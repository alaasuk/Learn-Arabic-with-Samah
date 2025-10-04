import React, { useState, useEffect, useCallback } from 'react';
import { generateMultipleChoice } from '../services/geminiService';
import { MCQExercise, MCQHistoryItem, HistoryItem, View } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ExerciseContainer from './ExerciseContainer';
import { triggerVibration } from '../App';

interface MultipleChoiceProps {
  onBack: () => void;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
  addHistoryItem: (item: HistoryItem) => void;
}

const TOTAL_EXERCISES = 100;

const MultipleChoice: React.FC<MultipleChoiceProps> = ({ onBack, onCorrectAnswer, onIncorrectAnswer, addHistoryItem }) => {
  const [exercise, setExercise] = useState<MCQExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(1);

  const fetchExercise = useCallback(async () => {
    setLoading(true);
    setExercise(null);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    try {
      const level = exerciseCount <= 50 ? 'مبتدئ' : 'متوسط';
      const newExercise = await generateMultipleChoice(level);
      const shuffledOptions = [...newExercise.options].sort(() => Math.random() - 0.5);
      setExercise({ ...newExercise, options: shuffledOptions });
    } catch (error) {
      console.error("Failed to generate multiple choice exercise:", error);
    } finally {
      setLoading(false);
    }
  }, [exerciseCount]);

  useEffect(() => {
    fetchExercise();
  }, [fetchExercise]);

  const handleNextExercise = () => {
    triggerVibration();
    setExerciseCount(prev => (prev % TOTAL_EXERCISES) + 1);
  }

  const handleOptionClick = (option: string) => {
    if (isSubmitted || !exercise) return;
    triggerVibration();
    setSelectedAnswer(option);
    setIsSubmitted(true);
    if (option === exercise.correctAnswer) {
        onCorrectAnswer();
    } else {
        onIncorrectAnswer();
    }
    const historyItem: MCQHistoryItem = { type: View.MULTIPLE_CHOICE, exercise, selectedAnswer: option };
    addHistoryItem(historyItem);
  };

  const getButtonClass = (option: string) => {
    if (!isSubmitted) {
      return 'bg-slate-700 hover:bg-slate-600';
    }
    if (option === exercise?.correctAnswer) {
      return 'bg-green-600 ring-2 ring-green-400 scale-105 cursor-default';
    }
    if (option === selectedAnswer && option !== exercise?.correctAnswer) {
      return 'bg-red-600 ring-2 ring-red-400 cursor-default';
    }
    return 'bg-slate-700 opacity-50 cursor-not-allowed';
  };
  
  const feedbackMessage = isSubmitted ? (
    selectedAnswer === exercise?.correctAnswer ? (
        <p className="text-green-400 text-xl font-bold">🎉 أحسنت! إجابة صحيحة</p>
    ) : (
        <p className="text-red-400 text-xl font-bold">😕 إجابة خاطئة! الإجابة الصحيحة بالأخضر.</p>
    )
  ) : null;

  return (
    <ExerciseContainer title="اختر من متعدد" onBack={onBack} exerciseNumber={exerciseCount}>
      <div className="flex-grow flex flex-col justify-center">
        {loading && <LoadingSpinner />}
        {!loading && exercise && (
          <div className="w-full flex flex-col items-center gap-8">
            <p className="text-2xl font-semibold text-center">{exercise.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
              {exercise.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  disabled={isSubmitted}
                  className={`p-4 rounded-lg text-lg font-semibold transition-all duration-300 w-full ${getButtonClass(option)}`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-col items-center gap-4 min-h-[120px] justify-center">
              {isSubmitted && (
                  <div className="flex flex-col items-center gap-3 animate-fade-in">
                    {feedbackMessage}
                     {exercise.explanation && (
                        <div className="bg-slate-900/50 border border-slate-700 p-3 rounded-lg max-w-lg text-center">
                            <p className="font-bold text-yellow-400 mb-1">💡 شرح القاعدة:</p>
                            <p className="text-slate-300">{exercise.explanation}</p>
                        </div>
                    )}
                    <button onClick={handleNextExercise} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors mt-2">
                        تدريب جديد
                    </button>
                  </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ExerciseContainer>
  );
};

export default MultipleChoice;

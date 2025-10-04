import React, { useState, useEffect, useCallback } from 'react';
import { generateFillInTheBlank } from '../services/geminiService';
import { FillBlankExercise, FillBlankHistoryItem, HistoryItem, View } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ExerciseContainer from './ExerciseContainer';
import { triggerVibration } from '../App';

interface FillInTheBlankProps {
  onBack: () => void;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
  addHistoryItem: (item: HistoryItem) => void;
}

const TOTAL_EXERCISES = 100;

const FillInTheBlank: React.FC<FillInTheBlankProps> = ({ onBack, onCorrectAnswer, onIncorrectAnswer, addHistoryItem }) => {
  const [exercise, setExercise] = useState<FillBlankExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [exerciseCount, setExerciseCount] = useState(1);

  const fetchExercise = useCallback(async () => {
    setLoading(true);
    setExercise(null);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    try {
      const level = exerciseCount <= 50 ? 'مبتدئ' : 'متوسط';
      const newExercise = await generateFillInTheBlank(level);
      const shuffledOptions = [...newExercise.options].sort(() => Math.random() - 0.5);
      setExercise({ ...newExercise, options: shuffledOptions });
    } catch (error) {
      console.error("Failed to generate fill-in-the-blank exercise:", error);
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
  };

  const handleOptionClick = (option: string) => {
    if (isSubmitted || !exercise) return;
    triggerVibration();
    
    const correct = option === exercise.answer;
    setSelectedAnswer(option);
    setIsSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      onCorrectAnswer();
    } else {
      onIncorrectAnswer();
    }

    const historyItem: FillBlankHistoryItem = { type: View.FILL_IN_BLANK, exercise, selectedAnswer: option };
    addHistoryItem(historyItem);
  };

  const getButtonClass = (option: string) => {
    if (!isSubmitted) {
      return 'bg-slate-700 hover:bg-slate-600';
    }
    if (option === exercise?.answer) {
      return 'bg-green-600 ring-2 ring-green-400 scale-105 cursor-default';
    }
    if (option === selectedAnswer && option !== exercise?.answer) {
      return 'bg-red-600 ring-2 ring-red-400 cursor-default';
    }
    return 'bg-slate-700 opacity-50 cursor-not-allowed';
  };

  const getSentenceWithContent = () => {
    if (!exercise) return null;

    const parts = exercise.sentence.split('___');
    let content: React.ReactNode = <span className="inline-block bg-slate-900 border-2 border-dashed border-slate-600 rounded-lg w-32 h-10 mx-2" />;

    if (isSubmitted) {
      if (isCorrect) {
        content = <span className="text-green-400 font-bold bg-green-900/50 px-3 py-1 rounded-md mx-2">{exercise.answer}</span>;
      } else {
        content = (
          <>
            <span className="text-red-400 font-bold bg-red-900/50 px-2 py-1 rounded-md line-through mx-2">{selectedAnswer}</span>
            <span className="text-green-400 font-bold bg-green-900/50 px-3 py-1 rounded-md mx-2">{exercise.answer}</span>
          </>
        );
      }
    }
    
    return (
        <p className="text-2xl sm:text-3xl font-semibold leading-relaxed text-center">
            {parts[0]}
            {content}
            {parts[1]}
        </p>
    );
  };

  return (
    <ExerciseContainer title="املأ الفراغ" onBack={onBack} exerciseNumber={exerciseCount}>
      <div className="flex-grow flex flex-col justify-center">
        {loading && <LoadingSpinner />}
        {!loading && exercise && (
            <div className="w-full text-center flex flex-col items-center gap-8">
                <div className="p-4 min-h-[80px] flex items-center justify-center">
                    {getSentenceWithContent()}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
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

                {isSubmitted && (
                    <div className="mt-4 flex flex-col items-center gap-3 min-h-[100px] justify-center animate-fade-in">
                        {isCorrect 
                            ? <p className="text-green-400 text-xl font-bold">🎉 أحسنت! إجابة صحيحة</p> 
                            : <p className="text-red-400 text-xl font-bold">😕 إجابة خاطئة! الإجابة الصحيحة هي بالأخضر.</p>}
                        
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
        )}
      </div>
    </ExerciseContainer>
  );
};

export default FillInTheBlank;

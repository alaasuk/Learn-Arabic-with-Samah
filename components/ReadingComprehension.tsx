import React, { useState, useEffect, useCallback } from 'react';
import { generateReadingComprehension } from '../services/geminiService';
import { ReadingExercise, ReadingHistoryItem, HistoryItem, View } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ExerciseContainer from './ExerciseContainer';
import { triggerVibration } from '../App';

interface ReadingComprehensionProps {
  onBack: () => void;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
  addHistoryItem: (item: HistoryItem) => void;
}

const TOTAL_EXERCISES = 100;

const ReadingComprehension: React.FC<ReadingComprehensionProps> = ({ onBack, onCorrectAnswer, onIncorrectAnswer, addHistoryItem }) => {
  const [exercise, setExercise] = useState<ReadingExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fetchExercise = useCallback(async () => {
    setLoading(true);
    setExercise(null);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    try {
      const level = exerciseCount <= 50 ? 'مبتدئ' : 'متوسط';
      const newExercise = await generateReadingComprehension(level);
      const shuffledOptions = [...newExercise.options].sort(() => Math.random() - 0.5);
      setExercise({ ...newExercise, options: shuffledOptions });
    } catch (error) {
      console.error("Failed to generate reading comprehension exercise:", error);
    } finally {
      setLoading(false);
    }
  }, [exerciseCount]);

  useEffect(() => {
    fetchExercise();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [fetchExercise]);

  const handleNextExercise = () => {
    triggerVibration();
    setExerciseCount(prev => (prev % TOTAL_EXERCISES) + 1);
  };

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
    const historyItem: ReadingHistoryItem = { type: View.READING_COMPREHENSION, exercise, selectedAnswer: option };
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

  const speakText = (text: string) => {
    triggerVibration();
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };
  
  const feedbackMessage = isSubmitted ? (
    selectedAnswer === exercise?.correctAnswer ? (
        <p className="text-green-400 text-lg font-bold">🎉 أحسنت! إجابة صحيحة</p>
    ) : (
        <p className="text-red-400 text-lg font-bold">😕 إجابة خاطئة! الإجابة الصحيحة بالأخضر.</p>
    )
  ) : null;

  return (
    <ExerciseContainer title="تقوية القراءة" onBack={onBack} exerciseNumber={exerciseCount}>
      <div className="flex-grow flex flex-col justify-center">
        {loading && <LoadingSpinner />}
        {!loading && exercise && (
          <div className="w-full text-center flex flex-col items-center gap-4">
              <div className="relative bg-slate-900 p-4 rounded-xl border border-slate-700 w-full">
                  <button 
                      onClick={() => speakText(exercise.paragraph)}
                      className="absolute top-2 left-2 bg-slate-700 p-2 rounded-full hover:bg-slate-600 transition-colors"
                      aria-label={isSpeaking ? "إيقاف الصوت" : "تشغيل الصوت"}
                  >
                      {isSpeaking ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                      ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                          </svg>
                      )}
                  </button>
                  <p className="text-lg leading-relaxed text-slate-200">{exercise.paragraph}</p>
              </div>
              
              <p className="text-xl font-semibold text-green-400 mt-2">{exercise.question}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-2">
                  {exercise.options.map((option, index) => (
                      <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      disabled={isSubmitted}
                      className={`p-3 rounded-lg text-md font-semibold transition-all duration-300 w-full ${getButtonClass(option)}`}
                      >
                      {option}
                      </button>
                  ))}
              </div>

              <div className="mt-2 flex flex-col items-center gap-3 min-h-[100px] justify-center">
                  {isSubmitted && (
                      <>
                          {feedbackMessage}
                          <div className="bg-slate-900/50 border border-slate-700 p-3 rounded-lg max-w-lg animate-fade-in">
                              <p className="font-bold text-yellow-400 mb-1">💡 شرح الإجابة:</p>
                              <p className="text-slate-300">{exercise.explanation}</p>
                          </div>
                          <button onClick={handleNextExercise} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors mt-2">
                              النص التالي
                          </button>
                      </>
                  )}
              </div>
          </div>
        )}
      </div>
    </ExerciseContainer>
  );
};

export default ReadingComprehension;

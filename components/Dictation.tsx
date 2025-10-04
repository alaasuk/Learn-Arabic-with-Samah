import React, { useState, useEffect, useCallback } from 'react';
import { generateDictationExercise } from '../services/geminiService';
import { DictationExercise, DictationHistoryItem, HistoryItem, View } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ExerciseContainer from './ExerciseContainer';
import { triggerVibration } from '../App';

interface DictationProps {
  onBack: () => void;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
  addHistoryItem: (item: HistoryItem) => void;
}

const TOTAL_EXERCISES = 100;

const Dictation: React.FC<DictationProps> = ({ onBack, onCorrectAnswer, onIncorrectAnswer, addHistoryItem }) => {
  const [exercise, setExercise] = useState<DictationExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [exerciseCount, setExerciseCount] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fetchExercise = useCallback(async () => {
    setLoading(true);
    setExercise(null);
    setWrittenAnswer('');
    setIsSubmitted(false);
    setIsCorrect(null);
    window.speechSynthesis.cancel();
    try {
      const level = exerciseCount <= 50 ? 'مبتدئ' : 'متوسط';
      const newExercise = await generateDictationExercise(level);
      setExercise(newExercise);
    } catch (error) {
      console.error("Failed to generate dictation exercise:", error);
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!writtenAnswer.trim() || !exercise) return;
    triggerVibration();

    const trimmedAnswer = writtenAnswer.trim();
    const correct = trimmedAnswer === exercise.word;
    setIsSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      onCorrectAnswer();
    } else {
      onIncorrectAnswer();
    }

    const historyItem: DictationHistoryItem = { type: View.DICTATION, exercise, writtenAnswer: trimmedAnswer };
    addHistoryItem(historyItem);
  };
  
  const handleNextExercise = () => {
    triggerVibration();
    setExerciseCount(prev => (prev % TOTAL_EXERCISES) + 1);
  };

  return (
    <ExerciseContainer title="الكاتب الدقيق" onBack={onBack} exerciseNumber={exerciseCount}>
      <div className="flex-grow flex flex-col justify-center items-center">
        {loading && <LoadingSpinner />}
        {!loading && exercise && (
          <div className="w-full text-center flex flex-col items-center gap-8">
            <p className="text-xl text-slate-300">استمع جيداً للكلمة ثم اكتبها في الصندوق.</p>
            <button
              onClick={() => speakText(exercise.word)}
              disabled={isSpeaking}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full w-24 h-24 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
              aria-label="استمع للكلمة"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
            </button>
            
            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col items-center gap-4">
              <input
                type="text"
                value={writtenAnswer}
                onChange={(e) => setWrittenAnswer(e.target.value)}
                placeholder="اكتب الكلمة هنا..."
                disabled={isSubmitted}
                className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-center text-white text-2xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-70"
                required
                lang="ar"
                dir="rtl"
              />
              {!isSubmitted && (
                 <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transition-colors text-lg"
                 >
                    تحقق من إجابتي
                </button>
              )}
            </form>

             {isSubmitted && (
                <div className="mt-4 flex flex-col items-center gap-3 min-h-[100px] justify-center animate-fade-in">
                    {isCorrect 
                        ? <p className="text-green-400 text-xl font-bold">🎉 أحسنت! كتابة صحيحة</p> 
                        : <p className="text-red-400 text-xl font-bold">😕 حاول مرة أخرى! الكلمة الصحيحة هي: <span className="font-extrabold">{exercise.word}</span></p>}
                    
                    <div className="bg-slate-900/50 border border-slate-700 p-3 rounded-lg max-w-lg text-center">
                        <p className="font-bold text-yellow-400 mb-1">📝 مثال في جملة:</p>
                        <p className="text-slate-300">{exercise.exampleSentence}</p>
                    </div>
                    
                    <button onClick={handleNextExercise} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors mt-2">
                        الكلمة التالية
                    </button>
                </div>
            )}
          </div>
        )}
      </div>
    </ExerciseContainer>
  );
};

export default Dictation;

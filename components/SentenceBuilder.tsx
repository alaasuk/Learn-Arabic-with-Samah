import React, { useState, useEffect, useCallback } from 'react';
import { generateSentenceBuilderExercise } from '../services/geminiService';
import { SentenceBuilderExercise, SentenceBuilderHistoryItem, HistoryItem, View } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ExerciseContainer from './ExerciseContainer';
import { triggerVibration } from '../App';

interface SentenceBuilderProps {
  onBack: () => void;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
  addHistoryItem: (item: HistoryItem) => void;
}

const TOTAL_EXERCISES = 100;

const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ onBack, onCorrectAnswer, onIncorrectAnswer, addHistoryItem }) => {
  const [exercise, setExercise] = useState<SentenceBuilderExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [builtSentence, setBuiltSentence] = useState<string[]>([]);
  const [remainingWords, setRemainingWords] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [exerciseCount, setExerciseCount] = useState(1);

  const fetchExercise = useCallback(async () => {
    setLoading(true);
    setExercise(null);
    setBuiltSentence([]);
    setRemainingWords([]);
    setIsSubmitted(false);
    setIsCorrect(null);
    try {
      const level = exerciseCount <= 50 ? 'مبتدئ' : 'متوسط';
      const newExercise = await generateSentenceBuilderExercise(level);
      setExercise(newExercise);
      setRemainingWords(newExercise.scrambledWords);
    } catch (error) {
      console.error("Failed to generate sentence builder exercise:", error);
    } finally {
      setLoading(false);
    }
  }, [exerciseCount]);

  useEffect(() => {
    fetchExercise();
  }, [fetchExercise]);

  const handleWordClick = (word: string, index: number) => {
    triggerVibration();
    setBuiltSentence(prev => [...prev, word]);
    setRemainingWords(prev => prev.filter((_, i) => i !== index));
  };

  const handleConstructedWordClick = (word: string, index: number) => {
    triggerVibration();
    setRemainingWords(prev => [...prev, word]);
    setBuiltSentence(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = () => {
    if (!exercise) return;
    triggerVibration();

    // Normalize both the user's sentence and the correct sentence
    // This removes trailing punctuation and trims whitespace for a fairer comparison
    const normalizeSentence = (str: string) => {
        return str.trim().replace(/[.?!؟,]*$/, '');
    };

    const finalSentence = builtSentence.join(' ');
    const userSentenceNormalized = normalizeSentence(finalSentence);
    const correctSentenceNormalized = normalizeSentence(exercise.correctSentence);

    const correct = userSentenceNormalized === correctSentenceNormalized;
    
    setIsSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      onCorrectAnswer();
    } else {
      onIncorrectAnswer();
    }

    const historyItem: SentenceBuilderHistoryItem = { type: View.SENTENCE_BUILDER, exercise, builtSentence: finalSentence };
    addHistoryItem(historyItem);
  };

  const handleNextExercise = () => {
    triggerVibration();
    setExerciseCount(prev => (prev % TOTAL_EXERCISES) + 1);
  };

  return (
    <ExerciseContainer title="مهندس الجمل" onBack={onBack} exerciseNumber={exerciseCount}>
      <div className="flex-grow flex flex-col justify-center items-center">
        {loading && <LoadingSpinner />}
        {!loading && exercise && (
          <div className="w-full text-center flex flex-col items-center gap-6">
            <p className="text-xl text-slate-300">اضغط على الكلمات بالترتيب الصحيح لتكوين جملة مفيدة.</p>
            
            <div className="bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-lg w-full min-h-[7rem] p-4 flex flex-wrap justify-center items-center gap-3">
              {builtSentence.length === 0 && !isSubmitted && <span className="text-slate-500">ابدأ بتكوين جملتك هنا</span>}
              {builtSentence.map((word, index) => (
                <button 
                    key={`${word}-${index}`}
                    onClick={() => !isSubmitted && handleConstructedWordClick(word, index)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-lg font-semibold cursor-pointer"
                >
                    {word}
                </button>
              ))}
            </div>

            <div className="w-full min-h-[7rem] p-2 flex flex-wrap justify-center items-center gap-3">
                {remainingWords.map((word, index) => (
                    <button
                        key={`${word}-${index}`}
                        onClick={() => handleWordClick(word, index)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-lg font-semibold transition-colors"
                    >
                        {word}
                    </button>
                ))}
            </div>

            {!isSubmitted ? (
                 <button
                    onClick={handleSubmit}
                    disabled={builtSentence.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    تحقق من الجملة
                </button>
            ) : (
                <div className="mt-4 flex flex-col items-center gap-3 min-h-[100px] justify-center animate-fade-in">
                    {isCorrect 
                        ? <p className="text-green-400 text-xl font-bold">🎉 أحسنت! جملة صحيحة</p> 
                        : <p className="text-red-400 text-xl font-bold">😕 حاول مرة أخرى! الجملة الصحيحة هي:</p>}
                    
                    {!isCorrect && <p className="text-green-400 font-bold text-2xl bg-slate-900/50 px-4 py-2 rounded-lg">{exercise.correctSentence}</p>}
                    
                    <div className="bg-slate-900/50 border border-slate-700 p-3 rounded-lg max-w-lg text-center">
                        <p className="font-bold text-yellow-400 mb-1">💡 شرح القاعدة:</p>
                        <p className="text-slate-300">{exercise.explanation}</p>
                    </div>
                    
                    <button onClick={handleNextExercise} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors mt-2">
                        التمرين التالي
                    </button>
                </div>
            )}
          </div>
        )}
      </div>
    </ExerciseContainer>
  );
};

export default SentenceBuilder;

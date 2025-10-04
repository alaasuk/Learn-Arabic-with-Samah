import React, { useState, useEffect, useCallback } from 'react';
import { generateEducationalCard } from '../services/geminiService';
import { EducationalCard } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ExerciseContainer from './ExerciseContainer';
import { triggerVibration } from '../App';

interface EducationalCardsProps {
  onBack: () => void;
}

const TOTAL_CARDS = 100;

const EducationalCards: React.FC<EducationalCardsProps> = ({ onBack }) => {
  const [card, setCard] = useState<EducationalCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [cardCount, setCardCount] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fetchCard = useCallback(async () => {
    setLoading(true);
    setCard(null);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    try {
      const level = cardCount <= 50 ? 'مبتدئ' : 'متوسط';
      const newCard = await generateEducationalCard(level);
      setCard(newCard);
    } catch (error) {
      console.error("Failed to generate educational card:", error);
    } finally {
      setLoading(false);
    }
  }, [cardCount]);

  useEffect(() => {
    fetchCard();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [fetchCard]);

  const handleNextCard = () => {
    triggerVibration();
    setCardCount(prev => (prev % TOTAL_CARDS) + 1);
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

  return (
    <ExerciseContainer title="بطاقات تعليمية" onBack={onBack} exerciseNumber={cardCount}>
      {loading && <LoadingSpinner />}
      {!loading && card && (
        <div className="w-full flex flex-col items-center gap-6">
          <div className="relative bg-slate-900 p-8 rounded-2xl border-2 border-green-500 shadow-lg shadow-green-500/10 w-full max-w-lg text-center transform transition-transform duration-500">
                <button 
                  onClick={() => speakText(`${card.concept}. ${card.explanation}. مثال: ${card.example}`)}
                  className="absolute top-3 left-3 bg-slate-700 p-2 rounded-full hover:bg-slate-600 transition-colors"
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
                <h3 className="text-2xl font-bold text-green-400 mb-4">{card.concept}</h3>
                <p className="text-lg text-slate-300 mb-6">{card.explanation}</p>
                <div className="border-t border-slate-700 pt-4">
                    <p className="text-sm text-slate-500 mb-2">مثال:</p>
                    <p className="text-xl font-semibold text-white">{card.example}</p>
                </div>
          </div>
           <div className="text-center">
                <button onClick={handleNextCard} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transition-colors text-lg">
                    البطاقة التالية
                </button>
                <p className="text-xs text-slate-500 mt-2">ملاحظة: الصوت المُساعد ليس حقيقياً وقد لا يكون دقيقاً.</p>
           </div>
        </div>
      )}
    </ExerciseContainer>
  );
};

export default EducationalCards;

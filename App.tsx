import React, { useState, useEffect, useCallback } from 'react';
import { View, HistoryState, HistoryItem, Badge } from './types';
import Dashboard from './components/Dashboard';
import FillInTheBlank from './components/FillInTheBlank';
import MultipleChoice from './components/MultipleChoice';
import ReadingComprehension from './components/ReadingComprehension';
import EducationalCards from './components/EducationalCards';
import HistoryView from './components/HistoryView';
import LoginScreen from './components/LoginScreen';
import Dictation from './components/Dictation';
import SentenceBuilder from './components/SentenceBuilder';
import AchievementsView from './components/AchievementsView';
import BadgeUnlockModal from './components/BadgeUnlockModal';
import { allBadges } from './data/badges';

// Feedback Utilities
export const triggerVibration = () => {
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(10);
  }
};

let audioContext: AudioContext | null = null;
const getAudioContext = () => {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser");
            return null;
        }
    }
    return audioContext;
};

export const playCorrectSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
  oscillator.frequency.linearRampToValueAtTime(1046.50, ctx.currentTime + 0.15); // C6

  oscillator.start(ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
  oscillator.stop(ctx.currentTime + 0.3);
};


const initialHistoryState: HistoryState = {
  [View.FILL_IN_BLANK]: [],
  [View.MULTIPLE_CHOICE]: [],
  [View.READING_COMPREHENSION]: [],
  [View.DICTATION]: [],
  [View.SENTENCE_BUILDER]: [],
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [history, setHistory] = useState<HistoryState>(initialHistoryState);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    try {
      // FIX: Load student name as a plain string to prevent escaping issues.
      const savedName = localStorage.getItem('studentName');
      if (savedName) setStudentName(savedName);

      const savedPoints = localStorage.getItem('studentPoints');
      if (savedPoints) setPoints(JSON.parse(savedPoints));
      
      const savedStreak = localStorage.getItem('studentStreak');
      if (savedStreak) setStreak(JSON.parse(savedStreak));

      const savedHistory = localStorage.getItem('studentHistory');
      if (savedHistory) setHistory(JSON.parse(savedHistory));

      const savedBadges = localStorage.getItem('unlockedBadges');
      if (savedBadges) setUnlockedBadges(JSON.parse(savedBadges));

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setStudentName(null);
      setPoints(0);
      setStreak(0);
      setHistory(initialHistoryState);
      setUnlockedBadges([]);
    }
  }, []);

  // Generic function to save complex data as JSON
  const saveDataToLocalStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage`, error);
    }
  }, []);

  // FIX: Save student name as a plain string.
  useEffect(() => { if (studentName) localStorage.setItem('studentName', studentName) }, [studentName]);
  
  // Save other data using the JSON helper
  useEffect(() => { saveDataToLocalStorage('studentPoints', points) }, [points, saveDataToLocalStorage]);
  useEffect(() => { saveDataToLocalStorage('studentStreak', streak) }, [streak, saveDataToLocalStorage]);
  useEffect(() => { saveDataToLocalStorage('studentHistory', history) }, [history, saveDataToLocalStorage]);
  useEffect(() => { saveDataToLocalStorage('unlockedBadges', unlockedBadges) }, [unlockedBadges, saveDataToLocalStorage]);


  const checkAndUnlockBadges = useCallback((updatedHistory: HistoryState, updatedStreak: number) => {
    const newBadges: string[] = [];
    allBadges.forEach(badge => {
      if (unlockedBadges.includes(badge.id)) return;

      let conditionMet = false;
      switch (badge.id) {
        case 'first_correct':
          conditionMet = Object.values(updatedHistory).some(h => h.length > 0);
          break;
        case 'streak_5':
          conditionMet = updatedStreak >= 5;
          break;
        case 'streak_10':
          conditionMet = updatedStreak >= 10;
          break;
        case 'mcq_10':
          conditionMet = updatedHistory[View.MULTIPLE_CHOICE].length >= 10;
          break;
        case 'fill_10':
          conditionMet = updatedHistory[View.FILL_IN_BLANK].length >= 10;
          break;
        case 'read_10':
          conditionMet = updatedHistory[View.READING_COMPREHENSION].length >= 10;
          break;
        case 'dict_10':
            conditionMet = updatedHistory[View.DICTATION].length >= 10;
            break;
        case 'sent_10':
            conditionMet = updatedHistory[View.SENTENCE_BUILDER].length >= 10;
            break;
      }

      if (conditionMet) {
        newBadges.push(badge.id);
        if (!newlyUnlockedBadge) {
          setNewlyUnlockedBadge(badge);
        }
      }
    });

    if (newBadges.length > 0) {
      setUnlockedBadges(prev => [...prev, ...newBadges]);
    }
  }, [unlockedBadges, newlyUnlockedBadge]);

  const handleLogin = (name: string) => {
    setStudentName(name);
  };

  const handleChangeUser = () => {
    triggerVibration();
    localStorage.removeItem('studentName');
    setStudentName(null);
  }

  const handleCorrectAnswer = () => {
    playCorrectSound();
    const newStreak = streak + 1;
    setPoints(prevPoints => prevPoints + 10);
    setStreak(newStreak);
    checkAndUnlockBadges(history, newStreak);
  };
  
  const handleIncorrectAnswer = () => {
    setStreak(0);
  };

  const addHistoryItem = (item: HistoryItem) => {
    setHistory(prevHistory => {
        const newHistory = { ...prevHistory };
        const historyForType = [item, ...newHistory[item.type]];
        newHistory[item.type] = historyForType as any;
        
        // After state update, check for badges
        // We use the newHistory object directly as state update is async
        checkAndUnlockBadges(newHistory, streak);

        return newHistory;
    });
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard onSelectView={setCurrentView} studentName={studentName || ''} />;
      case View.FILL_IN_BLANK:
        return <FillInTheBlank onBack={() => setCurrentView(View.DASHBOARD)} onCorrectAnswer={handleCorrectAnswer} onIncorrectAnswer={handleIncorrectAnswer} addHistoryItem={addHistoryItem} />;
      case View.MULTIPLE_CHOICE:
        return <MultipleChoice onBack={() => setCurrentView(View.DASHBOARD)} onCorrectAnswer={handleCorrectAnswer} onIncorrectAnswer={handleIncorrectAnswer} addHistoryItem={addHistoryItem} />;
      case View.READING_COMPREHENSION:
        return <ReadingComprehension onBack={() => setCurrentView(View.DASHBOARD)} onCorrectAnswer={handleCorrectAnswer} onIncorrectAnswer={handleIncorrectAnswer} addHistoryItem={addHistoryItem} />;
      case View.EDUCATIONAL_CARDS:
        return <EducationalCards onBack={() => setCurrentView(View.DASHBOARD)} />;
       case View.DICTATION:
        return <Dictation onBack={() => setCurrentView(View.DASHBOARD)} onCorrectAnswer={handleCorrectAnswer} onIncorrectAnswer={handleIncorrectAnswer} addHistoryItem={addHistoryItem} />;
      case View.SENTENCE_BUILDER:
        return <SentenceBuilder onBack={() => setCurrentView(View.DASHBOARD)} onCorrectAnswer={handleCorrectAnswer} onIncorrectAnswer={handleIncorrectAnswer} addHistoryItem={addHistoryItem} />;
      case View.HISTORY:
        return <HistoryView onBack={() => setCurrentView(View.DASHBOARD)} history={history} />;
      case View.ACHIEVEMENTS:
        return <AchievementsView onBack={() => setCurrentView(View.DASHBOARD)} unlockedBadgeIds={unlockedBadges} />;
      default:
        return <Dashboard onSelectView={setCurrentView} studentName={studentName || ''} />;
    }
  };

  if (!studentName) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <div className="w-full max-w-4xl mx-auto flex flex-col min-h-screen p-4">
         <header className="w-full py-4 flex justify-between items-center flex-wrap gap-y-2 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                <span className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-slate-900 font-extrabold text-lg flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.289 7.5 15.5 7.5c1.21 0 2.32-.439 3.166-1.136m0-1.415V3" />
                    </svg>
                </span>
            </h1>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm text-slate-400">أهلاً بك يا بطل</span>
              <span className="font-bold text-lg text-green-400 -mt-1 break-all">{studentName}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
                <span className="text-xl">🔥</span>
                <span className="font-bold text-lg text-white">{streak}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold text-lg text-white">{points}</span>
            </div>
             <button onClick={handleChangeUser} className="bg-slate-700 hover:bg-slate-600 p-2.5 rounded-full" aria-label="تغيير المستخدم">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </button>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center">
            {renderView()}
        </main>
      </div>
      {newlyUnlockedBadge && (
        <BadgeUnlockModal badge={newlyUnlockedBadge} onClose={() => setNewlyUnlockedBadge(null)} />
      )}
    </div>
  );
};

export default App;
import React from 'react';
import { triggerVibration } from '../App';

interface ExerciseContainerProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
  exerciseNumber?: number;
}

const ExerciseContainer: React.FC<ExerciseContainerProps> = ({ title, onBack, children, exerciseNumber }) => {
  const totalExercises = 100;
  let level = null;
  let levelStyle = '';
  
  if (exerciseNumber) {
    if (exerciseNumber <= 50) {
      level = 'مبتدئ ⭐';
      levelStyle = 'bg-blue-500 text-white';
    } else {
      level = 'متوسط ⭐⭐';
      levelStyle = 'bg-purple-500 text-white';
    }
  }

  return (
    <div className="bg-slate-800 p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-3xl mx-auto h-[90vh] max-h-[700px] flex flex-col">
        <header className="relative flex justify-between items-center w-full mb-6 min-h-[44px] flex-shrink-0 gap-4">
            <button
                onClick={() => {
                    triggerVibration();
                    onBack();
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-full transition-colors duration-300 flex items-center justify-center w-11 h-11 sm:w-auto sm:h-auto sm:px-4 sm:py-2 sm:gap-2 flex-shrink-0"
                aria-label="عودة"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
                <span className="hidden sm:inline">عودة</span>
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold text-green-400 text-center truncate">
                {title}
            </h2>

            <div className="flex flex-col items-end gap-2 text-xs sm:text-sm flex-shrink-0">
                 {exerciseNumber && (
                    <span className="bg-slate-700 text-green-400 font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        {exerciseNumber} / {totalExercises}
                    </span>
                 )}
                 {level && (
                    <span className={`font-bold px-3 py-1 rounded-full whitespace-nowrap ${levelStyle}`}>
                        المستوى: {level}
                    </span>
                 )}
            </div>
        </header>

        <div className="flex-grow flex flex-col overflow-y-auto pr-2 -mr-2">
            {children}
        </div>
    </div>
  );
};

export default ExerciseContainer;

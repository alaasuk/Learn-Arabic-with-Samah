import React from 'react';
import ExerciseContainer from './ExerciseContainer';
import { allBadges } from '../data/badges';

interface AchievementsViewProps {
  onBack: () => void;
  unlockedBadgeIds: string[];
}

const AchievementsView: React.FC<AchievementsViewProps> = ({ onBack, unlockedBadgeIds }) => {
  return (
    <ExerciseContainer title="الأوسمة والإنجازات" onBack={onBack}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {allBadges.map(badge => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`p-6 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 ${
                isUnlocked ? 'bg-slate-700 border-2 border-yellow-400 shadow-lg shadow-yellow-500/10' : 'bg-slate-800 opacity-60'
              }`}
            >
              <div className={`text-6xl mb-4 transition-transform duration-300 ${isUnlocked ? 'transform scale-110' : 'grayscale'}`}>
                {badge.icon}
              </div>
              <h3 className={`font-bold text-lg ${isUnlocked ? 'text-yellow-400' : 'text-slate-300'}`}>
                {badge.name}
              </h3>
              <p className="text-sm text-slate-400">{badge.description}</p>
              {!isUnlocked && (
                 <div className="absolute top-2 right-2 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                 </div>
              )}
            </div>
          );
        })}
      </div>
    </ExerciseContainer>
  );
};

export default AchievementsView;

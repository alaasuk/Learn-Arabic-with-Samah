import React from 'react';
import { Badge } from '../types';
import { triggerVibration } from '../App';

interface BadgeUnlockModalProps {
  badge: Badge;
  onClose: () => void;
}

const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({ badge, onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        onClick={() => {
            triggerVibration();
            onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="badge-name"
    >
      <div 
        className="bg-slate-800 rounded-2xl p-8 text-center flex flex-col items-center gap-4 border-2 border-yellow-400 shadow-2xl shadow-yellow-500/20 transform animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-7xl">{badge.icon}</div>
        <h2 id="badge-name" className="text-2xl font-bold text-yellow-400">إنجاز جديد!</h2>
        <p className="text-lg text-white">لقد حصلت على وسام:</p>
        <p className="text-xl font-bold text-green-400">{badge.name}</p>
        <p className="text-slate-300">{badge.description}</p>
        <button
          onClick={() => {
            triggerVibration();
            onClose();
          }}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg transition-colors text-lg"
        >
          رائع!
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BadgeUnlockModal;



import React from 'react';
import { triggerVibration } from '../App';

interface SectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <button
      onClick={() => {
        triggerVibration();
        onClick();
      }}
      className="bg-slate-800 rounded-xl p-6 text-right w-full flex items-center gap-5 transition-all duration-300 hover:bg-slate-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900"
    >
      <div className="flex-shrink-0 bg-green-500 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-slate-400">{description}</p>
      </div>
    </button>
  );
};

export default SectionCard;

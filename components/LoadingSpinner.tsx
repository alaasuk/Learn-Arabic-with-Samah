
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
        <p className="text-slate-300">جاري تحضير التدريب...</p>
    </div>
  );
};

export default LoadingSpinner;

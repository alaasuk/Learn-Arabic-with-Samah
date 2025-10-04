import React, { useState } from 'react';
import { triggerVibration } from '../App';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      triggerVibration();
      onLogin(name.trim());
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-slate-900 font-extrabold text-4xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.289 7.5 15.5 7.5c1.21 0 2.32-.439 3.166-1.136m0-1.415V3" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold">تعلم العربية مع سماح</h1>
        <p className="text-slate-300 max-w-md">
          مرحباً بك في مغامرتك لتعلم اللغة العربية! أدخل اسمك لكي نبدأ رحلتنا التعليمية الممتعة.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-sm">
        <label htmlFor="student-name" className="sr-only">
          أدخل اسمك
        </label>
        <input
          id="student-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اكتب اسمك هنا يا بطل"
          className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-lg text-center text-white text-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          required
        />
        <button
          type="submit"
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-xl transition-colors duration-300"
        >
          هيا نبدأ!
        </button>
      </form>
       <footer className="absolute bottom-6 text-sm text-slate-500">
        <p>صنع بواسطة سماح لمساعدتكم على تعلم العربية</p>
      </footer>
    </div>
  );
};

export default LoginScreen;

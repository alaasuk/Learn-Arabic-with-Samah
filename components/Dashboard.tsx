import React from 'react';
import { View } from '../types';
import SectionCard from './SectionCard';

interface DashboardProps {
  onSelectView: (view: View) => void;
  studentName: string;
}

const sections = [
  {
    view: View.MULTIPLE_CHOICE,
    title: 'اختر من متعدد',
    description: 'اختر الإجابة الصحيحة من بين الخيارات.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    view: View.FILL_IN_BLANK,
    title: 'املأ الفراغ',
    description: 'اكتب الكلمة المناسبة في الفراغ.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
      </svg>
    ),
  },
  {
    view: View.READING_COMPREHENSION,
    title: 'تقوية القراءة',
    description: 'اقرأ نصوصاً قصيرة وجاوب على الأسئلة.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
    {
    view: View.EDUCATIONAL_CARDS,
    title: 'بطاقات تعليمية',
    description: 'تعلم مفاهيم جديدة مع بطاقات تفاعلية.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h-2M5 11H3" />
      </svg>
    ),
  },
  {
    view: View.DICTATION,
    title: 'الكاتب الدقيق',
    description: 'استمع للكلمة واكتبها بشكل صحيح.',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 14h.01M4.5 14h.01M8 14h.01M11.5 14h.01M12 20.5a.5.5 0 01-.5-.5V19h1v1.0a.5.5 0 01-.5.5zM12 3a1 1 0 011 1v11a1 1 0 01-2 0V4a1 1 0 011-1z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h8v3H8v-3z" />
        </svg>
    ),
  },
  {
    view: View.SENTENCE_BUILDER,
    title: 'مهندس الجمل',
    description: 'رتب الكلمات المبعثرة لتكوين جملة مفيدة.',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20l4-4m0 0l-4-4m4 4H3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h1.5L8 16h1.5" />
        </svg>
    ),
  },
];

const mainSections = sections.slice(0, 6);
const utilitySections = [
    {
        view: View.HISTORY,
        title: 'سجل التمارين المحلولة',
        description: 'راجع جميع التمارين التي قمت بحلها.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ),
    },
    {
        view: View.ACHIEVEMENTS,
        title: 'الأوسمة والإنجازات',
        description: 'شاهد الأوسمة التي حصلت عليها.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        ),
    }
];


const Dashboard: React.FC<DashboardProps> = ({ onSelectView, studentName }) => {
  return (
    <div className="text-center w-full">
      <div className="mb-8">
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          أهلاً بك يا بطل <span className="font-bold text-white">{studentName}</span>! أنا <span className="font-bold text-green-400">سماح</span>، وسأساعدك في تعلم قواعد اللغة العربية بمتعة وحماس. هيا نختار تدريبنا اليوم!
        </p>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainSections.map((section) => (
          <SectionCard
            key={section.title}
            title={section.title}
            description={section.description}
            icon={section.icon}
            onClick={() => onSelectView(section.view)}
          />
        ))}
      </main>
      
      <div className="mt-8 border-t border-slate-700 pt-8">
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {utilitySections.map((section) => (
            <SectionCard
                key={section.title}
                title={section.title}
                description={section.description}
                icon={section.icon}
                onClick={() => onSelectView(section.view)}
            />
            ))}
        </main>
      </div>

      <footer className="mt-12 text-sm text-slate-500">
        <p>صنع بواسطة سماح لمساعدتكم على تعلم العربية</p>
      </footer>
    </div>
  );
};

export default Dashboard;

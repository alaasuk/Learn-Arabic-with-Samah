import React from 'react';
import { HistoryState, View, FillBlankHistoryItem, MCQHistoryItem, ReadingHistoryItem, DictationHistoryItem, SentenceBuilderHistoryItem } from '../types';
import ExerciseContainer from './ExerciseContainer';

interface HistoryViewProps {
  onBack: () => void;
  history: HistoryState;
}

const renderFillInTheBlankItem = (item: FillBlankHistoryItem, index: number, total: number) => {
    const parts = item.exercise.sentence.split('___');
    const isAnswerCorrect = item.selectedAnswer === item.exercise.answer;
    let content: React.ReactNode;

    if (isAnswerCorrect) {
        content = <span className="text-green-400 font-bold bg-green-900/50 px-2 py-0.5 rounded-md mx-1 text-base">{item.exercise.answer}</span>;
    } else {
        content = (
          <>
            <span className="text-red-400 font-bold bg-red-900/50 px-2 py-0.5 rounded-md line-through mx-1 text-base">{item.selectedAnswer}</span>
            <span className="text-green-400 font-bold bg-green-900/50 px-2 py-0.5 rounded-md mx-1 text-base">{item.exercise.answer}</span>
          </>
        );
    }

    return (
      <div key={index} className="bg-slate-900/50 p-4 rounded-lg space-y-2">
        <p className="text-lg leading-relaxed">
          <span className="font-bold text-slate-500 ml-2">{total - index}.</span>
          {parts[0]}{content}{parts[1]}
        </p>
        <div className="pr-6">
            <p className="font-bold text-yellow-500 text-sm">💡 الشرح: <span className="font-normal text-slate-300">{item.exercise.explanation}</span></p>
        </div>
      </div>
    );
};

const renderMCQItem = (item: MCQHistoryItem, index: number, total: number) => {
    return (
      <div key={index} className="bg-slate-900/50 p-4 rounded-lg space-y-2">
        <p className="font-semibold mb-2">
          <span className="font-bold text-slate-500 ml-2">{total - index}.</span>
          {item.exercise.question}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm pr-6">
          {item.exercise.options.map(opt => {
            const isCorrect = opt === item.exercise.correctAnswer;
            const isSelected = opt === item.selectedAnswer;
            let classes = 'p-2 rounded ';
            if (isCorrect) {
              classes += 'bg-green-900/70 text-green-300';
            } else if (isSelected && !isCorrect) {
              classes += 'bg-red-900/70 text-red-300 line-through';
            } else {
              classes += 'bg-slate-800 text-slate-400';
            }
            return <div key={opt} className={classes}>{opt}</div>;
          })}
        </div>
        {item.exercise.explanation && (
            <div className="pr-6 pt-2">
                <p className="font-bold text-yellow-500 text-sm">💡 الشرح: <span className="font-normal text-slate-300">{item.exercise.explanation}</span></p>
            </div>
        )}
      </div>
    );
};

const renderReadingItem = (item: ReadingHistoryItem, index: number, total: number) => {
    return (
      <div key={index} className="bg-slate-900/50 p-4 rounded-lg space-y-3">
        <div>
          <span className="font-bold text-slate-500 ml-2">{total - index}.</span>
          <span className="text-slate-400 italic">"{item.exercise.paragraph}"</span>
        </div>
        <p className="font-semibold pr-6">{item.exercise.question}</p>
        <div className="grid grid-cols-2 gap-2 text-sm pr-6">
          {item.exercise.options.map(opt => {
            const isCorrect = opt === item.exercise.correctAnswer;
            const isSelected = opt === item.selectedAnswer;
            let classes = 'p-2 rounded ';
            if (isCorrect) classes += 'bg-green-900/70 text-green-300';
            else if (isSelected && !isCorrect) classes += 'bg-red-900/70 text-red-300 line-through';
            else classes += 'bg-slate-800 text-slate-400';
            return <div key={opt} className={classes}>{opt}</div>;
          })}
        </div>
        <div className="pr-6">
            <p className="font-bold text-yellow-500 text-sm">💡 الشرح: <span className="font-normal text-slate-300">{item.exercise.explanation}</span></p>
        </div>
      </div>
    );
};

const renderDictationItem = (item: DictationHistoryItem, index: number, total: number) => {
    const isCorrect = item.writtenAnswer === item.exercise.word;
    return (
        <div key={index} className="bg-slate-900/50 p-4 rounded-lg space-y-2">
            <p className="text-lg">
                <span className="font-bold text-slate-500 ml-2">{total - index}.</span>
                الكلمة الصحيحة هي: <span className="font-bold text-green-400">{item.exercise.word}</span>
            </p>
            <div className="pr-6">
                {isCorrect ? (
                    <p className="text-green-300">لقد كتبتها بشكل صحيح: <span className="font-semibold">{item.writtenAnswer}</span></p>
                ) : (
                    <p className="text-red-300">
                        لقد كتبت: <span className="font-semibold line-through">{item.writtenAnswer}</span>
                    </p>
                )}
            </div>
        </div>
    );
}

const renderSentenceBuilderItem = (item: SentenceBuilderHistoryItem, index: number, total: number) => {
    const normalizeSentence = (str: string) => {
        return str.trim().replace(/[.?!؟,]*$/, '');
    };
    const isCorrect = normalizeSentence(item.builtSentence) === normalizeSentence(item.exercise.correctSentence);
    return (
        <div key={index} className="bg-slate-900/50 p-4 rounded-lg space-y-2">
             <p className="text-lg">
                <span className="font-bold text-slate-500 ml-2">{total - index}.</span>
                 الجملة الصحيحة هي: <span className="font-bold text-green-400">{item.exercise.correctSentence}</span>
            </p>
            <div className="pr-6">
                {isCorrect ? (
                    <p className="text-green-300">لقد رتبتها بشكل صحيح!</p>
                ) : (
                     <p className="text-red-300">
                        ترتيبك كان: <span className="font-semibold">{item.builtSentence}</span>
                    </p>
                )}
                 <p className="font-bold text-yellow-500 text-sm mt-1">💡 الشرح: <span className="font-normal text-slate-300">{item.exercise.explanation}</span></p>
            </div>
        </div>
    );
}

const HistoryView: React.FC<HistoryViewProps> = ({ onBack, history }) => {
    const historySections = [
        { title: 'تمارين املأ الفراغ', history: history[View.FILL_IN_BLANK], renderer: renderFillInTheBlankItem },
        { title: 'تمارين اختر من متعدد', history: history[View.MULTIPLE_CHOICE], renderer: renderMCQItem },
        { title: 'تمارين تقوية القراءة', history: history[View.READING_COMPREHENSION], renderer: renderReadingItem },
        { title: 'تمارين الإملاء', history: history[View.DICTATION], renderer: renderDictationItem },
        { title: 'تمارين بناء الجمل', history: history[View.SENTENCE_BUILDER], renderer: renderSentenceBuilderItem },
    ];
    
    const isEmpty = historySections.every(section => section.history.length === 0);

  return (
    <ExerciseContainer title="سجل التمارين المحلولة" onBack={onBack}>
        {isEmpty ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
                <p className="text-2xl text-slate-400">📜</p>
                <p className="text-xl text-slate-400 mt-4">لم تقم بحل أي تمارين بعد.</p>
                <p className="text-slate-500">عندما تحل التمارين، ستظهر هنا للمراجعة.</p>
            </div>
        ) : (
            <div className="space-y-8">
                {historySections.map(section => (
                    section.history.length > 0 && (
                        <section key={section.title}>
                            <h3 className="text-xl font-bold text-green-400 mb-4 border-b-2 border-slate-700 pb-2">{section.title}</h3>
                            <div className="space-y-4">
                                {section.history.map((item, index) => (section.renderer as any)(item, index, section.history.length))}
                            </div>
                        </section>
                    )
                ))}
            </div>
        )}
    </ExerciseContainer>
  );
};

export default HistoryView;
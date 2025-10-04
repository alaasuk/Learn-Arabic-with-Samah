import { GoogleGenAI, Type } from "@google/genai";
import { FillBlankExercise, MCQExercise, ReadingExercise, EducationalCard, DictationExercise, SentenceBuilderExercise } from '../types';

// FIX: Switched from `import.meta.env` to `process.env.API_KEY` to align with coding guidelines and resolve the TypeScript error.
// The API key is obtained from the environment variable `process.env.API_KEY`.
// This variable is assumed to be pre-configured and accessible.
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
  // This provides a clear error message in the developer console and on the screen if the API key is missing.
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="font-family: 'Cairo', sans-serif; background-color: #0f172a; color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; text-align: center; padding: 20px; box-sizing: border-box;">
        <h1 style="color: #f87171; font-size: 2rem; margin-bottom: 1rem;">خطأ في الإعدادات</h1>
        <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">لم يتم العثور على مفتاح الواجهة البرمجية (API Key).</p>
        <p style="color: #9ca3af;">يرجى التأكد من أن متغير البيئة <code>API_KEY</code> قد تم إعداده بشكل صحيح.</p>
      </div>
    `;
  }
  throw new Error("API key not found. Please ensure API_KEY is set in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey });


const topics = [
  'عالم الحيوانات', 'الفضاء والكواكب', 'أعماق البحار', 'الاختراعات المدهشة', 
  'الرياضات المختلفة', 'عجائب الطبيعة', 'الأسرة والأصدقاء', 'المدرسة والعلوم', 
  'القصص الخيالية', 'السفر حول العالم', 'الفنون والموسيقى', 'الحفاظ على البيئة'
];

const getRandomTopic = () => topics[Math.floor(Math.random() * topics.length)];

type DifficultyLevel = 'مبتدئ' | 'متوسط';

const BASE_PROMPT = (topic: string, level: DifficultyLevel) => {
    const difficultyInstruction = level === 'مبتدئ'
        ? "يجب أن يكون التمرين بسيطًا ومباشرًا جدًا، ومناسبًا لمستوى مبتدئ."
        : "يجب أن يكون التمرين أكثر تحديًا قليلاً، بمفردات وقواعد أكثر تنوعًا، ومناسبًا لمستوى متوسط.";

    return `أنت معلمة لغة عربية اسمك سماح، وتصممين تمارين لطلاب الصف الرابع الابتدائي. يجب أن يكون التمرين ممتعًا ومناسبًا لغوياً لهم، ومرتبطاً بموضوع "${topic}". ${difficultyInstruction} يجب أن يكون الناتج بصيغة JSON.`;
};


export async function generateFillInTheBlank(level: DifficultyLevel): Promise<FillBlankExercise> {
  const topic = getRandomTopic();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${BASE_PROMPT(topic, level)} صممي تمرين 'املأ الفراغ' لقواعد اللغة العربية. يجب أن تحتوي الجملة على فراغ واحد. قدمي الجملة مع '___' مكان الفراغ. قدمي الإجابة الصحيحة، بالإضافة إلى 3 خيارات خاطئة مشابهة. يجب أن يكون مجموع الخيارات 4. وقدمي أيضاً شرحاً بسيطاً وواضحاً (جملة واحدة) يوضح القاعدة النحوية أو سبب اختيار هذه الإجابة.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentence: { type: Type.STRING, description: "الجملة التي تحتوي على فراغ واحد." },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "مصفوفة تحتوي على 4 خيارات نصية (الإجابة الصحيحة و3 خيارات خاطئة).",
          },
          answer: { type: Type.STRING, description: "الكلمة الصحيحة لملء الفراغ." },
          explanation: { type: Type.STRING, description: "شرح بسيط لسبب صحة الإجابة." }
        },
        required: ["sentence", "options", "answer", "explanation"],
      },
    },
  });

  const json = JSON.parse(response.text);
  if(json.options.length !== 4 || !json.options.includes(json.answer)) {
      return generateFillInTheBlank(level);
  }
  return json as FillBlankExercise;
}

export async function generateMultipleChoice(level: DifficultyLevel): Promise<MCQExercise> {
  const topic = getRandomTopic();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${BASE_PROMPT(topic, level)} صممي سؤال اختيار من متعدد لقواعد اللغة العربية. يجب أن يحتوي السؤال على 4 خيارات، واحد منها فقط صحيح. وقدمي أيضاً شرحاً بسيطاً وواضحاً (جملة واحدة) يوضح القاعدة النحوية أو سبب اختيار هذه الإجابة.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "نص السؤال." },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "مصفوفة تحتوي على 4 خيارات نصية.",
          },
          correctAnswer: {
            type: Type.STRING,
            description: "الإجابة الصحيحة من ضمن الخيارات.",
          },
          explanation: { type: Type.STRING, description: "شرح بسيط لسبب صحة الإجابة." }
        },
        required: ["question", "options", "correctAnswer", "explanation"],
      },
    },
  });

  const json = JSON.parse(response.text);
  if(json.options.length !== 4) {
      return generateMultipleChoice(level);
  }
  return json as MCQExercise;
}

export async function generateReadingComprehension(level: DifficultyLevel): Promise<ReadingExercise> {
  const topic = getRandomTopic();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${BASE_PROMPT(topic, level)} اكتبي فقرة قصيرة وممتعة وبسيطة (2-4 جمل) لطلاب الصف الرابع. بعد الفقرة، ضعي سؤال فهم واستيعاب واحد حولها. يجب أن يكون السؤال بصيغة اختيار من متعدد مع 4 خيارات (واحد صحيح و3 خاطئة). قدمي الإجابة الصحيحة، وقدمي أيضاً شرحاً بسيطاً وواضحاً (جملة واحدة) يوضح لماذا الإجابة صحيحة، مع الإشارة إلى الجزء الداعم من الفقرة.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          paragraph: { type: Type.STRING, description: "الفقرة النصية." },
          question: { type: Type.STRING, description: "سؤال اختيار من متعدد حول الفقرة." },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "مصفوفة تحتوي على 4 خيارات نصية (واحد صحيح و3 خاطئة)."
          },
          correctAnswer: { type: Type.STRING, description: "الإجابة الصحيحة من ضمن الخيارات." },
          explanation: { type: Type.STRING, description: "شرح بسيط لسبب صحة الإجابة." }
        },
        required: ["paragraph", "question", "options", "correctAnswer", "explanation"],
      },
    },
  });

  const json = JSON.parse(response.text);
  if(json.options.length !== 4 || !json.options.includes(json.correctAnswer)) {
      return generateReadingComprehension(level);
  }
  return json as ReadingExercise;
}


export async function generateEducationalCard(level: DifficultyLevel): Promise<EducationalCard> {
  const topic = getRandomTopic();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${BASE_PROMPT(topic, level)} أنشئي محتوى لـ 'بطاقة تعليمية'. يجب أن يكون الموضوع مفهومًا بسيطًا في قواعد اللغة العربية (مثل الاسم، الفعل، الصفة، حرف الجر)، مع شرح مبسط جدًا ومثال مرتبط بموضوع "${topic}".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          concept: { type: Type.STRING, description: "اسم القاعدة النحوية." },
          explanation: { type: Type.STRING, description: "شرح بسيط جدًا للمفهوم." },
          example: { type: Type.STRING, description: "جملة مثال تستخدم المفهوم وتتعلق بالموضوع." },
        },
        required: ["concept", "explanation", "example"],
      },
    },
  });

  const json = JSON.parse(response.text);
  return json as EducationalCard;
}


export async function generateDictationExercise(level: DifficultyLevel): Promise<DictationExercise> {
  const topic = getRandomTopic();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${BASE_PROMPT(topic, level)} صممي تمرين إملاء. قدمي كلمة عربية واحدة مناسبة للعمر ومستوى الصعوبة. يجب أن تكون الكلمة شائعة ومفيدة. وقدمي جملة مثال بسيطة توضح استخدام الكلمة.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING, description: "الكلمة العربية المراد إملائها." },
          exampleSentence: { type: Type.STRING, description: "جملة مثال تستخدم الكلمة." }
        },
        required: ["word", "exampleSentence"],
      },
    },
  });

  const json = JSON.parse(response.text);
  return json as DictationExercise;
}

export async function generateSentenceBuilderExercise(level: DifficultyLevel): Promise<SentenceBuilderExercise> {
  const topic = getRandomTopic();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${BASE_PROMPT(topic, level)} صممي تمرين 'بناء الجملة'. قدمي جملة عربية صحيحة ومفيدة (3-6 كلمات). ثم قدمي نفس الكلمات في مصفوفة بترتيب عشوائي. وقدمي شرحاً بسيطاً عن تركيب الجملة الصحيح أو القاعدة التي تتبعها.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correctSentence: { type: Type.STRING, description: "الجملة الصحيحة الكاملة." },
          scrambledWords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "مصفوفة تحتوي على كلمات الجملة بترتيب عشوائي.",
          },
          explanation: { type: Type.STRING, description: "شرح بسيط لتركيب الجملة." }
        },
        required: ["correctSentence", "scrambledWords", "explanation"],
      },
    },
  });

  const json = JSON.parse(response.text);
  // Ensure scrambled words are not the same as the correct sentence order
  if (json.scrambledWords.join(' ') === json.correctSentence) {
      json.scrambledWords.reverse();
  }
  return json as SentenceBuilderExercise;
}

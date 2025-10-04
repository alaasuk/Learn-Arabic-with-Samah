import { View as V } from './types';

export enum View {
  DASHBOARD,
  FILL_IN_BLANK,
  MULTIPLE_CHOICE,
  READING_COMPREHENSION,
  EDUCATIONAL_CARDS,
  DICTATION,
  SENTENCE_BUILDER,
  HISTORY,
  ACHIEVEMENTS,
}

export interface FillBlankExercise {
  sentence: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface MCQExercise {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ReadingExercise {
  paragraph: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface EducationalCard {
  concept: string;
  explanation: string;
  example: string;
}

export interface DictationExercise {
    word: string;
    exampleSentence: string;
}

export interface SentenceBuilderExercise {
    scrambledWords: string[];
    correctSentence: string;
    explanation: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or SVG string
}


// History Types
export interface FillBlankHistoryItem {
  type: V.FILL_IN_BLANK;
  exercise: FillBlankExercise;
  selectedAnswer: string;
}

export interface MCQHistoryItem {
  type: V.MULTIPLE_CHOICE;
  exercise: MCQExercise;
  selectedAnswer: string;
}

export interface ReadingHistoryItem {
  type: V.READING_COMPREHENSION;
  exercise: ReadingExercise;
  selectedAnswer: string;
}

export interface DictationHistoryItem {
    type: V.DICTATION;
    exercise: DictationExercise;
    writtenAnswer: string;
}

export interface SentenceBuilderHistoryItem {
    type: V.SENTENCE_BUILDER;
    exercise: SentenceBuilderExercise;
    builtSentence: string;
}

export type HistoryItem = FillBlankHistoryItem | MCQHistoryItem | ReadingHistoryItem | DictationHistoryItem | SentenceBuilderHistoryItem;

export interface HistoryState {
  [V.FILL_IN_BLANK]: FillBlankHistoryItem[];
  [V.MULTIPLE_CHOICE]: MCQHistoryItem[];
  [V.READING_COMPREHENSION]: ReadingHistoryItem[];
  [V.DICTATION]: DictationHistoryItem[];
  [V.SENTENCE_BUILDER]: SentenceBuilderHistoryItem[];
}

import type { QuestionState } from './question';

export * from './question';

export interface SurveyData {
  userName: string;
  categories: Category[];
}

export interface Category {
  readonly id: number;
  readonly genre: string;
  icon?: string;
  isChecked: boolean;
  questions: QuestionState[];
}

export interface ValidationError {
  category: string;
  text: string;
  answer?: string;
}

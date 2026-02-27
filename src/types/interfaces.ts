export interface SurveyData {
  userName: string;
  categories: Category[];
}

export interface Category {
  id: number;
  genre: string;
  icon?: string;
  isChecked: boolean;
  questions: Question[];
}

export interface Question {
  id: number;
  questionText: string;
  answers: Answer[];
}

export interface Answer {
  text: string;
  isChecked: boolean;
  value: number;
}

export interface ValidationError {
  category: string;
  questionText: string;
  answer?: string;
}

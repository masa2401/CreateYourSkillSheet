export type Question = {
  readonly id: number;
  readonly questionText: string;
  answers: string[];
};

export type QuestionState = {
  readonly id: number;
  readonly questionText: string;
  answers: Answer[];
};

export type StarLevel = 1 | 2 | 3 | 4 | 5;

export type Answer = {
  readonly label: string;
  isChecked?: boolean;
  value?: StarLevel;
};

export type QuestionCategory = 'common' | 'engineer' | 'designer';

export interface CategoryMeta {
  readonly label: string;
  readonly description: string;
}

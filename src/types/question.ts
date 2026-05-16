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

export type Answer = {
  readonly label: string;
  isChecked?: boolean;
  value?: number;
};

export type QuestionCategory = 'common' | 'engineer' | 'designer';

export interface CategoryMeta {
  readonly label: string;
  readonly description: string;
}

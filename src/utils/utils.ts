import type { Question, QuestionState } from '@/types';

// ========================================
// LocalStorage操作
// ========================================

/**
 * LocalStorageから値を取得し、JSONパースして返す。エラーが発生した場合はデフォルト値を返す。
 * @param {string} key - ストレージキー
 * @param {*} [defaultValue] - デフォルト値（オプション）
 * @returns {T | undefined} パースされた値、またはデフォルト値/undefined
 */

// defaultValue あり → T が確実に返る
export function getStorageValue<T>(key: string, defaultValue: T): T;
// defaultValue なし → undefined が返る可能性あり
export function getStorageValue<T>(key: string, defaultValue?: T): T | undefined;
// 実装シグネチャ
export function getStorageValue<T>(key: string, defaultValue?: T): T | undefined {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`LocalStorage取得・パースエラー: ${key}`, error);
    return defaultValue;
  }
}

/**
 * LocalStorageに値を保存。値はJSON文字列に変換される。エラーが発生した場合はfalseを返す。
 * @param {string} key - ストレージキー
 * @param {*} value - 保存する値
 * @returns {boolean} 成功/失敗
 */

export const setStorageValue = (key: string, value: unknown): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`LocalStorage保存エラー: ${key}`, error);
    return false;
  }
};

/**
 * LocalStorageから値を削除。エラーが発生した場合はfalseを返す。
 * @param {string} key - ストレージキー
 * @returns {boolean} 成功/失敗
 */

export const removeStorageValue = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`LocalStorage削除エラー: ${key}`, error);
    return false;
  }
};

// ========================================
// データ変換
// ========================================

/**
 * 質問データをQuestionState形式に変換するユーティリティ関数
 * @param {Question} question - 変換対象の質問データ
 * @returns {QuestionState} 変換された質問状態オブジェクト
 */

const toQuestionState = (question: Question): QuestionState => ({
  ...question,
  answers: question.answers.map((label) => ({ label })),
});

export const initQuestionStates = (questions: Question[]) => questions.map(toQuestionState); // Question[] → QuestionState[]

/** 質問状態オブジェクトから質問データを抽出するユーティリティ関数
 * @param {QuestionState[]} questions - 抽出対象の質問状態オブジェクトの配列
 * @returns {Question[]} 抽出された質問データの配列
 */

export const extractQuestionData = (questions: QuestionState[]): QuestionState[] =>
  questions.map((q) => ({
    id: q.id,
    questionText: q.questionText,
    answers: q.answers.map((a) => ({
      label: a.label,
      isChecked: a.isChecked,
      value: a.value,
    })),
  }));

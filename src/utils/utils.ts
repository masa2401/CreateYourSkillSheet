import type { Question, QuestionState } from '@/types';

// ========================================
// LocalStorage操作
// ========================================

/**
 * LocalStorageから値を取得
 * @param {string} key - ストレージキー
 * @param {*} defaultValue - デフォルト値
 * @returns {*} 取得した値またはデフォルト値
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
 * LocalStorageに値を保存
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
 * LocalStorageから値を削除
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
 * 質問データをリアクティブな形式に変換
 */

const toQuestionState = (question: Question): QuestionState => ({
  ...question,
  answers: question.answers.map((label) => ({ label })),
});

export const initQuestionStates = (questions: Question[]) => questions.map(toQuestionState); // Question[] → QuestionState[]

/**
 * 質問データをシリアライズ（保存用）
 * @param {Question[]} questions - 質問データ配列
 * @returns {Question[]} シリアライズされた質問データ
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

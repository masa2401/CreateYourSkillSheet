// ========================================
// LocalStorage操作
// ========================================

/**
 * LocalStorageから値を取得
 * @param {string} key - ストレージキー
 * @param {*} defaultValue - デフォルト値
 * @returns {*} 取得した値またはデフォルト値
 */

export const getStorageValue = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error(`LocalStorage取得・パースエラー: ${key}`, error);
    return defaultValue;
  }
};

/**
 * LocalStorageに値を保存
 * @param {string} key - ストレージキー
 * @param {*} value - 保存する値
 * @returns {boolean} 成功/失敗
 */

export const setStorageValue = (key, value) => {
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

export const removeStorageValue = (key) => {
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
 * @param {Array} data - 質問データ配列
 * @returns {Array} リアクティブな質問データ
 */

export const createReactiveQuestions = (data) => {
  return data.map((q) => ({
    id: q.id,
    questionText: q.questionText,
    answers: q.answers.map((text) => ({
      text,
      isChecked: false,
      value: null,
    })),
  }));
};

/**
 * 質問データをシリアライズ（保存用）
 * @param {Array} questions - 質問データ配列
 * @returns {Array} シリアライズされた質問データ
 */

export const serializeQuestions = (questions) => {
  return questions.map((q) => ({
    id: q.id,
    questionText: q.questionText,
    answers: q.answers.map((a) => ({
      text: a.text,
      isChecked: a.isChecked,
      value: a.value,
    })),
  }));
};

// ========================================
// バリデーション
// ========================================

/**
 * チェックされた回答で習熟度が未選択のものを検証
 * @param {Array} allQuestions - すべての質問データ
 * @param {Array} categories - カテゴリ設定
 * @returns {Array} エラー配列
 */

export const validateQuestions = (allQuestions, categories) => {
  const errors: Array<{ category: string; questionText: string; answer: string }> = [];
  allQuestions.forEach(({ name, questions, categoryId }) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category?.isChecked) return;
    questions.forEach((question) => {
      question.answers.forEach((answer) => {
        if (answer.isChecked && !answer.value) {
          errors.push({
            category: name,
            questionText: question.questionText,
            answer: answer.text,
          });
        }
      });
    });
  });
  return errors;
};

// ========================================
// スクロール
// ========================================

/**
 * 要素までスムーズスクロール
 * @param {string} elementId - 要素のID
 */

export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

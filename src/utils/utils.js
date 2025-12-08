import { STORAGE_KEYS } from './constants'

// LocalStorage操作
export const getStorageValue = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key)
        if (item === null) return defaultValue

        // JSON.parseで自動的に型変換
        return JSON.parse(item)
    } catch (error) {
        console.error(`LocalStorage取得・パースエラー: ${key}`, error)
        return defaultValue
    }
}

// LocalStorageに値を保存（自動でJSON.stringify）
export const setStorageValue = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
        return true
    } catch (error) {
        console.error(`LocalStorage保存エラー: ${key}`, error)
        return false
    }
}

// LocalStorageから値を削除
export const removeStorageValue = (key) => {
    try {
        localStorage.removeItem(key)
        return true
    } catch (error) {
        console.error(`LocalStorage削除エラー: ${key}`, error)
        return false
    }
}

// ユーザー名を取得
export const getUserName = () => {
    return getStorageValue(STORAGE_KEYS.USER_NAME, 'ゲスト')
}
// カテゴリの選択状態を取得
export const getCategorySelection = (categoryKey) => {
    return getStorageValue(categoryKey, false)
}
// データ変換
// 質問データをリアクティブな形式に変換
export const createReactiveQuestions = (data) => {
    return data.map((q) => ({
        id: q.id,
        question: q.question,
        answers: q.answers.map((text) => ({
            text,
            isChecked: false,
            value: null,
        })),
    }))
}

// 質問データをシリアライズ（保存用）
export const serializeQuestions = (questions) => {
    return questions.map((q) => ({
        id: q.id,
        question: q.question,
        answers: q.answers.map((a) => ({
            text: a.text,
            isChecked: a.isChecked,
            value: a.value,
        })),
    }))
}

// バリデーション
// チェックされた回答で習熟度が未選択のものを検証
export const validateQuestions = (allQuestions, categories) => {
    const errors = []

    allQuestions.forEach(({ name, questions, categoryId }) => {
        const category = categories.find((c) => c.id === categoryId)
        if (!category?.isChecked) return

        questions.forEach((question) => {
            question.answers.forEach((answer) => {
                if (answer.isChecked && !answer.value) {
                    errors.push({
                        category: name,
                        question: question.question,
                        answer: answer.text,
                    })
                }
            })
        })
    })

    return errors
}

// スクロール
// 要素までスムーズスクロール
export const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}
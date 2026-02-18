// LocalStorageキー
export const STORAGE_KEYS = {
    USER_NAME: 'name',
    CATEGORY_ENGINEER: 'engineer',
    CATEGORY_DESIGNER: 'designer',
    SURVEY_DATA: 'surveyData',
}

// カテゴリ定義
export const CATEGORIES = {
    COMMON: {
        id: 1,
        genre: '共通の質問',
        icon: 'fa-solid fa-briefcase',
        alwaysChecked: true,
    },
    ENGINEER: {
        id: 2,
        genre: 'プログラマ/エンジニア向けの質問',
        icon: 'fa-solid fa-computer',
        storageKey: STORAGE_KEYS.CATEGORY_ENGINEER,
    },
    DESIGNER: {
        id: 3,
        genre: 'デザイナー(動画制作)向けの質問',
        icon: 'fa-solid fa-palette',
        storageKey: STORAGE_KEYS.CATEGORY_DESIGNER,
    },
}

// 習熟度ラベル
export const LEVEL_LABELS = [
    '★☆☆☆☆',
    '★★☆☆☆',
    '★★★☆☆',
    '★★★★☆',
    '★★★★★',
]

// ルートパス
export const ROUTES = {
    TOP: '/',
    SURVEY: '/survey',
    RESULT: '/result',
}
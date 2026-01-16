import LZString from 'lz-string'

// ========================================
// データの圧縮・展開
// ========================================

/**
 * オブジェクトを圧縮してBase64エンコード
 */
export const encodeData = (data) => {
    try {
        const jsonString = JSON.stringify(data)
        // LZ-stringで圧縮 + URL安全なBase64エンコード
        const compressed = LZString.compressToEncodedURIComponent(jsonString)
        return compressed
    } catch (error) {
        console.error('エンコードエラー:', error)
        return null
    }
}

/**
 * 圧縮されたBase64文字列をデコードしてオブジェクトに変換
 */
export const decodeData = (compressedString) => {
    try {
        // LZ-stringで解凍
        const jsonString = LZString.decompressFromEncodedURIComponent(compressedString)

        if (!jsonString) {
            throw new Error('解凍に失敗しました')
        }

        const data = JSON.parse(jsonString)
        return data
    } catch (error) {
        console.error('デコードエラー:', error)
        return null
    }
}

// ========================================
// URL生成・解析
// ========================================

/**
 * 共有用URLを生成
 */
export const createShareUrl = (surveyData) => {
    const encoded = encodeData(surveyData)
    if (!encoded) {
        throw new Error('データのエンコードに失敗しました')
    }

    const { origin, pathname } = window.location
    return `${origin}${pathname}#/result?data=${encoded}`
}

/**
 * URLからデータを取得
 */
export const getDataFromUrl = () => {
    try {
        let searchString = ''

        // Hash Modeの場合（#の後ろにクエリパラメータがある）
        if (window.location.hash.includes('?')) {
            // "#/result?data=xxxxx" から "?data=xxxxx" 部分を抽出
            const hashParts = window.location.hash.split('?')
            searchString = hashParts.length > 1 ? '?' + hashParts.slice(1).join('?') : ''
        }
        // History Modeの場合（従来通り）
        else if (window.location.search) {
            searchString = window.location.search
        }

        // クエリパラメータが存在しない場合
        if (!searchString) {
            console.info('URLにデータパラメータが含まれていません')
            return null
        }

        // URLパラメータの解析
        const urlParams = new URLSearchParams(searchString)
        const encodedData = urlParams.get('data')

        // dataパラメータが存在しない場合
        if (!encodedData) {
            console.warn('URLに"data"パラメータが見つかりません')
            return null
        }

        // 空文字列チェック
        if (encodedData.trim() === '') {
            console.error('dataパラメータが空です')
            return null
        }

        // デコード処理
        const decoded = decodeData(encodedData)

        // デコード失敗
        if (!decoded) {
            console.error('データのデコードに失敗しました。URLが破損している可能性があります。')
            return null
        }

        // データ構造の検証
        if (typeof decoded !== 'object' || decoded === null) {
            console.error('デコードされたデータが無効な形式です（オブジェクトではありません）')
            return null
        }

        // 必須フィールドの検証
        if (!decoded.userName || typeof decoded.userName !== 'string') {
            console.error('データに有効なuserNameフィールドがありません')
            return null
        }

        if (!Array.isArray(decoded.categories)) {
            console.error('データに有効なcategoriesフィールドがありません（配列ではありません）')
            return null
        }

        // categoriesの各要素を検証
        const isValidCategories = decoded.categories.every((category) => {
            return (
                category &&
                typeof category.id === 'number' &&
                typeof category.genre === 'string' &&
                typeof category.isChecked === 'boolean' &&
                Array.isArray(category.questions)
            )
        })

        if (!isValidCategories) {
            console.error('categoriesの構造が無効です')
            return null
        }

        // すべての検証を通過
        console.info('URLからデータを正常に取得しました')
        return decoded

    } catch (error) {
        // 予期しないエラーをキャッチ
        console.error('URLからのデータ取得中に予期しないエラーが発生しました:', error)

        // エラーの詳細をログ出力（デバッグ用）
        if (error instanceof TypeError) {
            console.error('型エラー: データ構造が想定と異なる可能性があります')
        } else if (error instanceof SyntaxError) {
            console.error('構文エラー: JSONのパースに失敗しました')
        }

        return null
    }
}

// ========================================
// クリップボード操作
// ========================================

/**
 * URLをクリップボードにコピー
 */
export const copyToClipboard = async (text) => {
    try {
        // モダンブラウザ
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text)
            return true
        }

        // フォールバック（古いブラウザ）
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()

        const success = document.execCommand('copy')
        document.body.removeChild(textarea)

        return success
    } catch (error) {
        console.error('クリップボードコピーエラー:', error)
        return false
    }
}
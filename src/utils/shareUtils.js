// ========================================
// データの圧縮・展開
// ========================================

/**
 * オブジェクトをBase64エンコード
 */
export const encodeData = (data) => {
    try {
        const jsonString = JSON.stringify(data)
        // UTF-8対応のBase64エンコード
        const base64 = btoa(unescape(encodeURIComponent(jsonString)))
        return base64
    } catch (error) {
        console.error('エンコードエラー:', error)
        return null
    }
}

/**
 * Base64文字列をデコードしてオブジェクトに変換
 */
export const decodeData = (base64String) => {
    try {
        // UTF-8対応のBase64デコード
        const jsonString = decodeURIComponent(escape(atob(base64String)))
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
export const generateShareUrl = (surveyData) => {
    const encoded = encodeData(surveyData)
    if (!encoded) {
        throw new Error('データのエンコードに失敗しました')
    }

    const baseUrl = window.location.origin
    const shareUrl = `${baseUrl}/result?data=${encoded}`

    return shareUrl
}

/**
 * URLからデータを取得
 */
export const getDataFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const encodedData = urlParams.get('data')

    if (!encodedData) {
        return null
    }

    return decodeData(encodedData)
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

// ========================================
// SNSシェア
// ========================================

/**
 * Twitter シェアURLを生成
 */
export const getTwitterShareUrl = (url, text = 'スキルシートを共有') => {
    const encodedText = encodeURIComponent(text)
    const encodedUrl = encodeURIComponent(url)
    return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
}

/**
 * LINE シェアURLを生成
 */
export const getLineShareUrl = (url, text = 'スキルシートを共有') => {
    const message = encodeURIComponent(`${text}\n${url}`)
    return `https://line.me/R/msg/text/?${message}`
}

/**
 * Facebook シェアURLを生成
 */
export const getFacebookShareUrl = (url) => {
    const encodedUrl = encodeURIComponent(url)
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
}
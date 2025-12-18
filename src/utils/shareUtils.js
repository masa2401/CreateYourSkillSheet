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
 * 共有用URLを生成（Hash Mode対応）
 */
export const generateShareUrl = (surveyData) => {
    const encoded = encodeData(surveyData)
    if (!encoded) {
        throw new Error('データのエンコードに失敗しました')
    }

    const baseUrl = window.location.origin
    const basePath = window.location.pathname // GitHub Pagesのサブパス対応

    // Hash Modeの場合: /#/result?data=xxxxx
    const shareUrl = `${baseUrl}${basePath}#/result?data=${encoded}`

    return shareUrl
}

/**
 * URLからデータを取得（Hash Mode対応）
 */
export const getDataFromUrl = () => {
    // Hash Modeでは window.location.hash にクエリパラメータが含まれる
    // 例: "#/result?data=xxxxx" または "?data=xxxxx"（History Mode互換性）

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

    if (!searchString) {
        return null
    }

    const urlParams = new URLSearchParams(searchString)
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
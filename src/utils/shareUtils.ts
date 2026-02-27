import LZString from 'lz-string';
import type { Category, SurveyData } from '../types/interfaces';

// ========================================
// 型ガード
// ========================================

const isCategory = (value: unknown): value is Category =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Category).id === 'number' &&
  typeof (value as Category).genre === 'string' &&
  typeof (value as Category).isChecked === 'boolean' &&
  Array.isArray((value as Category).questions);

const isSurveyData = (value: unknown): value is SurveyData =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as SurveyData).userName === 'string' &&
  !!(value as SurveyData).userName &&
  Array.isArray((value as SurveyData).categories) &&
  (value as SurveyData).categories.every(isCategory);

// ========================================
// データの圧縮・展開
// ========================================

/**
 * オブジェクトを圧縮してBase64エンコード
 */
export const encodeData = (data: SurveyData): string | undefined => {
  try {
    const jsonString = JSON.stringify(data);
    // LZ-stringで圧縮 + URL安全なBase64エンコード
    return LZString.compressToEncodedURIComponent(jsonString);
  } catch (error) {
    console.error('エンコードエラー:', error);
    return undefined;
  }
};

/**
 * 圧縮されたBase64文字列をデコードしてオブジェクトに変換
 */
export const decodeData = (compressedString: string): string | undefined => {
  try {
    // LZ-stringで解凍
    const jsonString = LZString.decompressFromEncodedURIComponent(compressedString);
    if (!jsonString) {
      throw new Error('解凍に失敗しました');
    }
    return JSON.parse(jsonString) as string;
  } catch (error) {
    console.error('デコードエラー:', error);
    return undefined;
  }
};

// ========================================
// URL生成・解析
// ========================================

/**
 * 共有用URLを生成
 */
export const createShareUrl = (surveyData: SurveyData): string => {
  const encoded = encodeData(surveyData);
  if (!encoded) {
    throw new Error('データのエンコードに失敗しました');
  }
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#/result?data=${encoded}`;
};

/**
 * URLからデータを取得
 */
export const getDataFromUrl = (): SurveyData | undefined => {
  try {
    let searchString = '';
    if (window.location.hash.includes('?')) {
      // "#/result?data=xxxxx" から "?data=xxxxx" 部分を抽出
      const hashParts = window.location.hash.split('?');
      searchString = hashParts.length > 1 ? '?' + hashParts.slice(1).join('?') : '';
    }

    // クエリパラメータが存在しない場合
    if (!searchString) {
      console.info('URLにデータパラメータが含まれていません');
      return undefined;
    }

    // URLパラメータの解析
    const urlParams = new URLSearchParams(searchString);
    const encodedData = urlParams.get('data');

    // dataパラメータが存在しない・空の場合
    if (!encodedData) {
      console.warn('URLに"data"パラメータが見つかりません');
      return undefined;
    }

    // デコード処理
    const decoded = decodeData(encodedData);
    if (!decoded) {
      console.error('データのデコードに失敗しました。URLが破損している可能性があります。');
      return undefined;
    }

    // 型ガードによるデータ構造の検証
    if (!isSurveyData(decoded)) {
      console.error('デコードされたデータの構造が無効です');
      return undefined;
    }
    console.info('URLからデータを正常に取得しました');
    return decoded;
  } catch (error) {
    console.error('URLからのデータ取得中に予期しないエラーが発生しました:', error);
    return undefined;
  }
};

// ========================================
// クリップボード操作
// ========================================

/**
 * URLをクリップボードにコピー
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('クリップボードコピーエラー:', error);
    return false;
  }
};

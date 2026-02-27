import { LEVEL_LABELS } from '@/utils/constants';
import type { SurveyData } from '@/types/interfaces';

// ========================================
// 型定義
// ========================================

interface LevelLabel {
  stars: string;
  text: string;
}

// ========================================
// CSV変換・ダウンロード
// ========================================

/**
 * スキルシートデータをCSV形式に変換
 * @param {SurveyData} surveyData - アンケートデータ
 * @returns {string} CSV文字列
 */
export const convertToCSV = (surveyData: SurveyData): string => {
  try {
    const rows: Array<string[]> = [];

    // ヘッダー行
    rows.push(['ユーザー名', surveyData.userName]);
    rows.push([]); // 空行

    // 習熟度の説明
    rows.push(['習熟度の説明']);
    LEVEL_LABELS.forEach((level) => {
      rows.push([level.stars, level.text]);
    });
    rows.push([]); // 空行

    // カテゴリごとのデータ
    rows.push(['カテゴリ', '質問', 'スキル', '習熟度']);

    // チェックされたカテゴリのみ処理
    surveyData.categories.forEach((category) => {
      if (!category.isChecked) return;
      let categoryRowAdded = false;
      category.questions.forEach((question) => {
        const checkedAnswers = question.answers.filter((a) => a.isChecked);
        if (checkedAnswers.length === 0) return;
        let questionRowAdded = false;
        checkedAnswers.forEach((answer) => {
          // 習熟度のラベルを取得
          const level: LevelLabel | undefined = answer.value
            ? LEVEL_LABELS[answer.value - 1]
            : undefined;
          rows.push([
            !categoryRowAdded ? category.genre : '',
            !questionRowAdded ? question.questionText : '',
            answer.text,
            level?.stars ?? '',
          ]);
          categoryRowAdded = true;
          questionRowAdded = true;
        });
      });
    });

    // CSVフォーマットに変換（ダブルクォートでエスケープ）
    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => {
            // セルの値を文字列に変換
            const cellValue = cell === null || cell === undefined ? '' : String(cell);
            // ダブルクォートを2つにエスケープ
            const escapedValue = cellValue.replace(/"/g, '""');
            // 各セルをダブルクォートで囲む
            return `"${escapedValue}"`;
          })
          .join(','),
      )
      .join('\r\n');

    // BOM付きUTF-8（Excelでの文字化け防止）
    return '\uFEFF' + csvContent;
  } catch (error) {
    console.error('CSV変換エラー:', error);
    throw new Error('CSVへの変換に失敗しました');
  }
};

/**
 * CSVファイルをダウンロード
 * @param {SurveyData} surveyData - アンケートデータ
 * @returns {boolean} 成功/失敗
 */
export const downloadCSV = (surveyData: SurveyData): boolean => {
  try {
    // データ検証
    if (!surveyData || !surveyData.userName || !surveyData.categories) {
      console.error('無効なデータ:', surveyData);
      return false;
    }

    // CSV変換
    const csv = convertToCSV(surveyData);

    // Blob作成
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // ファイル名生成（ユーザー名_スキルシート_日付.csv）
    const date = new Date();
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const fileName = `${surveyData.userName}様_スキルシート_${dateString}.csv`;

    // ダウンロード実行
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // クリーンアップ
    document.body.removeChild(link);

    // メモリ解放（少し遅延させる）
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);

    console.info('CSVダウンロード成功:', fileName);
    return true;
  } catch (error) {
    console.error('CSVダウンロードエラー:', error);
    return false;
  }
};

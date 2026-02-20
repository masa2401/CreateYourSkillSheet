// ========================================
// CSV変換・ダウンロード
// ========================================

import { LEVEL_LABELS } from '@/utils/constants';

/**
 * スキルシートデータをCSV形式に変換
 * @param {Object} surveyData - アンケートデータ
 * @returns {string} CSV文字列
 */
export const convertToCSV = (surveyData) => {
  try {
    const rows: Array<string | string[]> = [];

    // ヘッダー行
    rows.push(['ユーザー名', surveyData.userName]);
    rows.push([]); // 空行

    // 習熟度の説明
    rows.push(['習熟度の説明']);
    rows.push(['★☆☆☆☆', '習得が不十分な状態']);
    rows.push(['★★☆☆☆', '基礎はあるが不安定']);
    rows.push(['★★★☆☆', '期待どおりにできる']);
    rows.push(['★★★★☆', '期待以上の成果を出す']);
    rows.push(['★★★★★', '卓越したレベルで発揮する']);
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
          const level = answer.value ? LEVEL_LABELS[answer.value - 1] : '';
          rows.push([
            !categoryRowAdded ? category.genre : '',
            !questionRowAdded ? question.questionText : '',
            answer.text,
            level,
          ]);
          categoryRowAdded = true;
          questionRowAdded = true;
        });
      });
    });

    // CSVフォーマットに変換（ダブルクォートでエスケープ）
    const csvContent = rows
      .map((row) => {
        if (typeof row === 'string') {
          const escapedRow = row.replace(/"/g, '""');
          return `"${escapedRow}"`;
        }
        return row
          .map((cell) => {
            // セルの値を文字列に変換
            const cellValue = cell === null || cell === undefined ? '' : String(cell);
            // ダブルクォートを2つにエスケープ
            const escapedValue = cellValue.replace(/"/g, '""');
            // 各セルをダブルクォートで囲む
            return `"${escapedValue}"`;
          })
          .join(',');
      })
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
 * @param {Object} surveyData - アンケートデータ
 * @returns {boolean} 成功/失敗
 */
export const downloadCSV = (surveyData) => {
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

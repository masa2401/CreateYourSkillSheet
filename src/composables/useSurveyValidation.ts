import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import type { Category, ValidationError } from '@/types/interfaces';

// ─── composable ────────────────────────────────────────────────────────────────

/**
 * useSurveyValidation
 *
 * SurveyPage の「チェック済み質問に習熟度が選択されているか」バリデーションを担う composable。
 *
 * ### 使い方
 * ```ts
 * const { validationErrors, hasAttemptedSubmit, validate, isSubmitDisabled } =
 *   useSurveyValidation(categoryData);
 * ```
 *
 * - `validate()`         : 送信ボタン押下時に呼び出す。エラーがなければ true を返す。
 * - `isSubmitDisabled`   : 送信ボタンの無効化判定に使う算出済み ref（computed ではなく ref で保持）。
 *
 * ### なぜ watch を composable の中に持つか
 * 「送信試行後にリアルタイム再バリデーションする」というロジックは
 * バリデーション責務の一部なので、ページコンポーネントに書くより
 * ここにまとめた方が保守しやすい。
 */
export function useSurveyValidation(categoryData: Ref<Category[]>) {
  /** バリデーションエラーの一覧 */
  const validationErrors = ref<ValidationError[]>([]);

  /** 一度でも送信ボタンが押されたかどうか */
  const hasAttemptedSubmit = ref<boolean>(false);

  /**
   * バリデーションルールを評価してエラー一覧を返す。
   * 副作用はなく、純粋に結果を返すだけ。
   */
  const buildErrors = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    categoryData.value.forEach((category) => {
      // チェックされていないカテゴリは対象外
      if (!category.isChecked) return;

      category.questions.forEach((question) => {
        question.answers.forEach((answer) => {
          // チェックされているのに習熟度が未選択の場合はエラー
          if (answer.isChecked && !answer.value) {
            errors.push({
              category: category.genre,
              questionText: question.questionText,
            });
          }
        });
      });
    });

    return errors;
  };

  /**
   * バリデーションを実行し、内部状態を更新する。
   * @returns エラーがない場合 true、ある場合 false
   */
  const validate = (): boolean => {
    hasAttemptedSubmit.value = true;
    validationErrors.value = buildErrors();
    return validationErrors.value.length === 0;
  };

  /**
   * 送信ボタンの無効化条件。
   * 「送信を試みた かつ エラーがある」場合のみ true。
   */
  const isSubmitDisabled = (): boolean => {
    return hasAttemptedSubmit.value && validationErrors.value.length > 0;
  };

  // 送信試行後のみ、categoryData の変化に応じてリアルタイム再バリデーション
  watch(
    categoryData,
    () => {
      if (hasAttemptedSubmit.value) {
        validationErrors.value = buildErrors();
      }
    },
    { deep: true },
  );

  return {
    validationErrors,
    hasAttemptedSubmit,
    validate,
    isSubmitDisabled,
  };
}

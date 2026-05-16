import { watch } from 'vue';
import type { Ref } from 'vue';
import type { Category, Answer, ValidationError, QuestionState } from '@/types';
import { useValidation } from '@/composables/useValidation';

// ─── composable ────────────────────────────────────────────────────────────────

export function useSurveyValidation(categoryData: Ref<Category[]>) {
  /** バリデーションルールを評価してエラー一覧を返す。 */
  const checkAnswerError = (
    category: Category,
    question: QuestionState,
    answer: Answer,
  ): ValidationError | null => {
    if (answer.isChecked && !answer.value) {
      return {
        category: category.genre,
        text: question.questionText,
      };
    }
    return null;
  };
  const buildErrors = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    categoryData.value.forEach((category) => {
      if (!category.isChecked) return; // チェックされていないカテゴリは対象外
      category.questions.forEach((question) => {
        question.answers.forEach((answer) => {
          const error = checkAnswerError(category, question, answer);
          if (error) errors.push(error);
        });
      });
    });
    return errors;
  };

  const { validationErrors, hasAttemptedSubmit, validate } = useValidation(buildErrors);

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

import { watch } from 'vue';
import type { Ref } from 'vue';
import type { Category, Answer, ValidationError, QuestionState } from '@/types';
import { useValidation } from '@/composables/useValidation';

// ─── composable ────────────────────────────────────────────────────────────────

export function useSurveyValidation(categoryData: Ref<Category[]>) {
  /**
   * 各回答に対するバリデーションルールを評価し、エラーがあれば ValidationError オブジェクトを返す。
   * ルール：チェックされている回答で、かつ値が空の場合はエラー。
   * @param category - 現在のカテゴリオブジェクト。
   * @param question - 現在の質問オブジェクト。
   * @param answer - 現在の回答オブジェクト。
   * @returns ValidationError オブジェクトまたは null。
   */

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

  /**
   * 全カテゴリの全質問の全回答に対して checkAnswerError を適用し、エラーがあれば配列で返す。
   * 送信が試みられた後にのみエラーを評価するため、リアクティブな categoryData を監視して、変更があった場合にバリデーションエラーを再評価する。
   * @returns ValidationError の配列。
   */

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
   * 送信ボタンの disabled 状態を判定する関数。送信が試みられた後で、かつバリデーションエラーが存在する場合に true を返す。
   * これにより、ユーザーはエラーを修正するまで送信できなくなる。
   * @returns boolean - 送信ボタンを無効にするかどうか。
   */

  const isSubmitDisabled = (): boolean => {
    return hasAttemptedSubmit.value && validationErrors.value.length > 0;
  };

  /**
   * categoryData を監視し、変更があった場合にバリデーションエラーを再評価する。これにより、ユーザーが回答を修正した際にリアルタイムでエラーが更新される。
   * 送信が試みられた後にのみエラーを更新するため、hasAttemptedSubmit を条件にしている。
   */

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

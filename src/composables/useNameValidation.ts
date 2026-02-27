import { ref } from 'vue';
import type { Ref } from 'vue';
import type { ValidationError } from '@/types/interfaces';

/**
 * useNameValidation
 *
 * TopPage の「お名前入力」バリデーションを担う composable。
 *
 * ### 使い方
 * ```ts
 * const { validationErrors, hasAttemptedSubmit, validate, onInput } =
 *   useNameValidation(userName);
 * ```
 *
 * - `validate()`   : 送信ボタン押下時に呼び出す。エラーがなければ true を返す。
 * - `onInput()`    : input イベント時に呼び出す。送信試行後のみ再バリデーションする。
 */
export function useNameValidation(userName: Ref<string | null | undefined>) {
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

    if (!userName.value || !userName.value.trim()) {
      errors.push({
        category: '入力必須項目',
        questionText: 'お名前を入力してください',
      });
    }

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
   * input イベント用ハンドラ。
   * 送信を一度試みた後のみ、リアルタイムでエラーを更新する。
   */
  const onInput = (): void => {
    if (hasAttemptedSubmit.value) {
      validationErrors.value = buildErrors();
    }
  };

  return {
    validationErrors,
    hasAttemptedSubmit,
    validate,
    onInput,
  };
}

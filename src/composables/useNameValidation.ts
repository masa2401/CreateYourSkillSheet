import type { Ref } from 'vue';
import type { ValidationError } from '@/types';
import { useValidation } from '@/composables/useValidation';

export function useNameValidation(userName: Ref<string>) {
  const buildErrors = (): ValidationError[] => {
    if (!userName.value.trim()) {
      return [{ category: '入力必須項目', text: 'お名前を入力してください' }];
    }
    return [];
  };

  const { validationErrors, hasAttemptedSubmit, validate } = useValidation(buildErrors);

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

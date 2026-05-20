import { describe, it, expect } from 'vitest';
import { encodeData, decodeData } from './shareUtils';
import type { SurveyData } from '@/types';

const mockSurveyData: SurveyData = {
  userName: 'テストユーザー',
  categories: [
    {
      id: 1,
      genre: '共通の質問',
      isChecked: true,
      questions: [
        {
          id: 1,
          questionText: 'Q1 テスト質問',
          answers: [{ label: 'テスト回答', isChecked: true, value: 3 }],
        },
      ],
    },
  ],
};

describe('encodeData', () => {
  it('エンコード結果が文字列で返る', () => {
    const result = encodeData(mockSurveyData);
    expect(typeof result).toBe('string');
  });

  it('空のuserNameはエンコードできる', () => {
    const data = { ...mockSurveyData, userName: '' };
    const result = encodeData(data);
    expect(result).not.toBeNull();
  });
});

describe('decodeData', () => {
  it('エンコード→デコードで元のデータに戻る', () => {
    const encoded = encodeData(mockSurveyData)!;
    const decoded = decodeData(encoded);
    expect(decoded).toEqual(mockSurveyData);
  });

  it('不正な文字列はnullを返す', () => {
    const result = decodeData('invalid-string');
    expect(result).toBeNull();
  });
});

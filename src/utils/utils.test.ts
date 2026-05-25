import { describe, it, expect, beforeEach } from 'vitest';
import {
  extractQuestionData,
  getStorageValue,
  initQuestionStates,
  removeStorageValue,
  setStorageValue,
} from './utils';
import type { Question } from '@/types';

// ─── localStorage ────────────────────────────────────────────────────────────

describe('getStorageValue', () => {
  beforeEach(() => localStorage.clear());

  it('保存済みの値をパースして返す', () => {
    localStorage.setItem('key', JSON.stringify({ name: 'テスト' }));
    expect(getStorageValue<{ name: string }>('key')).toEqual({ name: 'テスト' });
  });

  it('キーが存在しない場合はデフォルト値を返す', () => {
    expect(getStorageValue('nonexistnt', 'default')).toBe('default');
  });

  it('デフォルト値なしでキーが存在しない場合はundefinedを返す', () => {
    expect(getStorageValue('nonexistnt')).toBeUndefined();
  });

  it('不正なJSONの場合はデフォルト値を返す', () => {
    localStorage.setItem('key', 'invalid JSON{{{');
    expect(getStorageValue('key', 'fallback')).toBe('fallback');
  });
});

describe('setStorageValue', () => {
  beforeEach(() => localStorage.clear);

  it('値を保存してtrueを返す', () => {
    expect(setStorageValue('key', 'value')).toBe(true);
    expect(localStorage.getItem('key')).toBe('"value"');
  });

  it('オブジェクトをJSON文字列として保存する', () => {
    setStorageValue('obj', { a: 1 });
    expect(JSON.parse(localStorage.getItem('obj')!)).toEqual({ a: 1 });
  });
});

describe('removeStorageValue', () => {
  it('キーを削除してtrueを返す', () => {
    localStorage.setItem('key', 'value');
    expect(removeStorageValue('key')).toBe(true);
    expect(localStorage.getItem('key')).toBeNull();
  });

  it('存在しないキーを削除してもtrueを返す', () => {
    expect(removeStorageValue('nonexistent')).toBe(true);
  });
});

// ─── データ変換 ───────────────────────────────────────────────────────────────

describe('initQuestionStates', () => {
  const questions: Question[] = [
    { id: 1, questionText: 'Q1. テスト質問', answers: ['回答A', '回答B'] },
  ];

  it('answers の文字列を label を持つオブジェクトに変換する', () => {
    const [result] = initQuestionStates(questions);
    expect(result!.answers).toEqual([{ label: '回答A' }, { label: '回答B' }]);
  });

  it('id と questionText は維持される', () => {
    const [result] = initQuestionStates(questions);
    expect(result!.id).toBe(1);
    expect(result!.questionText).toBe('Q1. テスト質問');
  });

  it('空配列を渡すと空配列が返る', () => {
    expect(initQuestionStates([])).toEqual([]);
  });
});

describe('extractQuestionData', () => {
  it('label, isChecked, value のみを抽出する', () => {
    const questions = [
      {
        id: 1,
        questionText: 'Q1. テスト質問',
        answers: [{ label: '回答A', isChecked: true, value: 3 as const }],
      },
    ];
    const [result] = extractQuestionData(questions);
    expect(result!.answers[0]).toEqual({ label: '回答A', isChecked: true, value: 3 });
  });

  it('id と questionText は維持される', () => {
    const questions = [{ id: 1, questionText: 'Q1. テスト質問', answers: [] }];
    const [result] = extractQuestionData(questions);
    expect(result!.id).toBe(1);
    expect(result!.questionText).toBe('Q1. テスト質問');
  });
});

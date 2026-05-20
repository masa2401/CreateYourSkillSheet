import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AnswerItem from '@/components/AnswerItem.vue';

describe('AnswerItem.vue', () => {
  it('isChecked が true のとき習熟度選択が表示される', () => {
    const wrapper = mount(AnswerItem, {
      props: { answer: { label: 'テスト回答', isChecked: true }, answerIndex: 0 },
    });
    expect(wrapper.find('.level-selector').exists()).toBe(true);
  });

  it('isChecked が false のとき習熟度選択が表示されない', () => {
    const wrapper = mount(AnswerItem, {
      props: { answer: { label: 'テスト回答', isChecked: false }, answerIndex: 0 },
    });
    expect(wrapper.find('.level-selector').exists()).toBe(false);
  });

  it('チェックボックス変更時に update:answer が emit される', async () => {
    const wrapper = mount(AnswerItem, {
      props: { answer: { label: 'テスト回答', isChecked: false }, answerIndex: 0 },
    });

    await wrapper.find('input[type="checkbox"]').trigger('change');

    expect(wrapper.emitted('update:answer')).toBeTruthy();
  });

  it('習熟度ボタンをクリックすると value が更新される', async () => {
    const wrapper = mount(AnswerItem, {
      props: { answer: { label: 'テスト回答', isChecked: true, value: undefined }, answerIndex: 0 },
    });
    const radios = wrapper.findAll('.level-radio');
    expect(radios.length).toBe(5);

    await radios[2]!.trigger('change');

    const emittedEvents = wrapper.emitted('update:answer');
    expect(emittedEvents).toBeTruthy();
    const [payload] = emittedEvents![0] as [{ value: number }];
    expect(payload.value).toBe(3);
  });

  it('習熟度未選択時は警告テキストが表示される', () => {
    const wrapper = mount(AnswerItem, {
      props: { answer: { label: 'テスト回答', isChecked: true, value: undefined }, answerIndex: 0 },
    });
    expect(wrapper.find('.warning-text').exists()).toBe(true);
  });

  it('習熟度選択済みなら警告テキストが表示されない', () => {
    const wrapper = mount(AnswerItem, {
      props: { answer: { label: 'テスト回答', isChecked: true, value: 3 }, answerIndex: 0 },
    });
    expect(wrapper.find('.warning-text').exists()).toBe(false);
  });
});

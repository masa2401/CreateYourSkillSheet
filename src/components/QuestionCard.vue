<script setup>
import AnswerItem from './AnswerItem.vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:question'])

// 回答の更新を親コンポーネントに伝達
const handleAnswerUpdate = (answerIndex, updatedAnswer) => {
  const updatedQuestion = {
    ...props.question,
    answers: props.question.answers.map((answer, index) =>
      index === answerIndex ? updatedAnswer : answer,
    ),
  }
  emit('update:question', updatedQuestion)
}
</script>

<template>
  <div class="question-card">
    <h4 class="question-text">{{ question.question }}</h4>

    <div class="answers-grid">
      <AnswerItem
        v-for="(answer, index) in question.answers"
        :key="index"
        :answer="answer"
        :answer-index="index"
        @update:answer="handleAnswerUpdate(index, $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.question-card {
  background: #ffffff;
  border-radius: 15px;
  padding: 1.5rem 3rem;
  transition: transform 0.2s;
}

.question-text {
  font-size: 1.1rem;
  margin: 0 0 0.75rem 0;
  color: #483c32;
  font-weight: 600;
  line-height: 1.6;
}

.answers-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (max-width: 768px) {
  .question-card {
    padding: 2rem;
  }
}
</style>

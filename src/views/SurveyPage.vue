<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import QuestionCard from '@/components/QuestionCard.vue'
import ValidationError from '@/components/ValidationError.vue'
import { commonQuestionData, engineerQuestionData, designerQuestionData } from '@/data/questionData'
import { ROUTES, STORAGE_KEYS, CATEGORIES } from '@/utils/constants'
import {
  getStorageValue,
  setStorageValue,
  createReactiveQuestions,
  serializeQuestions,
  scrollToElement,
} from '@/utils/utils'

const router = useRouter()
const isHover = ref(false)

// ユーザー情報の取得
const userName = getStorageValue(STORAGE_KEYS.USER_NAME, '')

// カテゴリと質問データを統合管理
const categoryData = ref([
  {
    ...CATEGORIES.COMMON,
    isChecked: true,
    questions: createReactiveQuestions(commonQuestionData),
  },
  {
    ...CATEGORIES.ENGINEER,
    isChecked: getStorageValue(STORAGE_KEYS.CATEGORY_ENGINEER, false),
    questions: createReactiveQuestions(engineerQuestionData),
  },
  {
    ...CATEGORIES.DESIGNER,
    isChecked: getStorageValue(STORAGE_KEYS.CATEGORY_DESIGNER, false),
    questions: createReactiveQuestions(designerQuestionData),
  },
])

// バリデーション状態
const validationErrors = ref([])
const hasAttemptedSubmit = ref(false)

// バリデーション実行
const performValidation = () => {
  const errors = []

  categoryData.value.forEach((category) => {
    if (!category.isChecked) return

    category.questions.forEach((question) => {
      question.answers.forEach((answer) => {
        if (answer.isChecked && !answer.value) {
          errors.push({
            category: category.genre,
            question: question.question,
            answer: answer.text,
          })
        }
      })
    })
  })

  return errors
}

// 回答が変更されたらバリデーションを実行（送信ボタンを押した後のみ）
watch(
  categoryData,
  () => {
    if (hasAttemptedSubmit.value) {
      validationErrors.value = performValidation()
    }
  },
  { deep: true },
)

// 質問の更新ハンドラ
const handleQuestionUpdate = (categoryIndex, questionIndex, updatedQuestion) => {
  categoryData.value[categoryIndex].questions[questionIndex] = updatedQuestion
}

// 次へ進む処理
const toNext = async () => {
  hasAttemptedSubmit.value = true
  validationErrors.value = performValidation()

  if (validationErrors.value.length > 0) {
    await nextTick()
    scrollToElement('error-message')
    return
  }

  // データ保存
  const surveyData = {
    userName,
    categories: categoryData.value.map((cat) => ({
      id: cat.id,
      genre: cat.genre,
      isChecked: cat.isChecked,
      icon: cat.icon,
      questions: serializeQuestions(cat.questions),
    })),
  }

  setStorageValue(STORAGE_KEYS.SURVEY_DATA, surveyData)
  router.push(ROUTES.RESULT)
}

// 次へ進むボタンの有効/無効判定
const isSubmitDisabled = () => {
  return hasAttemptedSubmit.value && validationErrors.value.length > 0
}
</script>

<template>
  <div class="page-container">
    <div class="header-section">
      <div class="inner">
        <div class="name-card">
          <h2 class="user-greeting">{{ userName }} 様</h2>
        </div>
        <div class="instruction-card">
          <p class="instruction-text">
            <font-awesome-icon icon="fa-solid fa-check" />
            以下の質問にチェックを入れていただき、習熟度を5段階で回答してください。
          </p>
        </div>
      </div>
    </div>

    <div class="wrap">
      <template v-for="(category, categoryIndex) in categoryData" :key="category.id">
        <div v-if="category.isChecked" class="category-section">
          <div class="category-header">
            <font-awesome-icon :icon="category.icon" class="category-icon" />
            <h3 class="category-title">{{ category.genre }}</h3>
          </div>

          <QuestionCard
            v-for="(question, questionIndex) in category.questions"
            :key="question.id"
            :question="question"
            @update:question="handleQuestionUpdate(categoryIndex, questionIndex, $event)"
          />
        </div>
      </template>

      <!-- バリデーションエラー表示 -->
      <ValidationError :errors="validationErrors">
        <template #description>
          <p class="error-description">チェックを入れた項目には、習熟度の選択が必須です。</p>
        </template>
      </ValidationError>

      <div class="submit-section">
        <p v-if="isSubmitDisabled()" class="submit-hint">
          <font-awesome-icon icon="fa-solid fa-triangle-exclamation" shake />
          すべてのチェック項目に習熟度を選択してください
        </p>
        <button
          @mouseenter="isHover = true"
          @mouseleave="isHover = false"
          @click="toNext"
          class="submit-button"
          :class="{ disabled: isSubmitDisabled() }"
          :disabled="isSubmitDisabled()"
        >
          次へ進む &ensp;
          <font-awesome-icon icon="fa-solid fa-arrow-right" :bounce="isHover" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #d3c6a6 0%, #e8dcc8 100%);
  padding: 3.6rem 1rem 2rem;
}

.header-section {
  max-width: 1000px;
  margin: 0 auto 2.25rem;
}

.inner {
  max-width: 1000px;
  padding: 1.2rem 1rem;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(72, 60, 50, 0.15);
  border: 1px solid rgba(72, 60, 50, 0.1);
}

.user-greeting {
  font-size: 1.8rem;
  color: #483c32;
  font-weight: 700;
}

.instruction-text {
  margin: 0;
  font-size: 1.05rem;
  color: #444;
  text-align: center;
  line-height: 1.6;
}

.wrap {
  max-width: 1000px;
  margin: 0 auto;
}

.category-section {
  margin-bottom: 2rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(72, 60, 50, 0.1);
  padding: 2.5rem 0;
}

.category-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
}

.category-icon {
  font-size: 2rem;
  color: #483c32;
}

.category-title {
  font-size: 1.5rem;
  margin: 0;
  color: #483c32;
  font-weight: 700;
}

.submit-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem;
}

.submit-button {
  font-size: 1.1rem;
  padding: 0.75rem 1.5rem;
  background: #483c32;
  color: #ffffff;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 6px 16px rgba(72, 60, 50, 0.3);
  transition: all 0.3s;
}

.submit-button:hover:not(.disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(72, 60, 50, 0.4);
  background: #5a4a3e;
}

.submit-button.disabled {
  background: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.6;
}

.submit-hint {
  color: #c00e0b;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem 0;
  }

  .user-greeting {
    font-size: 1.4rem;
  }
}
</style>

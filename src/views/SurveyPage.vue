<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import QuestionCard from '@/components/QuestionCard.vue'
import ValidationError from '@/components/ValidationError.vue'
import { commonQuestionData, engineerQuestionData, designerQuestionData } from '@/data/questionData'
import { ROUTES, STORAGE_KEYS, CATEGORIES } from '@/utils/constants'
import {
  getUserName,
  getStorageValue,
  setStorageValue,
  createReactiveQuestions,
  serializeQuestions,
  validateQuestions,
  scrollToElement,
} from '@/utils/utils'

const router = useRouter()

// ユーザー情報の取得
const userName = getUserName()

// カテゴリ設定
const categories = ref([
  {
    id: CATEGORIES.COMMON.id,
    genre: CATEGORIES.COMMON.genre,
    isChecked: true,
    icon: CATEGORIES.COMMON.icon,
  },
  {
    id: CATEGORIES.ENGINEER.id,
    genre: CATEGORIES.ENGINEER.genre,
    isChecked: getStorageValue(STORAGE_KEYS.CATEGORY_ENGINEER, false),
    icon: CATEGORIES.ENGINEER.icon,
  },
  {
    id: CATEGORIES.DESIGNER.id,
    genre: CATEGORIES.DESIGNER.genre,
    isChecked: getStorageValue(STORAGE_KEYS.CATEGORY_DESIGNER, false),
    icon: CATEGORIES.DESIGNER.icon,
  },
])

// 質問データの初期化
const commonQuestions = ref(createReactiveQuestions(commonQuestionData))
const engineerQuestions = ref(createReactiveQuestions(engineerQuestionData))
const designerQuestions = ref(createReactiveQuestions(designerQuestionData))

// カテゴリごとの質問マッピング
const questionsByCategory = computed(() => ({
  [CATEGORIES.COMMON.id]: commonQuestions.value,
  [CATEGORIES.ENGINEER.id]: engineerQuestions.value,
  [CATEGORIES.DESIGNER.id]: designerQuestions.value,
}))

// バリデーション
const validationErrors = ref([])
const hasAttemptedSubmit = ref(false)

// バリデーション実行
const performValidation = () => {
  const allQuestions = [
    {
      name: CATEGORIES.COMMON.genre,
      questions: commonQuestions.value,
      categoryId: CATEGORIES.COMMON.id,
    },
    {
      name: CATEGORIES.ENGINEER.genre,
      questions: engineerQuestions.value,
      categoryId: CATEGORIES.ENGINEER.id,
    },
    {
      name: CATEGORIES.DESIGNER.genre,
      questions: designerQuestions.value,
      categoryId: CATEGORIES.DESIGNER.id,
    },
  ]

  return validateQuestions(allQuestions, categories.value)
}

// 回答が変更されたらバリデーションを実行（送信ボタンを押した後のみ）
watch(
  [commonQuestions, engineerQuestions, designerQuestions],
  () => {
    if (hasAttemptedSubmit.value) {
      validationErrors.value = performValidation()
    }
  },
  { deep: true },
)

// 質問の更新ハンドラ
const handleQuestionUpdate = (categoryId, questionId, updatedQuestion) => {
  const questionsRef = questionsByCategory.value[categoryId]
  const index = questionsRef.findIndex((q) => q.id === questionId)
  if (index !== -1) {
    questionsRef[index] = updatedQuestion
  }
}

// 次へ進む処理
const toNext = async () => {
  hasAttemptedSubmit.value = true

  // バリデーション実行
  validationErrors.value = performValidation()

  if (validationErrors.value.length > 0) {
    // DOM更新を待ってからスクロール
    await nextTick()
    scrollToElement('error-message')
    return
  }

  // データ保存
  const surveyData = {
    userName,
    categories: categories.value,
    commonQuestions: serializeQuestions(commonQuestions.value),
    engineerQuestions: serializeQuestions(engineerQuestions.value),
    designerQuestions: serializeQuestions(designerQuestions.value),
  }

  setStorageValue(STORAGE_KEYS.SURVEY_DATA, surveyData)
  router.push(ROUTES.RESULT)
}

// 次へ進むボタンの有効/無効判定
const canSubmit = computed(() => {
  if (!hasAttemptedSubmit.value) return true
  return validationErrors.value.length === 0
})
</script>

<template>
  <div class="page-container">
    <!-- ヘッダーセクション -->
    <div class="header-section">
      <div class="inner">
        <div class="name-card">
          <h2 class="user-greeting">{{ userName }} 様</h2>
        </div>
        <div class="instruction-card">
          <p class="instruction-text">
            📋 以下の質問にチェックを入れていただき、習熟度を5段階で回答してください。
          </p>
        </div>
      </div>
    </div>

    <div class="wrap">
      <!-- カテゴリごとの質問 -->
      <template v-for="category in categories" :key="category.id">
        <div v-if="category.isChecked" class="category-section">
          <div class="category-header">
            <span class="category-icon">{{ category.icon }}</span>
            <h3 class="category-title">{{ category.genre }}</h3>
          </div>

          <QuestionCard
            v-for="question in questionsByCategory[category.id]"
            :key="question.id"
            :question="question"
            @update:question="handleQuestionUpdate(category.id, question.id, $event)"
          />
        </div>
      </template>

      <!-- バリデーションエラー表示 -->
      <ValidationError :errors="validationErrors" />

      <div class="submit-section">
        <button
          @click="toNext"
          class="submit-button"
          :class="{ disabled: !canSubmit }"
          :disabled="!canSubmit"
        >
          次へ進む →
        </button>
        <p v-if="!canSubmit" class="submit-hint">
          ⚠️ すべてのチェック項目に習熟度を選択してください
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #d3c6a6 0%, #e8dcc8 100%);
  padding: 2rem;
}

.header-section {
  max-width: 1000px;
  margin: 0 auto 1rem;
  padding: 1rem;
}

.inner {
  max-width: 1000px;
  padding: 1.5rem 1rem;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(72, 60, 50, 0.15);
  border: 1px solid rgba(72, 60, 50, 0.1);
}

.user-greeting {
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
  color: #483c32;
  font-weight: 700;
}

.instruction-text {
  margin: 0;
  font-size: 1.05rem;
  color: #555;
  text-align: center;
  line-height: 1.6;
}

.wrap {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.category-section {
  margin-bottom: 3rem;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(72, 60, 50, 0.1);
}

.category-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
}

.category-icon {
  font-size: 2rem;
}

.category-title {
  font-size: 1.5rem;
  margin: 0;
  color: #333;
  font-weight: 700;
}

.submit-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 3rem;
  padding: 2rem 0;
  gap: 1rem;
}

.submit-button {
  font-size: 1.1rem;
  padding: 1rem 3rem;
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
  color: #f59e0b;
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

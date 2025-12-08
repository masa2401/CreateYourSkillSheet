<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
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

// バリデーション・データ保存
const validationErrors = ref([])
const hasAttemptedSubmit = ref(false)

// リアルタイムバリデーション
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
            📋 以下の質問にチェックを入れていただき、習熟度を5段階で御回答ください。
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

          <div
            v-for="question in questionsByCategory[category.id]"
            :key="question.id"
            class="question-card"
          >
            <h4 class="question-text">{{ question.question }}</h4>

            <div class="answers-grid">
              <div v-for="(answer, index) in question.answers" :key="index" class="answer-item">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="answer.isChecked" class="custom-checkbox" />
                  <span class="checkbox-text">{{ answer.text }}</span>
                </label>

                <transition name="slide-fade">
                  <div v-if="answer.isChecked" class="level-selector">
                    <div class="level-buttons">
                      <label
                        v-for="level in 5"
                        :key="level"
                        class="level-button"
                        :class="{ active: answer.value === level }"
                      >
                        <input
                          type="radio"
                          v-model="answer.value"
                          :value="level"
                          class="level-radio"
                        />
                        <span class="level-number">{{ level }}</span>
                        <span class="level-stars">{{ '★'.repeat(level) }}</span>
                      </label>
                    </div>
                    <span v-if="!answer.value" class="warning-text">
                      ⚡ 習熟度を選択してください
                    </span>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- バリデーションエラー表示 -->
      <transition name="fade">
        <div v-if="validationErrors.length > 0" class="error-message" id="error-message">
          <div class="error-icon">⚠️</div>
          <div class="error-content">
            <h4>入力エラー</h4>
            <p>チェックを入れた項目には、習熟度の選択が必須です。</p>
            <ul>
              <li v-for="(error, index) in validationErrors" :key="index">
                <strong>{{ error.category }}</strong> - {{ error.answer }}
              </li>
            </ul>
          </div>
        </div>
      </transition>

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: white;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.user-greeting {
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
  color: #333;
  font-weight: 700;
}

.instruction-text {
  margin: 0;
  font-size: 1.05rem;
  color: #555;
  text-align: center;
  line-height: 1.6;
}

.error-message {
  background: linear-gradient(135deg, #fee 0%, #fdd 100%);
  border: 2px solid #f88;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(255, 0, 0, 0.2);
}

.error-icon {
  font-size: 2rem;
}

.error-content h4 {
  color: #c00;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.error-content p {
  color: #c00;
  margin: 0 0 1rem 0;
}

.error-content ul {
  margin: 0;
  padding-left: 1.5rem;
  list-style: disc;
}

.error-content li {
  color: #c00;
  margin-bottom: 0.5rem;
}

.wrap {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.category-section {
  margin-bottom: 3rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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

.question-card {
  background: white;
  border-radius: 15px;
  padding: 2rem 3.6rem;
  margin-bottom: 1.5rem;
  transition: transform 0.2s;
}

.question-text {
  font-size: 1.1rem;
  margin: 0 0 1.5rem 0;
  color: #333;
  font-weight: 600;
  line-height: 1.6;
}

.answers-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.answer-item {
  border-left: 4px solid #667eea;
  padding-left: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 1rem;
  color: #444;
  padding: 0.5rem 0;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-text {
  flex: 1;
  line-height: 1.5;
}

.level-selector {
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
}

.level-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.level-button {
  flex: 1;
  min-width: 80px;
  padding: 0.75rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.level-button:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.2);
}

.level-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  transform: scale(1.05);
}

.level-radio {
  display: none;
}

.level-number {
  font-size: 1.2rem;
  font-weight: 700;
}

.level-stars {
  font-size: 0.75rem;
  opacity: 0.8;
}

.warning-text {
  color: #f59e0b;
  font-size: 0.85rem;
  font-weight: 600;
  display: block;
  margin-top: 0.5rem;
  animation: pulse 2s infinite;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s;
}

.submit-button:hover:not(.disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(102, 126, 234, 0.5);
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

/* アニメーション */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
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

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem 0;
  }

  .user-greeting {
    font-size: 1.4rem;
  }

  .question-card {
    padding: 2rem;
  }

  .level-buttons {
    gap: 0.25rem;
  }

  .level-button {
    min-width: 60px;
    padding: 0.5rem;
  }

  .level-number {
    font-size: 1rem;
  }

  .level-stars {
    font-size: 0.65rem;
  }
}
</style>

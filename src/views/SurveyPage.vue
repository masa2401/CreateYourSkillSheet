<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { commonQuestionData, engineerQuestionData, designerQuestionData } from '@/data/questionData'

const router = useRouter()

// ユーザー情報の取得
const userName = localStorage.name?.toString() || ''

// カテゴリ設定
const toBoolean = (value) => value === 'true'

const categories = ref([
  { id: 1, genre: '共通の質問', isChecked: true, icon: '💼' },
  {
    id: 2,
    genre: 'プログラマ/エンジニア向けの質問',
    isChecked: toBoolean(localStorage.engineer),
    icon: '💻',
  },
  {
    id: 3,
    genre: 'デザイナー(動画制作)向けの質問',
    isChecked: toBoolean(localStorage.designer),
    icon: '🎨',
  },
])

// 質問データの初期化
function createReactiveQuestions(data) {
  return data.map((q) => ({
    id: q.id,
    question: q.question,
    answers: q.answers.map((text) => ({
      text,
      isChecked: false,
      value: null,
    })),
  }))
}

const commonQuestions = ref(createReactiveQuestions(commonQuestionData))
const engineerQuestions = ref(createReactiveQuestions(engineerQuestionData))
const designerQuestions = ref(createReactiveQuestions(designerQuestionData))

// カテゴリごとの質問マッピング
const questionsByCategory = computed(() => ({
  1: commonQuestions.value,
  2: engineerQuestions.value,
  3: designerQuestions.value,
}))

// バリデーション
const validationErrors = ref([])

function validateQuestions() {
  const errors = []
  const allQuestions = [
    { name: '共通の質問', questions: commonQuestions.value, categoryId: 1 },
    { name: 'プログラマ/エンジニア向けの質問', questions: engineerQuestions.value, categoryId: 2 },
    { name: 'デザイナー(動画制作)向けの質問', questions: designerQuestions.value, categoryId: 3 },
  ]

  allQuestions.forEach(({ name, questions, categoryId }) => {
    const category = categories.value.find((c) => c.id === categoryId)
    if (!category?.isChecked) return

    questions.forEach((question) => {
      question.answers.forEach((answer) => {
        if (answer.isChecked && !answer.value) {
          errors.push({
            category: name,
            question: question.question,
            answer: answer.text,
          })
        }
      })
    })
  })

  return errors
}

// データ変換・保存処理
function serializeQuestions(questions) {
  return questions.map((q) => ({
    id: q.id,
    question: q.question,
    answers: q.answers.map((a) => ({
      text: a.text,
      isChecked: a.isChecked,
      value: a.value,
    })),
  }))
}

const toNext = () => {
  validationErrors.value = validateQuestions()

  if (validationErrors.value.length > 0) {
    const element = document.getElementById('error-message')
    window.scrollTo({ top: element.offsetTop, behavior: 'smooth' })
    return
  }

  const surveyData = {
    userName,
    categories: categories.value,
    commonQuestions: serializeQuestions(commonQuestions.value),
    engineerQuestions: serializeQuestions(engineerQuestions.value),
    designerQuestions: serializeQuestions(designerQuestions.value),
  }

  localStorage.setItem('surveyData', JSON.stringify(surveyData))
  router.push('/result')
}
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
        <div v-show="category.isChecked" class="category-section">
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
        <button @click="toNext" class="submit-button">次へ進む →</button>
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
  justify-content: center;
  margin-top: 3rem;
  padding: 2rem 0;
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

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(102, 126, 234, 0.5);
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

  .question-block {
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

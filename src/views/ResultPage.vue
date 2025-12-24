<script setup>
import ShareButton from '@/components/ShareButton.vue'
import AnimatedIconButton from '@/components/AnimatedIconButton.vue'
import { STORAGE_KEYS, ROUTES, LEVEL_LABELS } from '@/utils/constants'
import { getDataFromUrl } from '@/utils/shareUtils'
import { getStorageValue } from '@/utils/utils'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const surveyData = ref(null)
const isSharedView = ref(false)

// データ取得
onMounted(() => {
  const urlData = getDataFromUrl()
  if (urlData) {
    surveyData.value = urlData
    isSharedView.value = true
    return
  }

  const localData = getStorageValue(STORAGE_KEYS.SURVEY_DATA, '')
  if (localData) {
    surveyData.value = localData
    isSharedView.value = false
    return
  }

  router.push(ROUTES.SURVEY)
})

const getQuestionsByCategory = (categoryId) => {
  if (!surveyData.value) return []
  const category = surveyData.value.categories.find((c) => c.id === categoryId)
  return category.questions || []
}

const getCheckedAnswers = (answers) => {
  return answers.filter((answer) => answer.isChecked)
}

const getCategoryIcon = (categoryId) => {
  const icons = {
    1: '💼',
    2: '💻',
    3: '🎨',
  }
  return icons[categoryId] || '📋'
}

const goToTop = () => {
  router.push(ROUTES.TOP)
}

const goBack = () => {
  router.push(ROUTES.SURVEY)
}

const createMyOwn = () => {
  router.push(ROUTES.TOP)
}

const handlePrint = () => {
  window.print()
}
</script>

<template>
  <div class="page-container" v-if="surveyData">
    <div class="header-section">
      <div class="result-header">
        <div class="header-icon">📊</div>
        <h2 class="page-title">{{ surveyData.userName }} 様のスキルシート</h2>
      </div>
    </div>

    <div class="content-wrapper">
      <div
        v-for="category in surveyData.categories"
        :key="category.id"
        v-show="category.isChecked"
        class="category-section"
      >
        <div class="category-header">
          <span class="category-icon">{{ getCategoryIcon(category.id) }}</span>
          <h3 class="category-title">{{ category.genre }}</h3>
        </div>

        <div
          v-for="question in getQuestionsByCategory(category.id)"
          :key="question.id"
          v-show="getCheckedAnswers(question.answers).length > 0"
          class="question-block"
        >
          <template v-if="getCheckedAnswers(question.answers).length > 0">
            <h4 class="question-title">{{ question.question }}</h4>

            <div class="skills-grid">
              <div
                v-for="(answer, index) in getCheckedAnswers(question.answers)"
                :key="index"
                class="skill-card"
              >
                <div class="skill-info">
                  <div class="skill-name">{{ answer.text }}</div>
                  <div class="skill-level">
                    <span class="level-stars">{{ LEVEL_LABELS[answer.value] }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="button-group no-print">
        <template v-if="!isSharedView">
          <AnimatedIconButton
            icon="fa-solid fa-arrow-left"
            text="修正する"
            animation="beat"
            button-class="action-button secondary-button"
            @click="goBack"
          />

          <AnimatedIconButton
            icon="fa-solid fa-print"
            text="印刷する"
            animation="bounce"
            button-class="action-button print-button"
            @click="handlePrint"
          />

          <ShareButton :surveyData="surveyData" />

          <AnimatedIconButton
            icon="fa-regular fa-house"
            text="トップへ戻る"
            animation="beat"
            button-class="action-button primary-button"
            @click="goToTop"
          />
        </template>

        <template v-else>
          <button @click="createMyOwn" class="action-button primary-button">
            <span class="button-icon">✨</span>
            <span class="button-text">自分のスキルシートを作成</span>
          </button>
        </template>
      </div>
    </div>
  </div>

  <div v-else class="loading-container">
    <div class="loading-spinner"></div>
    <p class="loading-text">データを読み込んでいます...</p>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #d3c6a6 0%, #e8dcc8 100%);
  padding-bottom: 4rem;
}

.header-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.result-header {
  display: flex;
  justify-content: center;
  align-items: baseline;
}

.header-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 2.5rem;
  color: #483c32;
  margin: 0;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(211, 198, 166, 0.3);
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.category-section {
  margin-bottom: 3rem;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(72, 60, 50, 0.1);
}

.category-header {
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-icon {
  font-size: 2.5rem;
}

.category-title {
  font-size: 1.5rem;
  color: #483c32;
  margin: 0;
  font-weight: 700;
}

.question-block {
  padding: 0 3.6rem 1.8rem;
}

.question-title {
  font-size: 1.1rem;
  color: #483c32;
  margin: 0 0 1.5rem;
  font-weight: 600;
  line-height: 1.6;
}

.skills-grid {
  display: grid;
  gap: 1.5rem;
}

.skill-card {
  background: #ffffff;
  padding: 0.8rem 1rem;
  border-left: 4px solid #d3c6a6;
  transition: all 0.3s;
}

.skill-info {
  display: grid;
  grid-template-columns: 9fr 1fr;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.skill-name {
  flex: 1;
  color: #483c32;
  font-size: 1rem;
  font-weight: 500;
}

.skill-level {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.level-stars {
  color: #fbbf24;
  font-size: 1.2rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.action-button {
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.button-icon {
  font-size: 1.1rem;
  display: inline-block;
}

.button-text {
  display: inline-block;
}

.primary-button {
  background: #483c32;
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(72, 60, 50, 0.3);
}

.primary-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(72, 60, 50, 0.4);
  background: #5a4a3e;
  border-color: #5a4a3e;
}

.secondary-button,
.print-button {
  background: #ffffff;
  color: #483c32;
  border-color: #483c32;
  box-shadow: 0 2px 8px rgba(72, 60, 50, 0.1);
}

.secondary-button:hover,
.print-button:hover {
  background: #483c32;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 60, 50, 0.25);
}

.loading-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #d3c6a6 0%, #e8dcc8 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(72, 60, 50, 0.3);
  border-top-color: #483c32;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #483c32;
  font-size: 1.2rem;
  font-weight: 600;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .question-block {
    padding: 2rem;
  }

  .skill-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .skill-level {
    width: 100%;
    justify-content: space-between;
  }

  .button-group {
    flex-direction: column;
    width: 100%;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }
}

/* 印刷用スタイル */
@media print {
  @page {
    size: A4;
    margin: 15mm 10mm;
  }

  .no-print,
  .button-group {
    display: none !important;
  }

  .page-container {
    background: #ffffff !important;
    padding: 0;
    min-height: auto;
  }

  .header-section {
    padding: 0 0 1rem 0;
  }

  .header-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .page-title {
    font-size: 1.8rem;
    text-shadow: none;
    break-after: avoid;
  }

  .content-wrapper {
    padding: 0;
    max-width: 100%;
  }

  .category-section {
    margin-bottom: 1.5rem;
    box-shadow: none;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }

  .category-header {
    padding: 1rem;
    margin-bottom: 0.5rem;
  }

  .category-icon {
    font-size: 1.8rem;
  }

  .category-title {
    font-size: 1.3rem;
  }

  .question-block {
    padding: 0 1.5rem 1rem;
  }

  .question-title {
    font-size: 1rem;
    margin: 0 0 0.8rem;
    break-after: avoid;
  }

  .skills-grid {
    gap: 0.5rem;
  }

  .skill-card {
    padding: 0.8rem;
    border-radius: 6px;
    box-shadow: none;
    border: 1px solid #e5e7eb;
    break-inside: avoid;
  }

  .skill-info {
    gap: 0.8rem;
  }

  .skill-name {
    font-size: 0.9rem;
  }

  .level-stars {
    font-size: 0.9rem;
  }

  .skill-card {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  h2,
  h3,
  h4 {
    break-after: avoid;
  }

  a[href]:after {
    content: none !important;
  }
}
</style>

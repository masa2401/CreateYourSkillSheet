<script setup>
import ShareButton from '@/components/ShareButton.vue'
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
  // 1. URLパラメータからデータを取得
  const urlData = getDataFromUrl()
  if (urlData) {
    // URLから取得した場合（共有リンク経由）
    surveyData.value = urlData
    isSharedView.value = true
    return
  }

  // 2. LocalStorageから取得
  const localData = getStorageValue(STORAGE_KEYS.SURVEY_DATA, '')
  if (localData) {
    surveyData.value = localData
    isSharedView.value = false
    return
  }

  // 3. どちらもない場合はアンケートページへ
  router.push(ROUTES.SURVEY)
})

// カテゴリごとの質問データを取得
const getQuestionsByCategory = (categoryId) => {
  if (!surveyData.value) return []

  switch (categoryId) {
    case 1:
      return surveyData.value.commonQuestions || []
    case 2:
      return surveyData.value.engineerQuestions || []
    case 3:
      return surveyData.value.designerQuestions || []
    default:
      return []
  }
}

// チェックされた回答のみをフィルタリング
const getCheckedAnswers = (answers) => {
  return answers.filter((answer) => answer.isChecked)
}

// カテゴリアイコン
const getCategoryIcon = (categoryId) => {
  const icons = {
    1: '💼',
    2: '💻',
    3: '🎨',
  }
  return icons[categoryId] || '📋'
}

// ナビゲーション
const goToTop = () => {
  router.push(ROUTES.TOP)
}

const goBack = () => {
  router.push(ROUTES.SURVEY)
}

const createMyOwn = () => {
  router.push(ROUTES.TOP)
}
</script>

<template>
  <div class="page-container" v-if="surveyData">
    <!-- ヘッダーセクション -->
    <div class="header-section">
      <div class="result-header">
        <div class="header-icon">📊</div>
        <h2 class="page-title">{{ surveyData.userName }} 様のスキルシート</h2>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- カテゴリごとに結果を表示 -->
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

        <!-- 質問ごとに表示 -->
        <div
          v-for="question in getQuestionsByCategory(category.id)"
          :key="question.id"
          v-show="getCheckedAnswers(question.answers).length > 0"
          class="question-block"
        >
          <!-- チェックされた回答がある場合のみ質問を表示 -->
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

      <!-- ボタングループ -->
      <div class="button-group">
        <!-- 自分のデータの場合 -->
        <template v-if="!isSharedView">
          <button @click="goBack" class="secondary-button">← 修正する</button>
          <ShareButton :surveyData="surveyData" />
          <button @click="goToTop" class="primary-button">トップへ戻る</button>
        </template>

        <!-- 共有リンク経由の場合 -->
        <template v-else>
          <button @click="createMyOwn" class="primary-button">✨ 自分のスキルシートを作成</button>
        </template>
      </div>
    </div>
  </div>

  <!-- ローディング画面 -->
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
  margin-bottom: 2rem;
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
  gap: 1rem;
}

.skill-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.25rem;
  border-left: 4px solid #d3c6a6;
  transition: all 0.3s;
}

.skill-info {
  display: flex;
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
  font-size: 1rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.primary-button,
.secondary-button {
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
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
}

.secondary-button {
  background: #ffffff;
  color: #483c32;
  border: 2px solid #483c32;
}

.secondary-button:hover {
  background: #483c32;
  color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(72, 60, 50, 0.3);
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

  .primary-button,
  .secondary-button {
    width: 100%;
  }
}
</style>

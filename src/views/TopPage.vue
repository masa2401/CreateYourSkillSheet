<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { STORAGE_KEYS, ROUTES } from '@/utils/constants'
import { setStorageValue } from '@/utils/utils'
const router = useRouter()

// フォームデータ
const userName = ref('')
const selectedCategories = ref({
  engineer: false,
  designer: false,
})

// バリデーション
const showError = ref(false)
const validateAndProceed = () => {
  // 名前が空の場合はエラー表示
  if (!userName.value.trim()) {
    showError.value = true
    return
  }

  // データを保存
  setStorageValue(STORAGE_KEYS.USER_NAME, userName.value.trim())
  setStorageValue(STORAGE_KEYS.CATEGORY_ENGINEER, selectedCategories.value.engineer)
  setStorageValue(STORAGE_KEYS.CATEGORY_DESIGNER, selectedCategories.value.designer)

  // アンケートページへ遷移
  router.push(ROUTES.SURVEY)
}
</script>

<template>
  <div class="page-container">
    <div class="hero-section">
      <div class="hero-content">
        <h2 class="hero-title">
          <span class="emoji">📊</span>
          スキルアンケート
        </h2>
      </div>
    </div>
    <div class="main-content">
      <div class="welcome-card">
        <p class="card-description">
          これからいくつかの質問を行います。<br />
          質問に回答後、あなたのスキルシートが出力されます。
        </p>
      </div>
      <div class="input-group">
        <!-- 名前入力セクション -->
        <div class="input-section">
          <label class="input-label">
            <span class="label-icon">✏️</span>
            お名前を入力してください
          </label>
          <input
            type="text"
            class="name-input"
            v-model="userName"
            placeholder="山田 太郎"
            @input="showError = false"
          />
          <transition name="fade">
            <p v-if="showError" class="error-text">⚠️ お名前を入力してください</p>
          </transition>
        </div>
        <!-- カテゴリ選択セクション -->
        <div class="category-section">
          <h3 class="section-title">
            <span class="title-icon">🎯</span>
            該当するカテゴリを選択してください（複数選択可）
          </h3>
          <div class="category-cards">
            <label class="category-card" :class="{ active: selectedCategories.engineer }">
              <input
                type="checkbox"
                class="category-checkbox"
                v-model="selectedCategories.engineer"
              />
              <div class="card-content">
                <div class="card-icon-large">💻</div>
                <h4 class="card-category-title">プログラマ / ITエンジニア</h4>
                <p class="card-category-desc">
                  開発言語、フレームワーク、<br />インフラ関連のスキル
                </p>
                <div class="check-indicator">
                  <span v-if="selectedCategories.engineer" class="check-mark">✓</span>
                </div>
              </div>
            </label>
            <label class="category-card" :class="{ active: selectedCategories.designer }">
              <input
                type="checkbox"
                class="category-checkbox"
                v-model="selectedCategories.designer"
              />
              <div class="card-content">
                <div class="card-icon-large">🎨</div>
                <h4 class="card-category-title">デザイナー / 動画制作</h4>
                <p class="card-category-desc">デザインツール、動画編集、<br />制作スキル</p>
                <div class="check-indicator">
                  <span v-if="selectedCategories.designer" class="check-mark">✓</span>
                </div>
              </div>
            </label>
          </div>
          <p class="hint-text">💡 どちらも選択しない場合は、共通の質問のみ表示されます</p>
        </div>
      </div>
      <!-- ボタン -->
      <div class="button-section">
        <button @click="validateAndProceed" class="start-button">アンケートを開始 →</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-section {
  padding: 4rem 1rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  color: white;
  margin: 0 0 1rem;
  font-weight: 800;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.emoji {
  font-size: 3.5rem;
  display: inline-block;
}

.main-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
}

.welcome-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.8;
  margin: 0;
}

.input-group {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.input-section {
  text-align: center;
  margin-bottom: 2rem;
}

.input-label {
  display: block;
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
}

.label-icon {
  font-size: 1.3rem;
  margin-right: 0.5rem;
}

.name-input {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.name-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.error-text {
  color: #ef4444;
  font-size: 0.95rem;
  margin: 0.75rem 0 0;
  font-weight: 600;
}

.section-title {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 1.5rem;
  font-weight: 700;
  text-align: center;
}

.title-icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.category-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.category-card {
  position: relative;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 3px solid #e0e0e0;
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s;
  display: block;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  border-color: #667eea;
}

.category-card.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  transform: scale(1.02);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.category-card.active .card-category-title,
.category-card.active .card-category-desc {
  color: white;
}

.category-checkbox {
  display: none;
}

.card-content {
  text-align: center;
}

.card-icon-large {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.card-category-title {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 0.75rem;
  font-weight: 700;
}

.card-category-desc {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.check-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.check-mark {
  font-size: 1.5rem;
  color: #22c55e;
  font-weight: bold;
  animation: checkPop 0.3s ease;
}

@keyframes checkPop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.hint-text {
  text-align: center;
  color: #666;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.6;
}

.button-section {
  display: flex;
  justify-content: center;
}

.start-button {
  font-size: 1.2rem;
  padding: 1.25rem 3.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  transition: all 0.3s;
}

.start-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(102, 126, 234, 0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .emoji {
    font-size: 2.5rem;
  }

  .category-cards {
    grid-template-columns: 1fr;
  }

  .welcome-card,
  .input-group {
    padding: 1.5rem;
  }
}
</style>

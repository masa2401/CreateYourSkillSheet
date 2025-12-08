<script setup>
import { ref } from 'vue'
import {
  generateShareUrl,
  copyToClipboard,
  getTwitterShareUrl,
  getLineShareUrl,
} from '@/utils/shareUtils'

const props = defineProps({
  surveyData: {
    type: Object,
    required: true,
  },
})

const showMenu = ref(false)
const copySuccess = ref(false)

// 共有URLを生成
const shareUrl = ref('')
try {
  shareUrl.value = generateShareUrl(props.surveyData)
} catch (error) {
  console.error('URL生成エラー:', error)
}

// クリップボードにコピー
const handleCopy = async () => {
  const success = await copyToClipboard(shareUrl.value)
  if (success) {
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
      showMenu.value = false
    }, 2000)
  }
}

// SNS共有
const shareOnTwitter = () => {
  const url = getTwitterShareUrl(shareUrl.value, 'スキルシートを共有します')
  window.open(url, '_blank')
  showMenu.value = false
}

const shareOnLine = () => {
  const url = getLineShareUrl(shareUrl.value, 'スキルシートを共有します')
  window.open(url, '_blank')
  showMenu.value = false
}

// メニューの表示切替
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}
</script>

<template>
  <div class="share-button-container">
    <button @click="toggleMenu" class="share-button">🔗 結果を共有</button>

    <transition name="slide-fade">
      <div v-if="showMenu" class="share-menu">
        <button @click="handleCopy" class="menu-item" :class="{ success: copySuccess }">
          <span class="menu-icon">{{ copySuccess ? '✓' : '📋' }}</span>
          <span class="menu-text">{{ copySuccess ? 'コピーしました！' : 'URLをコピー' }}</span>
        </button>

        <button @click="shareOnTwitter" class="menu-item">
          <span class="menu-icon">🐦</span>
          <span class="menu-text">Twitterで共有</span>
        </button>

        <button @click="shareOnLine" class="menu-item">
          <span class="menu-icon">💬</span>
          <span class="menu-text">LINEで共有</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.share-button-container {
  position: relative;
}

.share-button {
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.share-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(16, 185, 129, 0.5);
}

.share-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  min-width: 200px;
  z-index: 100;
}

.menu-item {
  width: 100%;
  padding: 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 10px;
  transition: all 0.2s;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.menu-item:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.menu-item.success {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #059669;
}

.menu-icon {
  font-size: 1.25rem;
}

.menu-text {
  flex: 1;
  text-align: left;
}

/* アニメーション */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  transform: translateX(-50%) translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-50%) translateY(-10px);
  opacity: 0;
}

@media (max-width: 768px) {
  .share-menu {
    left: 0;
    right: 0;
    transform: none;
    margin: 0 1rem;
  }
}
</style>

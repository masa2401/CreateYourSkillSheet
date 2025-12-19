<script setup>
import { ref } from 'vue'
import { generateShareUrl, copyToClipboard } from '@/utils/shareUtils'

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
          <span class="menu-text">{{ copySuccess ? 'コピーしました!' : 'URLをコピー' }}</span>
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
  height: 100%;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  background: #ffffff;
  color: #483c32;
  border-color: #483c32;
  box-shadow: 0 2px 8px rgba(72, 60, 50, 0.1);
}

.share-button:hover {
  background: #483c32;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 60, 50, 0.25);
}

.share-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(72, 60, 50, 0.15);
  border: 1px solid rgba(72, 60, 50, 0.1);
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
  color: #483c32;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item.success {
  background: #d1fae5;
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
  .share-button {
    width: 100%;
  }
  .share-menu {
    left: 0;
    right: 0;
    transform: none;
    margin: 0 1rem;
  }
}
</style>

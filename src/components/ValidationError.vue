<script setup>
import { computed } from 'vue'

const props = defineProps({
  errors: {
    type: Array,
    default: () => [],
  },
})

// エラーをカテゴリごとにグループ化
const groupedErrors = computed(() => {
  const groups = {}

  props.errors.forEach((error) => {
    if (!groups[error.category]) {
      groups[error.category] = []
    }
    groups[error.category].push(error)
  })

  return Object.entries(groups).map(([category, items]) => ({
    category,
    count: items.length,
  }))
})
</script>

<template>
  <transition name="fade">
    <div v-if="errors.length > 0" class="error-message" id="error-message">
      <div class="error-content">
        <div class="error-title">
          <div class="error-icon">
            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />
          </div>
          <h4>入力エラー</h4>
        </div>
        <div class="error-text">
          <slot name="description"></slot>
          <ul class="error-list">
            <li v-for="(group, index) in groupedErrors" :key="index" class="error-item">
              <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="error-bullet" />
              <strong>{{ group.category }}</strong>
              <span class="error-count">（{{ group.count }}件の未選択項目）</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.error-message {
  background: #fff5f5;
  border: 2px solid #f88;
  border-radius: var(--radius, 12px);
  padding: var(--p-16, 2rem);
  margin-top: var(--p-16, 2rem);
  display: flex;
  gap: var(--p-4, 0.5rem);
  box-shadow: 0 2px 8px rgba(255, 0, 0, 0.15);
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.error-icon {
  color: #ef4444;
  font-size: 2rem;
  flex-shrink: 0;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: var(--p-4, 0.5rem);
  color: #c00;
}

.error-title {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--p-4, 0.5rem);
}

.error-title > h4 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.error-text {
  width: 100%;
  text-align: center;
}

.error-list {
  width: fit-content;
  margin: var(--p-4, 0.5rem) auto 0;
  padding: 0;
  list-style: none;
}

.error-item {
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 0 var(--p-4, 0.5rem);
  margin-bottom: var(--p-4, 0.5rem);
  line-height: 1.4;
}

.error-bullet {
  color: #ef4444;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.error-item strong {
  font-weight: 700;
}

.error-count {
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .error-message {
    padding: var(--p-12, 1.5rem);
  }

  .error-icon {
    font-size: 1.5rem;
  }

  .error-title > h4 {
    font-size: 1.2rem;
  }

  .error-item {
    font-size: 0.9rem;
  }
}
</style>

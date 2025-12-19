<script setup>
defineProps({
  errors: {
    type: Array,
    required: true,
    default: () => [],
  },
})
</script>

<template>
  <transition name="fade">
    <div v-if="errors.length > 0" class="error-message" id="error-message">
      <div class="error-icon">⚠️</div>
      <div class="error-content">
        <h4 class="error-title">入力エラー</h4>
        <p class="error-description">チェックを入れた項目には、習熟度の選択が必須です。</p>
        <ul class="error-list">
          <li v-for="(error, index) in errors" :key="index" class="error-item">
            <strong>{{ error.category }}</strong> - {{ error.answer }}
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.error-message {
  background: #fff5f5;
  border: 2px solid #f88;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
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
  font-size: 2rem;
  flex-shrink: 0;
}

.error-content {
  flex: 1;
}

.error-title {
  color: #c00;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 700;
}

.error-description {
  color: #c00;
  margin: 0 0 1rem 0;
  font-size: 1rem;
  line-height: 1.5;
}

.error-list {
  margin: 0;
  padding-left: 1.5rem;
  list-style: disc;
}

.error-item {
  color: #c00;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.error-item strong {
  font-weight: 700;
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
    padding: 1rem;
    gap: 0.75rem;
  }

  .error-icon {
    font-size: 1.5rem;
  }

  .error-title {
    font-size: 1.1rem;
  }

  .error-description {
    font-size: 0.95rem;
  }

  .error-item {
    font-size: 0.9rem;
  }
}
</style>

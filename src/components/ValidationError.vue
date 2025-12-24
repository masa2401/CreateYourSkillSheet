<script setup>
defineProps({
  errors: {
    type: Array,
    default: () => [],
  },
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
          <!-- スロットでカスタムメッセージを受け取る -->
          <slot name="description"></slot>

          <ul class="error-list">
            <li v-for="(error, index) in errors" :key="index" class="error-item">
              <strong>{{ error.category }}</strong> - {{ error.answer }}
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
  border-radius: 15px;
  padding: 2rem;
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
  color: #f59e0b;
  font-size: 2rem;
  flex-shrink: 0;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 1rem;
  color: #c00;
}

.error-title {
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-title > h4 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.error-description {
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  line-height: 1.5;
}

.error-list {
  margin: 0.2rem 0 0;
  padding-left: 1.5rem;
  list-style: disc;
}

.error-item {
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

  .error-title > h4 {
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

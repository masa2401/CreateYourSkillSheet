<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="notfound-container">
    <div class="notfound-content">
      <div class="error-icon">🔍</div>
      <h1 class="error-code">404</h1>
      <h2 class="error-title">ページが見つかりません</h2>
      <p class="error-message">
        お探しのページは存在しないか、<br />
        移動または削除された可能性があります。
      </p>
      <button @click="goHome" class="home-button">🏠 トップページへ戻る</button>
    </div>
  </div>
</template>

<style scoped>
.notfound-container {
  min-height: 80vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.notfound-content {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.error-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.error-code {
  font-size: 6rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-title {
  font-size: 1.8rem;
  color: #333;
  margin: 1rem 0;
  font-weight: 700;
}

.error-message {
  color: #666;
  font-size: 1rem;
  line-height: 1.8;
  margin: 1rem 0 2rem;
}

.home-button {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.home-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(102, 126, 234, 0.5);
}

@media (max-width: 768px) {
  .notfound-content {
    padding: 2rem;
  }

  .error-code {
    font-size: 4rem;
  }

  .error-title {
    font-size: 1.5rem;
  }
}
</style>

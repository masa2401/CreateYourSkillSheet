<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ROUTES } from '@/utils/constants'

const router = useRouter()
const route = useRoute()

const goHome = () => {
  if (route.path !== ROUTES.TOP) {
    router.push(ROUTES.TOP)
  }
}
</script>

<template>
  <header class="header">
    <h1 class="title" @click="goHome">
      <span class="icon">📊</span>
      スキルシート制作ページ
    </h1>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(135deg, #483c32 0%, #5a4a3e 100%);
  padding: 1.5rem 0;
  box-shadow: 0 2px 8px rgba(72, 60, 50, 0.2);
}

.title {
  width: 100%;
  margin: 0;
  text-align: center;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title:hover {
  transform: scale(1.02);
}

.icon {
  font-size: 1.8rem;
  margin-right: 0.5rem;
  display: inline-block;
  vertical-align: baseline;
}

@media (max-width: 768px) {
  .title {
    font-size: 1.2rem;
  }

  .icon {
    font-size: 1.5rem;
  }
}
</style>

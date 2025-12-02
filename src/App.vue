<script setup lang="js">
import TheFooter from '@/components/TheFooter.vue'
import TheHeader from '@/components/TheHeader.vue'
</script>

<template>
  <div class="wrap">
    <TheHeader />
    <main class="main"><router-view /></main>
    <TheFooter />
  </div>
</template>

<style></style>

<script setup lang="js"></script>

<template>
  <button class="btn" @click="toNext"><slot /></button>
</template>
<style scoped>
.btn {
  padding: 8px;
  font-size: 14px;
  color: #333;
  text-align: center;
  border-radius: 6px;
}
</style>

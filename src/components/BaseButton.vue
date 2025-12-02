<script setup lang="js">
const emit = defineEmits(['on-click'])
</script>

<template>
  <button class="btn" @click="emit('on-click')"><slot /></button>
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

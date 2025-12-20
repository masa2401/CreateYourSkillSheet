<script setup>
import { ref } from 'vue'

defineProps({
  icon: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  animation: {
    type: String,
    default: 'beat', // 'beat', 'bounce', 'fade', 'spin' など
    validator: (value) => ['beat', 'bounce', 'fade', 'spin', 'none'].includes(value),
  },
  buttonClass: {
    type: String,
    default: 'action-button',
  },
})

const emit = defineEmits(['click'])

const isHover = ref(false)

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <button
    @click="handleClick"
    :class="buttonClass"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <span class="button-icon">
      <font-awesome-icon
        :icon="icon"
        :beat="animation === 'beat' && isHover"
        :bounce="animation === 'bounce' && isHover"
        :fade="animation === 'fade' && isHover"
        :spin="animation === 'spin' && isHover"
      />
    </span>
    <span class="button-text">{{ text }}</span>
  </button>
</template>

<style scoped>
.button-icon {
  font-size: 1.1rem;
  display: inline-block;
}

.button-text {
  display: inline-block;
}
</style>

<script setup>
import { ref } from 'vue'

defineProps({
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  animationType: {
    type: String,
    default: 'beat',
    validator: (value) => ['beat', 'bounce', 'fade', 'spin', 'none'].includes(value),
  },
  buttonClass: {
    type: String,
    default: 'action-button',
  },
})

const emit = defineEmits(['click'])

const isHovering = ref(false)

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <button
    @click="handleClick"
    :class="buttonClass"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <span class="button-icon">
      <font-awesome-icon
        :icon="icon"
        :beat="animationType === 'beat' && isHovering"
        :bounce="animationType === 'bounce' && isHovering"
        :fade="animationType === 'fade' && isHovering"
        :spin="animationType === 'spin' && isHovering"
      />
    </span>
    <span class="button-text">{{ label }}</span>
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

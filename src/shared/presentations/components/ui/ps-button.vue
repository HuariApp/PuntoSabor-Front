<template>
  <button
      class="ps-button"
      :type="type"
      :disabled="disabled"
      @click="$emit('click', $event)"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script>
export default {
  name: 'PsButton',
  props: {
    label: { type: String, default: '' },
    type: { type: String, default: 'button' },
    disabled: { type: Boolean, default: false }
  }
};
</script>

<style scoped>
.ps-button {
  background-color: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s ease;
}
.ps-button:hover:not(:disabled) {
  opacity: 0.85;
}
.ps-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

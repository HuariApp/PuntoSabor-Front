<template>
  <button
      class="btn"
      :class="[`btn-${variant}`, `btn-${size}`, { 'btn-disabled': disabled, 'btn-loading': loading }]"
      :disabled="disabled || loading"
      :type="type"
      @click="$emit('click')"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <span v-if="icon" class="btn-icon">{{ icon }}</span>
    <slot>{{ label }}</slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    label: String,
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'danger', 'success', 'warning'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    type: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'submit', 'reset'].includes(value)
    },
    disabled: Boolean,
    loading: Boolean,
    icon: String
  },
  emits: ['click']
};
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

/* Tamaños */
.btn-sm {
  padding: 8px 16px;
  font-size: 12px;
}

.btn-md {
  padding: 12px 24px;
  font-size: 14px;
}

.btn-lg {
  padding: 14px 32px;
  font-size: 16px;
}

/* Variantes */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background: #e0e0e0;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c0392b;
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #229954;
}

.btn-warning {
  background: #f39c12;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: #d68910;
}

/* Estados */
.btn-disabled,
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-loading {
  pointer-events: none;
}

.btn-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-icon {
  font-size: 16px;
}
</style>

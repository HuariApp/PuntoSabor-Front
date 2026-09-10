<template>
  <div class="form-field">
    <label :for="id" class="label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <input
        v-if="type !== 'textarea'"
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :required="required"
        :pattern="pattern"
        class="input"
        :class="{ 'input-error': error, 'input-success': success }"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
    />

    <textarea
        v-else
        :id="id"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :required="required"
        :rows="rows"
        class="textarea"
        :class="{ 'input-error': error, 'input-success': success }"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
    ></textarea>

    <div v-if="hint" class="hint">{{ hint }}</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="showCharCount && maxlength" class="char-count">
      {{ modelValue.length }} / {{ maxlength }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormField',
  props: {
    id: {
      type: String,
      required: true
    },
    label: String,
    type: {
      type: String,
      default: 'text'
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    placeholder: String,
    disabled: Boolean,
    required: Boolean,
    error: String,
    success: Boolean,
    hint: String,
    maxlength: Number,
    pattern: String,
    rows: {
      type: Number,
      default: 4
    },
    showCharCount: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'blur', 'focus']
};
</script>

<style scoped>
.form-field {
  margin-bottom: 20px;
}

.label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.required {
  color: #e74c3c;
  margin-left: 4px;
}

.input,
.textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s;
  box-sizing: border-box;
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input:disabled,
.textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.input-error,
.textarea.input-error {
  border-color: #e74c3c;
}

.input-error:focus,
.textarea.input-error:focus {
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.input-success,
.textarea.input-success {
  border-color: #27ae60;
}

.input-success:focus,
.textarea.input-success:focus {
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
}

.hint {
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}

.error-message {
  margin-top: 6px;
  font-size: 12px;
  color: #e74c3c;
  font-weight: 500;
}

.char-count {
  margin-top: 6px;
  font-size: 12px;
  color: #999;
  text-align: right;
}
</style>

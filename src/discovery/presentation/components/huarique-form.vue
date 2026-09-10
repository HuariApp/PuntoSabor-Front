<script setup>
import { reactive, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  submitting: { type: Boolean, default: false },
  submitText: { type: String, default: 'Guardar' }
});
const emit = defineEmits(['update:modelValue','submit']);

const form = reactive({
  name: '',
  categoryId: '',
  address: '',
  phone: '',
  imgUrl: '',
  description: ''
});

const formError = ref('');

watch(
    () => props.modelValue,
    (v) => Object.assign(form, v || {}),
    { immediate: true }
);

watch(
    form,
    () => emit('update:modelValue', { ...form }),
    { deep: true }
);

function onSubmit(e) {
  e.preventDefault();

  if (!form.name || !form.categoryId || !form.address) {
    formError.value = 'Por favor completa todos los campos obligatorios.';
    return;
  }

  formError.value = '';
  emit('submit', { ...form });
}
</script>

<template>
  <form class="card" @submit="onSubmit" style="max-width:720px;margin:0 auto">
    <h2 class="section-title">{{ submitText }}</h2>

    <p v-if="formError" class="form-error" role="alert">
      {{ formError }}
    </p>

    <label>Nombre *</label>
    <input v-model.trim="form.name" required />

    <label>Categoría *</label>
    <input
        v-model.trim="form.categoryId"
        placeholder="ej. anticuchos, ceviche"
        required
    />

    <label>Dirección *</label>
    <input v-model.trim="form.address" required />

    <label>Teléfono</label>
    <input v-model.trim="form.phone" />

    <label>Imagen (URL)</label>
    <input v-model.trim="form.imgUrl" />

    <label>Descripción</label>
    <textarea v-model.trim="form.description" rows="4"></textarea>

    <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:14px">
      <button type="submit" class="ps-btn" :disabled="submitting">
        {{ submitText }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.card{
  background:#fff;
  border-radius:18px;
  padding:18px;
  box-shadow: var(--shadow-1,0 6px 18px rgba(0,0,0,.06));
}
.section-title{ margin:0 0 12px 0 }
label{
  display:block;
  font-weight:600;
  margin:12px 0 6px;
}
input, textarea{
  width:100%;
  padding:10px 12px;
  border-radius:12px;
  border:1px solid #ddd;
  outline:none;
}
.ps-btn{
  padding:10px 16px;
  border:none;
  border-radius:18px;
  background:var(--orange,#e3891b);
  color:#fff;
  cursor:pointer;
}
.ps-btn[disabled]{
  opacity:.6;
  cursor:default;
}
.form-error{
  color:#b3261e;
  margin:0 0 8px;
  font-size:.9rem;
}
</style>

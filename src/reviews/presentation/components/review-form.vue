<template>
  <form class="rf" @submit.prevent="onSubmit">
    <!-- Rating -->
    <div class="rf__row">
      <label class="rf__label">{{ t('reviews.form.rating') }}</label>

      <div class="rf__stars" role="radiogroup" :aria-label="t('reviews.form.rating')">
        <button
            v-for="n in 5"
            :key="n"
            class="rf__star"
            type="button"
            role="radio"
            :aria-checked="rating === n"
            :title="`${n} / 5`"
            @mouseenter="hover = n"
            @mouseleave="hover = 0"
            @click="rating = n"
        >
          <span aria-hidden="true">{{ (hover || rating) >= n ? '★' : '☆' }}</span>
        </button>
        <span class="rf__score" aria-live="polite">
          {{ rating ? `${rating}/5` : '—/5' }}
        </span>
      </div>
    </div>

    <!-- Comment -->
    <div class="rf__row">
      <label class="rf__label" :for="idTextarea">{{ t('reviews.form.comment') }}</label>

      <div class="rf__field">
        <textarea
            :id="idTextarea"
            v-model.trim="comment"
            rows="5"
            class="rf__textarea"
            :placeholder="t('reviews.form.placeholder')"
            @input="onInput"
        />
        <div class="rf__hint">
          <span :class="{'ok': comment.length >= MIN, 'warn': comment.length < MIN}">
            {{ comment.length }}/{{ MIN }}
          </span>
        </div>
      </div>
    </div>

    <!-- Submit -->
    <div class="rf__actions">
      <ps-button
          :disabled="!canSubmit || loading"
          :label="loading ? t('common.saving') : t('reviews.form.submit')"
          type="submit"
      />
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PsButton from '@/shared/presentations/components/ui/ps-button.vue';
import { ReviewsRepository } from '@/reviews/infrastructure/reviews.repository.js';

const props = defineProps({
  huariqueId: { type: [String, Number], required: true },
  userId: { type: [String, Number], default: 0 }
});
const emit = defineEmits(['created']);

const { t } = useI18n();

const rating = ref(0);
const hover  = ref(0);
const comment = ref('');
const loading = ref(false);

const MIN = 5;
const idTextarea = `rf-${Math.random().toString(36).slice(2, 8)}`;

const canSubmit = computed(() => rating.value >= 1 && rating.value <= 5 && comment.value.length >= MIN);

function onInput() {
  if (comment.value.length > 2000) comment.value = comment.value.slice(0, 2000);
}

async function onSubmit() {
  if (!canSubmit.value || loading.value) return;
  loading.value = true;
  try {
    const res = await ReviewsRepository.create({
      huariqueId: props.huariqueId,
      userId: props.userId,
      rating: rating.value,
      comment: comment.value
    });
    emit('created', res);
    // Limpieza visual
    comment.value = '';
    rating.value = 0;
    hover.value = 0;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Paleta principal:
   - Marrón oscuro: #5B3010
   - Dorado: #E7A33E
   - Crema claro (fondos): #FFF8E6
   - Verde suave del fondo global: #E9F4CC
*/

/* Layout base */
.rf {
  display: grid;
  gap: 1.5rem;
  color: #3c2a21;
  font-family: "Poppins", sans-serif;
}

/* Cada fila: etiqueta + campo */
.rf__row {
  display: grid;
  grid-template-columns: 160px 1fr;
  align-items: start;
  gap: 1rem;
}
@media (max-width: 640px) {
  .rf__row {
    grid-template-columns: 1fr;
  }
}

.rf__label {
  font-weight: 600;
  color: #5b3010;
  font-size: 1rem;
}

/* Estrellas */
.rf__stars {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.rf__star {
  font-size: 2rem;
  color: #e7a33e;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease, color 0.15s ease;
}
.rf__star:hover {
  transform: scale(1.15);
  color: #ffba48;
}
.rf__score {
  margin-left: 0.6rem;
  font-weight: 500;
  color: #7b5a3e;
}

/* Campo de reseña */
.rf__field {
  width: 100%;
}
.rf__textarea {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #e7a33e30;
  background: #fff8e6;
  font-size: 1rem;
  color: #3c2a21;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.rf__textarea:focus {
  outline: none;
  border-color: #e7a33e;
  box-shadow: 0 0 6px rgba(231, 163, 62, 0.3);
}
.rf__hint {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.35rem;
  font-size: 0.9rem;
}
.rf__hint .ok {
  color: #5b3010;
}
.rf__hint .warn {
  color: #c0a37a;
}

/* Botón de enviar */
.rf__actions {
  display: flex;
  justify-content: flex-end;
}
.ps-button {
  background-color: #5b3010;
  color: #fff8e6;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease;
}
.ps-button:hover:not(:disabled) {
  background-color: #7b4a28;
  transform: translateY(-1px);
}
.ps-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

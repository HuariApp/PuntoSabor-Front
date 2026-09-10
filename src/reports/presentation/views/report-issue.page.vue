<template>
  <section class="ps-report wrap">
    <header class="ps-report__head">
      <div class="ps-report__icon" aria-hidden="true">⚑</div>
      <div>
        <h1 class="ps-report__title">{{ $t('report.title') }}</h1>
        <p class="ps-report__meta">
          <strong>{{ name }}</strong>
          <span>•</span>
          <span>{{ address }}</span>
        </p>
      </div>
    </header>

    <form class="ps-card" @submit.prevent="onSubmit">
      <div class="ps-grid">
        <!-- ¿Qué deseas corregir? -->
        <div class="ps-field ps-field--full">
          <label class="ps-label" for="field">{{ $t('report.field.label') }}</label>
          <select id="field" v-model="form.field" class="ps-control">
            <option value="name">{{ $t('report.field.options.name') }}</option>
            <option value="address">{{ $t('report.field.options.address') }}</option>
            <option value="hours">{{ $t('report.field.options.hours') }}</option>
            <option value="other">{{ $t('report.field.options.other') }}</option>
          </select>
          <small class="ps-hint">{{ $t('report.subtitle') }}</small>
        </div>

        <!-- Valor actual -->
        <div class="ps-field">
          <label class="ps-label" for="current">{{ $t('report.current') }}</label>
          <input id="current" class="ps-control" :value="currentValue" disabled />
        </div>

        <!-- Valor correcto -->
        <div class="ps-field">
          <label class="ps-label" for="suggested">{{ $t('report.suggested') }}</label>
          <input
              id="suggested"
              class="ps-control"
              v-model.trim="form.suggested"
              :placeholder="$t('report.placeholders.suggested')"
              :disabled="sending"
          />
        </div>

        <!-- Comentario -->
        <div class="ps-field ps-field--full">
          <label class="ps-label" for="comment">{{ $t('report.comment') }}</label>
          <textarea
              id="comment"
              class="ps-control ps-control--textarea"
              v-model.trim="form.comment"
              :placeholder="$t('report.placeholders.comment')"
              :disabled="sending"
              rows="5"
          ></textarea>
        </div>
      </div>

      <footer class="ps-actions">
        <button type="button" class="ps-btn ps-btn--ghost" @click="goBack" :disabled="sending">
          {{ $t('common.cancel') }}
        </button>
        <button type="submit" class="ps-btn ps-btn--brand" :disabled="disableSubmit">
          <span v-if="sending">{{ $t('report.submitting') }}</span>
          <span v-else>{{ $t('report.submit') }}</span>
        </button>
      </footer>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  id: { type: [String, Number], default: '' },
  name: { type: String, default: '' },
  address: { type: String, default: '' },
  hours: { type: String, default: '' }
});

const router = useRouter();
const { t } = useI18n();

const sending = ref(false);
const form = reactive({
  field: 'hours',      // 'name' | 'address' | 'hours' | 'other'
  suggested: '',
  comment: ''
});

const currentValue = computed(() => {
  switch (form.field) {
    case 'name': return props.name || '';
    case 'address': return props.address || '';
    case 'hours': return props.hours || '';
    default: return '';
  }
});

const disableSubmit = computed(() =>
    sending.value || !form.field || (form.field !== 'other' && form.suggested.trim().length < 2)
);

function goBack() {
  router.back();
}

async function onSubmit() {
  if (disableSubmit.value) return;
  try {
    sending.value = true;

    await new Promise(r => setTimeout(r, 900));
    alert(t('report.toastSaved'));
    goBack();
  } catch (e) {
    alert(t('report.toastError'));
  } finally {
    sending.value = false;
  }
}
</script>

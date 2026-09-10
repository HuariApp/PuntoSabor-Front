<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const STORAGE_KEY = 'ps-notification-prefs';
const { t } = useI18n();

const prefs = reactive({
  app: true,
  promos: true,
  reviews: true
});

const saving = ref(false);
const saved = ref(false);

onMounted(() => {
  if (typeof localStorage === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    Object.assign(prefs, parsed || {});
  } catch (err) {
    console.warn('Error cargando preferencias de notificaciones', err);
  }
});

function onSubmit() {
  if (typeof localStorage === 'undefined') return;
  saving.value = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  saved.value = true;
  setTimeout(() => { saving.value = false; }, 400);
}
</script>

<template>
  <section class="wrap" aria-labelledby="notif-title">
    <header class="page-head">
      <h1 id="notif-title" class="section-title">
        {{ t('notifications.title') }}
      </h1>
      <p class="section-sub">
        {{ t('notifications.intro') }}
      </p>
    </header>

    <form class="card" @submit.prevent="onSubmit">
      <fieldset class="field-group">
        <legend class="field-title">
          {{ t('notifications.section.general') }}
        </legend>

        <label class="toggle">
          <input type="checkbox" v-model="prefs.app" />
          <span>{{ t('notifications.fields.app') }}</span>
        </label>

        <label class="toggle">
          <input type="checkbox" v-model="prefs.promos" />
          <span>{{ t('notifications.fields.promos') }}</span>
        </label>

        <label class="toggle">
          <input type="checkbox" v-model="prefs.reviews" />
          <span>{{ t('notifications.fields.reviews') }}</span>
        </label>
      </fieldset>

      <div class="actions">
        <button class="ps-btn" type="submit" :disabled="saving">
          {{ t('notifications.save') }}
        </button>
        <span v-if="saved" class="saved-hint">
          {{ t('notifications.saved') }}
        </span>
      </div>
    </form>
  </section>
</template>

<style scoped>
.card{
  background:#fff;
  border-radius:18px;
  padding:18px;
  box-shadow: var(--shadow-1,0 6px 18px rgba(0,0,0,.06));
}
.field-group{
  border:none;
  padding:0;
  margin:0 0 1rem;
}
.field-title{
  font-weight:600;
  margin-bottom:.75rem;
}
.toggle{
  display:flex;
  align-items:center;
  gap:.5rem;
  margin-bottom:.5rem;
}
.toggle input[type="checkbox"]{
  width:18px;
  height:18px;
}
.actions{
  display:flex;
  align-items:center;
  gap:.75rem;
}
.saved-hint{
  font-size:.9rem;
  color:var(--ps-brown);
}
</style>

<template>
  <section class="revnew">
    <h1 class="revnew__title">{{ t('reviews.new.title') }}</h1>

    <ps-card>
      <template #header>
        <div class="revnew__head">
          <h2 class="revnew__subtitle">{{ t('reviews.new.subtitle') }}</h2>

          <!-- Huarique destino -->
          <div v-if="huarique" class="revnew__target" aria-live="polite">
            <div class="revnew__avatar" :title="huarique.name">
              <img v-if="huarique.img" :src="huarique.img" :alt="huarique.name" @error="imgError" />
              <span v-else>{{ initials(huarique.name) }}</span>
            </div>

            <!-- Nombre + meta con separación correcta -->
            <div class="revnew__info">
              <strong class="revnew__name">{{ huarique.name }}</strong>
              <small class="revnew__meta">{{ huarique.district }}</small>
              <small class="revnew__meta">{{ huarique.category }}</small>
            </div>
          </div>
        </div>
      </template>

      <review-form
          v-if="ready"
          :huarique-id="huariqueId"
          :user-id="sessionUserId"
          @created="handleCreated"
      />
      <div v-else class="revnew__loading">...</div>
    </ps-card>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PsCard from '@/shared/presentations/components/ui/ps-card.vue';
import ReviewForm from '@/reviews/presentation/components/review-form.vue';
import { getSession } from '@/auth/application/get-session.query.js';
import { api } from '@/shared/infrastructure/base-api';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const huariqueId = computed(() => Number(route.params.huariqueId));
const sessionUserId = ref(0);
const ready = ref(false);
const huarique = ref(null);

// Carga robusta: si por alguna razón /huariques/:id fuera mapeado a colección,
// usamos también /huariques?id=ID y resolvemos el item exacto.
async function loadHuarique(id) {
  const num = Number(id);

  try {
    // 1) intenta item directo
    let h = await api(`/huariques/${num}`);

    // si por mapa termina siendo array, o por seguridad, busca el id
    if (Array.isArray(h)) {
      h = h.find(x => Number(x?.id) === num) ?? h[0] ?? null;
    }
    // 2) si sigue fallando o vino null, intenta con query
    if (!h) {
      const arr = await api(`/huariques?id=${num}`);
      h = Array.isArray(arr) ? arr.find(x => Number(x?.id) === num) ?? arr[0] ?? null : arr;
    }
    huarique.value = h || null;
  } catch {
    huarique.value = null;
  }
}

async function loadSession() {
  try {
    const session = getSession();
    sessionUserId.value = Number(session?.id ?? 0);
  } catch {
    sessionUserId.value = 0;
  }
}

onMounted(async () => {
  await Promise.all([loadSession(), loadHuarique(huariqueId.value)]);
  ready.value = true;
});

watch(huariqueId, async (id) => {
  await loadHuarique(id);
});

onBeforeRouteUpdate(async (to) => {
  if (to.params.huariqueId !== route.params.huariqueId) {
    await loadHuarique(to.params.huariqueId);
  }
});

function handleCreated() {
  router.push({ name: 'reviews', params: { huariqueId: huariqueId.value } });
}

function imgError(e) {
  e.target.style.display = 'none';
}

function initials(name = '') {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() ?? '').join('');
}
</script>


<style scoped>
:root { --ps-brown:#5B3010; --ps-gold:#E7A33E; --ps-cream:#FFF8E6; }

.revnew {
  max-width: 960px;
  margin: 1.75rem auto 2.25rem;
  padding: 0 1rem;
}
.revnew__title {
  color: var(--ps-brown);
  font-size: 2.15rem;
  font-weight: 800;
  letter-spacing: .2px;
  margin: .35rem 0 1.25rem;
}
.revnew :deep(.ps-card) {
  padding: 1.25rem 1.25rem 1rem;
  border: 1px solid #0000;
}
.revnew :deep(.ps-card__header){
  margin-bottom: .75rem;
}
.revnew__subtitle {
  color: var(--ps-brown);
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
}

.revnew__head{
  display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;
}
.revnew__target {
  display: inline-flex; align-items: center; gap: .65rem;
  padding: .5rem .75rem; background: var(--ps-cream);
  border: 1px solid color-mix(in srgb, var(--ps-gold) 35%, transparent);
  border-radius: 999px;
}
.revnew__avatar { width: 40px; height: 40px; border-radius: 999px;
  overflow: hidden; display: grid; place-items: center;
  background: color-mix(in srgb, var(--ps-gold) 25%, white);
  color: var(--ps-brown); font-weight: 700;
}
.revnew__avatar img{ width:100%; height:100%; object-fit:cover; display:block; }

/* separación limpia entre nombre, distrito y categoría */
.revnew__info{
  display:inline-flex;
  align-items: baseline;
  gap:.5rem;
}
.revnew__name { color: var(--ps-brown); font-weight: 700; }
.revnew__meta { color: #8b6a4c; position: relative; }
.revnew__meta + .revnew__meta::before {
  content: "•";
  margin: 0 .25rem 0 .15rem;
  color: #c19a6b;
}

.revnew__loading { color:#9ca3af; font-size:.95rem; }
</style>

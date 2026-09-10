<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import HuariqueCard from '../components/huarique-card.vue';
import { getFavorites } from '@/shared/infrastructure/favorites.service.js';

const { t } = useI18n();
const favorites = ref([]);

onMounted(() => {
  favorites.value = getFavorites();
});

const hasFavorites = computed(() => favorites.value && favorites.value.length > 0);
</script>

<template>
  <section class="wrap" aria-labelledby="fav-title">
    <header class="page-head">
      <h1 id="fav-title" class="section-title">{{ t('favorites.title') }}</h1>
      <p class="section-sub">{{ t('favorites.subtitle') }}</p>
    </header>

    <div v-if="hasFavorites" class="cards-grid">
      <HuariqueCard
          v-for="h in favorites"
          :key="h.id"
          :item="h"
          :img="h.imgUrl"
      />
    </div>

    <div v-else class="empty">
      <p>{{ t('favorites.empty') }}</p>
      <RouterLink class="ps-btn ps-btn--primary" to="/map">
        {{ t('favorites.ctaExplore') }}
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.wrap {
  padding-top: 1.5rem;
}

.empty {
  padding: 2rem 0;
  text-align: center;
}
</style>

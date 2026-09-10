<template>
  <section class="wrap hero">
    <div class="blob"></div>

    <div class="hero__grid">
      <!-- Texto principal -->
      <div>
        <h1>{{ $t('home.headline') }}</h1>
        <p class="hero__lead">{{ $t('home.subhead') }}</p>

        <form class="search" @submit.prevent="goSearch">
          <input v-model="q" :placeholder="$t('home.searchPlaceholder')" />
          <button class="btn">{{ $t('home.ctaExplore') }}</button>
        </form>

        <!-- Chips rápidas -->
        <div class="chips">
          <button class="chip" @click="quick('Pollo')">Pollo</button>
          <button class="chip" @click="quick('Marina')">Marina</button>
          <button class="chip" @click="quick('Menú')">Menú</button>
          <RouterLink class="chip" to="/categories">{{ $t('home.ctaExplore') }}</RouterLink>
          <RouterLink class="chip" to="/map">{{ $t('home.ctaMap') }}</RouterLink>
        </div>
      </div>

      <!-- Logo -->
      <div class="pinwrap">
        <div class="pin pin--img">
          <img class="hero-logo" :src="smallLogo" alt="PointFlavor" />
        </div>
        <h2 class="hero__brand">{{ $t('brand') }}</h2>
      </div>
    </div>
  </section>

  <!-- Sección de categorías -->
  <section class="wrap" v-if="cats.length">
    <h2 class="section-title">{{ $t('home.catsTitle') }}</h2>

    <div class="grid cards-4">
      <article v-for="c in cats" :key="c.id ?? c.name" class="card card--category">
        <div class="card__media media">
          <img :src="categoryImg(c.name)" :alt="c.name" loading="lazy" @error="onImgError" />
          <span class="media__badge">{{ c.name }}</span>
        </div>

        <div class="card__body">
          <strong>{{ c.name }}</strong>
          <p class="meta">{{ $t('home.popularNear') }}</p>
        </div>

        <div class="card__footer">
          <RouterLink class="btn" :to="{ path:'/results', query:{ q:c.name } }">
            {{ $t('home.view') }}
          </RouterLink>
          <span class="meta">+10</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { listCategoriesQuery } from '@/discovery/application/list-categories.query.js';
import smallLogo from '@/assets/slogoPuntoSabor.png';

const modules = import.meta.glob('/src/assets/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default'
});

const IMG_MAP = Object.fromEntries(
    Object.entries(modules).map(([path, url]) => {
      const filename = path.split('/').pop().toLowerCase().replace(/\.[^.]+$/, '');
      return [filename, url];
    })
);

const FALLBACK =
    IMG_MAP['slogopuntosabor'] ||
    IMG_MAP['logopuntosabor'] ||
    Object.values(IMG_MAP)[0];

export default {
  name: 'HomeView',
  data: () => ({
    q: '',
    cats: [],
    smallLogo
  }),
  async created() {
    const raw = await listCategoriesQuery();
    // Normalizamos a objetos { id, name }
    this.cats = (raw ?? []).map((c, i) => (
        typeof c === 'string' ? { id: i + 1, name: c } : c
    )).slice(0, 4);
  },
  methods: {
    goSearch() {
      this.$router.push({ path: '/results', query: { q: this.q } });
    },
    quick(term) {
      this.$router.push({ path: '/results', query: { q: term } });
    },
    categoryImg(catName) {
      const slug = String(catName).toLowerCase();
      const ALIAS = {
        pollo:   ['pollo_brasa'],
        marina:  ['marisco'],
        criolla: ['criolla'],
        chifa:   ['chifaref'],
        postres: ['postresref'],
        menu:    ['menu', 'menú', 'menuref'],
        cafe:    ['cafe', 'café', 'caferef'],
        parrillas: ['parrillas', 'parrillasref']
      };
      const candidates = (ALIAS[slug] || [slug])
          .map(k => [k, k.replace(/-/g, '_')])
          .flat();
      for (const key of candidates) if (IMG_MAP[key]) return IMG_MAP[key];
      return FALLBACK;
    },
    onImgError(e) {
      e.target.src = FALLBACK;
    }
  }
};
</script>

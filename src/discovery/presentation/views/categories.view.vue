<template>
  <section class="wrap categories-page" aria-labelledby="cat-title">
    <header class="page-head fx-sub">
      <h2 id="cat-title" class="section-title fx-title">
        {{ $t('categories.title') }}
      </h2>
    </header>

    <div class="grid cards-3 categories-grid">
      <article
          v-for="(c, i) in cats"
          :key="c.id ?? catSlug(c)"
          class="card card--category item"
          :style="stagger(i)"
      >
        <div class="card__media media">
          <img
              :src="categoryImg(c)"
              :alt="tCat(c)"
              loading="lazy"
              @error="onImgError"
          />
          <span class="media__badge" :aria-label="tCat(c)">
            {{ tCat(c) }}
          </span>
        </div>

        <div class="card__body">
          <p class="meta">
            {{ $t('categories.exploreInArea', { category: tCat(c) }) }}
          </p>
        </div>

        <footer class="card__footer">
          <RouterLink class="btn" :to="{ path: '/results', query: { q: catName(c) } }">
            {{ $t('categories.see') }}
          </RouterLink>
        </footer>
      </article>
    </div>
  </section>
</template>

<script>
import { listCategoriesQuery } from '../../application/list-categories.query.js';

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
    IMG_MAP['logopuntosabor'] ||
    IMG_MAP['slogopuntosabor'] ||
    Object.values(IMG_MAP)[0];

export default {
  name: 'CategoriesView',
  data: () => ({ cats: [] }),
  async created () {
    const raw = await listCategoriesQuery();
    this.cats = (raw ?? []).map((c, idx) => {
      if (typeof c === 'string') {
        return { id: this.slugify(c) || String(idx), name: c };
      }
      return {
        id: c.id ?? this.slugify(c.name ?? `cat-${idx}`),
        name: c.name ?? String(c) // fallback
      };
    });
  },
  methods: {
    slugify (s) {
      return String(s)
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9\-]/g, '');
    },
    catName (c) {
      return typeof c === 'string' ? c : (c?.name ?? '');
    },
    catSlug (c) {
      return this.slugify(this.catName(c));
    },
    tCat (c) {
      const key = this.catSlug(c); // usar slug del name
      const translated = this.$t(`cat.${key}`);
      const name = this.catName(c);
      return (typeof translated === 'string' && translated !== `cat.${key}`) ? translated : name;
    },

    categoryImg (c) {
      const slug = this.catSlug(c);
      const ALIAS = {
        pollo:     ['pollo', 'pollo-brasa', 'pollo_brasa'],
        marina:    ['marisco', 'la-marina', 'la_marina', 'mariscos'],
        criolla:   ['criolla', 'antojos-criollos', 'antojos_criollos'],
        chifa:     ['chifaref', 'la-picanteria', 'la_picanteria', 'don-pepe', 'don_pepe', 'el-forastero', 'el_forastero'],
        postres:   ['postresref', 'dulces', 'dulcesazon', 'mazamorra', 'mazamorra-morada', 'mazamorra_morada'],
        menu:      ['menuref', 'menú', 'menu'],
        cafe:      ['caféref', 'caferef', 'cafe'],
        parrillas: ['parrillasref', 'parrillas', 'parrilla']
      };
      const candidates = (ALIAS[slug] || [slug])
          .map(k => [k, k.replace(/-/g, '_')])
          .flat();
      for (const key of candidates) if (IMG_MAP[key]) return IMG_MAP[key];
      return FALLBACK;
    },

    onImgError (e) {
      if (e?.target && e.target.src !== FALLBACK) e.target.src = FALLBACK;
    },

    stagger (i) {
      const delay = (i % 12) * 60; // ms
      return { animationDelay: `${delay}ms` };
    }
  }
};
</script>

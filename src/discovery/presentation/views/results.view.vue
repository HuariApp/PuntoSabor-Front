<template>
  <section class="wrap">
    <h2 class="section-title">
      Resultados
      <small style="font-size:14px">{{ results.length }} hallazgos</small>
    </h2>

    <div class="grid cards-4">
      <HuariqueCard
          v-for="h in results"
          :key="h.id"
          :item="h"
          :img="itemImg(h)"
          :promo="promosMap[h.id] || null"
      />
    </div>
  </section>
</template>

<script>
import { searchHuariquesQuery } from '../../application/search-huariques.query.js';
import { listFeaturedPromotionsQuery } from '@/promotions/application/list-featured-promotions.query.js';
import HuariqueCard from '../components/huarique-card.vue';

const modules = import.meta.glob('/src/assets/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default'
});

const IMG_MAP = Object.fromEntries(
    Object.entries(modules).map(([p, url]) => {
      const raw = p.split('/').pop().replace(/\.[^.]+$/, ''); // nombre sin extensión
      const key = raw
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''); // <-- quita tildes/ñ
      return [key, url];
    })
);

const FALLBACK =
    IMG_MAP['slogopuntosabor'] ||
    IMG_MAP['logopuntosabor'] ||
    Object.values(IMG_MAP)[0];

const norm = s =>
    String(s)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // sin tildes

const slugify = s =>
    norm(s)
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');

const variants = k => {
  const a = norm(k);
  return [a, a.replace(/-/g, '_'), a.replace(/[_-]/g, '')];
};

const hashIndex = (key, n) => {
  let h = 0;
  const s = norm(key);
  for (let i = 0; i < s.length; i++) h = ((h * 31 + s.charCodeAt(i)) >>> 0);
  return n ? h % n : 0;
};

export default {
  name: 'ResultsView',
  components: { HuariqueCard },
  data: () => ({
    results: [],
    promosMap: {}
  }),
  async created() {
    this.fetch();
  },
  watch: {
    '$route.query.q': 'fetch'
  },
  methods: {
    async fetch() {
      this.results = await searchHuariquesQuery(this.$route.query.q || '');

      // Cargar promociones destacadas activas y mapear por huariqueId
      try {
        const pf = await listFeaturedPromotionsQuery();
        const map = {};
        (pf.promotions || []).forEach(p => {
          if (p && p.huariqueId) {
            const existing = map[p.huariqueId];
            // Nos quedamos con la promo que vence antes
            if (!existing || p.daysRemaining < existing.daysRemaining) {
              map[p.huariqueId] = p;
            }
          }
        });
        this.promosMap = map;
      } catch (err) {
        console.warn(
            'No se pudieron cargar promociones destacadas:',
            err.message || err
        );
        this.promosMap = {};
      }
    },
    slugify(s) {
      return String(s)
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9\-]/g, '');
    },
    itemImg(r) {
      const norm = s =>
          String(s)
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');
      const slugify = s =>
          norm(s)
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9\-]/g, '');
      const variants = k => {
        const a = norm(k);
        return [a, a.replace(/-/g, '_'), a.replace(/[_-]/g, '')];
      };
      const hashIndex = (key, n) => {
        let h = 0;
        const s = norm(key);
        for (let i = 0; i < s.length; i++)
          h = ((h * 31 + s.charCodeAt(i)) >>> 0);
        return n ? h % n : 0;
      };

      const cat = slugify(r.category || this.$route.query.q || '');
      const nameSlug = r.name ? slugify(r.name) : '';

      const NAME_ALIAS = {
        'parrilladas-don-mario': ['mario'],
        'brasa-y-carbon': ['brasaycarbon'],
        'fuego-criollo': ['fuegocriollo'],
        'la-parrilla-del-norte': ['parrillanorte'],
        'punto-grill': ['puntogrill']
      };

      // Alias por nombre de huarique
      if (nameSlug && NAME_ALIAS[nameSlug]) {
        const direct = NAME_ALIAS[nameSlug].flatMap(variants);
        for (const key of direct) if (IMG_MAP[key]) return IMG_MAP[key];
      }

      // Intento directo por nombre
      if (nameSlug) {
        for (const key of variants(nameSlug)) if (IMG_MAP[key]) return IMG_MAP[key];
      }

      // Alias por categoría (UNIÓN de tus dos versiones, sin perder nada)
      const ALIAS = {
        pollo: [
          'pollo',
          'pollo-brasa',
          'pollo_brasa',
          'parrillasref',
          'elbrasero',
          'dontito',
          'donlucho'
        ],
        marina: [
          // nuevos alias
          'marina',
          'la-marina',
          'la_marina',
          'marisco',
          'mariscos',
          // antiguos
          'olamarina',
          'rinconmarino',
          'marytierra'
        ],
        criolla: [
          // nuevos
          'criolla',
          'antojos-criollos',
          'antojos_criollos',
          'marytierra',
          'lapicanteria',
          // antiguos
          'dona',
          'la_picanteria',
          'sabornorteno'
        ],
        chifa: [
          'chifaref',
          'chifaping',
          'don-pepe',
          'don_pepe',
          'el-forastero',
          'el_forastero',
          'sanjoylao'
        ],
        postres: [
          'postresref',
          'dulces',
          'dulcesazon',
          'mazamorra',
          'mazamorra-morada',
          'mazamorra_morada',
          'lacaspdelpostre',
          'lapasteleria'
        ],
        menu: [
          // nuevos
          'menuref',
          'menu',
          'menu-del-dia',
          'menu_del_dia',
          'aesqui',
          // antiguo que NO queríamos perder
          'donlucho'
        ],
        cafe: ['caferef', 'cafe', 'cafecentral', 'aromaysabor']
      };

      const list = (ALIAS[cat] || [cat])
          .flatMap(variants)
          .filter(k => IMG_MAP[k]);

      if (list.length) {
        const sorted = [...new Set(list)].sort();
        const idx = hashIndex(r.name || String(r.id), sorted.length);
        return IMG_MAP[sorted[idx]];
      }

      return FALLBACK;
    }
  }
};
</script>

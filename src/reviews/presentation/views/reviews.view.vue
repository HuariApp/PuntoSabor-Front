<template>
  <section class="revlist wrap">
    <!-- Encabezado con acciones -->
    <div class="section-head">
      <h1 class="revlist__title section-title">
        {{ $t('reviews.title') }}
      </h1>

      <div class="actions">
        <!-- Solo admins / owners -->
        <RouterLink
            v-if="isAdmin"
            class="btn btn--admin"
            :to="{ path: '/reviews/admin' }"
        >
          Panel Admin
        </RouterLink>

        <!-- Botón para crear reseña del huarique actual -->
        <RouterLink
            v-if="isLoggedIn"
            class="btn btn--primary"
            :to="{ name: 'review-new', params: { huariqueId: currentHuariqueId } }"
        >
          Escribir reseña
        </RouterLink>

        <!-- Si no está logueado -->
        <button
            v-else
            class="btn btn--primary btn--disabled"
            title="Debes estar logueado"
            disabled
        >
          Escribir reseña
        </button>
      </div>
    </div>

    <!-- Lista de reseñas  -->
    <div v-if="reviews.length" class="revlist__grid">
      <article v-for="r in reviews" :key="r.id" class="revitem" role="article">
        <header class="revitem__head">
          <div class="revitem__avatar" :title="displayName(r)">
            {{ avatarText(r) }}
          </div>
          <div class="revitem__person">
            <strong class="revitem__name">{{ displayName(r) }}</strong>
            <span class="revitem__stars" :aria-label="`${score(r)}/5`">
              {{ '★'.repeat(score(r)) }}<span class="revitem__stars--off">{{ '☆'.repeat(5 - score(r)) }}</span>
            </span>
          </div>
        </header>

        <p class="revitem__comment">
          {{ r.comment ?? r.text ?? '' }}
        </p>

        <footer class="revitem__meta">
          <span>#{{ r.id }}</span>
          <span v-if="r.createdAt">{{ formatDate(r.createdAt) }}</span>
        </footer>
      </article>
    </div>

    <div v-else class="revlist__empty">
      <p class="revlist__emptyText">No hay reseñas todavía.</p>
    </div>
  </section>
</template>

<script>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getSession } from '@/auth/application/get-session.query.js';
import { ReviewsRepository } from '@/reviews/infrastructure/reviews.repository.js';

export default {
  name: 'ReviewsView',
  components: { RouterLink },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data: () => ({
    reviews: [],
    session: null
  }),
  computed: {
    currentHuariqueId() {
      const id = Number(this.$route.params.huariqueId);
      return Number.isNaN(id) ? 0 : id;
    },
    isLoggedIn() {
      return !!(this.session && this.session.id);
    },
    isAdmin() {
      const role = this.session?.role;
      return role === 'owner' || role === 'admin';
    }
  },
  async created() {
    // Cargar reseñas
    const id = this.currentHuariqueId;
    this.reviews = id
        ? await ReviewsRepository.listByHuarique(id)
        : await ReviewsRepository.list();

    // Cargar sesión para los botones
    try {
      this.session = await getSession();
    } catch (e) {
      this.session = null;
    }
  },
  watch: {
    '$route.params.huariqueId': {
      async handler() {
        const id = this.currentHuariqueId;
        this.reviews = id
            ? await ReviewsRepository.listByHuarique(id)
            : await ReviewsRepository.list();
      }
    }
  },
  methods: {
    score(r) {
      const s = Number(r?.rating ?? r?.stars ?? 0);
      if (Number.isNaN(s)) return 0;
      return Math.max(0, Math.min(5, Math.round(s)));
    },
    displayName(r) {
      return r?.by ?? `Usuario #${r?.userId ?? 'anon'}`;
    },
    avatarText(r) {
      const name = this.displayName(r);
      const parts = String(name).split(/\s+/).slice(0, 2);
      return parts.map(p => p?.[0]?.toUpperCase() ?? '').join('');
    },
    formatDate(iso) {
      try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        });
      } catch {
        return '';
      }
    }
  }
};
</script>

<style scoped>
/* Paleta PuntoSabor */
:root{ --ps-brown:#5B3010; --ps-gold:#E7A33E; --ps-cream:#FFF8E6; }

.revlist{
  max-width: 1100px;
  margin: 1.75rem auto 2.5rem;
  padding: 0 1rem;
}

.revlist__title{
  color: var(--ps-brown);
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: .2px;
  margin: .35rem 0 1.25rem;
}

/* Encabezado + acciones  */
.section-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-bottom:18px;
}
.actions{
  display:flex;
  gap:8px;
}
.btn{
  background:linear-gradient(90deg,#667eea,#764ba2);
  color:#fff;
  padding:8px 14px;
  border-radius:10px;
  font-weight:700;
  text-decoration:none;
  border:none;
  cursor:pointer;
  font-size: .9rem;
}
.btn:hover{
  opacity:0.95;
  transform:translateY(-1px);
}
.btn--admin{
  background:linear-gradient(90deg,#f39c12,#e67e22);
}
.btn--primary{
  background:linear-gradient(90deg,#667eea,#764ba2);
}
.btn--disabled{
  opacity:0.5;
  cursor:not-allowed;
}
.btn--disabled:hover{
  opacity:0.5;
  transform:none;
}

/* Grid de tarjetas  */
.revlist__grid{
  display: grid;
  gap: 1rem 1.25rem;
  grid-template-columns: repeat(2, minmax(320px,1fr));
}
@media (max-width: 980px){
  .revlist__grid{ grid-template-columns: 1fr; }
}

/* Tarjeta de reseña */
.revitem{
  background: #fff;
  border-radius: 16px;
  padding: 1rem 1.1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,.08);
  border: 1px solid rgba(231,163,62,0.15); /* dorado suave */
  transition: transform .15s ease, box-shadow .15s ease;
}
.revitem:hover{
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,.10);
}

.revitem__head{
  display: flex; align-items: center; gap: .75rem;
  margin-bottom: .5rem;
}
.revitem__avatar{
  width: 40px; height: 40px; border-radius: 999px;
  display: grid; place-items: center;
  background: var(--ps-cream);
  color: var(--ps-brown);
  border: 1px solid rgba(231,163,62,.35);
  font-weight: 700;
}
.revitem__person{ display:flex; align-items:center; gap:.5rem; flex-wrap:wrap; }
.revitem__name{ color: var(--ps-brown); font-weight: 700; }
.revitem__stars{ color: var(--ps-gold); font-weight: 600; }
.revitem__stars--off{ color: #e5e7eb; }

.revitem__comment{
  background: #fffef9;
  border: 1px dashed rgba(231,163,62,.35);
  border-radius: 12px;
  padding: .75rem .9rem;
  color: #3c2a21;
  line-height: 1.45;
  margin: .35rem 0 .6rem;
}

.revitem__meta{
  display:flex; gap:.75rem; justify-content:flex-end;
  font-size: .85rem; color: #8b6a4c;
}

.revlist__empty{
  background: var(--ps-cream);
  border: 1px dashed rgba(231,163,62,.45);
  color: var(--ps-brown);
  border-radius: 14px;
  padding: 1rem 1.25rem;
}
.revlist__emptyText{
  margin: 0;
  font-weight: 600;
}
</style>

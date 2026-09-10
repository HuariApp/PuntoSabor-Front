<template>
  <section class="wrap">
    <!-- Encabezado -->
    <div class="toolbar">
      <h2 class="section-title">{{ $t('ownerNew.promos.title') }}</h2>

      <!-- Botones -->
      <div class="toolbar__actions" style="display:flex; gap:.5rem; align-items:center;">
        <RouterLink
            v-if="['owner','dueño'].includes(currentRole)"
            :to="{ name:'owner-promos' }"
            class="ps-btn ps-btn--ghost ps-btn--pill ps-btn--sm"
        >
          {{ $t('ownerNew.promos.manageBtn') || 'Gestionar Promos' }}
        </RouterLink>

        <button
            v-if="['owner','dueño'].includes(currentRole)"
            class="ps-btn ps-btn--primary ps-btn--pill ps-btn--sm"
            @click="showCreate = true"
        >
          {{ $t('ownerNew.promos.addBtn') }}
        </button>
      </div>
    </div>

    <!-- Tarjetas -->
    <div class="grid cards-3">
      <article v-for="p in promos" :key="p.id" class="card card--promo">
        <div class="card__media media">
          <img :src="promoImg(p)" :alt="trTitle(p)" loading="lazy" @error="onImgError" />
          <span class="media__badge">{{ trTitle(p) }}</span>
        </div>

        <div class="card__body">
          <p class="meta">{{ trNote(p) }}</p>
          <button class="btn" @click="openDetails(p)">{{ $t('ownerNew.promos.seeDetails') }}</button>
        </div>
      </article>
    </div>

    <!-- MODAL: Crear promoción -->
    <div v-if="showCreate" class="ps-modal" @click.self="showCreate=false">
      <div class="ps-modal__card ps-modal__card--md" role="dialog" aria-modal="true" aria-labelledby="createTitle">
        <header class="ps-modal__head">
          <h3 id="createTitle">{{ $t('ownerNew.promos.create.title') }}</h3>
          <button type="button" class="ps-icon-btn" @click="showCreate=false" :aria-label="$t('ownerNew.promos.actions.close')">✕</button>
        </header>

        <div class="ps-modal__body">
          <form id="createPromoForm" class="ps-form" @submit.prevent="handleCreate">
            <div class="ps-field">
              <label>{{ $t('ownerNew.promos.fields.title') }}</label>
              <input v-model="formData.title" required />
            </div>

            <div class="ps-field">
              <label>{{ $t('ownerNew.promos.fields.note') }}</label>
              <input v-model="formData.note" />
            </div>

            <div class="form-row">
              <div class="ps-field">
                <label>{{ $t('ownerNew.promos.fields.discount') }}</label>
                <input v-model.number="formData.discount" type="number" min="0" max="100" required />
              </div>
              <div class="ps-field">
                <label>{{ $t('ownerNew.promos.fields.maxUses') }}</label>
                <input v-model.number="formData.maxUses" type="number" min="0" />
              </div>
            </div>

            <div class="form-row">
              <div class="ps-field">
                <label>{{ $t('ownerNew.promos.fields.start') }}</label>
                <input v-model="formData.startDate" type="datetime-local" />
              </div>
              <div class="ps-field">
                <label>{{ $t('ownerNew.promos.fields.end') }}</label>
                <input v-model="formData.endDate" type="datetime-local" />
              </div>
            </div>

            <div class="ps-field">
              <label>{{ $t('ownerNew.promos.fields.huarique') }}</label>
              <select v-model="formData.huariqueId" required>
                <option disabled value="">{{ $t('ownerNew.promos.fields.selectPlaceholder') }}</option>
                <option v-for="h in huariques" :key="h.id" :value="h.id">{{ h.name || ('Huarique ' + h.id) }}</option>
              </select>
              <p v-if="huariques.length === 0" class="hint">
                {{ $t('ownerNew.promos.noHuariquesHint') }}
              </p>
            </div>

            <p v-if="createError" class="error">{{ $t(createError) }}</p>
          </form>
        </div>

        <footer class="ps-modal__actions">
          <button type="button" class="ps-btn ps-btn--ghost ps-btn--pill" @click="showCreate=false">{{ $t('ownerNew.promos.actions.close') }}</button>
          <button
              class="ps-btn ps-btn--primary ps-btn--pill"
              :disabled="isCreating || huariques.length===0"
              type="submit"
              form="createPromoForm"
          >
            {{ isCreating ? $t('ownerNew.promos.actions.creating') : $t('ownerNew.promos.actions.create') }}
          </button>
        </footer>
      </div>
    </div>

    <!-- MODAL: Ver detalles -->
    <div v-if="showDetails && selectedPromo" class="ps-modal" @click.self="closeDetails">
      <div class="ps-modal__card ps-modal__card--md" role="dialog" aria-modal="true" aria-labelledby="promoDetailsTitle">
        <header class="ps-modal__head">
          <h3 id="promoDetailsTitle">{{ selectedPromo.title }}</h3>
          <button type="button" class="ps-icon-btn" @click="closeDetails" :aria-label="$t('ownerNew.promos.actions.close')">✕</button>
        </header>

        <div class="ps-modal__body">
          <div class="ps-details">
            <div class="ps-details__top">
              <span class="ps-chip ps-chip--amber">{{ (selectedPromo.discount ?? 0) }}% {{ $t('ownerNew.promos.labels.off') }}</span>
              <span v-if="detailsStatusKey" :class="['ps-chip', detailsStatusClass]">{{ detailsStatusLabel }}</span>
            </div>

            <p class="ps-details__desc">{{ selectedPromo.description || selectedPromo.note || '—' }}</p>

            <dl class="ps-dl">
              <div v-if="selectedPromo.startDate || selectedPromo.endDate" class="ps-dl__row">
                <dt>{{ $t('ownerNew.promos.details.validity') }}</dt>
                <dd>{{ dateRange(selectedPromo.startDate, selectedPromo.endDate) }}</dd>
              </div>
              <div v-if="selectedPromo.maxUses > 0" class="ps-dl__row">
                <dt>{{ $t('ownerNew.promos.details.available') }}</dt>
                <dd>{{ Math.max(selectedPromo.maxUses - (selectedPromo.currentUses||0), 0) }} / {{ selectedPromo.maxUses }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <footer class="ps-modal__actions">
          <button type="button" class="ps-btn ps-btn--ghost ps-btn--pill" @click="closeDetails">{{ $t('ownerNew.promos.actions.close') }}</button>
          <button
              v-if="['owner','dueño'].includes(currentRole)"
              type="button"
              class="ps-btn ps-btn--danger ps-btn--pill"
              @click="deleteFromDetails(selectedPromo.id)"
          >
            {{ $t('ownerNew.promos.actions.delete') }}
          </button>
        </footer>
      </div>
    </div>
  </section>
</template>

<script>
import { listPromosQuery } from '../../application/list-promos.query.js';
import { createPromotionUseCase } from '@/promotions/application/create-promotion.usecase.js';
import { PromotionsRepository } from '@/promotions/infrastructure/promos.repository.js';
import { DiscoveryRepository } from '@/discovery/infrastructure/discovery.repository.js';

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

const BUCKETS = [
  { key: 'parrilla', keys: ['parrilla', 'parrillas', 'grill', 'asado'], imgs: ['parrillasref'] },
  { key: 'pollo',    keys: ['pollo', 'brasa', 'brasas'],                imgs: ['pollo_brasa'] },
  { key: 'marino',   keys: ['marino', 'marina', 'ceviche', 'mariscos', 'pescado'], imgs: ['la_marina', 'marisco'] },
  { key: 'cafe',     keys: ['cafe', 'café', 'espresso', 'latte'],      imgs: ['caféref'] },
  { key: 'postre',   keys: ['postre', 'postres', 'dulce', 'torta', 'pastel', 'helado', 'mazamorra'], imgs: ['postresref', 'dulcesazon', 'mazamorra_morada'] },
  { key: 'criollo',  keys: ['criollo', 'criolla', 'anticucho', 'aji de gallina', 'lomo saltado'],   imgs: ['criolla', 'antojos_criollos'] }
];

export default {
  name: 'PromosView',
  data: () => ({
    promos: [], huariques: [],
    showCreate: false, createError: '', isCreating: false,
    formData: { title: '', note: '', discount: 10, startDate: '', endDate: '', maxUses: 0, huariqueId: null },
    showDetails: false, selectedPromo: null, currentRole: null
  }),

  computed: {
    // key de estado traducible
    detailsStatusKey () {
      if (!this.selectedPromo) return '';
      return this.statusKey(this.selectedPromo);
    },
    detailsStatusLabel () {
      if (!this.detailsStatusKey) return '';
      return this.$t(`ownerNew.promos.status.${this.detailsStatusKey}`);
    },
    detailsStatusClass () {
      const map = {
        active: 'ps-chip--green',
        upcoming: 'ps-chip--blue',
        expired: 'ps-chip--red',
        complete: 'ps-chip--gray'
      };
      return map[this.detailsStatusKey] || 'ps-chip--gray';
    }
  },

  async created () {
    this.currentRole = this.getCurrentUserRole();
    this._onSessionUpdated = () => { this.currentRole = this.getCurrentUserRole(); };
    window.addEventListener('ps-session-updated', this._onSessionUpdated);
    this._onStorage = (e) => {
      if (!e || !e.key) return;
      if (['ps-session','ps-role','ps-user'].includes(e.key)) {
        this.currentRole = this.getCurrentUserRole();
      }
    };
    window.addEventListener('storage', this._onStorage);

    await this.load();
    await this.fetchHuariques();

    this._poll = setInterval(() => this.load(), 60 * 1000);
  },
  beforeUnmount() {
    if (this._poll) clearInterval(this._poll);
    if (this._onSessionUpdated) window.removeEventListener('ps-session-updated', this._onSessionUpdated);
    if (this._onStorage) window.removeEventListener('storage', this._onStorage);
  },

  methods: {
    async load() { this.promos = await listPromosQuery(); },
    async fetchHuariques() {
      try {
        const res = await DiscoveryRepository.search('');
        this.huariques = Array.isArray(res) ? res : (res || []);
        if (this.huariques.length === 1 && !this.formData.huariqueId) {
          this.formData.huariqueId = this.huariques[0].id;
        }
      } catch (err) {
        console.error('Error cargando huariques:', err);
        this.huariques = [];
      }
    },
    norm (s) {
      return String(s || '')
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },
    promoKey (p) {
      const text = this.norm(`${p.title} ${p.note}`);
      const bucket = BUCKETS.find(b => b.keys.some(k => text.includes(this.norm(k))));
      return bucket?.key || null;
    },
    trTitle (p) {
      const k = this.promoKey(p);
      if (k) {
        const path = `ownerNew.promos.cards.${k}.title`;
        const t = this.$t(path);
        if (t !== path) return t;
      }
      return p.title;
    },
    trNote (p) {
      const k = this.promoKey(p);
      if (k) {
        const path = `ownerNew.promos.cards.${k}.note`;
        const t = this.$t(path);
        if (t !== path) return t;
      }
      return p.note;
    },
    promoImg (p) {
      const k = this.promoKey(p);
      if (k) {
        const bucket = BUCKETS.find(b => b.key === k);
        const candidates = bucket.imgs.flatMap(n => [n, n.replace(/-/g, '_')]);
        for (const key of candidates) if (IMG_MAP[key]) return IMG_MAP[key];
      }
      const title = this.norm(p.title).replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
      for (const key of [title, title.replace(/-/g, '_')]) if (IMG_MAP[key]) return IMG_MAP[key];
      return FALLBACK;
    },
    onImgError (e) { e.target.src = FALLBACK; },

    getCurrentUserRole() {
      try {
        const s = JSON.parse(localStorage.getItem('ps-session') || 'null');
        if (s && s.role) return String(s.role).toLowerCase();
      } catch (e) {}
      try {
        const r = localStorage.getItem('ps-role');
        if (r) return String(r).toLowerCase();
      } catch (e) {}
      try {
        const u = JSON.parse(localStorage.getItem('ps-user') || '{}');
        if (u && u.role) return String(u.role).toLowerCase();
        return null;
      } catch (e) { return null; }
    },
    getCurrentUserId() {
      try {
        const s = JSON.parse(localStorage.getItem('ps-session') || 'null');
        if (s && s.id) return s.id;
      } catch (e) {}
      try {
        const u = JSON.parse(localStorage.getItem('ps-user') || '{}');
        return u.id || null;
      } catch (e) { return null; }
    },

    /* Fecha con locale según i18n */
    formatDate (d) {
      if (!d) return '—';
      const date = new Date(d);
      if (isNaN(date)) return '—';
      const loc = this.$i18n?.locale?.startsWith('en') ? 'en-US' : 'es-PE';
      return date.toLocaleString(loc, {
        dateStyle: 'medium',
        timeStyle: 'short',
        hour12: false,
        timeZone: 'America/Lima'
      });
    },
    dateRange (start, end) {
      const s = this.formatDate(start);
      const e = this.formatDate(end);
      return `${s} — ${e}`;
    },

    /* Estados traducibles */
    statusKey (p) {
      const now = new Date();
      const start = p?.startDate ? new Date(p.startDate) : null;
      const end   = p?.endDate   ? new Date(p.endDate)   : null;
      if (end && now > end) return 'expired';
      if (p?.maxUses > 0 && (p?.currentUses || 0) >= p.maxUses) return 'complete';
      if (start && now < start) return 'upcoming';
      return 'active';
    },

    async handleCreate() {
      this.createError = '';
      if (!this.formData.title) { this.createError = 'ownerNew.promos.errors.titleRequired'; return; }
      this.isCreating = true;
      try {
        const ownerId = this.getCurrentUserId() || 'owner';
        await createPromotionUseCase({
          title: this.formData.title,
          description: this.formData.note,
          discount: this.formData.discount,
          startDate: this.formData.startDate || null,
          endDate: this.formData.endDate || null,
          maxUses: this.formData.maxUses || 0,
          huariqueId: this.formData.huariqueId || null
        }, ownerId);
        this.showCreate = false;
        this.formData = { title: '', note: '', discount: 10, startDate: '', endDate: '', maxUses: 0, huariqueId: null };
        await this.load();
      } catch (err) {
        console.error(err);
        this.createError = 'ownerNew.promos.errors.createFailed';
      } finally {
        this.isCreating = false;
      }
    },

    openDetails(p) { this.selectedPromo = p; this.showDetails = true; },
    closeDetails() { this.showDetails = false; this.selectedPromo = null; },

    async deleteFromDetails(id) {
      if (!id) return;
      if (!confirm(this.$t('ownerNew.promos.confirm.delete'))) return;
      try {
        await PromotionsRepository.delete(id);
        this.closeDetails();
        await this.load();
        alert(this.$t('ownerNew.promos.alerts.deleted'));
      } catch (err) {
        console.error('Error eliminando promoción:', err);
        alert(this.$t('ownerNew.promos.alerts.deleteFailed'));
      }
    }
  }
};
</script>

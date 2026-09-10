<template>
  <section class="wrap">
    <div class="toolbar">
      <h2 class="section-title">{{ $t('ownerManage.promos.title') }}</h2>
    </div>

    <div class="owner-grid owner-grid--2">
      <!-- Panel: Crear -->
      <article class="card">
        <div class="card__body">
          <form class="ps-form" @submit.prevent="handleCreatePromotion" v-if="!promotionCreated">
            <div class="ps-field">
              <label for="title">{{ $t('ownerManage.promos.fields.title') }}</label>
              <input
                  id="title"
                  v-model="formData.title"
                  type="text"
                  :placeholder="$t('ownerManage.promos.placeholders.title')"
                  required
                  :disabled="isCreating"
              />
            </div>

            <div class="ps-field">
              <label for="description">{{ $t('ownerManage.promos.fields.description') }}</label>
              <textarea
                  id="description"
                  v-model="formData.description"
                  rows="3"
                  :placeholder="$t('ownerManage.promos.placeholders.description')"
                  :disabled="isCreating"
              />
            </div>

            <div class="form-row">
              <div class="ps-field">
                <label for="discount">{{ $t('ownerManage.promos.fields.discount') }}</label>
                <input
                    id="discount"
                    v-model.number="formData.discount"
                    type="number"
                    min="0" max="100"
                    required
                    :disabled="isCreating"
                />
              </div>
              <div class="ps-field">
                <label for="max-uses">{{ $t('ownerManage.promos.fields.maxUses') }}</label>
                <input
                    id="max-uses"
                    v-model.number="formData.maxUses"
                    type="number"
                    min="0"
                    :disabled="isCreating"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="ps-field">
                <label for="start-date">{{ $t('ownerManage.promos.fields.start') }}</label>
                <input id="start-date" v-model="formData.startDate" type="datetime-local" :disabled="isCreating" />
              </div>
              <div class="ps-field">
                <label for="end-date">{{ $t('ownerManage.promos.fields.end') }}</label>
                <input id="end-date" v-model="formData.endDate" type="datetime-local" :disabled="isCreating" />
              </div>
            </div>

            <button type="submit" class="ps-btn ps-btn--primary ps-btn--pill full" :disabled="isCreating">
              {{ isCreating ? $t('ownerManage.promos.actions.creating') : $t('ownerManage.promos.actions.publish') }}
            </button>

            <p class="error" v-if="createError">{{ createError }}</p>
          </form>

          <div class="success" v-else>
            <div class="emoji">✅</div>
            <h3>{{ $t('ownerManage.promos.success.title') }}</h3>
            <p>{{ $t('ownerManage.promos.success.body') }}</p>
            <button @click="resetForm" class="ps-btn ps-btn--ghost ps-btn--pill">
              {{ $t('ownerManage.promos.actions.createAnother') }}
            </button>
          </div>
        </div>
      </article>

      <!-- Panel: Listado -->
      <article class="card">
        <div class="card__head">
          <h3>{{ $t('ownerManage.promos.listTitle') }}</h3>
        </div>
        <div class="card__body">
          <div v-if="isLoading" class="loading">{{ $t('ownerManage.promos.loading') }}</div>

          <div v-else>
            <div class="filters">
              <input
                  v-model="filterSearch"
                  type="text"
                  :placeholder="$t('ownerManage.promos.searchPlaceholder')"
                  class="search-input"
              />
            </div>

            <div v-if="filteredPromotions.length === 0" class="empty-state">
              <p>{{ $t('ownerManage.promos.empty') }}</p>
            </div>

            <div v-for="promo in filteredPromotions" :key="promo.id" class="promo-card">
              <div class="promo-header">
                <h4>{{ promo.title }}</h4>
                <span class="badge">
                  {{ promo.discount || 0 }}% {{ $t('ownerNew.promos.labels.off') }}
                </span>
              </div>

              <p class="description" v-if="promo.description">{{ promo.description }}</p>

              <dl class="ps-dl">
                <div v-if="promo.startDate || promo.endDate" class="ps-dl__row">
                  <dt>{{ $t('ownerManage.promos.details.validity') }}</dt>
                  <dd>{{ rangeLabel(promo.startDate, promo.endDate) }}</dd>
                </div>
                <div class="ps-dl__row" v-if="promo.daysRemaining !== null">
                  <dt>{{ $t('ownerManage.promos.details.daysRemaining') }}</dt>
                  <dd>{{ promo.daysRemaining }}</dd>
                </div>
                <div class="ps-dl__row" v-if="promo.maxUses > 0">
                  <dt>{{ $t('ownerManage.promos.details.available') }}</dt>
                  <dd>{{ Math.max(promo.maxUses - (promo.currentUses || 0), 0) }} / {{ promo.maxUses }}</dd>
                </div>
              </dl>

              <div class="progress-bar" v-if="promo.maxUses > 0">
                <div class="progress-fill" :style="{ width: promo.usagePercentage + '%' }"></div>
              </div>
              <p class="usage-text" v-if="promo.maxUses > 0">{{ promo.usagePercentage }}% {{ $t('ownerManage.promos.labels.used') }}</p>

              <div class="promo-actions">
                <button class="ps-btn ps-btn--primary ps-btn--pill full">
                  {{ $t('ownerManage.promos.actions.claim') }}
                </button>
                <button
                    v-if="['owner','dueño'].includes(getCurrentUserRole())"
                    class="ps-btn ps-btn--danger ps-btn--pill"
                    @click="deletePromotion(promo.id)"
                >
                  {{ $t('ownerManage.promos.actions.delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { createPromotionUseCase } from '@/promotions/application/create-promotion.usecase.js';
import { listFeaturedPromotionsQuery } from '@/promotions/application/list-featured-promotions.query.js';
import { listPromosQuery } from '@/promotions/application/list-promos.query.js';
import { PromotionsRepository } from '@/promotions/infrastructure/promos.repository.js';

export default {
  name: 'PromotionsManagement',
  data() {
    return {
      formData: { title: '', description: '', discount: 10, startDate: '', endDate: '', maxUses: 0, huariqueId: 1 },
      isCreating: false,
      promotionCreated: false,
      createError: '',
      isLoading: false,
      promotions: [],
      filterSearch: ''
    };
  },
  computed: {
    filteredPromotions() {
      if (!this.filterSearch) return this.promotions;
      const s = this.filterSearch.toLowerCase();
      return this.promotions.filter(p =>
          (p.title || '').toLowerCase().includes(s) ||
          (p.description || '').toLowerCase().includes(s)
      );
    }
  },
  mounted() {
    this.loadPromotions();
    this._int = setInterval(() => this.loadPromotions(), 5 * 60 * 1000);
  },
  beforeUnmount() {
    if (this._int) clearInterval(this._int);
  },
  methods: {
    async handleCreatePromotion() {
      this.createError = '';
      this.isCreating = true;
      try {
        const ownerId = this.getCurrentUserId();
        const payload = {
          ...this.formData,
          isFeatured: true, featured: true, highlight: true
        };
        const result = await createPromotionUseCase(payload, ownerId);
        const ok = result?.success !== false;
        if (ok) {
          this.promotionCreated = true;
          await this.loadPromotions();
          setTimeout(() => this.resetForm(), 1800);
        } else {
          this.createError = result?.message || this.$t('ownerManage.promos.errors.createFailed');
        }
      } catch (err) {
        this.createError = err?.message || this.$t('ownerManage.promos.errors.createFailed');
      } finally {
        this.isCreating = false;
      }
    },

    async loadPromotions() {
      this.isLoading = true;
      try {
        let raw = null;
        try { raw = await listFeaturedPromotionsQuery(); } catch (_) {}
        let arr = this.normalizeArray(raw);
        if (!arr.length) {
          const all = await listPromosQuery().catch(() => []);
          arr = this.normalizeArray(all);
        }
        const now = new Date();
        const active = arr.filter(p => this.isActive(p, now))
            .map(p => this.decorate(p, now))
            .sort((a, b) => (new Date(a.endDate || '9999')) - (new Date(b.endDate || '9999')));
        this.promotions = active;
      } finally {
        this.isLoading = false;
      }
    },

    normalizeArray(result) {
      if (Array.isArray(result)) return result;
      if (result && Array.isArray(result.promotions)) return result.promotions;
      if (result && Array.isArray(result.items)) return result.items;
      return [];
    },

    isActive(p, now = new Date()) {
      const start = p?.startDate ? new Date(p.startDate) : null;
      const end   = p?.endDate   ? new Date(p.endDate)   : null;
      if (p?.maxUses > 0 && (p?.currentUses || 0) >= p.maxUses) return false;
      if (end && now > end) return false;
      if (start && now < start) return false;
      return true;
    },

    decorate(p, now = new Date()) {
      const end = p?.endDate ? new Date(p.endDate) : null;
      const msDay = 24 * 60 * 60 * 1000;
      const daysRemaining = end ? Math.max(0, Math.ceil((end - now) / msDay)) : null;

      const max = p?.maxUses || 0;
      const used = p?.currentUses || 0;
      const usagePercentage = max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0;

      return { ...p, daysRemaining, usagePercentage };
    },

    rangeLabel(start, end) {
      const loc = this.$i18n?.locale?.startsWith('en') ? 'en-US' : 'es-PE';
      const fmt = (d) => {
        if (!d) return '—';
        const dd = new Date(d);
        if (Number.isNaN(+dd)) return '—';
        return dd.toLocaleString(loc, { dateStyle: 'medium', timeStyle: 'short', hour12: false });
      };
      return `${fmt(start)} — ${fmt(end)}`;
    },

    async deletePromotion(id) {
      if (!id) return;
      if (!confirm(this.$t('ownerManage.promos.confirm.delete'))) return;
      try {
        await PromotionsRepository.delete(id);
        await this.loadPromotions();
        alert(this.$t('ownerManage.promos.alerts.deleted'));
      } catch (err) {
        console.error('Error eliminando promoción:', err);
        alert(this.$t('ownerManage.promos.alerts.deleteFailed'));
      }
    },

    resetForm() {
      this.formData = { title: '', description: '', discount: 10, startDate: '', endDate: '', maxUses: 0, huariqueId: 1 };
      this.promotionCreated = false;
      this.createError = '';
    },

    getCurrentUserId() {
      const user = JSON.parse(localStorage.getItem('ps-user') || '{}');
      return user.id || 'anonymous';
    },
    getCurrentUserRole() {
      try {
        const s = JSON.parse(localStorage.getItem('ps-session') || 'null');
        if (s && s.role) return String(s.role).toLowerCase();
      } catch (e) {}
      try {
        const u = JSON.parse(localStorage.getItem('ps-user') || '{}');
        if (u && u.role) return String(u.role).toLowerCase();
        return null;
      } catch (e) { return null; }
    }
  }
};
</script>



<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { listPlansQuery } from '../../application/list-plan.query.js'

const { t, tm, locale } = useI18n()

const serverPlans = ref([])

onMounted(async () => {
  try {
    serverPlans.value = await listPlansQuery()
  } catch (e) {
    console.warn('Plans API error:', e)
    serverPlans.value = []
  }
})

const priceById = computed(() => {
  const m = new Map()
  for (const p of serverPlans.value || []) m.set(String(p.id).toLowerCase(), p.price)
  return m
})

function formatPrice(n) {
  if (typeof n !== 'number') return ''
  if (n === 0) return t('plans.basic.price')
  const symbol = locale.value === 'es' ? 'S/' : '$'
  return `${symbol}${n}`
}

const plans = computed(() => {
  const P = tm('plans') || {}
  const get = (id, key, fb = '') => (P?.[id]?.[key] ?? fb)
  const ids = ['basic', 'premium', 'exclusive']
  return ids.map(id => {
    const priceNum = priceById.value.get(id)
    const priceText = (typeof priceNum === 'number')
        ? formatPrice(priceNum)
        : (get(id, 'price', '') || '')
    return {
      key: id,
      name: get(id, 'name', id.toUpperCase()),
      priceText,
      period: get(id, 'period', ''),
      cta: get(id, 'button', t('home.view') || 'Elegir'),
      tagline: get(id, 'tagline', ''),
      features: Array.isArray(get(id, 'features')) ? get(id, 'features') : [],
      popular: id === 'premium',
      popularText: P?.basic?.popular || 'Popular'
    }
  })
})

const router = useRouter()

function goToPayment(planKey) {
  router.push({ path: '/memberships/payment', query: { planId: planKey } })
}
</script>

<template>
  <section class="wrap plans-page">
    <header class="plans-hero">
      <h1 class="section-title">{{ $t('plans.title') }}</h1>
      <p class="section-lead">{{ $t('plans.subtitle') }}</p>
    </header>

    <div class="plans-grid">
      <article
          v-for="p in plans"
          :key="p.key"
          class="plan-card"
          :class="{ '--popular': p.popular }"
      >
        <header class="plan-head">
          <div class="plan-title">
            <h3 class="plan-name">{{ p.name }}</h3>
            <span v-if="p.popular" class="plan-badge">{{ p.popularText }}</span>
          </div>
          <div class="price">
            <span class="price-main">{{ p.priceText }}</span>
            <span v-if="p.period" class="price-period">{{ p.period }}</span>
          </div>
          <p class="plan-summary" v-if="p.tagline">{{ p.tagline }}</p>
        </header>

        <div class="features" v-if="p.features?.length">
          <span v-for="(f, i) in p.features" :key="i" class="feature-pill">{{ f }}</span>
        </div>

        <footer class="plan-cta">
          <button class="btn cta" @click="goToPayment(p.key)">{{ p.cta }}</button>
        </footer>
      </article>
    </div>

    <div class="plans-footer">
      <RouterLink to="/contact" class="plans-footer__link">
        {{ $t('plans.ctaContact') }}
      </RouterLink>
    </div>
  </section>
</template>

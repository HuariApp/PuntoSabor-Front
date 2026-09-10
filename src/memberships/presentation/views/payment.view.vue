<template>
  <section class="wrap membership-payment" aria-labelledby="title">
    <header class="page-head">
      <h1 id="title" class="section-title">{{ $t('payment.title') }}</h1>
      <p class="section-sub">{{ $t('payment.subtitle') }}</p>
    </header>

    <div class="sheet pay-container">
      <article class="card form-card pay-card">
        <!-- Resumen del plan -->
        <div class="card__head plan-head" v-if="selectedPlan">
          <div class="plan-head__title">
            <div class="price">
              <span class="price__value">S/ {{ selectedPlan.price }}</span>
              <span class="price__period">/ {{ billingCycleLabel }}</span>
            </div>
            <div class="plan-name">{{ selectedPlan.name }}</div>
          </div>
        </div>

        <!-- Métodos -->
        <div class="method-tabs">
          <button
              v-for="m in paymentMethods"
              :key="m.id"
              type="button"
              class="btn btn--tab"
              :class="{ 'is-active': selectedMethod === m.id }"
              @click="selectedMethod = m.id"
          >
            <span class="badge-ico" aria-hidden="true">{{ m.icon }}</span>
            {{ m.name }}
          </button>
        </div>

        <!-- Formulario -->
        <form class="ps-form" @submit.prevent="handlePayment">
          <!-- Tarjeta -->
          <fieldset v-if="selectedMethod === 'card'" class="ps-fieldset">
            <legend class="legend">{{ $t('payment.cardData') }}</legend>

            <div class="grid-3">
              <div class="ps-field grid-3__full">
                <label for="card-holder">{{ $t('payment.holderName') }}</label>
                <input
                    id="card-holder"
                    v-model="cardData.holderName"
                    type="text"
                    :placeholder="$t('payment.holderPh')"
                    required
                    :disabled="isProcessing"
                />
              </div>

              <div class="ps-field grid-3__full">
                <label for="card-number">{{ $t('payment.number') }}</label>
                <input
                    id="card-number"
                    v-model="cardData.cardNumber"
                    type="text"
                    :placeholder="$t('payment.numberPh')"
                    maxlength="19"
                    required
                    :disabled="isProcessing"
                    @input="formatCardNumber"
                />
              </div>

              <div class="ps-field">
                <label for="expiry-month">{{ $t('payment.month') }}</label>
                <select id="expiry-month" v-model="cardData.expiryMonth" required :disabled="isProcessing">
                  <option value="">{{ $t('payment.month') }}</option>
                  <option v-for="m in 12" :key="m" :value="String(m).padStart(2, '0')">
                    {{ String(m).padStart(2, '0') }}
                  </option>
                </select>
              </div>

              <div class="ps-field">
                <label for="expiry-year">{{ $t('payment.year') }}</label>
                <select id="expiry-year" v-model="cardData.expiryYear" required :disabled="isProcessing">
                  <option value="">{{ $t('payment.year') }}</option>
                  <option v-for="y in 10" :key="y" :value="String(new Date().getFullYear() + y - 1)">
                    {{ new Date().getFullYear() + y - 1 }}
                  </option>
                </select>
              </div>

              <div class="ps-field">
                <label for="cvv">CVV</label>
                <input id="cvv" v-model="cardData.cvv" type="text" placeholder="123" maxlength="4" required :disabled="isProcessing" />
              </div>
            </div>
          </fieldset>

          <!-- Billetera -->
          <fieldset v-if="selectedMethod === 'wallet'" class="ps-fieldset">
            <legend class="legend">{{ $t('payment.wallet') }}</legend>

            <div class="wallet-tabs">
              <button
                  v-for="w in walletOptions"
                  :key="w.id"
                  type="button"
                  class="btn btn--chip"
                  :class="{ 'is-active': selectedWallet === w.id }"
                  @click="selectedWallet = w.id"
              >
                {{ w.icon }} {{ w.name }}
              </button>
            </div>

            <div class="ps-field">
              <label for="wallet-id">{{ $t('payment.walletIdLabel', { name: getWalletName }) }}</label>
              <input
                  id="wallet-id"
                  v-model="walletData.walletId"
                  type="text"
                  :placeholder="$t('payment.walletIdPh')"
                  required
                  :disabled="isProcessing"
              />
            </div>
          </fieldset>

          <!-- Errores -->
          <div class="ps-alert ps-alert--error" v-if="errorMessage">
            <strong>{{ $t('payment.error') }}</strong>
            <ul>
              <li v-for="(err, i) in errorList" :key="i">{{ err }}</li>
            </ul>
          </div>

          <!-- Resumen -->
          <div class="summary">
            <div class="summary__row">
              <span>{{ $t('payment.amount') }}</span>
              <strong>S/ {{ selectedPlan?.price || 0 }}</strong>
            </div>
            <div class="summary__row">
              <span>{{ $t('payment.cycle') }}</span>
              <strong>{{ billingCycleLabel }}</strong>
            </div>
            <div class="summary__total">
              <span>{{ $t('payment.total') }}</span>
              <strong>S/ {{ selectedPlan?.price || 0 }}</strong>
            </div>
          </div>

          <button class="btn btn--primary btn--full pay-action" type="submit" :disabled="isProcessing">
            {{ isProcessing ? $t('payment.processing') : $t('payment.payAmount', { amount: selectedPlan?.price || 0 }) }}
          </button>
        </form>

        <!-- Éxito -->
        <div class="ps-success" v-if="paymentSuccessful">
          <div class="success-ico" aria-hidden="true">✓</div>
          <h3>{{ $t('payment.success') }}</h3>
          <p>{{ $t('payment.activated') }}</p>
          <div class="receipt" v-if="receipt">
            <p><strong>{{ $t('payment.txId') }}:</strong> {{ receipt.transactionId }}</p>
            <p><strong>{{ $t('payment.amount') }}:</strong> S/ {{ receipt.amount }}</p>
            <p><strong>{{ $t('payment.plan') }}:</strong> {{ receipt.planName }}</p>
          </div>
          <router-link class="btn btn--ghost" :to="{ name: 'plans' }">{{ $t('payment.back') }}</router-link>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { processMembershipPaymentUseCase } from '@/memberships/application/process-membership-payment.usecase.js';
import { listPlansQuery } from '@/memberships/application/list-plan.query.js';

// Si tienes getSession(), úsalo. Si no, este fallback no rompe.
function getSession() {
  try { return JSON.parse(localStorage.getItem('ps-session') || localStorage.getItem('ps-user') || '{}'); }
  catch { return {}; }
}

export default {
  name: 'MembershipPayment',
  data() {
    return {
      selectedPlan: null,
      selectedMethod: 'card',
      selectedWallet: 'yape',
      billingCycle: 'monthly',
      isProcessing: false,
      paymentSuccessful: false,
      errorMessage: '',
      errorList: [],
      receipt: null,
      cardData: { holderName: '', cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '' },
      walletData: { walletId: '' },
      paymentMethods: [
        { id: 'card', name: this.$t('payment.card'), icon: '💳' },
        { id: 'wallet', name: this.$t('payment.wallet'), icon: '📱' }
      ],
      walletOptions: [
        { id: 'yape', name: 'Yape', icon: '🟢' },
        { id: 'plin', name: 'Plin', icon: '🔵' }
      ]
    };
  },
  computed: {
    billingCycleLabel() {
      const m = { monthly: this.$t('payment.monthly'), quarterly: this.$t('payment.quarterly'), annual: this.$t('payment.annual') };
      return m[this.billingCycle] || m.monthly;
    },
    getWalletName() {
      const w = this.walletOptions.find(x => x.id === this.selectedWallet);
      return w?.name || this.$t('payment.wallet');
    }
  },
  async mounted() {
    const planId = this.$route.query?.planId || this.$route.params?.plan?.id;
    const plans = await listPlansQuery().catch(() => []);
    const found = (plans || []).find(p => String(p.id).toLowerCase() === String(planId).toLowerCase());
    this.selectedPlan = found || this.$route.params.plan || { id: 'basic', name: 'Básico', price: 0, description: '' };
  },
  methods: {
    formatCardNumber(e) {
      const value = e.target.value.replace(/\s/g, '');
      this.cardData.cardNumber = value.match(/.{1,4}/g)?.join(' ') || value;
    },
    async handlePayment() {
      this.errorMessage = ''; this.errorList = []; this.isProcessing = true;
      try {
        const userId = getSession()?.id || 'anonymous';
        const payload = {
          method: this.selectedMethod,
          amount: Number(this.selectedPlan?.price || 0),
          planId: this.selectedPlan?.id,
          planName: this.selectedPlan?.name,
          billingCycle: this.billingCycle,
          ...(this.selectedMethod === 'card' ? this.cardData : this.walletData)
        };
        const result = await processMembershipPaymentUseCase(payload, userId);
        if (result.success) { this.paymentSuccessful = true; this.receipt = result.receipt; }
        else { this.errorMessage = result.message || this.$t('payment.error'); this.errorList = result.errors || []; }
      } catch (err) {
        this.errorMessage = err?.message || this.$t('payment.errorGeneric');
      } finally {
        this.isProcessing = false;
      }
    }
  }
};
</script>


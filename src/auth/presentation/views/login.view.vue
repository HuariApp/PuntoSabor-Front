<template>
  <section class="login wrap" aria-labelledby="title">
    <div class="panel" role="region" aria-describedby="subtitle">
      <header class="head">
        <h1 id="title" class="title">{{ $t('login.title') }}</h1>
        <p id="subtitle" class="subtitle">{{ $t('login.subtitle') }}</p>
      </header>

      <form class="form" @submit.prevent="onSubmit" novalidate>
        <label class="field">
          <span class="field__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m3 7 9 6 9-6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="3" y="7" width="18" height="14" rx="2.5" stroke-width="1.8"/>
            </svg>
          </span>
          <input
              v-model.trim="email"
              class="input"
              type="email"
              inputmode="email"
              autocomplete="email"
              :placeholder="$t('login.emailPlaceholder')"
              :aria-label="$t('login.emailAria')"
              required
          />
        </label>

        <label class="field">
          <span class="field__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="4" y="10" width="16" height="10" rx="2" stroke-width="1.8"/>
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </span>
          <input
              v-model="password"
              class="input"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              :placeholder="$t('login.passwordPlaceholder')"
              :aria-label="$t('login.passwordAria')"
              required
          />
          <button
              type="button"
              class="field__toggle"
              @click="showPassword = !showPassword"
              tabindex="-1"
              :aria-label="showPassword ? $t('login.hidePassword') : $t('login.showPassword')"
          >
            <svg v-if="showPassword" viewBox="0 0 24 24" width="20" height="20">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              <circle cx="12" cy="12" r="3" stroke-width="1.6" fill="none"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="20" height="20">
              <path d="M3 3l18 18" stroke-width="1.6" stroke-linecap="round"/>
              <path d="M10.6 5.2A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a15.6 15.6 0 0 1-3.4 4.3M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7c1.2 0 2.3-.2 3.3-.6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke-width="1.6" stroke-linecap="round" fill="none"/>
            </svg>
          </button>
        </label>

        <button class="btn" type="submit" :disabled="!canSend || loading">
          <span v-if="!loading">{{ $t('login.submit') }}</span>
          <span v-else>{{ $t('login.submitting') }}</span>
        </button>

        <p class="meta">
          {{ $t('login.noAccount') }}
          <RouterLink to="/register" class="link">{{ $t('login.register') }}</RouterLink>
        </p>
        <p class="meta">
          <RouterLink to="/auth/password-recovery" class="link">
            {{ $t('login.forgotPassword') }}
          </RouterLink>
        </p>

        <transition name="toast">
          <p v-if="error" class="error" role="alert">{{ error }}</p>
        </transition>
      </form>
    </div>
  </section>
</template>

<script>
import { loginUseCase } from '../../application/login.usecase.js';

export default {
  name: 'LoginView',
  data: () => ({
    email: '',
    password: '',
    showPassword: false,
    loading: false,
    error: ''
  }),
  computed: {
    emailOk(){
      return /\S+@\S+\.\S+/.test(this.email || '');
    },
    canSend() {
      return this.emailOk && (this.password || '').length > 0;
    }
  },
  methods: {
    async onSubmit(){
      if (!this.canSend || this.loading) return;
      this.error = '';
      this.loading = true;
      try{
        await loginUseCase(this.email, this.password);
        this.$router.push('/role');
      }catch(e){
        this.error = e?.message || this.$t('login.errorDefault');
      }finally{
        this.loading = false;
        if (this.error) setTimeout(() => (this.error = ''), 2500);
      }
    }
  }
}
</script>

<style scoped>
.field {
  position: relative;
}
.field__toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #6b5a4d;
}
.field__toggle svg {
  fill: none;
  stroke: currentColor;
}
</style>

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

        <button class="btn" type="submit" :disabled="!emailOk || loading">
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
    loading: false,
    error: ''
  }),
  computed: {
    emailOk(){
      return /\S+@\S+\.\S+/.test(this.email || '');
    }
  },
  methods: {
    async onSubmit(){
      if (!this.emailOk || this.loading) return;
      this.error = '';
      this.loading = true;
      try{
        await loginUseCase(this.email);
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

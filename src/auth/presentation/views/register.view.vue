<template>
  <section class="register wrap" aria-labelledby="title">
    <div class="panel">
      <div class="left">
        <h1 id="title" class="title">{{ $t('register.title') }}</h1>

        <form class="form" @submit.prevent="onSubmit" novalidate>
          <label class="field">
            <span class="field__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 20a8 8 0 0 1 16 0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="8" r="4" stroke-width="1.8"/>
              </svg>
            </span>
            <input
                v-model.trim="name"
                class="input"
                type="text"
                inputmode="text"
                autocomplete="name"
                :placeholder="$t('register.namePlaceholder')"
                :aria-label="$t('register.nameAria')"
                required
            />
          </label>

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
                :placeholder="$t('register.emailPlaceholder')"
                :aria-label="$t('register.emailAria')"
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
                autocomplete="new-password"
                :placeholder="$t('register.passwordPlaceholder')"
                :aria-label="$t('register.passwordAria')"
                required
            />
            <button
                type="button"
                class="field__toggle"
                @click="showPassword = !showPassword"
                tabindex="-1"
                :aria-label="showPassword ? $t('register.hidePassword') : $t('register.showPassword')"
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

          <label class="field">
            <span class="field__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="4" y="10" width="16" height="10" rx="2" stroke-width="1.8"/>
                <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <input
                v-model="confirmPassword"
                class="input"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                :placeholder="$t('register.confirmPasswordPlaceholder')"
                :aria-label="$t('register.confirmPasswordAria')"
                required
            />
            <button
                type="button"
                class="field__toggle"
                @click="showConfirmPassword = !showConfirmPassword"
                tabindex="-1"
                :aria-label="showConfirmPassword ? $t('register.hidePassword') : $t('register.showPassword')"
            >
              <svg v-if="showConfirmPassword" viewBox="0 0 24 24" width="20" height="20">
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

          <p v-if="password && password.length < 6" class="hint hint--warn">
            {{ $t('register.passwordTooShort') }}
          </p>
          <p v-else-if="confirmPassword && !passwordsMatch" class="hint hint--warn">
            {{ $t('register.passwordMismatch') }}
          </p>

          <label class="terms">
            <input type="checkbox" v-model="acceptedTerms" />
            <span>
              {{ $t('register.termsPrefix') }}
              <a href="/terms" target="_blank" rel="noopener" class="link">{{ $t('register.termsLink') }}</a>
            </span>
          </label>

          <button class="btn" type="submit" :disabled="!canSend || sending">
            <span v-if="!sending">{{ $t('register.submit') }}</span>
            <span v-else>{{ $t('register.submitting') }}</span>
          </button>
        </form>

        <transition name="toast">
          <p v-if="msg" class="toast">{{ msg }}</p>
        </transition>
      </div>

      <aside class="right" aria-hidden="true">
        <div class="right__inner">
          <h2 class="hello">{{ $t('register.helloRight') }}</h2>
          <p class="sub">
            {{ $t('register.subRight') }}
          </p>
        </div>
      </aside>
    </div>
  </section>
</template>

<script>
import { registerUseCase } from '../../application/register.usecase.js';

export default {
  name: 'RegisterView',
  data: () => ({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    acceptedTerms: false,
    sending: false,
    msg: ''
  }),
  computed: {
    passwordsMatch() {
      return this.password === this.confirmPassword;
    },
    canSend() {
      const emailOk = /\S+@\S+\.\S+/.test(this.email || '');
      const passwordOk = (this.password || '').length >= 6;
      return !!this.name && emailOk && passwordOk && this.passwordsMatch && this.acceptedTerms;
    }
  },
  methods: {
    async onSubmit() {
      if (!this.canSend || this.sending) return;
      this.sending = true;
      this.msg = '';
      try {
        await registerUseCase({
          name: this.name.trim(),
          email: this.email.trim(),
          password: this.password
        });
        this.msg = this.$t('register.successToast');
        setTimeout(() => this.$router.push('/role'), 900);
      } catch (e) {
        this.msg = e?.message || this.$t('register.errorToast');
      } finally {
        this.sending = false;
        setTimeout(() => (this.msg = ''), 3000);
      }
    }
  }
};
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
.hint {
  margin: -0.25rem 0 0.5rem;
  font-size: 0.8rem;
}
.hint--warn {
  color: #b45309;
}
.terms {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.85rem;
  margin: 0.25rem 0 0.75rem;
  cursor: pointer;
}
.terms input[type="checkbox"] {
  margin-top: 0.2rem;
}
.terms .link {
  color: #d9760a;
  font-weight: 600;
  text-decoration: none;
}
.terms .link:hover {
  text-decoration: underline;
}
</style>

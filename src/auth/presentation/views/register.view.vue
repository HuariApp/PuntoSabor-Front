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
    sending: false,
    msg: ''
  }),
  computed: {
    canSend() {
      const emailOk = /\S+@\S+\.\S+/.test(this.email || '');
      return !!this.name && emailOk;
    }
  },
  methods: {
    async onSubmit() {
      if (!this.canSend || this.sending) return;
      this.sending = true;
      try {
        await registerUseCase({
          name: this.name.trim(),
          email: this.email.trim()
        });
        this.msg = this.$t('register.successToast');
        setTimeout(() => this.$router.push('/role'), 900);
      } catch (e) {
        this.msg = this.$t('register.errorToast');
      } finally {
        this.sending = false;
        setTimeout(() => (this.msg = ''), 2500);
      }
    }
  }
};
</script>

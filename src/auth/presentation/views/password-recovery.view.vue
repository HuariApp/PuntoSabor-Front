<template>
  <div class="password-recovery-container">
    <div class="recovery-card">
      <h2>{{ $t('passwordRecovery.title') }}</h2>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" v-if="!tokenSent">
        <div class="form-group">
          <label for="email">{{ $t('passwordRecovery.emailLabel') }}</label>
          <input
              id="email"
              v-model="email"
              type="email"
              :placeholder="$t('passwordRecovery.emailPlaceholder')"
              required
              :disabled="isLoading"
          />
        </div>

        <button
            type="submit"
            class="btn-primary"
            :disabled="isLoading || !email"
        >
          {{ isLoading ? $t('passwordRecovery.submitting') : $t('passwordRecovery.submit') }}
        </button>

        <!-- Acceso directo al restablecimiento con token demo o devToken -->
        <p class="inline-help">
          {{ $t('passwordRecovery.haveLink') }}
          <router-link class="link" :to="resetLink">
            {{ $t('passwordRecovery.resetNow') }}
          </router-link>
        </p>

        <p class="error" v-if="error">{{ error }}</p>
      </form>

      <!-- Éxito -->
      <div class="success-message" v-else>
        <div class="success-icon">✓</div>
        <h3>{{ $t('passwordRecovery.successTitle') }}</h3>
        <p>{{ $t('passwordRecovery.successLead') }}</p>
        <p class="email-highlight">{{ email }}</p>
        <p class="instruction-text">
          {{ $t('passwordRecovery.successNote') }}
        </p>
        <button @click="resetForm" class="btn-secondary">
          {{ $t('passwordRecovery.retry') }}
        </button>

        <!-- Link a restablecer con token -->
        <p class="inline-help">
          {{ $t('passwordRecovery.gotLink') }}
          <router-link class="link" :to="resetLink">
            {{ $t('passwordRecovery.resetNow') }}
          </router-link>
        </p>
      </div>
    </div>

    <p class="back-link">
      <router-link to="/auth/login">{{ $t('passwordRecovery.backToLogin') }}</router-link>
    </p>
  </div>
</template>

<script>
import { requestPasswordRecoveryUseCase } from '@/auth/application/request-password-recovery.usecase.js';

export default {
  name: 'PasswordRecovery',
  data() {
    return {
      email: '',
      isLoading: false,
      tokenSent: false,
      error: null,
      devToken: null // token para demo o retornado por el usecase
    };
  },
  computed: {
    // Si el usecase no devolvió token, usamos uno de demo para no caer en "enlace inválido"
    resetLink() {
      const token = this.devToken || 'demo123';
      return { path: '/auth/reset-password', query: { token } };
    }
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true;
      this.error = null;
      try {
        const result = await requestPasswordRecoveryUseCase(this.email);
        if (result.success) {
          this.tokenSent = true;
          // guarda el token si el backend/mock lo devuelve; si no, deja null (el computed caerá a demo123)
          this.devToken = result.token || this.devToken;
        } else {
          this.error = result.message;
        }
      } catch (err) {
        this.error = err.message || this.$t('passwordRecovery.errorDefault');
      } finally {
        this.isLoading = false;
      }
    },
    resetForm() {
      this.email = '';
      this.tokenSent = false;
      this.error = null;

    }
  }
};
</script>

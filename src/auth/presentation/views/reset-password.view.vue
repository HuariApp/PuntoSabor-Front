<template>
  <div class="reset-password-container">
    <div class="reset-card">
      <h2>{{ $t('resetPassword.title') }}</h2>

      <div class="error-message" v-if="tokenError">
        <h3>⚠️ {{ $t('resetPassword.invalidTitle') }}</h3>
        <p>{{ tokenError }}</p>
        <router-link to="/auth/password-recovery" class="btn-primary">
          {{ $t('resetPassword.requestNewLink') }}
        </router-link>
      </div>

      <form @submit.prevent="handleSubmit" v-else-if="!passwordReset">
        <div class="form-group">
          <label for="password">{{ $t('resetPassword.newPassword') }}</label>
          <input
              id="password"
              v-model="password"
              type="password"
              :placeholder="$t('resetPassword.minCharsPh')"
              required
              :disabled="isLoading"
          />
          <small v-if="password" :class="{ valid: password.length >= 6, invalid: password.length < 6 }">
            {{ password.length >= 6 ? '✓' : '✗' }} {{ $t('resetPassword.minChars') }}
          </small>
        </div>

        <div class="form-group">
          <label for="confirm-password">{{ $t('resetPassword.confirmPassword') }}</label>
          <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              :placeholder="$t('resetPassword.repeatPasswordPh')"
              required
              :disabled="isLoading"
          />
          <small v-if="confirmPassword" :class="{ valid: passwordsMatch, invalid: !passwordsMatch }">
            {{ passwordsMatch ? '✓' : '✗' }} {{ passwordsMatch ? $t('resetPassword.passwordsMatch') : $t('resetPassword.passwordsNoMatch') }}
          </small>
        </div>

        <button
            type="submit"
            class="btn-primary"
            :disabled="isLoading || !isFormValid"
        >
          {{ isLoading ? $t('resetPassword.updating') : $t('resetPassword.updateBtn') }}
        </button>

        <p class="error" v-if="error">{{ error }}</p>
      </form>

      <div class="success-message" v-else>
        <div class="success-icon">✓</div>
        <h3>{{ $t('resetPassword.successTitle') }}</h3>
        <p>{{ $t('resetPassword.successLead') }}</p>
        <router-link to="/auth/login" class="btn-primary">
          {{ $t('resetPassword.goToLogin') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { resetPasswordUseCase } from '@/auth/application/reset-password.usecase.js';

export default {
  name: 'ResetPassword',
  data() {
    return {
      password: '',
      confirmPassword: '',
      isLoading: false,
      passwordReset: false,
      error: null,
      tokenError: null,
      token: null
    };
  },
  computed: {
    passwordsMatch() {
      return this.password === this.confirmPassword && this.password.length > 0;
    },
    isFormValid() {
      return this.password.length >= 6 && this.passwordsMatch;
    }
  },
  mounted() {
    // Obtener token de la URL
    this.token = this.$route.query.token;
    if (!this.token) {
      // Mensaje localizado
      this.tokenError = this.$t('resetPassword.tokenMissing');
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.isFormValid) return;

      this.isLoading = true;
      this.error = null;

      try {
        const result = await resetPasswordUseCase(this.token, this.password);
        if (result.success) {
          this.passwordReset = true;
        } else {
          this.error = result.message;
        }
      } catch (err) {
        this.error = err.message || this.$t('resetPassword.errorDefault');
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

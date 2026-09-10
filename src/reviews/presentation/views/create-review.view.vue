<template>
  <div class="create-review-container">
    <div class="review-card">
      <h2>Escribir una Reseña</h2>

      <div v-if="successMessage" class="success-alert">
        <span class="icon">✓</span>
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleSubmit" v-if="!reviewSubmitted">
        <div class="form-group">
          <label for="rating">Calificación</label>
          <div class="rating-selector">
            <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="star"
                :class="{ active: rating >= star }"
                @click="rating = star"
            >
              ★
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="content">Tu Reseña</label>
          <textarea
              id="content"
              v-model="content"
              placeholder="Comparte tu experiencia... (máx 500 caracteres)"
              maxlength="5000"
              required
              rows="6"
              :disabled="isLoading"
          ></textarea>
          <div class="char-count">
            {{ content.length }} / 5000 caracteres
          </div>
        </div>

        <button
            type="submit"
            class="btn-primary"
            :disabled="isLoading || !content.trim()"
        >
          {{ isLoading ? 'Publicando...' : 'Publicar Reseña' }}
        </button>

        <p class="error" v-if="error">
          <span class="icon">⚠️</span>
          {{ error }}
        </p>

        <p class="warning" v-if="moderationWarning">
          <span class="icon">⚠️</span>
          {{ moderationWarning }}
        </p>
      </form>

      <div class="blocked-message" v-else-if="reviewBlocked">
        <div class="blocked-icon">🚫</div>
        <h3>Reseña Bloqueada</h3>
        <p>{{ blockMessage }}</p>
        <p class="info">Tu reseña ha sido marcada para revisión manual.</p>
        <button @click="resetForm" class="btn-secondary">
          Intentar Nuevamente
        </button>
      </div>

      <div class="success-message" v-else>
        <div class="success-icon">✓</div>
        <h3>¡Reseña Publicada!</h3>
        <p>Tu reseña ha sido publicada exitosamente.</p>
        <button @click="resetForm" class="btn-secondary">
          Escribir Otra Reseña
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { createReviewUseCase } from '@/reviews/application/create-review.usecase.js';
import { getSession } from '@/auth/application/get-session.query.js';

export default {
  name: 'CreateReview',
  data() {
    return {
      rating: 5,
      content: '',
      isLoading: false,
      reviewSubmitted: false,
      reviewBlocked: false,
      error: null,
      successMessage: '',
      moderationWarning: '',
      blockMessage: ''
    };
  },
  mounted() {

    const session = getSession();
    if (!session || !session.id) {

      this.$router.push('/auth');
    }
  },
  methods: {
    async handleSubmit() {
      this.error = null;
      this.moderationWarning = '';
      this.blockMessage = '';
      this.isLoading = true;

      try {
        const result = await createReviewUseCase({
          huariqueId: this.$route.params.id || this.huariqueId, // Ajusta según tu routing
          rating: this.rating,
          comment: this.content
        });

        if (result.success && result.status === 'approved') {
          this.successMessage = result.message;
          this.reviewSubmitted = true;
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else if (!result.success && result.status === 'blocked') {
          this.blockMessage = result.message;
          this.reviewBlocked = true;
        }
      } catch (err) {
        this.error = err.message || 'Error al publicar reseña';
      } finally {
        this.isLoading = false;
      }
    },

    resetForm() {
      this.rating = 5;
      this.content = '';
      this.reviewSubmitted = false;
      this.reviewBlocked = false;
      this.error = null;
      this.blockMessage = '';
    },
  }
};
</script>

<style scoped>
.create-review-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.review-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.review-card h2 {
  color: #333;
  margin-bottom: 25px;
  text-align: center;
  font-size: 24px;
}

.success-alert {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-weight: 600;
  font-size: 14px;
}

.rating-selector {
  display: flex;
  gap: 10px;
}

.star {
  background: none;
  border: 2px solid #ddd;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  color: #ddd;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.star:hover,
.star.active {
  color: #ffc107;
  border-color: #ffc107;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s;
}

textarea:focus {
  outline: none;
  border-color: #667eea;
}

textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 6px;
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-top: 20px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
  margin-top: 15px;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.error,
.warning {
  margin-top: 15px;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.error {
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

.warning {
  background: #ffeaa7;
  color: #333;
  border: 1px solid #ffd700;
}

.icon {
  font-weight: bold;
  font-size: 18px;
}

.blocked-message,
.success-message {
  text-align: center;
  padding: 30px 20px;
}

.blocked-icon,
.success-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.blocked-message h3,
.success-message h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 20px;
}

.blocked-message p,
.success-message p {
  color: #666;
  margin-bottom: 8px;
  line-height: 1.6;
}

.blocked-message .info {
  font-size: 12px;
  color: #999;
  margin-top: 15px;
}
</style>

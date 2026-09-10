<template>
  <section class="wrap admin-reviews">
    <h2 class="section-title">Panel de Reseñas (Admin)</h2>

    <div v-if="loading" class="loading">
      <p>Cargando reseñas...</p>
    </div>

    <div v-else class="reviews-table">
      <table v-if="reviews.length > 0">
        <thead>
        <tr>
          <th>ID</th>
          <th>Autor</th>
          <th>Calificación</th>
          <th>Contenido</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="r in reviews" :key="r.id" :class="{ blocked: r.status === 'blocked', pending: !r.status || r.status === 'pending' }">
          <td>{{ r.id }}</td>
          <td><strong>{{ r.by }}</strong></td>
          <td class="rating">{{ '★'.repeat(r.stars || r.rating || 0) }}</td>
          <td class="text">{{ r.text || r.content }}</td>
          <td>
            <span v-if="r.status === 'approved'" class="badge badge--ok">Aprobada</span>
            <span v-else-if="r.status === 'blocked'" class="badge badge--blocked">Bloqueada</span>
            <span v-else class="badge badge--pending">Pendiente</span>
          </td>
          <td class="actions">
            <button
                v-if="r.status !== 'approved'"
                class="btn-approve"
                @click="approveReview(r.id)"
                title="Aprobar"
            >
              ✓
            </button>
            <button class="btn-del" @click="deleteReview(r.id)" title="Eliminar">
              🗑️
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-else class="empty">
        <p>No hay reseñas aún.</p>
      </div>
    </div>
  </section>
</template>

<script>
import { listReviewsQuery } from '../../application/list-reviews.query.js';
import { ReviewsRepository } from '../../infrastructure/reviews.repository.js';
import { getSession } from '@/auth/application/get-session.query.js';

export default {
  name: 'ReviewsAdminView',
  data: () => ({
    reviews: [],
    loading: true,
    error: null
  }),
  async created() {
    // Verificar que es admin/dueño
    const session = getSession();
    if (!session || (session.role !== 'owner' && session.role !== 'admin')) {
      this.$router.push('/');
      return;
    }

    await this.loadReviews();
  },
  methods: {
    async loadReviews() {
      this.loading = true;
      try {
        this.reviews = await listReviewsQuery();
      } catch (err) {
        this.error = err.message || 'Error al cargar reseñas';
      } finally {
        this.loading = false;
      }
    },
    async deleteReview(id) {
      if (!confirm('¿Eliminar esta reseña?')) return;

      try {
        await ReviewsRepository.delete(id);
        this.reviews = this.reviews.filter(r => r.id !== id);
        alert('Reseña eliminada');
      } catch (err) {
        alert('Error al eliminar: ' + err.message);
      }
    },
    async approveReview(id) {
      try {
        const review = this.reviews.find(r => r.id === id);
        if (!review) return;

        const updated = { ...review, status: 'approved' };
        await ReviewsRepository.update(id, updated);

        // Actualizar en la lista
        const idx = this.reviews.findIndex(r => r.id === id);
        if (idx >= 0) {
          this.reviews[idx].status = 'approved';
        }
        alert('Reseña aprobada');
      } catch (err) {
        alert('Error al aprobar: ' + err.message);
      }
    }
  }
};
</script>

<style scoped>
.admin-reviews {
  padding: 20px;
}

.section-title {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty {
  text-align: center;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 8px;
  color: #666;
}

.reviews-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

table thead {
  background: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

table th {
  padding: 12px 14px;
  text-align: left;
  font-weight: 700;
  color: #333;
  font-size: 0.9rem;
}

table td {
  padding: 12px 14px;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
  color: #555;
}

table tr:hover {
  background: #fafafa;
}

table tr.blocked {
  background: #fff9f9;
}

table tr.pending {
  background: #fffbf0;
}

.rating {
  color: #ffc107;
  font-weight: 700;
  letter-spacing: 1px;
}

.text {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge--ok {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.badge--blocked {
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

.badge--neutral {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.badge--pending {
  background: #e7f3ff;
  color: #003d99;
  border: 1px solid #b3d9ff;
}

.actions {
  text-align: center;
  display: flex;
  gap: 6px;
  justify-content: center;
}

.btn-del {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-del:hover {
  background: #ffe0e0;
  transform: scale(1.1);
}

.btn-approve {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-approve:hover {
  background: #d4edda;
  transform: scale(1.1);
}
</style>

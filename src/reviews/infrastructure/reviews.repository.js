import { api } from '@/shared/infrastructure/base-api';

export const ReviewsRepository = {
    /**
     * Listar todas las reseñas
     */
    list() {
        return api('/reviews');
    },

    /**
     * Listar reseñas por huarique (ordenadas por fecha desc)
     */
    listByHuarique(huariqueId) {
        const id = Number(huariqueId);
        return api(`/reviews?huariqueId=${id}&_sort=createdAt&_order=desc`);
    },

    /**
     * Crear reseña
     * - Mantiene la lógica original: agrega createdAt si no viene en el payload
     */
    async create(payload) {
        const body = {
            ...payload,
            createdAt: payload?.createdAt ?? new Date().toISOString()
        };

        return api('/reviews', {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    /**
     * Actualizar reseña (PATCH parcial)
     */
    update(id, review) {
        return api(`/reviews/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(review)
        });
    },

    /**
     * Eliminar reseña
     */
    delete(id) {
        return api(`/reviews/${id}`, {
            method: 'DELETE'
        });
    }
};

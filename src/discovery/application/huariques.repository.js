import { api } from '@/shared/infrastructure/base-api';

/**
 * Repositorio de acceso a la API de huariques.
 */
export const HuariquesRepository = {
    /**
     * Aplica una actualización parcial (PATCH) sobre un huarique.
     * @param {number|string} id Identificador del huarique.
     * @param {object} patch Campos a modificar.
     * @returns {Promise<object>} Huarique actualizado.
     */
    patch(id, patch) {
        return api(`/huariques/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(patch),
        });
    },
};

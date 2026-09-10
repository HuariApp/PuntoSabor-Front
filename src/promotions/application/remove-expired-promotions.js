import { PromotionsRepository } from '../infrastructure/promos.repository.js';
import { PromotionEntity } from '../domain/model/promotion.entity.js';

/**
 * Detecta las promociones expiradas dentro de una lista y las elimina del
 * repositorio. Centraliza la lógica de limpieza que antes estaba duplicada
 * en las distintas queries de promociones. Los errores de borrado se
 * registran pero no interrumpen el flujo.
 *
 * @param {Array<object>} promos Promociones a evaluar.
 * @returns {Promise<number>} Cantidad de promociones expiradas eliminadas.
 */
export async function removeExpiredPromotions(promos) {
    const expired = (promos || []).filter(p => {
        try {
            if (!p.startDate || !p.endDate) return false;
            return new PromotionEntity(p).hasExpired();
        } catch {
            return false;
        }
    });

    if (expired.length) {
        try {
            await Promise.all(expired.map(p => PromotionsRepository.delete(p.id)));
        } catch (e) {
            console.warn('Error eliminando promos expiradas:', e.message || e);
        }
    }

    return expired.length;
}

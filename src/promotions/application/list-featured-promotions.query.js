import { PromotionsRepository } from '../infrastructure/promos.repository.js';
import { PromotionEntity } from '../domain/model/promotion.entity.js';
import { removeExpiredPromotions } from './remove-expired-promotions.js';

/**
 * Query: lista las promociones destacadas, activas y no expiradas.
 * Limpia primero las promociones expiradas, aplica filtros opcionales por
 * huarique/propietario, ordena por fecha de fin y devuelve una proyección
 * enriquecida (días restantes, porcentaje de uso, estado, etc.).
 *
 * @param {{ huariqueId?: number|string, ownerId?: number|string }} [filters={}] Filtros opcionales.
 * @returns {Promise<{ total: number, promotions: Array<object> }>} Total y listado de promociones destacadas.
 * @throws {Error} Si ocurre un error al consultar el repositorio.
 */
export async function listFeaturedPromotionsQuery(filters = {}) {
    try {
        const allPromos = await PromotionsRepository.list();
        await removeExpiredPromotions(allPromos);

        const freshPromos = await PromotionsRepository.list();

        const promotions = freshPromos
            .map(promo => new PromotionEntity(promo))
            .filter(promo => {

                if (!promo.featured) return false;

                if (promo.hasExpired()) {
                    return false;
                }

                if (!promo.isActive()) {
                    return false;
                }

                if (filters.huariqueId && promo.huariqueId !== filters.huariqueId) {
                    return false;
                }

                if (filters.ownerId && promo.ownerId !== filters.ownerId) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {

                return a.endDate - b.endDate;
            });

        return {
            total: promotions.length,
            promotions: promotions.map(promo => ({
                id: promo.id,
                title: promo.title,
                description: promo.description,
                huariqueId: promo.huariqueId,
                discount: promo.discount,
                daysRemaining: promo.getDaysRemaining(),
                maxUses: promo.maxUses,
                currentUses: promo.currentUses,
                usagePercentage: promo.getUsagePercentage(),
                featured: true,
                status: promo.getStatus()
            }))
        };

    } catch (error) {
        throw new Error(`Error al listar promociones: ${error.message}`);
    }
}

import { PromotionsRepository } from '../infrastructure/promos.repository.js';
import { PromotionEntity } from '../domain/model/promotion.entity.js';

/**
 * Caso de uso: crear una promoción destacada.
 * Valida título, huarique, rango de fechas y descuento antes de construir
 * la entidad `PromotionEntity` y persistirla como activa y destacada.
 *
 * @param {{ title: string, description?: string, huariqueId: number|string, discount: number, maxUses?: number, startDate: string|Date, endDate: string|Date }} promotionData
 *   Datos de la promoción.
 * @param {number|string} ownerId Identificador del propietario que la crea.
 * @returns {Promise<{ success: boolean, message: string, promotion: object, featured: boolean }>} Resultado de la creación.
 * @throws {Error} Si falta algún dato obligatorio o las validaciones de fecha/descuento fallan.
 */
export async function createPromotionUseCase(promotionData, ownerId) {
    if (!promotionData || !ownerId) {
        throw new Error('Datos de promoción y propietario requeridos');
    }

    if (!promotionData.title || promotionData.title.trim().length === 0) {
        throw new Error('Título de promoción requerido');
    }

    if (!promotionData.huariqueId) {
        throw new Error('Debe seleccionar un huarique');
    }

    if (!promotionData.startDate || !promotionData.endDate) {
        throw new Error('Fechas de inicio y fin requeridas');
    }

    const startDate = new Date(promotionData.startDate);
    const endDate = new Date(promotionData.endDate);

    if (startDate >= endDate) {
        throw new Error('La fecha de fin debe ser posterior a la de inicio');
    }

    if (startDate < new Date()) {
        throw new Error('La fecha de inicio no puede ser en el pasado');
    }

    if (promotionData.discount < 0 || promotionData.discount > 100) {
        throw new Error('El descuento debe estar entre 0 y 100');
    }

    try {

        const promotion = new PromotionEntity({
            title: promotionData.title,
            description: promotionData.description || '',
            huariqueId: promotionData.huariqueId,
            ownerId,
            discount: promotionData.discount,
            maxUses: promotionData.maxUses || 0,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            featured: true,
            status: 'active'
        });


        const savedPromotion = await PromotionsRepository.create(promotion);

        return {
            success: true,
            message: 'Promoción creada y publicada destacada',
            promotion: savedPromotion,
            featured: true
        };

    } catch (error) {
        throw new Error(`Error al crear promoción: ${error.message}`);
    }
}

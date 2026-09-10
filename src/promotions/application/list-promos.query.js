import { PromosRepository } from '../infrastructure/promos.repository.js';
import { removeExpiredPromotions } from './remove-expired-promotions.js';

/**
 * Query: lista las promociones vigentes.
 * Como efecto de mantenimiento, detecta y elimina las promociones
 * expiradas antes de devolver el listado actualizado.
 *
 * @returns {Promise<Array<object>>} Promociones vigentes tras la limpieza.
 */
export const listPromosQuery = async () => {
    const all = await PromosRepository.list();
    await removeExpiredPromotions(all);
    return await PromosRepository.list();
};

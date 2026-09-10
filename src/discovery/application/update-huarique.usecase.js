import { DiscoveryRepository } from '../infrastructure/discovery.repository';

/**
 * Caso de uso: actualiza un huarique existente.
 * @param {number|string} id Identificador del huarique a actualizar.
 * @param {object} payload Campos a modificar.
 * @returns {Promise<object>} Huarique actualizado.
 */
export async function updateHuarique(id, payload) {
    const repo = new DiscoveryRepository();
    return await repo.updateHuarique(id, payload);
}

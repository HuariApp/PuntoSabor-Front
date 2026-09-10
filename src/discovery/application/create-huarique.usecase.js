import { DiscoveryRepository } from '../infrastructure/discovery.repository';

/**
 * Caso de uso: crea un nuevo huarique en el repositorio.
 * @param {object} payload Datos del huarique a crear.
 * @returns {Promise<object>} Huarique creado.
 */
export async function createHuarique(payload) {

    const repo = new DiscoveryRepository();
    return await repo.createHuarique(payload);
}

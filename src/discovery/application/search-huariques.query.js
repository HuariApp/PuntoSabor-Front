import { DiscoveryRepository } from '../infrastructure/discovery.repository.js';

/**
 * Query: busca huariques por término y devuelve una proyección ligera
 * con solo los campos necesarios para listar resultados.
 *
 * @param {string} [q] Término de búsqueda; si es falsy se busca con cadena vacía.
 * @returns {Promise<Array<{id:number, name:string, category:string, price:number, rating:number, district:string}>>}
 *   Lista de huariques resumidos.
 */
export async function searchHuariquesQuery(q){
    const list = await DiscoveryRepository.search(q || '');
    return list.map(h => ({ id:h.id, name:h.name, category:h.category, price:h.price, rating:h.rating, district:h.district }));
}

import { DiscoveryRepository } from '../infrastructure/discovery.repository.js';

/**
 * Query: obtiene el catálogo de categorías de huariques disponibles.
 * @returns {Promise<Array<object>>} Lista de categorías.
 */
export const listCategoriesQuery = () => DiscoveryRepository.listCategories();

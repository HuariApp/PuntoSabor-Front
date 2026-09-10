import { MembershipsRepository } from '../infrastructure/memberships.repository.js';

/**
 * Query: obtiene el catálogo de planes de membresía disponibles.
 * @returns {Promise<Array<object>>} Lista de planes.
 */
export const listPlansQuery = () => MembershipsRepository.list();

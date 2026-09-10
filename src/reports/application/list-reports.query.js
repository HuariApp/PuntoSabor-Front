import { ReportsRepository } from '@/reports/infrastructure/reports.repository.js';

/**
 * Query: lista los reportes ordenados según los parámetros indicados.
 * @param {{ sort?: string, order?: 'asc'|'desc' }} [options] Campo y dirección de orden.
 * @returns {Promise<Array<object>>} Lista de reportes ordenada.
 */
export function listReportsQuery({ sort = 'createdAt', order = 'desc' } = {}) {
    return ReportsRepository.list({ _sort: sort, _order: order });
}

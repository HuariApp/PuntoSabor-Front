import { ReviewsRepository } from '../infrastructure/reviews.repository.js';

/**
 * Query: obtiene el listado completo de reseñas.
 * @returns {Promise<Array<object>>} Lista de reseñas.
 */
export const listReviewsQuery = () => ReviewsRepository.list();

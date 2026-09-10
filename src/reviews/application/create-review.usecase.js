/**
 * Caso de uso: Crear reseña con validación de contenido
 * Implementa el requisito: Detección automática de contenido inapropiado
 */

import { ReviewsRepository } from '../infrastructure/reviews.repository.js';
import { Review } from '../domain/model/reviews.entity.js';
import { ContentModerationService } from '../domain/services/content-moderation.service.js';
import { getSession } from '@/auth/application/get-session.query.js';

/**
 * Caso de uso: crear una reseña con moderación automática de contenido.
 * Requiere sesión activa, valida los datos obligatorios, revisa el
 * comentario contra el servicio de moderación y, si es apropiado, lo
 * sanitiza y persiste como una entidad de dominio `Review`.
 *
 * @param {{ huariqueId: number|string, rating: number, comment: string }} params Datos de la reseña.
 * @returns {Promise<{ success: boolean, status: 'approved'|'blocked', message: string, review?: object, requiresReview?: boolean, originalContent?: string }>}
 *   Resultado de la operación (aprobada o bloqueada por moderación).
 * @throws {Error} Si no hay sesión, faltan datos obligatorios o falla la persistencia.
 */
export async function createReviewUseCase({ huariqueId, rating, comment }) {
    // Obtener sesión actual
    const session = getSession();
    if (!session || !session.id) {
        throw new Error('Debes iniciar sesión para publicar una reseña.');
    }

    const userId = session.id; // 👈 USAMOS EL ID REAL DEL USUARIO LOGUEADO

    // Validación básica de datos obligatorios
    if (!huariqueId || !rating || !comment) {
        throw new Error('La reseña debe incluir huarique, puntuación y comentario');
    }

    // 1) Validar contenido del comentario
    const validation = ContentModerationService.validateContent(comment);

    // Soporta tanto isAppropriate como isApropriate
    const isAppropriate =
        (typeof validation?.isAppropriate !== 'undefined'
            ? validation.isAppropriate
            : validation?.isApropriate) ?? true;

    if (!isAppropriate) {
        // Marcar reseña para revisión manual
        return {
            success: false,
            status: 'blocked',
            message: validation?.reason ?? 'Se detectó contenido inapropiado en la reseña',
            requiresReview: true,
            originalContent: comment
        };
    }

    // 2) Sanitizar contenido
    const sanitizedComment = typeof ContentModerationService.sanitizeContent === 'function'
        ? ContentModerationService.sanitizeContent(comment)
        : comment;

    // 3) Crear entidad de dominio
    const review = new Review({
        huariqueId,
        userId, // 👈 AHORA SIEMPRE VIENE EL QUE ESTÁ EN SESIÓN
        rating,
        comment: sanitizedComment
    });

    // 4) Persistir usando el repositorio
    try {
        const result = await ReviewsRepository.create(review);
        return {
            success: true,
            status: 'approved',
            message: 'Reseña publicada exitosamente',
            review: result
        };
    } catch (error) {
        throw new Error(`Error al crear reseña: ${error.message}`);
    }
}
import { updateUserPreferencesByEmail } from '../infrastructure/preferences.repository';

/**
 * Caso de uso: actualiza las preferencias de descubrimiento de un usuario.
 * @param {string} email Email del usuario dueño de las preferencias.
 * @param {object} preferences Nuevas preferencias a persistir.
 * @returns {Promise<object>} Preferencias actualizadas.
 */
export async function updatePreferencesUsecase(email, preferences) {
    return await updateUserPreferencesByEmail(email, preferences);
}

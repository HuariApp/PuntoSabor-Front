import { getUserPreferencesByEmail } from '../infrastructure/preferences.repository';

/**
 * Query: obtiene las preferencias de descubrimiento de un usuario por su email.
 * @param {string} email Email del usuario.
 * @returns {Promise<object>} Preferencias del usuario.
 */
export async function getPreferencesQuery(email) {
    return await getUserPreferencesByEmail(email);
}

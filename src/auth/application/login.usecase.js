import { AuthRepository } from '../infrastructure/auth.repository.js';
import { setSession } from './get-session.query.js';

/**
 * Caso de uso: iniciar sesión.
 * Busca al usuario por email en el repositorio y, si existe, persiste la
 * sesión con los datos esenciales (normalizando el rol a "explorer" por defecto).
 *
 * @param {string} email Email del usuario que intenta autenticarse.
 * @returns {Promise<object>} Usuario autenticado.
 * @throws {Error} Si no existe un usuario con ese email.
 */
export async function loginUseCase(email) {
    const user = await AuthRepository.login(email);
    if (!user) throw new Error('Usuario no encontrado');

    setSession({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'explorer'
    });

    return user;
}

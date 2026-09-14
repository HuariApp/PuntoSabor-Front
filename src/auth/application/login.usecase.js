import { AuthRepository } from '../infrastructure/auth.repository.js';
import { setSession } from './get-session.query.js';

/**
 * Caso de uso: iniciar sesión.
 * Autentica contra el backend real (email + contraseña) y persiste
 * la sesión junto con el JWT recibido.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Sesión autenticada (incluye token).
 * @throws {Error} Si las credenciales son inválidas.
 */
export async function loginUseCase(email, password) {
    const authResult = await AuthRepository.login(email, password);

    const session = setSession({
        id: authResult.id,
        email: authResult.email,
        name: authResult.name,
        role: (authResult.role || 'consumer').toLowerCase(),
        token: authResult.token
    });

    return session;
}

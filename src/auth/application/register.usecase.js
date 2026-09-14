import { AuthRepository } from '../infrastructure/auth.repository.js';
import { setSession } from './get-session.query.js';

/**
 * Caso de uso: registrar un nuevo usuario.
 * Crea el usuario en el backend real (con contraseña) y luego inicia
 * sesión con las mismas credenciales para obtener el JWT, ya que
 * POST /users no devuelve token.
 *
 * @param {{ name: string, email: string, password: string }} params
 * @returns {Promise<object>} Sesión creada (incluye token).
 */
export async function registerUseCase({ name, email, password }) {
    await AuthRepository.register({ name, email, password, role: 'consumer' });

    // El backend no devuelve token al crear el usuario: iniciamos sesión
    // con las mismas credenciales para obtenerlo, igual que en la app móvil.
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

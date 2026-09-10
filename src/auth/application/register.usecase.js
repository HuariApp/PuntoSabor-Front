import { AuthRepository } from '../infrastructure/auth.repository.js';
import { setSession } from './get-session.query.js';

/**
 * Caso de uso: registrar un nuevo usuario.
 * Crea el usuario en el repositorio e inicia sesión automáticamente,
 * igual que el flujo de login.
 *
 * @param {{ name: string, email: string }} params Datos de registro.
 * @returns {Promise<object>} Usuario recién creado.
 */
export async function registerUseCase({ name, email }) {
    const created = await AuthRepository.register({ name, email });

    // Guarda la sesión igual que en el login
    setSession({
        id: created.id,
        email: created.email,
        name: created.name,
        role: created.role || 'explorer'
    });

    return created;
}

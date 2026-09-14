/**
 * Caso de uso: Restablecer contraseña.
 * El backend real (POST /auth/reset-password) no usa un token de un
 * solo uso: solo requiere el email registrado y la nueva contraseña.
 */

import { AuthRepository } from '../infrastructure/auth.repository.js';

/**
 * @param {string} email Email de la cuenta cuya contraseña se restablece.
 * @param {string} newPassword Nueva contraseña (mínimo 6 caracteres).
 * @returns {Promise<{ success: boolean, message: string }>}
 * @throws {Error} Si faltan datos o el backend responde con error
 *   (p. ej. email no registrado).
 */
export async function resetPasswordUseCase(email, newPassword) {
    if (!email) {
        throw new Error('Email es requerido');
    }

    if (!newPassword || newPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const result = await AuthRepository.resetPassword(email.trim(), newPassword);

    return {
        success: true,
        message: result?.message || result?.Message || 'Contraseña actualizada exitosamente',
        email
    };
}

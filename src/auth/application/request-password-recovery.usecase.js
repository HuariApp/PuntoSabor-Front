/**
 * Caso de uso: Solicitar recuperación de contraseña.
 * El backend real (POST /auth/forgot-password) no envía un correo
 * todavía: solo valida el formato y responde con un mensaje genérico,
 * sin revelar si la cuenta existe.
 */

import { AuthRepository } from '../infrastructure/auth.repository.js';

/**
 * @param {string} email Email para el cual se solicita la recuperación.
 * @returns {Promise<{ success: boolean, message: string }>}
 * @throws {Error} Si el email falta o el backend responde con error.
 */
export async function requestPasswordRecoveryUseCase(email) {
    if (!email) {
        throw new Error('Email es requerido');
    }

    const result = await AuthRepository.forgotPassword(email.trim());

    return {
        success: true,
        message: result?.message || result?.Message || 'Si la cuenta existe, recibirás instrucciones de recuperación'
    };
}

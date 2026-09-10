/**
 * Caso de uso: Restablecer contraseña
 * Valida token y actualiza la contraseña
 */

import { AuthRepository } from '../infrastructure/auth.repository.js';
import { PasswordRecoveryService } from '../domain/services/password-recovery.service.js';

/**
 * Restablece la contraseña de un usuario a partir de un token de recuperación.
 * Valida el token, actualiza la contraseña del usuario asociado y marca el
 * token como usado para que no pueda reutilizarse.
 *
 * @param {string} token Token de recuperación previamente emitido.
 * @param {string} newPassword Nueva contraseña (mínimo 6 caracteres).
 * @returns {Promise<{ success: boolean, message: string, email: string }>} Resultado de la operación.
 * @throws {Error} Si el token es inválido/expirado, faltan datos o el usuario no existe.
 */
export async function resetPasswordUseCase(token, newPassword) {
    if (!token) {
        throw new Error('Token de recuperación es requerido');
    }

    if (!newPassword || newPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    try {
        // Validar token
        const tokenData = PasswordRecoveryService.validateRecoveryToken(token);

        if (!tokenData) {
            throw new Error('Token inválido o expirado');
        }

        const { email } = tokenData;

        // Buscar usuario
        const user = await AuthRepository.findByEmail(email);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Actualizar contraseña
        const updatedUser = {
            ...user,
            password: newPassword, // En producción: hash(newPassword)
            passwordUpdatedAt: new Date().toISOString()
        };

        // Guardar cambios
        await AuthRepository.updatePassword(user.id, updatedUser);

        // Marcar token como usado
        PasswordRecoveryService.markTokenAsUsed(token);

        return {
            success: true,
            message: 'Contraseña actualizada exitosamente',
            email: user.email
        };

    } catch (error) {
        throw new Error(`Error al restablecer contraseña: ${error.message}`);
    }
}

/**
 * Servicio de recuperación de contraseña
 * Gestiona solicitudes, tokens de recuperación y restablecimiento
 */

const RECOVERY_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas
const recoveryTokens = new Map(); // En producción usar base de datos

export class PasswordRecoveryService {

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static generateRecoveryToken(email) {
        const token = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        recoveryTokens.set(token, {
            email,
            createdAt: Date.now(),
            expiresAt: Date.now() + RECOVERY_TOKEN_EXPIRY,
            used: false
        });

        return token;
    }

    static validateRecoveryToken(token) {
        const tokenData = recoveryTokens.get(token);

        if (!tokenData) {
            return null;
        }

        if (tokenData.used) {
            return null;
        }

        if (Date.now() > tokenData.expiresAt) {
            recoveryTokens.delete(token);
            return null;
        }

        return tokenData;
    }


    static markTokenAsUsed(token) {
        const tokenData = recoveryTokens.get(token);
        if (tokenData) {
            tokenData.used = true;
        }
    }

    static generateRecoveryEmail(email, token) {
        const resetLink = `${window.location.origin}/auth/reset-password?token=${token}`;

        return {
            to: email,
            subject: 'Recupera tu contraseña - PointFlavor',
            template: 'password-recovery',
            data: {
                email,
                resetLink,
                expiryHours: 24,
                message: `Haz clic en el enlace para restablecer tu contraseña. Este enlace expira en 24 horas.`
            }
        };
    }


    static cleanupExpiredTokens() {
        const now = Date.now();
        for (const [token, data] of recoveryTokens.entries()) {
            if (now > data.expiresAt) {
                recoveryTokens.delete(token);
            }
        }
    }
}


setInterval(() => {
    PasswordRecoveryService.cleanupExpiredTokens();
}, 60 * 60 * 1000);

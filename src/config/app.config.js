/**
 * Configuración global de la aplicación
 */

import { useNotifications } from '@/shared/utils/useComposables.js';
import { setupAuthMiddleware } from '@/auth/presentation/auth.middleware.js';

/**
 * Instala servicios globales en la app
 */
export function setupGlobalServices(app, router) {

    const { success, error, warning, info } = useNotifications();

    app.config.globalProperties.$notify = {
        success,
        error,
        warning,
        info
    };


    setupAuthMiddleware(router);


    app.config.errorHandler = (err, instance, info) => {
        console.error('Error global:', err, info);
        error(err.message || 'Ocurrió un error');
    };


    if (import.meta.env.DEV) {
        app.config.warnHandler = (msg, instance, trace) => {
            console.warn('Advertencia:', msg, trace);
        };
    }
}

/**
 * Configuración de constantes globales
 */
export const APP_CONFIG = {

    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    APP_NAME: 'PointFlavor',


    REQUEST_TIMEOUT: 30000,
    NOTIFICATION_DURATION: 3000,
    TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 horas


    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 128,
    MAX_CONTENT_LENGTH: 5000,
    MAX_TITLE_LENGTH: 200,


    MIN_AMOUNT: 0.01,
    MAX_AMOUNT: 999999.99,
    CARD_LENGTH: 16,
    CVV_LENGTH_MIN: 3,
    CVV_LENGTH_MAX: 4,


    MAX_DISCOUNT: 100,
    MIN_DISCOUNT: 0,


    ITEMS_PER_PAGE: 10,


    ROLES: {
        USER: 'usuario',
        OWNER: 'dueño',
        ADMIN: 'admin'
    }
};

/**
 * Configuración de mensajes globales
 */
export const MESSAGES = {
    AUTH: {
        LOGIN_SUCCESS: 'Bienvenido!',
        LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
        PASSWORD_RESET_SUCCESS: 'Contraseña actualizada exitosamente',
        PASSWORD_RESET_ERROR: 'Error al restablecer la contraseña',
        EMAIL_SENT: 'Instrucciones enviadas a tu correo',
        INVALID_CREDENTIALS: 'Email o contraseña incorrectos'
    },

    REVIEW: {
        CREATE_SUCCESS: 'Reseña publicada exitosamente',
        CREATE_ERROR: 'Error al publicar reseña',
        BLOCKED: 'Tu reseña contiene contenido inapropiado y fue bloqueada',
        DELETE_SUCCESS: 'Reseña eliminada'
    },

    PAYMENT: {
        SUCCESS: 'Pago procesado exitosamente',
        ERROR: 'Error al procesar el pago',
        INVALID_DATA: 'Datos de pago inválidos',
        INVALID_CARD: 'Número de tarjeta inválido',
        EXPIRED_CARD: 'Tarjeta expirada'
    },

    PROMOTION: {
        CREATE_SUCCESS: 'Promoción creada exitosamente',
        CREATE_ERROR: 'Error al crear promoción',
        UPDATE_SUCCESS: 'Promoción actualizada',
        DELETE_SUCCESS: 'Promoción eliminada'
    },

    GENERAL: {
        REQUIRED_FIELD: 'Este campo es requerido',
        LOADING: 'Cargando...',
        ERROR: 'Ocurrió un error',
        SUCCESS: 'Operación completada exitosamente'
    }
};

/**
 * Configuración de rutas públicas y protegidas
 */
export const ROUTES_CONFIG = {
    PUBLIC: [
        '/',
        '/auth/login',
        '/auth/register',
        '/auth/password-recovery',
        '/categories',
        '/results',
        '/map'
    ],

    PROTECTED: [
        '/reviews/create',
        '/memberships/payment',
        '/promotions/management',
        '/profile'
    ],

    ADMIN_ONLY: [
        '/admin',
        '/admin/users',
        '/admin/reports'
    ],

    OWNER_ONLY: [
        '/promotions/management',
        '/myhuariques'
    ]
};

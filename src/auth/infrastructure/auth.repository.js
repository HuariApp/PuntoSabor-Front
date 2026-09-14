import { api } from '@/shared/infrastructure/base-api';

/**
 * Acceso a los endpoints reales de autenticación del backend
 * (ASP.NET Core, JWT + bcrypt). Reemplaza la version anterior que
 * apuntaba a un mock tipo json-server sin contraseña.
 */
export const AuthRepository = {
    /**
     * POST /auth/login
     * @returns {Promise<{id:number,name:string,email:string,role:string,token:string}>}
     */
    async login(email, password) {
        return api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    /**
     * POST /users
     * El backend no devuelve token al crear el usuario, solo el recurso creado.
     * @returns {Promise<{id:number,name:string,email:string,role:string}>}
     */
    async register({ name, email, password, role = 'consumer' }) {
        return api('/users', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, role })
        });
    },

    /**
     * PATCH /users/{id}/role
     * Cambia el rol del usuario ('consumer' u 'owner').
     */
    async updateRole(userId, role) {
        return api(`/users/${userId}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ role })
        });
    },

    /** GET /users?email= (búsqueda, se mantiene por compatibilidad) */
    async findByEmail(email) {
        try {
            const users = await api(`/users?email=${encodeURIComponent(email)}`);
            return Array.isArray(users) ? users[0] || null : users;
        } catch {
            return null;
        }
    },

    /** GET /auth/users/:id — perfil público */
    async getProfile(userId) {
        return api(`/auth/users/${userId}`);
    },

    /** PATCH /auth/users/:id — solo actualiza el nombre visible */
    async updateProfile(userId, name) {
        return api(`/auth/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({ name })
        });
    },

    /**
     * POST /auth/forgot-password
     * El backend siempre responde con un mensaje genérico (no revela si el
     * email existe), y no envía un correo real todavía.
     */
    async forgotPassword(email) {
        return api('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    },

    /**
     * POST /auth/reset-password
     * El backend real no usa token de un solo uso: solo valida que el
     * email exista y reemplaza la contraseña directamente.
     */
    async resetPassword(email, newPassword) {
        return api('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email, newPassword })
        });
    }
};

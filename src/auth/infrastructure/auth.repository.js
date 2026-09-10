import { api } from '@/shared/infrastructure/base-api';

export const AuthRepository = {
    async login(email) {
        // ⚠️ Ajusta la ruta a tu API real si ya no usas /users?email=
        const users = await api(`/users?email=${encodeURIComponent(email)}`);
        // Si tu API devuelve un solo objeto, sería simplemente:
        // const user = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email }) });
        return users[0] || null;
    },

    async register(payload) {
        // Lo mismo: ajusta la ruta a tu endpoint de registro real
        return api('/users', { method: 'POST', body: JSON.stringify(payload) });
    },

    async findByEmail(email) {
        const users = await api(`/users?email=${encodeURIComponent(email)}`);
        return users[0] || null;
    },

    async updatePassword(userId, userData) {
        return api(`/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(userData)
        });
    }
};

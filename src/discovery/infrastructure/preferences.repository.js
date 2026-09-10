import { api } from '@/shared/infrastructure/base-api';

const RESOURCE = '/users';

const defaultPrefs = {
    cuisines: [],
    maxPrice: null,
    district: '',
    nearOnly: false,
};

async function findUserByEmail(email) {
    const data = await api(`${RESOURCE}?email=${encodeURIComponent(email)}`);
    if (!Array.isArray(data) || !data.length) {
        throw new Error(`Usuario no encontrado para email ${email}`);
    }
    return data[0]; // { id, name, email, preferences? }
}

export async function getUserPreferencesByEmail(email) {
    const user = await findUserByEmail(email);
    return user.preferences || defaultPrefs;
}

export async function updateUserPreferencesByEmail(email, preferences) {
    const user = await findUserByEmail(email);

    const data = await api(`${RESOURCE}/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ preferences }),
    });

    return data.preferences;
}

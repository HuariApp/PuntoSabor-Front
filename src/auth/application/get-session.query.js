// src/auth/application/get-session.query.js

/**
 * Manejo de la sesión del usuario persistida en `localStorage`.
 * Soporta una clave heredada (`ps-user`) para mantener compatibilidad
 * con datos guardados por versiones anteriores de la app.
 */

const KEY = 'ps-session';
const LEGACY_KEY = 'ps-user';


/**
 * Obtiene la sesión actual desde `localStorage`.
 * Normaliza el rol a minúsculas y tolera datos corruptos devolviendo `null`.
 * @returns {object|null} Datos de sesión o `null` si no hay sesión válida.
 */
export function getSession() {
    try {

        const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
        if (!raw) return null;

        const data = JSON.parse(raw);
        if (data?.role) data.role = String(data.role).toLowerCase(); // normaliza
        return data;
    } catch {
        return null;
    }
}

/**
 * Fusiona datos parciales con la sesión existente y la persiste.
 * @param {object} partial Campos a actualizar o agregar a la sesión.
 * @returns {object} Sesión resultante tras la fusión.
 */
export function setSession(partial) {
    const prev = getSession() || {};
    const next = { ...prev, ...partial };
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
}

/**
 * Elimina la sesión actual y la clave heredada de `localStorage`.
 */
export function clearSession() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(LEGACY_KEY);
}

export default { getSession, setSession, clearSession };

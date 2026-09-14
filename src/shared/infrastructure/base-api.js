import { BASE_ENDPOINT } from './base-endpoint';
import { getSession } from '@/auth/application/get-session.query.js';

/**
 * Construye una query string a partir de un objeto de parámetros.
 * Ignora los valores `null`, `undefined` y cadenas vacías.
 *
 * @param {Record<string, string|number|boolean>} [params] Parámetros a serializar.
 * @returns {string} Query string con `?` inicial, o cadena vacía si no hay parámetros.
 */
function buildQueryString(params) {
    if (!params || typeof params !== 'object') return '';
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== null && value !== undefined && value !== '') {
            search.append(key, value);
        }
    }
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}

/**
 * Cliente HTTP mínimo sobre `fetch` compartido por todos los repositorios.
 * Antepone la URL base, normaliza el método, agrega la cabecera JSON por
 * defecto y centraliza el manejo de errores y el parseo de la respuesta.
 *
 * @param {string} path Ruta relativa al endpoint base (p. ej. "/users").
 * @param {RequestInit & { params?: Record<string, string|number|boolean> }} [opts={}]
 *   Opciones nativas de `fetch` (method, body, headers, ...) más `params` opcional
 *   que se serializa automáticamente como query string.
 * @returns {Promise<any>} JSON parseado si la respuesta es JSON; texto en caso contrario.
 * @throws {Error} Si la respuesta HTTP no es exitosa (status fuera de 2xx).
 */
/**
 * Extrae un mensaje legible del cuerpo de error del backend.
 * Soporta el ErrorResource propio ({ message } o { Message }) y el
 * ProblemDetails que ASP.NET genera automáticamente por validación
 * de modelo ({ title, errors: { Campo: ["mensaje", ...] } }).
 *
 * @param {string} rawBody Cuerpo crudo de la respuesta (texto).
 * @param {number} status Código HTTP de la respuesta.
 * @returns {string} Mensaje amigable para mostrar al usuario.
 */
function extractErrorMessage(rawBody, status) {
    if (rawBody) {
        try {
            const data = JSON.parse(rawBody);
            if (data.message) return data.message;
            if (data.Message) return data.Message;
            if (data.errors && typeof data.errors === 'object') {
                const firstField = Object.values(data.errors)[0];
                if (Array.isArray(firstField) && firstField[0]) return firstField[0];
            }
            if (data.title) return data.title;
        } catch {
            // no era JSON, seguimos al mensaje por defecto
        }
    }
    switch (status) {
        case 400: return 'Datos inválidos. Revisa la información ingresada.';
        case 401: return 'Correo o contraseña incorrectos.';
        case 404: return 'No se encontró el recurso solicitado.';
        case 409: return 'El recurso ya existe.';
        default: return status >= 500
            ? 'Error del servidor. Intenta nuevamente.'
            : `Ocurrió un error (${status}). Intenta de nuevo.`;
    }
}

export async function api(path, opts = {}) {
    const base = BASE_ENDPOINT();
    const { params, ...fetchOpts } = opts;
    const url = `${base}${path}${buildQueryString(params)}`;
    const method = (fetchOpts.method || 'GET').toUpperCase();
    console.info('[api]', method, url);

    const session = getSession();
    const authHeader = session?.token ? { Authorization: `Bearer ${session.token}` } : {};

    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...authHeader, ...(fetchOpts.headers || {}) },
        ...fetchOpts
    });
    if (!res.ok) {
        const body = await res.text();
        console.error('[api]', method, url, res.status, res.statusText, body);
        throw new Error(extractErrorMessage(body, res.status));
    }
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
}

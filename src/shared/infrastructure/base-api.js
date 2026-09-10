import { BASE_ENDPOINT } from './base-endpoint';

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
export async function api(path, opts = {}) {
    const base = BASE_ENDPOINT();
    const { params, ...fetchOpts } = opts;
    const url = `${base}${path}${buildQueryString(params)}`;
    const method = (fetchOpts.method || 'GET').toUpperCase();
    console.info('[api]', method, url);

    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...(fetchOpts.headers || {}) },
        ...fetchOpts
    });
    if (!res.ok) {
        const body = await res.text();
        console.error('[api]', method, url, res.status, res.statusText, body);
        throw new Error(`${res.status} ${res.statusText}`);
    }
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
}

/**
 * Resuelve la URL base del backend a partir de la variable de entorno
 * `VITE_API_URL`, con un valor por defecto para desarrollo local.
 * Se elimina la barra final para poder concatenar rutas de forma segura.
 *
 * @returns {string} URL base sin barra final (p. ej. "http://localhost:5048").
 */
export const BASE_ENDPOINT = () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:5048';
    return url.replace(/\/$/, '');
};

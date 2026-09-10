/**
 * Servicio de favoritos persistido en `localStorage`.
 * Guarda una copia ligera de cada huarique para poder listar favoritos
 * sin depender de una nueva llamada al backend.
 */

const STORAGE_KEY = 'ps-favorites';

/**
 * Lee y valida la lista de favoritos almacenada.
 * @returns {Array<object>} Lista de favoritos; array vacío si no hay datos o son inválidos.
 */
function load() {
    if (typeof localStorage === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

/**
 * Persiste la lista de favoritos en `localStorage`.
 * @param {Array<object>} list Lista completa a guardar.
 */
function save(list) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/**
 * Devuelve todos los huariques marcados como favoritos.
 * @returns {Array<object>} Lista de favoritos.
 */
export function getFavorites() {
    return load();
}

/**
 * Indica si un huarique está en favoritos.
 * @param {number|string} id Identificador del huarique.
 * @returns {boolean} `true` si el huarique está marcado como favorito.
 */
export function isFavorite(id) {
    const list = load();
    return list.some(h => Number(h.id) === Number(id));
}

/**
 * Devuelve la cantidad de huariques guardados como favoritos.
 * @returns {number} Total de favoritos.
 */
export function countFavorites() {
    return load().length;
}

/**
 * Obtiene un favorito concreto por su identificador.
 * @param {number|string} id Identificador del huarique.
 * @returns {object|null} El favorito encontrado o `null` si no existe.
 */
export function getFavoriteById(id) {
    const list = load();
    return list.find(h => Number(h.id) === Number(id)) ?? null;
}

/**
 * Elimina todos los favoritos almacenados.
 * @returns {Array<object>} Lista vacía tras la limpieza.
 */
export function clearFavorites() {
    save([]);
    return [];
}

/**
 * Alterna el estado de favorito de un huarique: lo agrega si no existe
 * o lo elimina si ya estaba guardado.
 * @param {object} huarique Huarique a alternar (se persiste una copia ligera).
 * @returns {Array<object>} Lista actualizada de favoritos.
 */
export function toggleFavorite(huarique) {
    const list = load();
    const id = Number(huarique.id);
    const idx = list.findIndex(h => Number(h.id) === id);

    let updated;
    if (idx === -1) {
        const item = {
            id,
            name: huarique.name,
            category: huarique.category,
            district: huarique.district,
            address: huarique.address,
            imgUrl: huarique.imgUrl,
            price: huarique.price,
            rating: huarique.rating
        };
        updated = [...list, item];
    } else {
        updated = list.filter(h => Number(h.id) !== id);
    }

    save(updated);
    return updated;
}

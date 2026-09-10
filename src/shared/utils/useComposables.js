import { ref, computed } from 'vue';

/**
 * Composable para manejar el estado de operaciones asíncronas
 * (carga, error y datos) de forma reactiva y reutilizable.
 *
 * @returns {{
 *   isLoading: import('vue').Ref<boolean>,
 *   isError: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<string|null>,
 *   data: import('vue').Ref<any>,
 *   execute: (asyncFn: () => Promise<any>) => Promise<any>,
 *   reset: () => void
 * }} Estado reactivo y helpers para ejecutar/reiniciar la operación.
 */
export function useAsyncState() {
    const isLoading = ref(false);
    const isError = ref(false);
    const error = ref(null);
    const data = ref(null);

    const execute = async (asyncFn) => {
        isLoading.value = true;
        isError.value = false;
        error.value = null;

        try {
            data.value = await asyncFn();
            return data.value;
        } catch (err) {
            isError.value = true;
            error.value = err.message || 'Error desconocido';
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const reset = () => {
        isLoading.value = false;
        isError.value = false;
        error.value = null;
        data.value = null;
    };

    return {
        isLoading,
        isError,
        error,
        data,
        execute,
        reset
    };
}


/**
 * Composable de notificaciones tipo "toast" en memoria.
 * Cada notificación se auto-elimina tras `duration` ms (si es mayor a 0).
 *
 * @returns {object} Lista reactiva de notificaciones y helpers para crearlas
 *   por tipo (`success`, `error`, `warning`, `info`) o limpiarlas.
 */
export function useNotifications() {
    const notifications = ref([]);

    /**
     * Agrega una notificación y programa su eliminación automática.
     * @param {string} message Texto a mostrar.
     * @param {'info'|'success'|'error'|'warning'} [type='info'] Tipo de notificación.
     * @param {number} [duration=3000] Duración en ms; 0 para que sea persistente.
     * @returns {number} Id único de la notificación creada.
     */
    const addNotification = (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        const notification = {
            id,
            message,
            type
        };

        notifications.value.push(notification);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    };

    const removeNotification = (id) => {
        const index = notifications.value.findIndex(n => n.id === id);
        if (index !== -1) {
            notifications.value.splice(index, 1);
        }
    };

    const success = (message, duration = 3000) => addNotification(message, 'success', duration);
    const error = (message, duration = 5000) => addNotification(message, 'error', duration);
    const warning = (message, duration = 3000) => addNotification(message, 'warning', duration);
    const info = (message, duration = 3000) => addNotification(message, 'info', duration);

    const clear = () => {
        notifications.value = [];
    };

    return {
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        warning,
        info,
        clear
    };
}


/**
 * Composable de autenticación en memoria respaldado por `localStorage`.
 * Expone el usuario actual, un flag reactivo de autenticación y métodos
 * para iniciar/cerrar sesión, restaurarla al cargar y actualizar datos.
 *
 * @returns {object} Estado y acciones de autenticación.
 */
export function useAuth() {
    const currentUser = ref(null);
    const isAuthenticated = computed(() => currentUser.value !== null);

    const login = (user) => {
        currentUser.value = user;
        localStorage.setItem('ps-user', JSON.stringify(user));
    };

    const logout = () => {
        currentUser.value = null;
        localStorage.removeItem('ps-user');
    };

    const initializeAuth = () => {
        const stored = localStorage.getItem('ps-user');
        if (stored) {
            try {
                currentUser.value = JSON.parse(stored);
            } catch {
                logout();
            }
        }
    };

    const updateUser = (updates) => {
        if (currentUser.value) {
            currentUser.value = { ...currentUser.value, ...updates };
            localStorage.setItem('ps-user', JSON.stringify(currentUser.value));
        }
    };

    return {
        currentUser,
        isAuthenticated,
        login,
        logout,
        initializeAuth,
        updateUser
    };
}


/**
 * Composable de paginación en cliente sobre una colección ya cargada.
 *
 * @param {Array<any>} [items=[]] Colección completa a paginar.
 * @param {number} [pageSize=10] Cantidad de elementos por página.
 * @returns {object} Página actual, total de páginas, items paginados y navegación.
 */
export function usePagination(items = [], pageSize = 10) {
    const currentPage = ref(1);

    const totalItems = computed(() => items.length);
    const totalPages = computed(() => Math.ceil(totalItems.value / pageSize));

    const paginatedItems = computed(() => {
        const start = (currentPage.value - 1) * pageSize;
        const end = start + pageSize;
        return items.slice(start, end);
    });

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page;
        }
    };

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
        }
    };

    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };

    const resetPagination = () => {
        currentPage.value = 1;
    };

    return {
        currentPage,
        totalPages,
        paginatedItems,
        goToPage,
        nextPage,
        prevPage,
        resetPagination,
        totalItems
    };
}

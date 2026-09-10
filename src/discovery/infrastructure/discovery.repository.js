import { api } from '@/shared/infrastructure/base-api';

export const DiscoveryRepository = {
    listCategories() {
        return api('/categories');
    },

    search(q) {
        const query = typeof q === 'string' ? encodeURIComponent(q) : '';
        return api(`/huariques?q=${query}`);
    },

    nearYou() {
        return api('/huariques?near=true');
    },

    getHuariqueById(id) {
        return api(`/huariques/${id}`);
    },

    /**
     * Crea un huarique
     * @param {{name:string, categoryId:string, address:string, phone?:string, imgUrl?:string, description?:string}} dto
     */
    createHuarique(dto) {
        const now = new Date().toISOString();
        return api('/huariques', {
            method: 'POST',
            json: { ...dto, createdAt: now, updatedAt: now }
        });
    },

    /**
     * Actualiza campos de un huarique
     * @param {number|string} id
     * @param {Partial<{name:string, categoryId:string, address:string, phone:string, imgUrl:string, description:string}>} dto
     */
    updateHuarique(id, dto) {
        return api(`/huariques/${id}`, {
            method: 'PATCH',
            json: { ...dto, updatedAt: new Date().toISOString() }
        });
    }
};



import { api } from '@/shared/infrastructure/base-api';

export const PromotionsRepository = {
    list() {
        return api('/promos');
    },
    create(promotion) {
        return api('/promos', {
            method: 'POST',
            body: JSON.stringify(promotion)
        });
    },
    getById(id) {
        return api(`/promos/${id}`);
    },
    update(id, data) {
        return api(`/promos/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },
    delete(id) {
        return api(`/promos/${id}`, {
            method: 'DELETE'
        });
    }
};

export const PromosRepository = PromotionsRepository;

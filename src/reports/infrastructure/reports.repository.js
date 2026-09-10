import { api } from '@/shared/infrastructure/base-api';

/**
 * Repository de Reports (json-server: /reports)
 * Estructura esperada:
 *  id, huariqueId, field(address|hours|status), currentValue, suggestedValue,
 *  comment, status(open|applied), createdAt, resolvedAt, userId
 */
export const ReportsRepository = {

    list(params = {}) {
        const qs = new URLSearchParams(params).toString();
        return api(`/reports${qs ? `?${qs}` : ''}`);
    },


    listByHuarique(huariqueId) {
        const id = Number(huariqueId);
        return api(`/reports?huariqueId=${id}&_sort=createdAt&_order=desc`);
    },


    create(payload) {
        const body = {
            ...payload,
            status: payload?.status ?? 'open',
            createdAt: payload?.createdAt ?? new Date().toISOString(),
        };
        return api('/reports', {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    patch(id, patch) {
        return api(`/reports/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(patch),
        });
    },
};

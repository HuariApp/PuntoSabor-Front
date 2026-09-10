import { api } from '@/shared/infrastructure/base-api';

export const MembershipsRepository = {
    list() {
        return api('/plans');
    },
    createSubscription(subscription) {
        return api('/subscriptions', {
            method: 'POST',
            body: JSON.stringify(subscription)
        });
    },
    getSubscriptionByUser(userId) {
        return api(`/subscriptions?userId=${userId}`);
    },
    updateSubscription(subscriptionId, data) {
        return api(`/subscriptions/${subscriptionId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }
};

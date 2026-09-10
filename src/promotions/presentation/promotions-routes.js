// Rutas del módulo Promotions
const PromosView = () => import('./views/promos.view.vue');
const PromotionsManagement = () => import('./views/promotions-management.view.vue');

export default [
    {
        path: '/promos',
        name: 'promos',
        component: PromosView,
        meta: { title: 'Promos' }
    },
    {
        path: '/owner/promos',
        name: 'owner-promos',
        component: PromotionsManagement,
        // Tu router.js ya respeta requiresOwner en beforeEach
        meta: { title: 'Gestionar Promos', requiresOwner: true }
    }
];

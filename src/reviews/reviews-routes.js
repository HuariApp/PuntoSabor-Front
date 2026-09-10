export default [
    // Rutas por huarique
    {
        path: '/huariques/:huariqueId/reviews/new',
        name: 'review-new',
        component: () => import('./presentation/views/review-new.view.vue'),
        meta: { title: 'Nueva reseña' }
    },
    {
        path: '/huariques/:huariqueId/reviews',
        name: 'reviews',
        component: () => import('./presentation/views/reviews.view.vue'),
        meta: { title: 'Reseñas' }
    },

    // Rutas generales de reviews
    {
        path: '/reviews',
        component: () => import('./presentation/views/reviews.view.vue'),
        meta: { title: 'Reseñas' }
    },
    {
        path: '/reviews/create',
        component: () => import('./presentation/views/create-review.view.vue'),
        meta: { requiresAuth: true, title: 'Escribir Reseña' }
    },
    {
        path: '/reviews/admin',
        component: () => import('./presentation/views/reviews-admin.view.vue'),
        meta: { requiresOwner: true, title: 'Gestionar Reseñas' }
    }
];

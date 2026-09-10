export default [
    { path: '/categories', component: () => import('./views/categories.view.vue') },
    { path: '/results', component: () => import('./views/results.view.vue') },
    { path: '/map', component: () => import('./views/map.view.vue') },
    {
        path: '/favorites',
        component: () => import('./views/favorites.view.vue'),
        meta: { requiresAuth: true, title: 'Mis favoritos' }
    },

    {
        path: '/preferences',
        name: 'preferences',
        component: () => import('./views/preferences.view.vue'),
        meta: { requiresAuth: true, title: 'Mis preferencias' }
    },

    {
        path: '/owner/huariques/new',
        name: 'owner-huarique-new',
        component: () => import('./views/owner-huarique-new.view.vue'),
        meta: { requiresOwner: true, title: 'Registrar huarique' }
    },
    {
        path: '/owner/huariques/:id/edit',
        name: 'owner-huarique-edit',
        component: () => import('./views/owner-huarique-edit.view.vue'),
        meta: { requiresOwner: true, title: 'Editar huarique' }
    }
];

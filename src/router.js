import { createRouter, createWebHistory } from 'vue-router';
import { getSession } from '@/auth/application/get-session.query';

const Home = () => import('./shared/presentations/views/home.view.vue');
const NotFound = () => import('./shared/presentations/views/page-not-found.view.vue');

import authRoutes from './auth/presentation/auth-routes.js';
import discoveryRoutes from './discovery/presentation/discovery-routes.js';
import promotionsRoutes from './promotions/presentation/promotions-routes.js';
import reviewsRoutes from './reviews/reviews-routes.js';
import membershipsRoutes from './memberships/presentation/memberships-routes.js';
import contactRoutes from './contact/presentation/contact-routes.js';
import reportsRoutes from './reports/presentation/reports-routes.js';


const routes = [

    { path: '/', name: 'home', component: Home, meta: { title: 'PointFlavor' } },

    ...authRoutes,
    ...discoveryRoutes,
    ...promotionsRoutes,
    ...reviewsRoutes,
    ...membershipsRoutes,
    ...contactRoutes,
    ...reportsRoutes,

    {
        path: '/profile',
        name: 'profile',
        component: () => import('./shared/presentations/views/profile.view.vue'),
        meta: { requiresAuth: true, title: 'Mi perfil' }
    },

    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { title: 'Página no encontrada' } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() { return { top: 0 }; }
});

router.beforeEach(async (to) => {

    if (to.meta?.requiresAuth) {
        try {
            const session = getSession();
            if (!session || !session.id) return { path: '/auth' };
        } catch {
            return { path: '/auth' };
        }
    }

    if (to.meta?.requiresOwner) {
        try {
            const session = getSession();
            if (!session || session.role !== 'owner') return { path: '/role' };
        } catch {
            return { path: '/auth' };
        }
    }
    return true;
});

router.afterEach((to) => {
    const base = 'PointFlavor';
    const title = to.meta?.title ? `${to.meta.title} · ${base}` : base;
    if (typeof document !== 'undefined') document.title = title;
});

export default router;

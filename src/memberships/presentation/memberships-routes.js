export default [
    {
        path: '/plans',
        name: 'plans',
        component: () => import('./views/plans.view.vue'),
        meta: { title: 'Planes de membresía' }
    },
    {

        path: '/memberships/payment/:planId?',
        name: 'payment',
        component: () => import('./views/payment.view.vue'),
        meta: { title: 'Procesar Pago', requiresAuth: true },
        props: route => ({

            planId: route.params.planId || route.query.planId || null
        })
    }
];

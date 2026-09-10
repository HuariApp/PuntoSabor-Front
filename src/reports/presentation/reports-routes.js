export default [
    {
        path: '/reports/new/:id',
        name: 'report-issue',
        component: () => import('./views/report-issue.page.vue'),
        props: (route) => ({
            id: String(route.params.id || ''),
            name: route.query.name || '',
            address: route.query.address || '',
            hours: route.query.hours || ''
        }),
        meta: { title: 'Reportar información' }
    },
    {
        path: '/reports',
        name: 'report-center',
        component: () => import('./views/report-center.view.vue'),
        meta: { title: 'Centro de reportes' }
    }
]

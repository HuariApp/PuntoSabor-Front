export default [
    { path: '/auth', component: () => import('./views/login.view.vue') },
    { path: '/auth/login', component: () => import('./views/login.view.vue') },
    { path: '/auth/register', component: () => import('./views/register.view.vue') },
    { path: '/auth/password-recovery', component: () => import('./views/password-recovery.view.vue') },
    { path: '/auth/reset-password', component: () => import('./views/reset-password.view.vue') },
    { path: '/register', component: () => import('./views/register.view.vue') },
    { path: '/role', component: () => import('./views/role-select.view.vue') }
];

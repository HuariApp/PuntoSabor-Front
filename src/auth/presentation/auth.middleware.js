import { useAuth } from '@/shared/utils/useComposables.js';
import { getSession } from '@/auth/application/get-session.query.js';

export function setupAuthMiddleware(router) {
    const { currentUser, initializeAuth } = useAuth();

    const protectedRoutes = [
        '/reviews/create',
        '/memberships/payment',
        '/promotions/management',
        '/profile'
    ];

    const guestOnlyRoutes = [
        '/auth/login',
        '/auth/register',
        '/auth/password-recovery',
        '/auth/reset-password',
    ];

    const roleProtectedRoutes = {

        '/promotions/management': ['owner', 'dueño'],
        '/admin': 'admin'
    };

    router.beforeEach((to, from, next) => {
        initializeAuth();

        const isAuthenticated = currentUser.value !== null;
        const isProtected = protectedRoutes.includes(to.path);
        const isGuestOnly = guestOnlyRoutes.includes(to.path);
        const requiredRole = roleProtectedRoutes[to.path];

        if (isGuestOnly && isAuthenticated) {
            return next('/');
        }

        if (isProtected && !isAuthenticated) {
            sessionStorage.setItem('redirectAfterLogin', to.fullPath);
            return next('/auth/login');
        }

        if (requiredRole && isAuthenticated) {
            const session = getSession();
            const userRole = (session && session.role) ? String(session.role).toLowerCase() : (currentUser.value && currentUser.value.role ? String(currentUser.value.role).toLowerCase() : null);

            if (!userRole) {
                return next('/auth');
            }

            if (Array.isArray(requiredRole)) {
                if (!requiredRole.map(r => String(r).toLowerCase()).includes(userRole)) {
                    return next('/auth');
                }
            } else {
                if (String(requiredRole).toLowerCase() !== userRole) {
                    return next('/auth');
                }
            }
        }

        next();
    });

    router.afterEach(() => {
        const redirect = sessionStorage.getItem('redirectAfterLogin');
        if (redirect && currentUser.value) {
            sessionStorage.removeItem('redirectAfterLogin');
        }
    });
}

export function useAuthGuard() {
    const { currentUser, isAuthenticated } = useAuth();

    const requireAuth = () => {
        if (!isAuthenticated.value) {
            throw new Error('Se requiere autenticación');
        }
    };

    const requireRole = (role) => {
        requireAuth();
        if (currentUser.value.role !== role) {
            throw new Error(`Se requiere rol: ${role}`);
        }
    };

    const canAccess = (path) => {
        if (!isAuthenticated.value) return false;

        const requiredRole = {
            '/promotions/management': ['owner', 'dueño'],
            '/admin': 'admin'
        }[path];

        if (requiredRole) {
            const session = getSession();
            const userRole = (session && session.role) ? String(session.role).toLowerCase() : (currentUser.value && currentUser.value.role ? String(currentUser.value.role).toLowerCase() : null);
            if (!userRole) return false;
            if (Array.isArray(requiredRole)) {
                return requiredRole.map(r => String(r).toLowerCase()).includes(userRole);
            }
            return String(requiredRole).toLowerCase() === userRole;
        }

        return true;
    };

    return {
        requireAuth,
        requireRole,
        canAccess
    };
}

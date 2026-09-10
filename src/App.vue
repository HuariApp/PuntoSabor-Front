<template>
  <nav class="nav">
    <div class="nav__inner">
      <RouterLink class="brand" to="/">
        <img class="brand__mark" :src="smallLogo" alt="PointFlavor" />
      </RouterLink>

      <button
        class="nav__toggle"
        type="button"
        aria-label="Abrir menu"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        aria-controls="main-menu"
        @click="toggleMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div id="main-menu" :class="['nav__menu', menuOpen && 'nav__menu--open']">
        <RouterLink to="/">{{ $t('nav.home') }}</RouterLink>
        <RouterLink to="/map">{{ $t('nav.explore') }}</RouterLink>
        <RouterLink to="/promos">{{ $t('nav.promos') }}</RouterLink>
        <RouterLink to="/plans">{{ $t('nav.plans') }}</RouterLink>
        <RouterLink to="/contact">{{ $t('nav.contact') }}</RouterLink>

        <div class="nav__actions">
          <LanguageSwitcher inline />
          <template v-if="!isLoggedIn">
            <RouterLink class="btn" to="/auth" @click="closeAllMenus">{{ $t('nav.signin') }}</RouterLink>
          </template>

          <template v-else>
            <div class="user-menu" @click.stop>
              <button
                class="user-menu__toggle"
                type="button"
                :aria-expanded="userMenuOpen ? 'true' : 'false'"
                @click="toggleUserMenu"
              >
                <span class="user-avatar" aria-hidden="true">{{ userInitials }}</span>
                <span class="user-name">{{ userName }}</span>
              </button>

              <div v-if="userMenuOpen" class="user-menu__panel">
                <RouterLink to="/favorites" @click="closeAllMenus">{{ $t('nav.favorites') }}</RouterLink>
                <RouterLink to="/preferences" @click="closeAllMenus">{{ $t('nav.preferences') }}</RouterLink>
                <RouterLink to="/profile" @click="closeAllMenus">{{ $t('nav.profile') }}</RouterLink>
                <button class="btn btn--logout" @click="logout">Salir</button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <RouterView />

  <footer class="footer">
    <div class="wrap">
      <RouterLink class="brand" to="/" style="color:#fff">
        <img class="brand__mark brand__mark--footer" :src="smallLogo" alt="PointFlavor" />
      </RouterLink>
      <small>© 2025 FijasDev</small>
    </div>
  </footer>
</template>

<script>
import { getSession, clearSession } from '@/auth/application/get-session.query.js';
import smallLogo from '@/assets/slogoPuntoSabor.png';
import LanguageSwitcher from '@/shared/presentations/components/language-switcher.vue';

export default {
  name: 'App',
  components: { LanguageSwitcher },
  data: () => ({ smallLogo, session: null, loading: true, menuOpen: false, userMenuOpen: false }),
  computed: {
    isLoggedIn() {
      return this.session && this.session.id;
    },
    userName() {
      return this.session?.name || this.session?.email || 'Usuario';
    },

    userInitials() {
      const n = (this.userName || '').trim();
      if (!n) return 'U';
      const parts = n.split(/\s+/);
      const a = (parts[0]?.[0] || '').toUpperCase();
      const b = (parts[1]?.[0] || '').toUpperCase();
      return (a + b) || a || 'U';
    }
  },
  mounted() {

    this.loadSession();


    window.addEventListener('storage', this.loadSession);

    window.addEventListener('ps-session-updated', this.loadSession);

    const unlisten = this.$router.afterEach(() => {
      setTimeout(() => this.loadSession(), 50);
      this.closeAllMenus();
    });

    this._removeAfterEach = unlisten;
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.loadSession);
    window.removeEventListener('ps-session-updated', this.loadSession);
    if (typeof this._removeAfterEach === 'function') this._removeAfterEach();
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      if (this.menuOpen) this.userMenuOpen = false;
    },
    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen;
      if (this.userMenuOpen) this.menuOpen = false;
    },
    closeAllMenus() {
      this.menuOpen = false;
      this.userMenuOpen = false;
    },
    loadSession() {
      const stored = getSession();
      this.session = stored;
      this.loading = false;
    },
    logout() {
      clearSession();
      this.session = null;
      this.closeAllMenus();
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.brand {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.brand__mark{
  width: 36px;
  height: 36px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,.15));
}

.brand__mark--footer{
  width: 32px;
  height: 32px;
}

.user-label{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:6px 12px 6px 6px;
  border-radius:9999px;
  background:rgba(255,255,255,.9);
  border:1px solid rgba(0,0,0,.08);
  box-shadow:0 2px 8px rgba(0,0,0,.08);
  backdrop-filter:saturate(120%) blur(3px);
  font-weight:600;
  font-size:.9rem;
  color:#2b2b2b;
  max-width:180px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  margin:0 8px;
}

.user-label:hover{
  transform:translateY(-1px);
  box-shadow:0 6px 16px rgba(0,0,0,.12);
}

.user-avatar{
  width:26px;
  height:26px;
  border-radius:50%;
  display:grid;
  place-items:center;
  font-size:.78rem;
  font-weight:700;
  color:#fff;
  background:linear-gradient(135deg,#f59e0b,#fbbf24);
  box-shadow:inset 0 -1px 0 rgba(0,0,0,.12);
  flex:0 0 26px;
}

.user-name{
  overflow:hidden;
  text-overflow:ellipsis;
}

.btn--logout {
  background: #f44;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn--logout:hover {
  background: #d33;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .brand__mark{ width: 32px; height: 32px; }
  .user-label { padding:4px 10px 4px 4px; font-size:.8rem; max-width:140px; }
  .user-avatar{ width:22px; height:22px; font-size:.7rem; }
  .btn--logout { padding: 5px 10px; font-size: 0.8rem; }
}
</style>

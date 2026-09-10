<template>
  <section class="role wrap" aria-labelledby="title">
    <div class="panel" role="region" aria-describedby="subtitle">
      <header class="head">
        <h1 id="title" class="title">{{ $t('roleSelect.title') }}</h1>
        <p id="subtitle" class="subtitle">{{ $t('roleSelect.subtitle') }}</p>
      </header>

      <div
          class="roles"
          role="radiogroup"
          :aria-label="$t('roleSelect.radiogroupLabel')"
          @keydown.left.prevent="focusPrev()"
          @keydown.right.prevent="focusNext()"
          @keydown.space.prevent="activateFocused()"
          @keydown.enter.prevent="activateFocused()"
      >
        <button
            ref="opt0"
            class="role-card"
            :class="{ active: role==='explorer', 'is-selected': role==='explorer' }"
            role="radio"
            :aria-checked="role==='explorer'"
            :aria-label="$t('roleSelect.explorerAria')"
            @click="setRole('explorer')"
        >
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.7"/>
            </svg>
          </span>
          <span class="role-title">{{ $t('roleSelect.explorerTitle') }}</span>
          <span class="role-desc">{{ $t('roleSelect.explorerDesc') }}</span>
        </button>

        <button
            ref="opt1"
            class="role-card"
            :class="{ active: role==='owner', 'is-selected': role==='owner' }"
            role="radio"
            :aria-checked="role==='owner'"
            :aria-label="$t('roleSelect.ownerAria')"
            @click="setRole('owner')"
        >
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M3 9h18l-2-4H5l-2 4Z" />
              <path d="M5 9v10h14V9" />
              <path d="M9 19v-6h6v6" />
            </svg>
          </span>
          <span class="role-title">{{ $t('roleSelect.ownerTitle') }}</span>
          <span class="role-desc">{{ $t('roleSelect.ownerDesc') }}</span>
        </button>
      </div>

      <div class="actions">
        <button class="btn" :disabled="!role" @click="save">
          {{ $t('roleSelect.continue') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'RoleSelectView',
  data: () => ({ role: null, focusIdx: 0 }),
  mounted() {
    const persistedRole = localStorage.getItem('ps-role');
    if (persistedRole) this.role = persistedRole;
  },
  methods: {
    setRole(r){ this.role = r; },
    focusPrev(){
      this.focusIdx = this.focusIdx === 0 ? 1 : 0;
      this.$refs[`opt${this.focusIdx}`]?.focus();
    },
    focusNext(){
      this.focusIdx = this.focusIdx === 0 ? 1 : 0;
      this.$refs[`opt${this.focusIdx}`]?.focus();
    },
    activateFocused(){
      this.setRole(this.focusIdx === 0 ? 'explorer' : 'owner');
    },
    save(){
      localStorage.setItem('ps-role', this.role);
      try{
        const prev = JSON.parse(localStorage.getItem('ps-session') || '{}');
        const session = { ...prev, role: this.role };
        localStorage.setItem('ps-session', JSON.stringify(session));


        window.dispatchEvent(new Event('ps-session-updated'));
      }catch{
        localStorage.setItem('ps-session', JSON.stringify({ role: this.role }));
        window.dispatchEvent(new Event('ps-session-updated'));
      }

      setTimeout(() => {
        this.$router.push(this.role === 'owner'
            ? { name:'owner-huarique-new' }
            : { name:'home' });
      }, 100);
    }
  }
};
</script>

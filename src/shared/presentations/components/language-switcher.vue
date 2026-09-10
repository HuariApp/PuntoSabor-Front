<template>
  <div :class="['lang', inline ? 'lang--inline' : 'lang--floating']" role="group" aria-label="Language">
    <button
      type="button"
      class="lang__btn"
      :aria-pressed="current === 'es' ? 'true' : 'false'"
      title="Espanol"
      @click="switchTo('es')"
    >
      🇵🇪
    </button>
    <button
      type="button"
      class="lang__btn"
      :aria-pressed="current === 'en' ? 'true' : 'false'"
      title="English"
      @click="switchTo('en')"
    >
      🇺🇸
    </button>
  </div>
</template>

<script>
import { i18n, setLocale } from '@/i18n';

export default {
  name: 'LanguageSwitcher',
  props: {
    inline: { type: Boolean, default: false }
  },
  computed: {
    current(){ return i18n.global.locale.value; }
  },
  methods: {
    switchTo(locale){ setLocale(locale); }
  }
}
</script>

<style scoped>
.lang{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.25);
}
.lang__btn{
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 4px;
  border-radius: 999px;
  opacity: .7;
  transition: opacity .2s ease, transform .2s ease, background .2s ease;
}
.lang__btn[aria-pressed='true']{
  opacity: 1;
  background: rgba(255,255,255,.2);
}
.lang__btn:hover{ opacity: 1; transform: translateY(-1px); }
.lang--floating{
  position: fixed;
  top: 8px;
  right: 8px;
  z-index: 1200;
  background: rgba(255,255,255,.75);
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 12px rgba(0,0,0,.10);
  border: 1px solid rgba(0,0,0,.06);
}
.lang--inline{
  background: rgba(255,255,255,.12);
  color: #fff;
  backdrop-filter: blur(6px);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.12);
}
</style>

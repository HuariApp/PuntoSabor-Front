<template>
  <div class="ps-card">
    <!-- Cabecera opcional -->
    <header v-if="$slots.header" class="ps-card__header">
      <slot name="header"></slot>
    </header>

    <!-- Cuerpo principal -->
    <div class="ps-card__content">
      <slot></slot>
    </div>

    <!-- Pie opcional -->
    <footer v-if="$slots.footer" class="ps-card__footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PsCard'
};
</script>

<style scoped>
.ps-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 1.2rem;
  margin-bottom: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.ps-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.ps-card__header {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
}
.ps-card__footer {
  border-top: 1px solid #eee;
  margin-top: 1rem;
  padding-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}
</style>

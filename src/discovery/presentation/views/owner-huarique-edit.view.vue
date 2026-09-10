<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import HuariqueForm from '../components/huarique-form.vue';
import { updateHuarique } from '@/discovery/application/update-huarique.usecase';
import { DiscoveryRepository } from '@/discovery/infrastructure/discovery.repository';

const route = useRoute();
const id = route.params.id;
const model = ref({});
const loading = ref(false);

onMounted(async () => {
  const repo = new DiscoveryRepository();
  model.value = await repo.getHuariqueById(id);
});

async function onSubmit(payload){
  loading.value = true;
  try{
    await updateHuarique(id, payload);

    alert('Huarique actualizado');
  }finally{
    loading.value = false;
  }
}
</script>

<template>
  <section class="wrap" aria-labelledby="title">
    <h1 id="title" class="section-title">Editar huarique</h1>
    <HuariqueForm v-if="model && model.id" v-model="model" :submitting="loading" submitText="Guardar cambios" @submit="onSubmit"/>
  </section>
</template>

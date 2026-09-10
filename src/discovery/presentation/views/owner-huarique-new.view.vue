<template>
  <section class="wrap owner-form" aria-labelledby="title">
    <header class="page-head">
      <h1 id="title" class="section-title">{{ $t('ownerNew.title') }}</h1>
      <p class="section-sub">{{ $t('ownerNew.subtitle') }}</p>
    </header>


    <div class="sheet">
      <form class="form-grid" @submit.prevent="onSubmit">

        <div class="col">
          <section class="card">
            <div class="card__head">
              <span class="badge-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="ico-svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                        d="M8.25 3.75v6m-3-6v6m6-6v6M5.25 9.75s0 3 3 3 3-3 3-3M15.75 4.5l4.5 4.5m0-4.5-4.5 4.5M18 14.25v6"/>
                </svg>
              </span>
              <h3 class="card__title">{{ $t('ownerNew.sections.data') }}</h3>
            </div>

            <div class="card__body">
              <div class="field-row">
                <div>
                  <label>{{ $t('ownerNew.labels.name') }}</label>
                  <input v-model.trim="model.name" required :placeholder="$t('ownerNew.labels.name')" />
                </div>
                <div>
                  <label>{{ $t('ownerNew.labels.category') }}</label>
                  <select v-model="model.categoryId" required>
                    <option value="" disabled>{{ $t('ownerNew.labels.select') }}</option>
                    <option value="anticuchos">{{ $t('ownerNew.categories.anticuchos') }}</option>
                    <option value="ceviche">{{ $t('ownerNew.categories.ceviche') }}</option>
                    <option value="chifa">{{ $t('ownerNew.categories.chifa') }}</option>
                    <option value="polleria">{{ $t('ownerNew.categories.polleria') }}</option>
                  </select>
                </div>
              </div>

              <div class="field-row">
                <div>
                  <label>{{ $t('ownerNew.labels.avgPrice') }}</label>
                  <input type="number" min="0" step="0.1" v-model.number="model.avgPrice" :placeholder="$t('ownerNew.labels.avgPrice')" />
                </div>
                <div>
                  <label>{{ $t('ownerNew.labels.district') }}</label>
                  <input v-model.trim="model.district" :placeholder="$t('ownerNew.labels.district')" />
                </div>
              </div>

              <label class="check">
                <input type="checkbox" v-model="model.nearMe" />
                <span class="pill pill--ghost">{{ $t('ownerNew.labels.nearMe') }}</span>
              </label>
            </div>
          </section>

          <section class="card">
            <div class="card__head">
              <span class="badge-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="ico-svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                        d="M12 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                        d="M19.5 10.5c0 5.25-7.5 10.125-7.5 10.125S4.5 15.75 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                </svg>
              </span>
              <h3 class="card__title">{{ $t('ownerNew.sections.address') }}</h3>
            </div>

            <div class="card__body">
              <div class="field-row">
                <div>
                  <label>{{ $t('ownerNew.labels.street') }}</label>
                  <input v-model.trim="model.address" required :placeholder="$t('ownerNew.placeholders.street')" />
                </div>
                <div>
                  <label>{{ $t('ownerNew.labels.city') }}</label>
                  <input v-model.trim="model.city" :placeholder="$t('ownerNew.placeholders.city')" />
                </div>
              </div>

              <div class="field-row">
                <div>
                  <label>{{ $t('ownerNew.labels.reference') }}</label>
                  <input v-model.trim="model.reference" :placeholder="$t('ownerNew.placeholders.reference')" />
                </div>
                <div>
                  <label>{{ $t('ownerNew.labels.phone') }}</label>
                  <input v-model.trim="model.phone" :placeholder="$t('ownerNew.placeholders.phone')" />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="col">
          <section class="card">
            <div class="card__head">
              <span class="badge-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="ico-svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                        d="M12 6v6l4 2"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
              </span>
              <h3 class="card__title">{{ $t('ownerNew.sections.schedules') }}</h3>
            </div>

            <div class="card__body">
              <label class="check">
                <input type="checkbox" v-model="model.closed" />
                <span class="tag tag--warn">{{ $t('ownerNew.labels.closed') }}</span>
              </label>

              <div class="field-row align-end">
                <div>
                  <label>{{ $t('ownerNew.labels.openAt') }}</label>
                  <div class="control-with-ico">
                    <span class="ico" aria-hidden="true">
                      <svg viewBox="0 0 24 24" class="ico-svg sm">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                              d="M12 6v6l4 2"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                      </svg>
                    </span>
                    <input type="time" v-model="model.openAt" />
                  </div>
                </div>

                <div>
                  <label>{{ $t('ownerNew.labels.closeAt') }}</label>
                  <div class="control-with-ico">
                    <span class="ico" aria-hidden="true">
                      <svg viewBox="0 0 24 24" class="ico-svg sm">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                              d="M12 6v6l4 2"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                      </svg>
                    </span>
                    <input type="time" v-model="model.closeAt" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="card">
            <div class="card__head">
              <span class="badge-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="ico-svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                        d="M6 3.75 8 5.25l2-1.5 2 1.5 2-1.5 2 1.5 2-1.5V20.25l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5V3.75Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                        d="M8.25 8.25h7.5m-7.5 3h7.5m-7.5 3h4.5"/>
                </svg>
              </span>
              <h3 class="card__title">{{ $t('ownerNew.sections.services') }}</h3>
            </div>

            <div class="card__body">
              <div class="chips">
                <label class="chip">
                  <input type="checkbox" v-model="model.services.delivery" />
                  <span class="tag">{{ $t('ownerNew.labels.delivery') }}</span>
                </label>
                <label class="chip">
                  <input type="checkbox" v-model="model.services.takeaway" />
                  <span class="tag">{{ $t('ownerNew.labels.takeaway') }}</span>
                </label>
                <label class="chip">
                  <input type="checkbox" v-model="model.services.dinein" />
                  <span class="tag">{{ $t('ownerNew.labels.dinein') }}</span>
                </label>
              </div>
            </div>
          </section>

          <section class="card">
            <div class="card__head">
              <span class="badge-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="ico-svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                        d="M8.25 6.75h10.5M8.25 12h10.5M8.25 17.25h10.5M4.5 6.75h.008v.008H4.5V6.75Zm0 5.25h.008v.008H4.5V12Zm0 5.25h.008v.008H4.5v-.008Z"/>
                </svg>
              </span>
              <h3 class="card__title">{{ $t('ownerNew.sections.menu') }}</h3>
            </div>

            <div class="card__body">
              <div class="menu-row">
                <input :placeholder="$t('ownerNew.labels.itemName')" v-model.trim="menuItem.name" />
                <input type="number" min="0" step="0.1" :placeholder="$t('ownerNew.labels.price')" v-model.number="menuItem.price" />
                <input :placeholder="$t('ownerNew.labels.section')" v-model.trim="menuItem.section" />
                <button type="button" class="btn-ghost" :disabled="!menuItem.name" @click="addItem">
                  {{ $t('ownerNew.labels.addItem') }}
                </button>
              </div>

              <ul class="menu-list">
                <li v-for="(it, i) in model.menu" :key="i">
                  <span>{{ it.name }} — S/ {{ it.price }} ({{ it.section }})</span>
                  <button type="button" class="icon" @click="removeItem(i)" :aria-label="$t('ownerNew.labels.remove')">✕</button>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <div class="actions">
          <button class="btn" type="submit" :disabled="!canSave">{{ $t('ownerNew.labels.save') }}</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { createHuarique } from '@/discovery/application/create-huarique.usecase';

const router = useRouter();

const model = reactive({
  name:'', categoryId:'', avgPrice:0, district:'',
  nearMe:false, address:'', city:'', reference:'', phone:'',
  openAt:'09:00', closeAt:'22:00', closed:false,
  services:{ delivery:true, takeaway:true, dinein:true },
  menu:[]
});

const menuItem = reactive({ name:'', price:0, section:'' });

const canSave = computed(() =>
    model.name?.trim() && model.categoryId && model.address?.trim()
);

function addItem(){
  if(!menuItem.name) return;
  model.menu.push({ name:menuItem.name, price:menuItem.price, section:menuItem.section });
  Object.assign(menuItem, { name:'', price:0, section:'' });
}
function removeItem(i){ model.menu.splice(i,1); }

async function onSubmit(){
  try{
    const created = await createHuarique({ ...model });
    router.push({ name:'owner-huarique-edit', params:{ id: created.id }});
  }catch(e){
    alert((typeof $t === 'function' ? $t('ownerNew.saveError') : 'No se pudo guardar. Inténtalo otra vez.'));
  }
}
</script>

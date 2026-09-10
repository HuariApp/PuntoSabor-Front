<template>
  <section class="wrap contact" aria-labelledby="title">
    <header class="page-head">
      <h1 id="title" class="section-title">{{ t('contact.title') }}</h1>
      <p class="section-sub">{{ t('home.subhead') }}</p>
    </header>

    <div class="sheet">
      <div class="contact-grid">
        <form class="card form-card" @submit.prevent="onSubmit">
          <div class="card__head">
            <span class="badge-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" class="ico-svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                      d="M21 8.25v7.5A2.25 2.25 0 0 1 18.75 18h-13.5A2.25 2.25 0 0 1 3 15.75v-7.5A2.25 2.25 0 0 1 5.25 6h13.5A2.25 2.25 0 0 1 21 8.25Z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                      d="M3.75 7.5 12 12.75 20.25 7.5"/>
              </svg>
            </span>
            <h3 class="card__title">{{ t('contact.formTitle') }}</h3>
          </div>

          <div class="card__body">
            <div class="field">
              <label for="name">{{ t('contact.nameLabel') }}</label>
              <input
                  id="name"
                  v-model.trim="form.name"
                  type="text"
                  autocomplete="name"
                  required
                  :placeholder="t('contact.namePh')"
              />
            </div>

            <div class="field">
              <label for="email">{{ t('contact.emailLabel') }}</label>
              <input
                  id="email"
                  v-model.trim="form.email"
                  type="email"
                  autocomplete="email"
                  required
                  :placeholder="t('contact.emailPh')"
              />
            </div>

            <div class="field">
              <label for="message">{{ t('contact.messageLabel') }}</label>
              <textarea
                  id="message"
                  v-model.trim="form.message"
                  rows="6"
                  required
                  :placeholder="t('contact.messagePh')"
              ></textarea>
            </div>

            <div class="actions">
              <button class="btn" type="submit" :disabled="!canSend || sending">
                <span v-if="!sending">{{ t('contact.submit') }}</span>
                <span v-else>{{ t('contact.submitting') }}</span>
              </button>

              <span v-if="sent" class="sent-badge" aria-live="polite">
                {{ t('contact.sent') }}
              </span>
            </div>
          </div>
        </form>

        <aside class="card map-card" :aria-label="t('contact.mapAria')">
          <div class="card__head">
            <span class="badge-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" class="ico-svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                      d="M12 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                      d="M19.5 10.5c0 5.25-7.5 10.125-7.5 10.125S4.5 15.75 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
              </svg>
            </span>
            <h3 class="card__title">{{ t('contact.mapTitle') }}</h3>
          </div>

          <div class="card__body map-body">
            <div ref="mapEl" class="map" :aria-label="t('contact.mapAria')"></div>

            <ul class="contact-info">
              <li>
                <span class="badge-ico badge-ico--sm" aria-hidden="true">
                  <svg viewBox="0 0 24 24" class="ico-svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                          d="M3 9.75 12 3l9 6.75M4.5 10.875V21h15V10.875"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                          d="M9 21v-6h6v6"/>
                  </svg>
                </span>
                <span>{{ t('contact.info.address') }}</span>
              </li>

              <li>
                <span class="badge-ico badge-ico--sm" aria-hidden="true">
                  <svg viewBox="0 0 24 24" class="ico-svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                          d="M2.25 6.75c0-1.243 1.007-2.25 2.25-2.25h1.39c.93 0 1.748.622 1.98 1.523l.71 2.762c.2.781-.123 1.61-.81 2.07l-1.12.747a.75.75 0 0 0-.27.936A12.03 12.03 0 0 0 11.462 16.5a.75.75 0 0 0 .936-.27l.747-1.12c.46-.687 1.289-1.01 2.07-.81l2.762.71c.901.232 1.523 1.05 1.523 1.98v1.39c0 1.243-1.007 2.25-2.25 2.25h-.75C8.6 21 3 15.4 3 8.25v-.75Z"/>
                  </svg>
                </span>
                <a href="tel:+51999999999">+51 999 999 999</a>
              </li>

              <li>
                <span class="badge-ico badge-ico--sm" aria-hidden="true">
                  <svg viewBox="0 0 24 24" class="ico-svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                          d="M21 8.25v7.5A2.25 2.25 0 0 1 18.75 18h-13.5A2.25 2.25 0 0 1 3 15.75v-7.5A2.25 2.25 0 0 1 5.25 6h13.5A2.25 2.25 0 0 1 21 8.25Z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                          d="M3.75 7.5 12 12.75 20.25 7.5"/>
                  </svg>
                </span>
                <a href="mailto:hola@puntosabor.com">hola@puntosabor.com</a>
              </li>

              <li>
                <span class="badge-ico badge-ico--sm" aria-hidden="true">
                  <svg viewBox="0 0 24 24" class="ico-svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                          d="M12 6v6l4 2"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                          d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                </span>
                <span>{{ t('contact.info.hours') }}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import smallLogo from '@/assets/slogoPuntoSabor.png'

const { t } = useI18n({ useScope: 'global' })

import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const form = reactive({ name: '', email: '', message: '' })
const sending = ref(false)
const sent = ref(false)

const canSend = computed(() => {
  const emailOk = /\S+@\S+\.\S+/.test(form.email || '')
  return !!form.name?.trim() && emailOk && !!form.message?.trim()
})

async function onSubmit () {
  if (!canSend.value || sending.value) return
  sending.value = true; sent.value = false
  // simula request
  await new Promise(r => setTimeout(r, 900))
  sending.value = false; sent.value = true
  setTimeout(() => { sent.value = false }, 3000)
}

const mapEl = ref(null)
const center = [-12.0464, -77.0428]

onMounted(() => {
  if (!mapEl.value) return

  const map = L.map(mapEl.value, { scrollWheelZoom: true, zoomControl: true }).setView(center, 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
  }).addTo(map)

  const psIcon = L.icon({
    iconUrl: smallLogo,
    iconSize: [44, 44],
    iconAnchor: [22, 42],
    popupAnchor: [0, -40],
    className: 'ps-marker'
  })

    L.marker(center, { icon: psIcon })
      .addTo(map)
      .bindPopup('<b>PointFlavor</b><br>Av. Sabor 123, Lima')
      .openPopup()

  setTimeout(() => map.invalidateSize(), 250)
})
</script>

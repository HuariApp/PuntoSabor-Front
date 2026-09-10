<template>
  <section class="wrap zones-wrap" aria-labelledby="zones-title">
    <header class="page-head" aria-labelledby="zones-title">
      <h2 id="zones-title" class="section-title fx-title">
        {{ $t('map.title') }}
      </h2>
    </header>

    <!-- Controles -->
    <div class="controls">
      <div class="chips" role="tablist" :aria-label="$t('map.aria.filterByCat')">
        <button
            v-for="c in chipOptions"
            :key="c.cat"
            class="chip"
            :class="{ active: activeCat === c.cat }"
            role="tab"
            :aria-selected="activeCat === c.cat"
            @click="onChip(c.cat)"
        >
          {{ c.label }}
        </button>
      </div>

      <div class="search">
        <input
            v-model.trim="queryText"
            type="search"
            :placeholder="$t('map.searchPlaceholder')"
            :aria-label="$t('map.aria.search')"
        />
      </div>
    </div>

    <!-- Layout -->
    <div class="zones-grid">
      <!-- Mapa + fichas -->
      <div class="map-col">
        <div ref="mapEl" id="map-zones" class="map" :aria-label="$t('map.aria.map')"></div>

        <!-- Info en 2 tarjetas -->
        <Transition name="card-pop" mode="out-in">
          <div v-if="selectedMeta" :key="activeId" class="detail-stack" aria-live="polite">
            <!-- Tarjeta: imagen -->
            <article class="media-card" :title="selectedPlace?.name">
              <img :src="logoUrl(selectedMeta.logo)" :alt="selectedPlace?.name || 'Logo'" class="media-img" />
            </article>

            <!-- Tarjeta: descripción -->
            <article class="info-card">
              <header class="info-head">
                <h3 class="info-title">{{ selectedPlace?.name }}</h3>
                <div class="badges">
                  <span class="badge badge--cat">{{ catLabel(selectedPlace?.cat) }}</span>
                  <span v-for="t in filteredTags" :key="t" class="badge badge--muted">{{ t }}</span>
                </div>
              </header>

              <p class="info-desc">{{ selectedMeta.desc }}</p>

              <ul class="info-list" role="list">
                <li>
                  <svg class="i i--stroke" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 21s-7-7.2-7-12a7 7 0 1 1 14 0c0 4.8-7 12-7 12Z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span>{{ selectedMeta.address }}</span>
                </li>

                <!-- Horario + estado -->
                <li class="hours-row">
                  <svg class="i i--stroke" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9.5" />
                    <path d="M12 7v5l4 2" />
                  </svg>

                  <span>{{ selectedMeta.hours }}</span>

                  <span v-if="statusText" class="status-badge" :class="statusClass">
                    <span class="status-dot" aria-hidden="true"></span>
                    {{ statusText }}
                  </span>
                </li>
              </ul>

              <div class="divider"></div>

              <div class="info-actions">
                <RouterLink class="btn btn--primary" :to="{ path:'/results', query:{ q:selectedPlace?.name } }">
                  <svg class="i" viewBox="0 0 24 24"><path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h12v2H3z" /></svg>
                  {{ $t('map.actions.viewMenu') }}
                </RouterLink>

                <a class="btn" :href="mapsHref" target="_blank" rel="noopener">
                  <svg class="i" viewBox="0 0 24 24"><path d="M12 2 3 6v12l9 4 9-4V6zM5 8l7-3 7 3-7 3z" /></svg>
                  {{ $t('map.actions.directions') }}
                </a>

                <button class="btn" type="button" @click="callActive">
                  <svg class="i" viewBox="0 0 24 24"><path d="M6.6 10.2c1.6 3.2 4 5.6 7.2 7.2l2.4-2.4c.3-.3.8-.4 1.2-.2 1 .4 2 .6 3.1.6.7 0 1.2.5 1.2 1.2V21c0 .7-.5 1.2-1.2 1.2C10.3 22.2 1.8 13.7 1.8 3.2 1.8 2.5 2.3 2 3 2h3.3c.7 0 1.2.5 1.2 1.2 0 1 .2 2.1.6 3.1.1.4 0 .9-.3 1.2z" /></svg>
                  {{ $t('map.actions.call') }}
                </button>

                <!-- Reportar información -->
                <RouterLink
                    class="btn btn--ghost"
                    :to="{
                    name: 'report-issue',
                    params: { id: selectedPlace?.id },
                    query: { name: selectedPlace?.name, address: selectedMeta?.address, hours: selectedMeta?.hours }
                  }"
                >
                  {{ $t('report.action') }}
                </RouterLink>

                <button class="btn btn--ghost" type="button" @click="shareActive">
                  <svg class="i" viewBox="0 0 24 24"><path d="M18 8a3 3 0 1 0-2.82-4h-.02L8.91 7.1a3 3 0 0 0 0 5.8l6.25 3.1a3 3 0 1 0 .66-1.33L9.6 11.6a3 3 0 0 0 0-1.2l6.22-3.08A3 3 0 0 0 18 8Z" /></svg>
                  {{ $t('map.actions.share') }}
                </button>
              </div>
            </article>
          </div>

          <article v-else key="empty" class="info-card empty">
            <span class="brand-placeholder">{{ $t('map.empty') }}</span>
          </article>
        </Transition>

        <!-- Acciones rápidas -->
        <div class="quick-actions">
          <RouterLink class="chip-link" :to="{ path:'/results', query:{ q:'Pollo' } }">{{ $t('map.quick.recommended') }}</RouterLink>
          <RouterLink class="chip-link" :to="{ path:'/results', query:{ q:'Menú' } }">{{ $t('map.quick.nearby') }}</RouterLink>
          <RouterLink class="chip-link" to="/reviews">{{ $t('map.quick.reviews') }}</RouterLink>
        </div>
      </div>

      <!-- Lista -->
      <aside class="list-col">
        <ul class="zones-list" role="listbox" :aria-label="$t('map.aria.list')">
          <li
              v-for="p in filteredPlaces"
              :key="p.id"
              :class="{ active: p.id === activeId }"
              tabindex="0"
              role="option"
              @click="selectPlace(p.id, true)"
              @keyup.enter="selectPlace(p.id, true)"
          >
            <strong class="name">{{ p.name }}</strong>
            <small class="cat">{{ catLabel(p.cat) }}</small>
          </li>
          <li v-if="filteredPlaces.length === 0" class="empty">
            {{ $t('map.noResults', { q: queryText }) }}
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<script>
import { defineComponent, onMounted, onBeforeUnmount, reactive, ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default defineComponent({
  name: 'MapView',
  components: { RouterLink },
  setup () {
    const { t } = useI18n()
    const mapEl = ref(null)
    const state = reactive({ query: '', activeCat: 'all', activeId: null })

    const queryText = computed({
      get: () => state.query,
      set: v => (state.query = v ?? '')
    })
    const activeCat = computed({
      get: () => state.activeCat,
      set: v => (state.activeCat = v || 'all')
    })
    const activeId = computed({
      get: () => state.activeId,
      set: v => (state.activeId = v ?? null)
    })

    /* ========= DATOS ============ */
    const HUARIQUES = [
      { id: 1,  name: 'El Brasero',            category: 'Pollo',     price: 22, rating: 4.6, district: 'Surco',                near: true  },
      { id: 2,  name: 'Rincón Marino',         category: 'Marina',    price: 28, rating: 4.8, district: 'Chorrillos',          near: false },
      { id: 3,  name: 'Doña Peta Criolla',     category: 'Criolla',   price: 25, rating: 4.5, district: 'Barranco',            near: true  },
      { id: 4,  name: 'Chifa San Joy Lao',     category: 'Chifa',     price: 21, rating: 4.4, district: 'Miraflores',          near: false },
      { id: 5,  name: 'La Dulcería',           category: 'Postres',   price: 15, rating: 4.9, district: 'San Isidro',          near: false },
      { id: 6,  name: 'La Esquinita del Menú', category: 'Menú',      price: 12, rating: 4.2, district: 'San Borja',           near: true  },
      { id: 7,  name: 'Café Aroma & Sabor',    category: 'Café',      price: 10, rating: 4.7, district: 'Miraflores',          near: false },
      { id: 8,  name: 'Pollos Don Tito',       category: 'Pollo',     price: 24, rating: 4.7, district: 'La Molina',           near: false },
      { id: 9,  name: 'Mar & Tierra',          category: 'Marina',    price: 30, rating: 4.3, district: 'San Miguel',          near: true  },
      { id:10,  name: 'Café Central',          category: 'Café',      price: 11, rating: 4.5, district: 'Centro de Lima',      near: false },
      { id:11,  name: 'Parrilladas Don Mario', category: 'Parrillas', price: 35, rating: 4.8, district: 'Surquillo',           near: true  },
      { id:12,  name: 'Brasa y Carbón',        category: 'Parrillas', price: 38, rating: 4.6, district: 'Lince',               near: false },
      { id:13,  name: 'Fuego Criollo',         category: 'Parrillas', price: 36, rating: 4.7, district: 'San Juan de Miraflores', near: true },
      { id:14,  name: 'La Parrilla del Norte', category: 'Parrillas', price: 33, rating: 4.5, district: 'Los Olivos',          near: false },
      { id:15,  name: 'Punto Grill',           category: 'Parrillas', price: 40, rating: 4.9, district: 'San Isidro',          near: false },
      { id:16,  name: 'La Picantería Peruana', category: 'Criolla',   price: 27, rating: 4.7, district: 'Surquillo',           near: true  },
      { id:17,  name: 'La Casa del Postre',    category: 'Postres',   price: 13, rating: 4.7, district: 'Surquillo',           near: true  },
      { id:18,  name: 'Chifa Ping Chung Long', category: 'Chifa',     price: 20, rating: 4.2, district: 'Lince',               near: false },
      { id:19,  name: 'El Sabor Norteño',      category: 'Criolla',   price: 23, rating: 4.2, district: 'Los Olivos',          near: false },
      { id:20,  name: 'La Ola Marina',         category: 'Marina',    price: 29, rating: 4.4, district: 'Magdalena',           near: true  },
      { id:21,  name: 'Menu Don Lucho',        category: 'Menú',      price: 12, rating: 4.2, district: 'El Agustino',         near: true  }
    ]

    const CAT = {
      Pollo:     { code: 'pollo',   label: 'Pollerías' },
      Marina:    { code: 'mar',     label: 'Marinos'   },
      Criolla:   { code: 'criollo', label: 'Criollo'   },
      Chifa:     { code: 'chifa',   label: 'Chifa'     },
      Postres:   { code: 'postre',  label: 'Dulces'    },
      Menú:      { code: 'menu',    label: 'Menú'      },
      'Café':    { code: 'cafe',    label: 'Café'      },
      Parrillas: { code: 'parri',   label: 'Parrillas' }
    }

    // Centro por distrito + jitter determinista
    const DIST = {
      'Surco': [-12.15, -76.98], 'Chorrillos': [-12.18, -77.02], 'Barranco': [-12.14, -77.02],
      'Miraflores': [-12.12, -77.03], 'San Isidro': [-12.10, -77.04], 'San Borja': [-12.10, -76.99],
      'La Molina': [-12.08, -76.94], 'San Miguel': [-12.08, -77.09], 'Centro de Lima': [-12.05, -77.04],
      'Surquillo': [-12.12, -77.01], 'Lince': [-12.09, -77.04], 'San Juan de Miraflores': [-12.16, -76.98],
      'Los Olivos': [-11.96, -77.07], 'Magdalena': [-12.09, -77.07], 'El Agustino': [-12.05, -76.99]
    }
    const jitter = (seed, a = 0.0012) => {
      const x = Math.sin(seed * 9301 + 49297) * 233280 % 1
      const y = Math.sin(seed * 2333 + 19283) * 233280 % 1
      return [(x - 0.5) * a, (y - 0.5) * a]
    }

    const LOGO_BY_NAME = {
      'El Brasero': 'ElBrasero.jpg',
      'Rincón Marino': 'rinconmarino.jpg',
      'Doña Peta Criolla': 'dona.png',
      'Chifa San Joy Lao': 'SanJoyLao.jpg',
      'La Dulcería': 'dulcesazon.jpg',
      'La Esquinita del Menú': 'menuRef.jpg',
      'Café Aroma & Sabor': 'aromaysabor.jpg',
      'Café Central': 'cafecentral.jpg',
      'Pollos Don Tito': 'dontito.jpg',
      'Mar & Tierra': 'MaryTierra.jpg',
      'Parrilladas Don Mario': 'mario.png',
      'Brasa y Carbón': 'brasaycarbon.jpg',
      'Fuego Criollo': 'fuegocriollo.jpg',
      'La Parrilla del Norte': 'parrillanorte.jpg',
      'Punto Grill': 'puntogrill.jpg',
      'La Picantería Peruana': 'la_picanteria.jpg',
      'La Casa del Postre': 'postresRef.jpg',
      'Chifa Ping Chung Long': 'ChifaPing.jpg',
      'El Sabor Norteño': 'SaborNorteño.png',
      'La Ola Marina': 'Olamarina.jpg',
      'Menu Don Lucho': 'donlucho.jpg'
    }
    const LOGO_BY_CAT = {
      pollo: 'pollo_brasa.jpg',
      mar: 'marisco.jpg',
      criollo: 'criolla.jpg',
      chifa: 'chifaRef.jpg',
      postre: 'postresRef.jpg',
      menu: 'menuRef.jpg',
      cafe: 'caféRef.jpeg',
      parri: 'parrillasRef.jpg'
    }
    const logoUrl = (file) => new URL(`../../../assets/${file}`, import.meta.url).href

    // places + META
    const places = HUARIQUES.map(h => {
      const cat = CAT[h.category]?.code ?? 'otros'
      return { id: slug(h.name), name: h.name, cat } // id = slug (string)
    })
    const META = {}
    HUARIQUES.forEach(h => {
      const code = CAT[h.category]?.code ?? 'otros'
      const [baseLat, baseLng] = DIST[h.district] ?? [-12.069, -77.035]
      const [djLat, djLng] = jitter(h.id)
      const lat = baseLat + djLat
      const lng = baseLng + djLng
      const file = LOGO_BY_NAME[h.name] ?? LOGO_BY_CAT[code] ?? 'LogoPuntoSabor.png'
      META[slug(h.name)] = {
        lat, lng,
        logo: file,
        address: `${h.district}, Lima`,
        hours: hoursByCat(code),
        desc: descByCat(code, h.name),
        tags: tagsByCat(code, h.price, h.rating, h.near),
        phone: '+51 999 000 000'
      }
    })

    function slug (s) {
      return s.toLowerCase().normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
    }
    function hoursByCat (code) {
      switch (code) {
        case 'pollo': return 'Lun–Dom 12:00–22:30'
        case 'mar': return 'Lun–Dom 12:00–21:30'
        case 'criollo': return 'Lun–Sáb 12:00–21:00'
        case 'chifa': return 'Lun–Dom 12:00–23:00'
        case 'postre': return 'Mar–Dom 13:00–20:00'
        case 'menu': return 'Lun–Sáb 12:00–16:00'
        case 'cafe': return 'Lun–Dom 08:00–20:00'
        case 'parri': return 'Jue–Dom 13:00–23:00'
        default: return 'Consultar horario'
      }
    }
    function descByCat (code, name) {
      const base = {
        pollo: `${name}: pollo a la brasa y brasas al toque.`,
        mar: `${name}: pescados y mariscos frescos.`,
        criollo: `${name}: cocina criolla de casa.`,
        chifa: `${name}: salteados al wok y wantanes.`,
        postre: `${name}: postres caseros y antojitos.`,
        menu: `${name}: menú del día contundente.`,
        cafe: `${name}: café y pastelería artesanal.`,
        parri: `${name}: parrillas y cortes a la brasa.`
      }
      return base[code] || `${name}: buena sazón.`
    }
    function tagsByCat (code, price, rating, near) {
      const tgs = []
      tgs.push(t(`map.filters.${code}`))
      tgs.push(`S/ ${price}`)
      tgs.push(`⭐ ${rating}`)
      if (near) tgs.push(t('map.quick.nearby'))
      return tgs
    }

    const allCatsInData = Array.from(new Set(HUARIQUES.map(h => CAT[h.category]?.code))).filter(Boolean)
    const chipOptions = computed(() => {
      return [{ cat: 'all', label: t('map.filters.all') }].concat(
          allCatsInData.map(code => ({ cat: code, label: t(`map.filters.${code}`) }))
      )
    })
    const catLabel = code => chipOptions.value.find(c => c.cat === code)?.label ?? code

    /* ========= Leaflet ========= */
    let map = null
    const markersById = new Map()
    const logoIcon = (file, catCode) => {
      const size = 46
      return L.icon({
        iconUrl: logoUrl(file),
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size + 10],
        className: `marker-logo marker-${catCode}`
      })
    }

    const filteredPlaces = computed(() => {
      const q = (state.query || '').toLowerCase()
      return places.filter(p => {
        const byCat = (state.activeCat === 'all' || p.cat === state.activeCat)
        const byTxt = p.name.toLowerCase().includes(q)
        return byCat && byTxt
      })
    })

    const selectedPlace = computed(() => places.find(p => p.id === state.activeId) || null)
    const selectedMeta = computed(() => (state.activeId && META[state.activeId]) ? META[state.activeId] : null)

    const filteredTags = computed(() => {
      const p = selectedPlace.value; const m = selectedMeta.value
      if (!p || !m) return []
      const cat = (catLabel(p.cat) || '').toLowerCase()
      return (m.tags || []).filter(txt => String(txt).toLowerCase() !== cat)
    })

    const mapsHref = computed(() => {
      if (!state.activeId) return '#'
      const m = META[state.activeId]
      return `https://www.google.com/maps?q=${m.lat},${m.lng}`
    })

    function onChip (cat) {
      state.activeCat = cat || 'all'
      if (state.activeId && !filteredPlaces.value.some(p => p.id === state.activeId)) state.activeId = null
      if (!state.activeId && filteredPlaces.value.length) selectPlace(filteredPlaces.value[0].id, true)
    }
    function selectPlace (id, center = false) {
      state.activeId = id
      if (center && markersById.has(id)) {
        const mk = markersById.get(id)
        map.setView(mk.getLatLng(), 15, { animate: true })
        mk.openPopup()
      }
    }
    function callActive () {
      const m = selectedMeta.value; if (!m?.phone) return
      window.location.href = `tel:${m.phone.replace(/\s+/g, '')}`
    }
    async function shareActive () {
      const p = selectedPlace.value; const m = selectedMeta.value; if (!p || !m) return
      const url = `https://www.google.com/maps?q=${m.lat},${m.lng}`
      const title = `${p.name} — ${m.address}`
      const text = t('map.shareText', { name: p.name, hours: m.hours })
      try {
        if (navigator.share) { await navigator.share({ title, text, url }) } else {
          await navigator.clipboard.writeText(`${title}\n${text}\n${url}`)
          alert(t('map.copied'))
        }
      } catch {}
    }

    watch(filteredPlaces, (list) => {
      if (state.activeId && !list.some(p => p.id === state.activeId)) state.activeId = null
    })

    onMounted(() => {
      const cont = mapEl.value; if (!cont) return
      if (cont._leaflet_id) cont._leaflet_id = null

      map = L.map(cont, { zoomControl: true, scrollWheelZoom: true }).setView([-12.069, -77.035], 12.8)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20, attribution: '&copy; OpenStreetMap' }).addTo(map)

      places.forEach(p => {
        const m = META[p.id]; if (!m) return
        const mk = L.marker([m.lat, m.lng], { icon: logoIcon(m.logo, p.cat) }).addTo(map)
        mk.bindPopup(`<img src="${logoUrl(m.logo)}" alt="${p.name}" class="popup-logo">`, { autoPan: true, closeButton: true, maxWidth: 220, className: 'ps-popup' })
        mk.on('click', () => selectPlace(p.id, false))
        markersById.set(p.id, mk)
      })

      if (filteredPlaces.value.length) selectPlace(filteredPlaces.value[0].id, true)
    })
    onBeforeUnmount(() => { if (map) { map.remove(); markersById.clear() } })

    /* ======== Estado junto al horario ======== */
    const effectiveStatus = computed(() => {
      const s = selectedMeta.value?.status
      if (s === 'open' || s === 'closed' || s === 'unknown') return s
      return inferStatusFromHours(selectedMeta.value?.hours)
    })

    const statusText = computed(() => {
      switch (effectiveStatus.value) {
        case 'open':   return t('status.openNow')
        case 'closed': return t('status.closed')
        default:       return t('status.unconfirmed')
      }
    })

    const statusClass = computed(() => ({
      'is-open':    effectiveStatus.value === 'open',
      'is-closed':  effectiveStatus.value === 'closed',
      'is-unknown': effectiveStatus.value !== 'open' && effectiveStatus.value !== 'closed'
    }))

    function inferStatusFromHours (hoursStr) {
      if (!hoursStr || typeof hoursStr !== 'string') return 'unknown'
      const m = hoursStr.match(/(\d{1,2}:\d{2})\s*–\s*(\d{1,2}:\d{2})/)
      if (!m) return 'unknown'

      const toMin = (s) => {
        const [h, mm] = s.split(':').map(Number)
        return h * 60 + mm
      }

      const open = toMin(m[1])
      let close  = toMin(m[2])

      const now  = new Date()
      let cur    = now.getHours() * 60 + now.getMinutes()

      // Horarios que cruzan medianoche (ej. 18:00–02:00)
      if (close <= open) {
        close += 24 * 60
        if (cur < open) cur += 24 * 60
      }

      return cur >= open && cur <= close ? 'open' : 'closed'
    }

    return {
      mapEl, chipOptions, catLabel,
      filteredPlaces, selectedPlace, selectedMeta, filteredTags,
      selectPlace, onChip, callActive, shareActive,
      logoUrl, mapsHref, queryText, activeCat, activeId,
      statusText, statusClass
    }
  }
})
</script>

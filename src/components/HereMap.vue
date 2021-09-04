<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue'
import H from '@here/maps-api-for-javascript'

const props = defineProps({
  lat: {
    type: Number,
    default: 0,
  },
  lng: {
    type: Number,
    default: 0,
  },
  zoom: {
    type: Number,
    default: 14,
  },
})

const refMap = ref()
const hereMap = ref()

onMounted(() => {
  const platform = new H.service.Platform({
    apikey: String(import.meta.env.VITE_HERE_API_KEY),
  })

  const layers = platform.createDefaultLayers()
  const map = new H.Map(refMap.value, layers.vector.normal.map, {
    pixelRatio: window.devicePixelRatio,
    center: { lat: props.lat, lng: props.lng },
    zoom: props.zoom,
  })

  hereMap.value = map

  const provider = hereMap.value.getBaseLayer().getProvider()
  const style = new H.map.Style(
    'https://heremaps.github.io/maps-api-for-javascript-examples/change-style-at-load/data/dark.yaml',
    'https://js.api.here.com/v3/3.1/styles/omv/',
  )

  provider.setStyle(style)

  window.addEventListener('resize', () => {
    hereMap.value.getViewPort().resize()
  })
})

onUpdated(() => {
  if (hereMap) {
    hereMap.value.setZoom(props.zoom)
    hereMap.value.setCenter({ lat: props.lat, lng: props.lng })
  }
})
</script>



<template>
  <div ref="refMap" class="heremap"></div>
</template>

<style scoped>
.heremap {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
}
</style>
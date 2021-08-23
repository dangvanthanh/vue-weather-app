<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
  DialogTitle,
} from '@headlessui/vue'
import {
  convertTime,
  degToCompass,
  getWindSpeed,
  getVisibility,
  getTime,
  getAMPM,
} from '../utils'
import Card from './Card.vue'

const systemUsed = ref('metric')
const systemUsedIcon = ref('celsius')
const isLoading = ref(false)
const isOpen = ref(false)
const error = ref('')
const location = ref('Ho Chi Minh')
const weather = reactive({
  name: '',
  country: '',
  description: '',
  icon: '',
  temp: 0,
  feelLikes: '',
  dt: 0,
  timezone: 0,
  humidity: 0,
  windSpeed: 0,
  windDeg: 0,
  visibility: 0,
  sunrise: 0,
  sunset: 0,
})
const buttons = ref([
  {
    value: 'metric',
    name: 'celsius',
    icon: 'M27 30a3.75 3.75 0 01-2.75 1.18A3.8 3.8 0 0121.48 30a3.91 3.91 0 012.78-6.69A3.89 3.89 0 0127 30zm-4-1.54a1.65 1.65 0 001.22.51 1.69 1.69 0 001.22-.51 1.61 1.61 0 00.51-1.2 1.71 1.71 0 00-.5-1.23 1.65 1.65 0 00-1.23-.52A1.63 1.63 0 0023 26a1.68 1.68 0 00-.51 1.23 1.61 1.61 0 00.51 1.19zM32 24.79a7.12 7.12 0 015.08-1.67c3.4 0 5.58 1.34 6.52 4a.72.72 0 01-.5 1.05l-1.32.46a.88.88 0 01-.65 0 1 1 0 01-.38-.54c-.53-1.48-1.75-2.21-3.67-2.21a4.19 4.19 0 00-2.85.87 3.23 3.23 0 00-1 2.54v5.3a3.24 3.24 0 001 2.54 4.09 4.09 0 002.85.89c1.9 0 3.12-.74 3.67-2.23a1 1 0 01.41-.56.75.75 0 01.64.06l1.3.45a.75.75 0 01.53 1.06q-1.43 4-6.55 4A7.17 7.17 0 0132 39.21a6 6 0 01-1.79-4.59v-5.26A5.94 5.94 0 0132 24.79z',
  },
  {
    value: 'imperial',
    name: 'fahrenheit',
    icon: 'M27.91 30.06a3.88 3.88 0 01-5.53 0 3.95 3.95 0 010-5.57 3.85 3.85 0 012.8-1.13 3.88 3.88 0 013.91 3.92 3.84 3.84 0 01-1.18 2.78zm-4-1.54a1.63 1.63 0 001.22.5 1.65 1.65 0 001.21-.5 1.61 1.61 0 00.52-1.2 1.71 1.71 0 00-.51-1.24 1.71 1.71 0 00-2.44 0 1.71 1.71 0 00-.51 1.24 1.64 1.64 0 00.54 1.2zM42.58 23.76a.83.83 0 01.2.63v1.18a.83.83 0 01-.2.63.91.91 0 01-.64.18h-7.35v4.42h6.17a1 1 0 01.65.18.84.84 0 01.19.64v1.17a.89.89 0 01-.18.64.93.93 0 01-.66.18h-6.17v6.19a.91.91 0 01-.18.64.88.88 0 01-.63.18h-1.37a.94.94 0 01-.65-.18.86.86 0 01-.19-.64V24.39a.83.83 0 01.19-.63.94.94 0 01.65-.18h9.53a.91.91 0 01.64.18z',
  },
])

const handleSearch = async (input: string) => {
  const getWeatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=${
      import.meta.env.VITE_OPENWEATHER_API_KEY
    }`
  )
  const json = await getWeatherData.json()

  error.value = ''

  if (json.cod === '404') {
    error.value = json.message
    isOpen.value = true
  } else {
    weather.name = json.name
    weather.country = json.sys.country
    weather.description = json.weather[0].description
    weather.icon = json.weather[0].icon
    weather.temp = json.main.temp
    weather.feelLikes = json.main.feels_like
    weather.dt = json.dt
    weather.timezone = json.timezone
    weather.humidity = json.main.humidity
    weather.windSpeed = json.wind.speed
    weather.windDeg = json.wind.deg
    weather.visibility = json.visibility
    weather.sunrise = json.sys.sunrise
    weather.sunset = json.sys.sunset
  }
}

const handleKeydown = (e: any) => {
  if (e.keyCode === 13) {
    handleSearch(location.value)
  }
}

const handleSystemUsed = (value: string) => {
  systemUsed.value = value
}

const setIsOpen = (value: boolean) => {
  isOpen.value = value
}

onMounted(async () => {
  isLoading.value = true
  await handleSearch(location.value)
  isLoading.value = false
})

watch(systemUsed, (newVal) => {
  if (newVal === 'metric') {
    systemUsedIcon.value = 'celsius'
  } else {
    systemUsedIcon.value = 'fahrenheit'
  }
})
</script>

<template>
  <div class="home" :class="{ 'is-loading': isLoading }">
    <div class="home-weather">
      <div class="button-group">
        <button
          class="button"
          v-for="button in buttons"
          :key="button.name"
          :class="{ active: button.value === systemUsed }"
          @click="handleSystemUsed(button.value)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <path :d="button.icon" />
          </svg>
        </button>
      </div>
      <input
        class="input"
        type="text"
        placeholder="Search for places..."
        v-model="location"
        @keydown="handleKeydown"
      />
      <div class="name">{{ weather.name }}, {{ weather.country }}</div>
      <p class="description">{{ weather.description }}</p>
      <p class="status">
        <img :src="`/static/icons/${weather.icon}.svg`" />
      </p>
      <p class="temp">
        <span>{{ Math.round(weather.temp) }}</span>
        <span><img :src="`/static/icons/${systemUsedIcon}.svg`" /></span>
      </p>
    </div>
    <div class="home-stats">
      <div class="grid">
        <Card
          title="Humidity"
          :metric="weather.humidity"
          unit="%"
          icon="/static/icons/humidity.svg"
        />
        <Card
          title="Wind"
          :metric="getWindSpeed(systemUsed, weather.windSpeed)"
          :unit="systemUsed === 'metric' ? 'm/s' : 'm/h'"
          icon="/static/icons/wind.svg"
        />
        <Card
          title="Wind Direction"
          :metric="degToCompass(weather.windDeg)"
          icon="/static/icons/compass.svg"
        />
        <Card
          title="Visibility"
          :metric="getVisibility(systemUsed, weather.visibility)"
          :unit="systemUsed === 'metric' ? 'km' : 'miles'"
          icon="/static/icons/barometer.svg"
        />
        <Card
          title="Sunrise"
          :metric="getTime(systemUsed, weather.sunrise, weather.timezone)"
          :unit="getAMPM(systemUsed, weather.sunrise, weather.timezone)"
          icon="/static/icons/sunrise.svg"
        />
        <Card
          title="Sunset"
          :metric="getTime(systemUsed, weather.sunset, weather.timezone)"
          :unit="getAMPM(systemUsed, weather.sunset, weather.timezone)"
          icon="/static/icons/sunset.svg"
        />
      </div>
    </div>
  </div>
  <Dialog :open="isOpen" @close="setIsOpen(false)">
    <div class="diglog">
      <div class="dialog-wrapper">
        <DialogOverlay class="dialog-overlay" />

        <div class="dialog-content">
          <DialogTitle as="h3"> Error </DialogTitle>
          <p class="dialog-description">
            {{ error }}
          </p>
          <button class="dialog-button" @click="setIsOpen(false)">Close</button>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.is-loading {
  font-family: flow-circular;
  color: #46058b;
}

.home {
  background: #fff;
  width: 60rem;
  border-radius: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  margin: 1rem;
}

.home-weather {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2rem;
}

.home-stats {
  background-color: #46058b;
  display: flex;
  flex: 1 1 0%;
  padding: 2rem;
}

.input {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}

.name {
  font-size: 2rem;
  margin: 2rem 0 1rem;
}

.description {
  text-transform: capitalize;
}

.status {
  padding-left: 2.5rem;
  padding-right: 2.5rem;
}

.temp {
  font-size: 4rem;
  text-align: center;
  font-weight: 600;
  position: relative;
  line-height: 1;
  margin: 0;
}

.temp span {
  display: inline-block;
  vertical-align: middle;
  position: relative;
}

.temp img {
  width: 5rem;
  height: auto;
  position: absolute;
  right: -4rem;
  top: -4rem;
}

.button-group {
  text-align: right;
  margin-bottom: 1rem;
}

.button-group .button {
  margin-left: 0.25rem;
}

.button {
  display: inline-block;
  vertical-align: middle;
  background: transparent;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0;
  cursor: pointer;
}

.button svg {
  fill: currentColor;
}

.button.active {
  background: #46058b;
  color: #fff;
  cursor: default;
  pointer-events: none;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 1rem;
}

.diglog {
  overflow-y: auto;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
}

.dialog-overlay {
  background: rgba(0, 0, 0, 0.15);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
}

.dialog-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-content {
  background: #fff;
  max-width: 30rem;
  width: 100%;
  margin: 2rem;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-radius: 0.5rem;
  position: relative;
  z-index: 5;
}

.dialog-content h3 {
  font-size: 1.125rem;
  margin: 0 0 1rem;
}

.dialog-description {
  color: rgba(107, 114, 128, 1);
}

.dialog-description::first-letter {
  text-transform: capitalize;
}

.dialog-button {
  background: linear-gradient(to right, #6007bd, #46058b);
  font-size: 1rem;
  line-height: 1.25rem;
  padding: 0.5rem 1rem;
  border: 1px solid #46058b;
  color: #fff;
  border-radius: 0.25rem;
  cursor: pointer;
}

@media (min-width: 978px) {
  .home-weather {
    width: 25rem;
  }
}
</style>

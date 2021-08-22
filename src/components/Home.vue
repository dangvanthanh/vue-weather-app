<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { convertTime, degToCompass, getWindSpeed, getVisibility, getTime, getAMPM } from '../utils'
import Card from './Card.vue'

export default defineComponent({
  components: { Card },
  setup() {
    const loading = ref(false)
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

    const handleSearch = async (input: string) => {
      const getWeatherData = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=${
          import.meta.env.VITE_OPENWEATHER_API_KEY
        }`
      )
      const json = await getWeatherData.json()
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

    const handleKeydown = (e: any) => {
      if (e.keyCode === 13) {
        handleSearch(location.value)
      }
    }

    onMounted(async () => {
      loading.value = true
      await handleSearch(location.value)
      loading.value = false
    })

    return {
      location,
      weather,
      handleKeydown,
    }
  },
  data() {
    return {
      systemUsed: 'metric',
      convertTime,
      degToCompass,
      getWindSpeed,
      getVisibility,
      getTime,
      getAMPM,
    }
  },
})
</script>

<template>
  <div class="home">
    <div class="home-weather">
      <div>
        <input
          class="input"
          type="text"
          placeholder="Search for places..."
          v-model="location"
          @keydown="handleKeydown"
        />
        <div>
          <div class="name">{{ weather.name }}, {{ weather.country }}</div>
          <p class="description">{{ weather.description }}</p>
          <p class="status">
            <img :src="`/static/icons/${weather.icon}.svg`" />
          </p>
          <p class="temp">
            <span>{{ Math.round(weather.temp) }}</span>
            <span><img src="/static/icons/celsius.svg" /></span>
          </p>
        </div>
      </div>
    </div>
    <div class="home-stats">
      <div class="grid">
        <Card title="Humidity" :metric="weather.humidity" unit="%" icon="/static/icons/humidity.svg" />
        <Card
          title="Wind"
          :metric="getWindSpeed(systemUsed, weather.windSpeed)"
          unit="m/s"
          icon="/static/icons/wind.svg"
        />
        <Card title="Wind Direction" :metric="degToCompass(weather.windDeg)" icon="/static/icons/barometer.svg" />
        <Card title="Visibility" :metric="getVisibility(systemUsed, weather.visibility)" unit="km" />
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
</template>

<style scoped>
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

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 1rem;
}

@media (min-width: 978px) {
  .home-weather {
    width: 25rem;
  }
}
</style>

import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'

import IconAdd from './icon-add.svg'

import styles from './App.module.css'

const env = import.meta.env

const App: Component = () => {
  const [value, setValue] = createSignal('')
  const [show, toggleShow] = createSignal(true)
  const [weather, setWeather] = createSignal(null)
  const [error, setError] = createSignal('')

  const getWeatherData = async () => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${value()}&appid=${
        env.VITE_OPENWEATHER_API_KEY
      }`
    )
    const json = await res.json()
    if (json.cod === '404') {
      console.log(json)
      setError(json.message)
    } else {
      setWeather(json)
    }
  }

  const handleSearch = (event) => {
    if (event.keyCode === 13) {
      setWeather(null)
      setError('')
      getWeatherData()
    }
  }

  const handleToggleModal = () => {
    toggleShow(true)
  }

  return (
    <div class={styles.App}>
      {show() ? (
        <div class={styles.container}>
          <input
            type="text"
            placeholder="Search city"
            class={styles.input}
            onInput={(e) => setValue(e.currentTarget.value)}
            onKeyDown={handleSearch}
          />

          {weather() && (
            <div class={styles.card}>
              <div class={styles.cardHeader}>
                <div class={styles.cardTitle}>{weather().name}</div>
              </div>
            </div>
          )}

          {error() && <div class={styles.error}>{error()}</div>}
        </div>
      ) : (
        <button class={styles.cta} onClick={handleToggleModal}>
          <img src={IconAdd} alt="" />
        </button>
      )}
    </div>
  )
}

export default App

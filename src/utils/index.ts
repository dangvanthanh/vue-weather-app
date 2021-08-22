export const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const ctoF = (c: number) => (c * 9) / 5 + 32

export const mpsToMph = (mps: number) => (mps * 2.236936).toFixed(2)

export const kmToM = (km: number) => (km / 1.609).toFixed(1)

export const timeToAMPM = (time: any) => {
  let hours = time.split(':')[0]
  let minutes = time.split(':')[1]
  hours = hours % 12
  hours = hours ? hours : 12
  return hours + ':' + minutes
}

export const degToCompass = (num: number) => {
  var val = Math.floor(num / 22.5 + 0.5)
  var arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'S/SE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return arr[val % 16]
}

export const convertTime = (unixSeconds: number, timezone: number) => {
  const time = new Date((unixSeconds + timezone) * 1000).toISOString().match(/(\d{2}:\d{2})/)
  return time
}

export const isPM = (time: any) => {
  let hours = time.split(':')[0]
  if (hours >= 12) {
    return 'PM'
  } else {
    return 'AM'
  }
}

export const getWindSpeed = (systemUsed: string, windInMph: number) =>
  systemUsed == 'metric' ? windInMph : mpsToMph(windInMph)

export const getVisibility = (systemUsed: string, visibilityInKm: number) =>
  systemUsed == 'metric' ? (visibilityInKm / 1000).toPrecision(2) : kmToM(visibilityInKm / 1000)

export const getTime = (systemUsed: string, currentTime: number, timezone: number) =>
  systemUsed == 'metric'
    ? `${parseInt(convertTime(currentTime, timezone)![0].split(':')[0])}:${
        convertTime(currentTime, timezone)![0].split(':')[1]
      }`
    : timeToAMPM(convertTime(currentTime, timezone)![0])

export const getAMPM = (systemUsed: string, currentTime: number, timezone: number) =>
  systemUsed == 'imperial' ? isPM(convertTime(currentTime, timezone)![0]) : ''

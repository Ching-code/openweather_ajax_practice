import { getApiKey } from '../lib/apiKey.js'

export default async function getWeatherDetails(lat, lon) {
  const API_KEY = getApiKey()
  return axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
}

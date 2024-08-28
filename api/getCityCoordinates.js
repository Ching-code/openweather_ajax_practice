import axios from 'axios'
import { getApiKey } from '../lib/apiKey.js'

export default async function getCityCoordinates(city) {
  const API_KEY = getApiKey()
  return axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`)
}

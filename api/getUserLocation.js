import axios from 'https://cdn.skypack.dev/axios';
import { getApiKey } from '../lib/apiKey.js'

export default async function getUserLocation(latitude, longitude) {
  const API_KEY = getApiKey()
  return axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit1&appid=${API_KEY}`)
}

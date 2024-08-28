import { getApiKey } from '../lib/apiKey.js'

export default async function getCityCoordinates(city) {
  const API_KEY = getApiKey()
  const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`)
  if(!res.ok) throw new Error('無法取得位置資訊')

  const data = await res.json()
  return data
}

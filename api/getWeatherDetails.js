import { getApiKey } from '../lib/apiKey.js'

export default async function getWeatherDetails(lat, lon) {
  const API_KEY = getApiKey()
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
  if(!res.ok) throw new Error('無法取得天氣資訊')

  const data = await res.json()
  return data
}

const API_KEY = process.env.OPENWEATHER_API_KEY

const cityInput = document.querySelector('#countryInput')
const searchBtn = document.querySelector('.search-btn')
const locationBtn = document.querySelector('.location-btn')

const currentWeather = document.querySelector('.currentWeather')
const weatherCards = document.querySelector('.weather-cards')


// input 列表資料
const countries = ['Taipei', 'Taichung', 'Tainan']
const countryDataList = document.querySelector('#countries')
countries.forEach((country) => {
  const option = document.createElement('option')
  option.value = country
  countryDataList.appendChild(option)
})

// 獲取城市名字、經緯度
function getCityCoordinates() {
  const city = cityInput.value.trim()
  if(!city) return

  const GEOCODE_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

  axios.get(GEOCODE_API_URL)
    .then(res => {
      if(!res.data.length) return alert('找不到城市')
      const { name, lat, lon } = res.data[0]
      getWeatherDetails(name, lat, lon)
    }).catch(err => {
      alert(`發生錯誤 ${err.message}`)
    })
}

// 根據城市名、經緯度獲取天氣
function getWeatherDetails(cityName, lat, lon) {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  axios.get(WEATHER_API_URL)
    .then(res => {
      // 篩選每天的一筆預測資料
      const uniqueDayList = []
      const fiveDaysForecast = res.data.list.filter((forecast) => {
        const date = new Date(forecast.dt_txt).getDate()
        if(!uniqueDayList.includes(date)) {
          uniqueDayList.push(date)
          return true
        }
        return false
      })

      cityInput.value = ''

      renderCurrentWeather(cityName, fiveDaysForecast[0])
      
      weatherCards.innerHTML = ''
      for(let i = 1; i < fiveDaysForecast.length; i++) {
        renderForecast(fiveDaysForecast[i])
      }
    })
}

function renderCurrentWeather(cityName, item) {
  currentWeather.innerHTML = ''

  currentWeather.insertAdjacentHTML('beforeend', `
    <div class="info">
      <h2>${cityName} ${item.dt_txt}</h2>
      <p>氣溫: ${(item.main.temp - 273.15).toFixed(2)} &#176;&#67;</p>
      <p>風速: ${item.wind.speed} M/S</p>
      <p>濕度: ${item.main.humidity} %</p>
    </div>
    <div class="icon">
      <img 
        src="https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png"
        alt="weather" />
    </div>
    `)
}

function renderForecast(item) {
  weatherCards.insertAdjacentHTML('beforeend', `
    <li class="weather-card">
      <div class="info">
        <h3>${item.dt_txt}</h3>
        <p>氣溫: ${(item.main.temp - 273.15).toFixed(2)} &#176;&#67;</p>
        <p>風速: ${item.wind.speed} M/S</p>
        <p>濕度: ${item.main.humidity} %</p>
      </div>
      <div class="icon">
        <img 
          src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"
          alt="weather" />
      </div>
    </li>
    `)
}

// 取得使用者位置
function getUserLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit1&appid=${API_KEY}`;
    axios.get(REVERSE_GEOCODING_URL)
      .then(res => {
        const { name } = res.data[0]
        getWeatherDetails(name, latitude, longitude)
      }).catch(err => alert(`無法取得位置資訊 ${err.message}`))
  }, (err) => {
    if(err.code === err.PERMISSION_DENIED) {
      alert('您拒絕取得位置資訊')
    }
  })
}

searchBtn.addEventListener('click', getCityCoordinates)
locationBtn.addEventListener('click', getUserLocation)

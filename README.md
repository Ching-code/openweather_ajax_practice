# # 天氣預報 OpenWeather ajax 串接

![天氣預報](./asset/thumb.png)

使用者可以直接輸入也可以從下拉選單中選取選項，以及直接獲取當前位置來得到天氣預報

---

[api 使用 OpenWeather](https://openweathermap.org/)

使用以下三隻 api:

- Direct Geocoding

  給城市名傳回經緯度

  http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
- Reverse Geocoding

  給經緯度傳回城市名

  http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid={API key}
- Call 5 day / 3 hour forecast data

  預測五天資料

  api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

---

考慮到 api 金鑰直接暴露在 index.js 中不安全，上網找尋解決方法。

查到都是設定 env 檔案，因為是要推送到 github pages 顯示，所以就採用了 github secret 加上 github actions 替換的方式。
原本以為他的替換是不會被看到的，結果還是直接暴露了。

後面決定改用 vercel 部屬網站並設定環境變數的方式

這次處理雖然繞了點路但也稍微了解了一點 github actions 的運作，希望以後有機會還會接觸到相關的知識吧。

1. github 儲存庫 setting 設定 Repository secrets
  把 KEY VALUE 設定在這邊

2. github actions 設定 workflow
  ```yaml
  name: Deploy

  on:
    workflow_dispatch: # 允許手動觸發工作流
    push:
      branches:
        - main

  jobs:
    deploy:
      runs-on: ubuntu-latest
    
      steps:
        - name: Checkout code
          uses: actions/checkout@v3

        - name: Replace API key in index.js 
          run: |
            sed -i "s/OPENWEATHER_API_KEY/${{ secrets.OPENWEATHER_API_KEY }}/g" index.js
            cat index.js

        # 部屬到 github pages
        - name: Deploy to GitHub Pages
          uses: peaceiris/actions-gh-pages@v3
          with:
            github_token: ${{ secrets.GITHUB_TOKEN }}
            publish_dir: .
  ```

---

後續 vercel 的設定

1. 在 vercel dashboard 中 設定環境變數 API_KEY

2. 把請求改寫成 vercel serverless functions，讓他可以使用 `process.env` 讀到環境變數，`lib/apiKey.js`

3. 順便把請求抽離變成一個一個的模組在 api 資料夾底下

4. `index.js` type 改成 module 才能使用 import

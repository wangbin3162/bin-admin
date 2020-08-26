<template>
  <div class="weather-wrap">
    <div class="weather-inner">
      <span>{{ time }}</span>
      <template v-if="showWeather">
        <span v-if="city" style="padding-left: 8px;">{{ city }}</span>
        <b-tooltip v-if="weather&&weatherImg" :content="weather" placement="bottom" theme="light"
                   max-width="180"
                   style="height:24px;line-height: 24px;padding-left: 8px;">
          <img :src="weatherImg" class="weather-img" alt="weather" style="height:24px;">
        </b-tooltip>
      </template>
    </div>
  </div>
</template>

<script>
import jsonp from '@/common/utils/jsonp'

const ak = 'H7W5CxI0BPzKtwGcBHmpGPAz50xP1Qjw'

export default {
  name: 'Weather',
  props: {
    showWeather: Boolean
  },
  data() {
    return {
      AK: ak,
      time: '',
      city: '',
      weather: '',
      weatherImg: ''
    }
  },
  created() {
    this.time = this.$util.parseTime(new Date(), '{y}-{m}-{d} 周{a}')
    if (this.showWeather) {
      this.getWeather()
    }
  },
  methods: {
    getWeather() {
      jsonp('https://api.map.baidu.com/location/ip', { ak: this.AK }).then(resp => {
        if (resp.status === 0) {
          this.city = resp.content.address_detail.city
          // 请求天气
          jsonp('http://api.map.baidu.com/telematics/v3/weather', {
            location: this.city,
            output: 'json',
            ak: this.AK
          }).then(data => {
            if (data.status === 'success') {
              let weatherData = data.results[0].weather_data[0]
              let hours = new Date().getHours()
              // 设置天气
              this.weather = `${weatherData.weather}，${weatherData.wind}，气温 ${weatherData.temperature}`
              // 设置图片
              this.weatherImg = (hours > 6 && hours < 18) ? weatherData.dayPictureUrl : weatherData.nightPictureUrl
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.weather-wrap {
  display: inline-block;
  height: 100%;
  padding: 0 12px;
}
.weather-inner {
  display: flex;
  align-items: center;
}
</style>

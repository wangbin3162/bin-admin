<template>
  <div class="weather-wrap">
    <div class="weather-inner">
      <span>{{time}}</span>
      <span>{{city}}</span>
      <span>{{weather}}</span>
      <img v-if="weatherImg" :src="weatherImg" class="weather-img" alt="weather" style="height:24px;">
    </div>
  </div>
</template>

<script>
  import jsonp from '../../common/utils/jsonp'

  const ak = 'H7W5CxI0BPzKtwGcBHmpGPAz50xP1Qjw'

  export default {
    name: 'Weather',
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
      this.time = this.$util.parseTime(new Date(), '{y}-{m}-{d}')
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
              this.weather = weatherData.weather
              // 设置图片
              let hours = new Date().getHours()
              this.weatherImg = (hours > 6 && hours < 18) ? weatherData.dayPictureUrl : weatherData.nightPictureUrl
            }
          })
        }
      })
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
    span {
      padding-right: 8px;
    }
  }
</style>

<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  import { mapActions, mapMutations } from 'vuex'
  import { licCheck } from '@/api/login.api'

  export default {
    name: 'app',
    data () {
      return {
        intervalTimer: null
      }
    },
    created () {
      this.init()
    },
    methods: {
      ...mapActions([
        'logout'
      ]),

      ...mapMutations({
        setLicStatus: 'SET_LIC_STATUS'
      }),

      /**
       * @author haoodongdong
       * @description 初始化操作
       */
      init () {
        const env = process.env.NODE_ENV
        if (env === 'production') {
          // 线上环境执行证书验证检测
          this.licCheck()
          this.loopCheck()
        }
      },

      /**
       * @author haodongdong
       * @description 证书检测接口
       */
      async licCheck () {
        try {
          await licCheck()
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '证书验证失败',
            desc: error
          })

          clearInterval(this.intervalTimer)
          this.setLicStatus(false)

          await this.logout()
          this.$router.push('/login')
        }
      },

      /**
       * @author haodongdong
       * @description 轮询检测证书，暂为30min一次
       */
      loopCheck () {
        this.intervalTimer = setInterval(() => {
          this.licCheck()
        }, 1800000) // 30min轮询一次
      }
    }
  }
</script>

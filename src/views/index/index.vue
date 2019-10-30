<template>
  <div class="app-wrap">
    <div class="scroll-box">
      <div class="index-wrap">
        <div class="main-wrap">
          <base-header></base-header>
          <div>
            <div v-for="i in 10" :key="i">
              <p>{{i}}测试填充内容</p>
            </div>
          </div>
        </div>
        <base-footer></base-footer>
      </div>
    </div>
    <b-back-top></b-back-top>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'index',
    computed: {
      ...mapGetters(['userInfo'])
    }
  }
</script>

<style scoped lang="stylus">
  .app-wrap {
    height: 100%;
    .scroll-box {
      height: 100%;
      overflow: auto;
      .index-wrap {
        width: 100%;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        .main-wrap {
          flex: 1;
        }
      }
    }
  }
</style>

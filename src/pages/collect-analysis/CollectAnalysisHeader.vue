<template>
  <div class="collect-analysis-header">
    <div class="con">
      <!-- <span class="title">归集分析</span> -->
      <img src="../../assets/images/collect-analysis-icon/logo-gjfx.png" />

      <b-button type="info" round plain @click="$router.push('index')">
        返回首页
      </b-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CollectAnalysisHeader',
    data () {
      return {

      }
    },
    created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
  .collect-analysis-header {
    height: 80px;
    background: #ffffff;
    box-shadow: 0 0 8px rgba(100,100,100,0.5);

    .con {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0 30px;

      img {
        max-height: 80px;
      }

      .link-home {
        font-size: 16px;
      }
    }
  }
</style>

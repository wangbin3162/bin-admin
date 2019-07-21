<template>
  <bin-container ref="container">
    <div class="container-wrap">
      <div class="info">
        <h2>bin-container</h2>
        <p>
          bin-container 是封装的滚动容器组件，这里基于bin-ui的b-scrollbar 标签来实现超出滚动，并可配置是否有返回顶部，并且可以通过指定方法来
          滚动到固定位置
        </p>
        <div>
          <b-button @click="scrollTo300" type="primary">滚动到距离顶部300px</b-button>
          <b-button @click="scrollToDom" type="primary">滚动到第10行内容</b-button>
        </div>
        <div style="padding: 20px;">
          <div v-for="item in 50" :key="item" ref="item">{{item}}:这是用来撑开内容的行...</div>
        </div>
      </div>
    </div>
  </bin-container>
</template>

<script>
  export default {
    methods: {
      scrollTo300 () {
        this.$refs.container.scrollTo(300)
      },
      scrollToDom () {
        let items = this.$refs.item
        this.$refs.container.scrollTo(items[9].offsetTop)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .container-wrap {
    .info {
      padding: 20px;
      color: #314659;
      font-size: 14px;
      line-height: 2;
      p, pre {
        padding: 12px 20px;
        margin: 16px 0;
        overflow: auto;
      }
      pre {
        border-radius: 2px;
        background: #f2f4f5;
        font-family: Lucida Console, Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
      }
      .link {
        padding: 0 10px;
      }
    }
  }
</style>

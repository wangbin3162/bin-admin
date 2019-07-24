<template>
  <b-container ref="container" header-fixed>
    <div slot="header">固定头部</div>
    <div class="container-wrap">
      <div class="info">
        <h2>b-container (现已收录至bin-ui，直接使用即可)</h2>
        <p>
          b-container 是封装的滚动容器组件，这里基于bin-ui的b-scrollbar 标签来实现超出滚动，并可配置是否有返回顶部，并且可以通过指定方法来
          滚动到固定位置
        </p>
        <div>
          <b-button @click="scrollTo300" type="primary">滚动到距离顶部300px</b-button>
          <b-button @click="scrollToDom" type="primary">滚动到第10行内容</b-button>
        </div>

        <p>我们还可以使用 `header-fixed` `footer-fixed`两个属性配合slot 的header footer来给容器增加固定的头和底部，或者是只添加插槽来插入可滚动的头和底部</p>
        <div style="padding: 20px; background: #eee;">
          <div v-for="item in 50" :key="item" ref="item">{{item}}:这是用来撑开内容的行...</div>
        </div>
      </div>
    </div>
    <div slot="footer">底部快捷栏(不使用footer-fixed则默认为文档流底部)</div>
  </b-container>
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
      h2 {
        margin: 0;
      }
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

<template>
  <div class="header-wrap">
    <div class="header-inner">
      <div class="top" flex="cross:center">
        <b-icon name="ios-undo" size="26" class="link mr-20"
                @click.native="back"></b-icon>
        <span class="title">{{ title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'title-header',
    props: {
      title: {
        type: String,
        default: '标题'
      }
    },
    methods: {
      back () {
        this.$emit('on-back')
      }
    }
  }
</script>

<style scoped lang="stylus">
  .header-wrap {
    padding: 10px 0;
    background: #fff;
    box-shadow: 0 0 5px #eeeeee;
    .header-inner {
      padding: 0 150px;
      height: 60px;
      .top {
        height: 100%;
      }
      .title {
        font-size: 26px;
      }
    }
  }
</style>

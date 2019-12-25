<template>
  <div class="keywords" :class="randomClass" :style="keywordsStyle">
    <slot>
      <span v-for="(item,index) in words" :key="index">{{ item }}</span>
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'keywords',
    props: {
      size: {
        type: Number,
        default: 50
      },
      radius: {
        type: Number,
        default: 15
      },
      fontSize: {
        type: Number,
        default: 22
      },
      words: {
        type: Array
      },
      padding: {
        type: Number,
        default: 5
      },
      cls: {
        type: String
      }
    },
    computed: {
      keywordsStyle () {
        return {
          width: `${this.size}px`,
          height: `${this.size}px`,
          borderRadius: `${this.radius}px`,
          fontSize: `${this.fontSize}px`,
          padding: `${this.padding}px`,
          color: '#ffffff',
          textAlign: 'center'
        }
      }
    },
    data () {
      return {
        randomClass: ''
      }
    },
    created () {
      this.randomClass = this.cls ? this.cls : `color-${this.$util.getRandomInt(0, 5)}`
    }
  }
</script>

<style scoped lang="stylus">
  .keywords {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background-color: #1f7af6; /* 不支持线性的时候显示 */
    background-image: linear-gradient(to bottom left, #1f7af6, #57a2ff);
    &.color-0 {
      background-color: #1f7af6; /* 不支持线性的时候显示 */
      background-image: linear-gradient(to bottom left, #1f7af6, #57a2ff);
    }
    &.color-1 {
      background-color: #32aef5; /* 不支持线性的时候显示 */
      background-image: linear-gradient(to bottom left, #32aef5, #55cfe1);
    }
    &.color-2 {
      background-color: #a861fe; /* 不支持线性的时候显示 */
      background-image: linear-gradient(to bottom left, #a861fe, #ca7ffe);
    }
    &.color-3 {
      background-color: #fe8496; /* 不支持线性的时候显示 */
      background-image: linear-gradient(to bottom left, #fe8496, #ffac96);
    }
    &.color-4 {
      background-color: #31e8e9; /* 不支持线性的时候显示 */
      background-image: linear-gradient(to bottom left, #31e8e9, #4dc5e9);
    }
    &.color-5 {
      background-color: #63c6fa; /* 不支持线性的时候显示 */
      background-image: linear-gradient(to bottom left, #63c6fa, #4197fa);
    }
  }
</style>

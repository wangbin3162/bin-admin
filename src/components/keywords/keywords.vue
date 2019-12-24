<template>
  <div class="keywords" :style="keywordsStyle">
    <slot>
      <span v-for="(item,index) in words" :key="index">{{ item }}</span>
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'keywords',
    props: {
      backColor: {
        type: String,
        default: '#1ba6ee'
      },
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
      }
    },
    computed: {
      keywordsStyle () {
        return {
          backgroundColor: this.backColor,
          width: `${this.size}px`,
          height: `${this.size}px`,
          borderRadius: `${this.radius}px`,
          fontSize: `${this.fontSize}px`,
          padding: `${this.padding}px`,
          color: '#ffffff',
          textAlign: 'center'
        }
      }
    }
  }
</script>

<style scoped>
  .keywords {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
</style>

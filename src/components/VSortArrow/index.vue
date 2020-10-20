<template>
  <div>
    <b-icon name="ios-arrow-round-up" size="20" @click.native="handleUp"
            style="cursor: pointer;color:#1890ff;" title="上移一层"></b-icon>
    <b-icon name="ios-arrow-round-down" size="20" @click.native="handleDown"
            style="cursor: pointer;color:#737d91;" title="下移一层"></b-icon>
  </div>
</template>

<script>
  export default {
    name: 'VSortArrow',
    methods: {
      handleUp() {
        this.$emit('up')
      },
      handleDown() {
        this.$emit('down')
      }
    }
  }
</script>

<template>
  <div class="gui-field">
    <div class="gui-field-name" v-if="label">{{ label }}</div>
    <div class="gui-field-container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      label: String
    }
  }
</script>

<style lang="stylus" scoped>
  .gui-field {
    display: flex;
    justify-content: space-between;
    padding: 6px 12px;
    min-height: 24px;
    &-name {
      padding-right: 5px;
      line-height: 28px;
    }
    &-container {
      min-height: 24px;
      display: flex;
      width: 260px;
      flex: 0 0 260px;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
    }
  }

  .gui-wrap .gui-field {
    padding-left: 18px;
  }
</style>

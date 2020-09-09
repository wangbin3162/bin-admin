<template>
  <div class="gui-field">
    <div class="gui-field-name" :style="labelStyle" v-if="label">{{ label }}<span></span></div>
    <div class="gui-field-container" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CfgField',
  props: {
    label: String,
    labelWidth: {
      type: String
    },
    labelPosition: {
      type: String,
      default: 'left'
    }
  },
  computed: {
    labelStyle() {
      return {
        width: this.labelWidth,
        textAlign: this.labelPosition
      }
    },
    contentStyle() {
      return {
        width: this.labelWidth ? `calc(100% - ${this.labelWidth})` : null
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.gui-field {
  display: flex;
  padding: 6px 12px;
  min-height: 24px;
  &-name {
    padding-right: 5px;
    line-height: 28px;
    width: 70px;
    color: rgba(0, 0, 0, .85);
  }
  &-container {
    min-height: 24px;
    display: flex;
    width: calc(100% - 70px);
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
}

.gui-wrap .gui-field {
  padding-left: 18px;
}
</style>

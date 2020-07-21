<template>
  <div class="scale-slider">
    <div class="data-slider">
      <b-icon name="ios-remove-circle-outline" class="zoom-out" @click.native="changeRange(-1)"></b-icon>
      <input type="range" :min="min" :max="max" class="input-range" :step="step"
             v-model="range" :style="rangeStyle">
      <b-icon name="ios-add-circle-outline" class="zoom-in" @click.native="changeRange(1)"></b-icon>
    </div>
    <div class="label">{{ range }}</div>
  </div>
</template>

<script>
  export default {
    name: 'VSlider',
    props: {
      value: Number,
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 1
      },
      step: {
        type: Number,
        default: 0.1
      }
    },
    data() {
      return {
        range: this.value
      }
    },
    computed: {
      rangeStyle() {
        let percent = (this.range / (this.max - this.min)) * 100
        return `background: linear-gradient(to right, rgb(0, 251, 255), rgb(0, 176, 255) ${percent}%, rgb(38, 42, 53) ${percent}%, rgb(38, 42, 53));`
      }
    },
    methods: {
      changeRange(val) {
        this.range += val * this.step

        const decimalCases = (String(this.step).split('.')[1] || '').length
        this.range = Number(this.range.toFixed(decimalCases))
        if (this.range > this.max) {
          this.range = this.max
        }
        if (this.range < this.min) {
          this.range = this.min
        }
      }
    },
    watch: {
      value(val) {
        this.range = val
      },
      range() {
        this.$emit('input', Number(this.range))
        this.$emit('on-change', Number(this.range))
      }
    }
  }
</script>

<style scoped lang="stylus">
  .scale-slider {
    height: 28px;
    width: 100%;
    display: flex;
    .label {
      font-size: 12px;
      line-height: 28px;
      padding: 0 5px;
    }
    .data-slider {
      display: flex;
      align-items: center;
      .input-range {
        cursor: pointer;
        margin: 0 8px;
        height: 2px;
        -webkit-appearance: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        outline: 0;
        &::-webkit-slider-thumb {
          cursor: grab;
          -webkit-appearance: none; /*清除系统默认样式*/
          height: 12px; /*拖动块高度*/
          width: 12px; /*拖动块宽度*/
          background: #fff; /*拖动块背景*/
          border: solid 1px #202020; /*设置边框*/
        }
      }
      .iconfont {
        cursor: pointer;
        font-size: 18px;
      }
    }
  }
</style>

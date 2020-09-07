<template>
  <div class="matrix-input">
    <b-input-number v-model="dividend"
      :max="9" :min="1" :precision="0">
    </b-input-number>
    <div class="line"> / </div>
    <b-input-number v-model="divisor"
      :max="9" :min="1" :precision="0">
    </b-input-number>
  </div>
</template>

<script>
  export default {
    name: 'MatrixInput',
    props: {
      value: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        dividend: null, // 被除数
        divisor: null // 除数
      }
    },
    watch: {
      value: {
        handler (newVal) {
          if (newVal !== '1') {
            const arr = newVal.split('/')
            this.dividend = Number(arr[0]) === 0 ? null : Number(arr[0])
            this.divisor = Number(arr[1]) === 0 ? null : Number(arr[1])
          }
        },
        immediate: true
      },
      dividend: {
        handler (newVal) {
          // if (this.dividend && this.divisor) {
          //   }
          let res = this.dividend + '/' + this.divisor
          this.$emit('input', res.replace(/null/g, ''))
        }
      },
      divisor: {
        handler (newVal) {
          // if (this.dividend && this.divisor) {
          //   }
          let res = this.dividend + '/' + this.divisor
          this.$emit('input', res.replace(/null/g, ''))
        }
      }
    },
    created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
  .matrix-input {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    width: 110px;

    .line {
      min-width: 7px;
      max-width: 7px;
      text-align: center;
    }
  }
</style>

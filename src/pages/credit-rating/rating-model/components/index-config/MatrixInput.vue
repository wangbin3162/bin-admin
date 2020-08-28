<template>
  <div class="matrix-input">
    <b-input-number v-model="dividend" style="width: 55px;"
      :max="9" :min="1" :precision="0">
    </b-input-number>
    <div class="pl-10 pr-10"> / </div>
    <b-input-number v-model="divisor" style="width: 55px;"
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
          if (this.dividend && this.divisor) {
            this.$emit('input', this.dividend + '/' + this.divisor)
          }
        }
      },
      divisor: {
        handler (newVal) {
          if (this.dividend && this.divisor) {
            this.$emit('input', this.dividend + '/' + this.divisor)
          }
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
   flex-wrap: wrap;

 }
</style>

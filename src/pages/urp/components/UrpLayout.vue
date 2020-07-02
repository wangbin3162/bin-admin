<template>
  <div class="app-wrap">
    <div class="index-wrap">
      <slot></slot>
    </div>
    <urp-footer v-if="!footHide"></urp-footer>
    <b-back-top :height="200"></b-back-top>
  </div>
</template>

<script>
  import UrpFooter from './UrpFooter'

  export default {
    name: 'UrpLayout',
    components: { UrpFooter },
    props: {
      footHide: Boolean
    }
  }
</script>

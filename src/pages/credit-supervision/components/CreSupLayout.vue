<template>
  <div class="app-wrap">
    <div class="index-wrap">
      <slot></slot>
    </div>
    <cre-sup-footer v-if="!footHide"></cre-sup-footer>
    <b-back-top :height="200"></b-back-top>
  </div>
</template>

<script>
  import CreSupFooter from '@/pages/credit-supervision/components/CreSupFooter'

  export default {
    name: 'CreSupLayout',
    props: {
      footHide: Boolean
    },
    components: {
      CreSupFooter
    }
  }
</script>

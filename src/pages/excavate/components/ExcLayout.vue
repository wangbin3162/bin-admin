<template>
  <div class="app-wrap">
    <div class="index-wrap">
      <slot></slot>
    </div>
    <exc-footer v-if="!footHide"></exc-footer>
    <b-back-top :height="200"></b-back-top>
  </div>
</template>

<script>

import ExcFooter from '@/pages/excavate/components/ExcFooter'
export default {
  name: 'ExcLayout',
  components: { ExcFooter },
  props: {
    footHide: Boolean
  }
}
</script>

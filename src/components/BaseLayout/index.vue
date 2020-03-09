<template>
  <div class="app-wrap">
    <div class="index-wrap">
      <slot></slot>
    </div>
    <base-footer v-if="!footHide"></base-footer>
    <b-back-top :height="200"></b-back-top>
  </div>
</template>

<script>
  export default {
    name: 'BaseLayout',
    props: {
      footHide: Boolean
    }
  }
</script>

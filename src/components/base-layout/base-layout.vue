<template>
  <div class="app-wrap">
    <div class="scroll-box">
      <div class="index-wrap">
        <slot></slot>
        <base-footer v-if="!footHide"></base-footer>
      </div>
    </div>
    <b-back-top></b-back-top>
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

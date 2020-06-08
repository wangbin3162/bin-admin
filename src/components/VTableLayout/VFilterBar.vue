<template>
  <div class="filter-bar" @keyup.enter="$emit('keyup-enter')">
    <b-row type="flex">
      <slot></slot>
    </b-row>
  </div>
</template>

<script>
  export default {
    name: 'VFilterBar'
  }
</script>

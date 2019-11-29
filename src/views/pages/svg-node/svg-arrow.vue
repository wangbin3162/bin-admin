<template>
  <g>
    <polygon points="0,0 20,0 20,-6 30,1 20,8 20,2 0,2" :transform="transform"
             style="fill: rgb(0, 132, 255); opacity: 0.5;"></polygon>
  </g>
</template>

<script>
  export default {
    name: 'svg-arrow',
    props: {
      transform: {
        type: String,
        default: null
      }
    }
  }
</script>

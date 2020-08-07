<template>
  <svg class="move-wrap" height='160' version='1.1' xmlns='http://www.w3.org/2000/svg'>
    <path d="M0 80
                 C80 40, 120 40, 200 80
                 S320 120,400 80
                 S520 40,600 80
                 S720 120,800 80
                 S920 40,1000 80
                 S1120 120,1200 80
                 S1320 40,1400 80
                 S1520 120,1600 80
                 S1720 40,1800 80
                 S1920 120,2000 80
                 S2120 40,2200 80
                 S2320 120,2400 80
                 V160 H0 Z" fill="rgba(47, 139, 253, .5)" stroke-width="3">
      <animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" to="-400" dur="10s"
                        repeatCount="indefinite"></animateTransform>
    </path>
    <path d="M0 100
                 C80 40, 120 40, 200 100
                 S320 160,400 100
                 S520 40,600 100
                 S720 160,800 100
                 S920 40,1000 100
                 S1120 160,1200 100
                 S1320 40,1400 100
                 S1520 160,1600 100
                 S1720 40,1800 100
                 S1920 160,2000 100
                 S2120 40,2200 100
                 S2320 160,2400 100
                 V160 H0 Z" fill="rgba(47, 139, 253, .35)" stroke-width="3">
      <animateTransform attributeName="transform" attributeType="XML" type="translate" from="-400" to="0" dur="11.5s"
                        repeatCount="indefinite"></animateTransform>
    </path>
  </svg>
</template>

<script>
export default {
  name: 'Waves'
}
</script>

<style scoped>
.move-wrap {
  width: 100%;
}
</style>

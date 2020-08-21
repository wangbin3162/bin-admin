<template>
  <div class="gather-analyze">
    <leg-person v-if="isLeg"></leg-person>
    <nat-person v-else></nat-person>
  </div>
</template>

<script>
import NatPerson from '@/pages/excavate/NatPerson'
import LegPerson from '@/pages/excavate/LegPerson'

require('bin-charts/src/theme/charts-theme')
export default {
  name: 'PersonAnalyze',
  components: { LegPerson, NatPerson },
  computed: {
    isLeg() {
      return this.$route.query.personType === 'LEG'
    }
  }
}
</script>

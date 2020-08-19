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
      return false
    }
  }
}
</script>

<style scoped lang="stylus">
.gather-analyze {
  .filter {
    text-align: right;
    margin-bottom: 8px;
  }

  .chart-widget-item {
    position: relative;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 5px 1px rgba(100, 100, 100, .1);
    margin-bottom: 16px;
    h2 {
      font-weight: normal;
      font-size: 16px;
      border-bottom: 1px solid #eeeeee;
      padding: 6px 2px;
      span {
        position: relative;
        line-height: 30px;
        padding: 0 18px;
        &:before {
          content: '';
          position: absolute;
          left: 2px
          top: 2px;
          bottom: 2px;
          width: 2px;
          background-color: #1089ff;
        }
      }
    }
    .chart-wrap {
      padding: 0 16px;
    }
  }
}
</style>

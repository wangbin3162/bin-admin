<template>
  <table class="nb-table-header"
         v-if="titleHeader"
         width="100%"
         border="0"
         cellspacing="0"
         cellpadding="0"
         align="center">
    <tr>
      <td align="center" class="main-header" height="40">{{ titleHeader.mainHeader }}</td>
    </tr>
    <tr>
      <td align="center" class="sub-header" height="40">{{ titleHeader.subHeader }}</td>
    </tr>
    <tr v-for="(desc,index) in titleHeader.desc" :key="index">
      <td :align="desc.align" height="25">{{ desc.content }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'NbTitleHeader',
  props: {
    titleHeader: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.nb-table-header {
  font-family: SimSong SimHei STHeiti "PingFang SC" Arial;
  .main-header {
    font-size: 24px;
    font-weight: bold;
    border-bottom: 1px dashed #CCCCCC;
    color: #255e95;
  }
  .sub-header {
    font-size: 18px;
    font-weight: 500;
  }
  td {
    font-size: #333;
  }
}
</style>

<template>
  <page-header-wrap>
    <v-table-wrap>
      <div class="global-anchor">
        <b-anchor show-ink :scroll-offset="0">
          <b-anchor-link href="#sheet1" title="1、省直机构数据归集情况"></b-anchor-link>
          <b-anchor-link href="#sheet2" title="2、设区市数据归集情况"></b-anchor-link>
          <b-anchor-link href="#sheet3" title="3、组织归集数据量明细"></b-anchor-link>
          <b-anchor-link href="#sheet4" title="4、数据入库年度趋势"></b-anchor-link>
          <b-anchor-link href="#sheet5" title="5、数据入库季度趋势"></b-anchor-link>
          <b-anchor-link href="#sheet6" title="6、数据入库月度趋势"></b-anchor-link>
          <b-anchor-link href="#sheet7" title="7、入库数据年度趋势"></b-anchor-link>
          <b-anchor-link href="#sheet8" title="8、分类统计汇总"></b-anchor-link>
          <b-anchor-link href="#sheet9" title="9、目录分类统计汇总"></b-anchor-link>
        </b-anchor>
      </div>
      <sheet1></sheet1>
      <b-divider></b-divider>
      <sheet2></sheet2>
      <b-divider></b-divider>
      <sheet3></sheet3>
      <b-divider></b-divider>
      <sheet4></sheet4>
      <b-divider></b-divider>
      <sheet5></sheet5>
      <b-divider></b-divider>
      <sheet6></sheet6>
      <b-divider></b-divider>
      <sheet7></sheet7>
      <b-divider></b-divider>
      <sheet8></sheet8>
      <b-divider></b-divider>
      <sheet9></sheet9>
    </v-table-wrap>
  </page-header-wrap>
</template>

<script>
import Sheet1 from '@/pages/demo/table/sheets/sheet1'
import Sheet2 from '@/pages/demo/table/sheets/sheet2'
import Sheet3 from '@/pages/demo/table/sheets/sheet3'
import Sheet4 from '@/pages/demo/table/sheets/sheet4'
import Sheet5 from '@/pages/demo/table/sheets/sheet5'
import Sheet6 from '@/pages/demo/table/sheets/sheet6'
import Sheet7 from '@/pages/demo/table/sheets/sheet7'
import Sheet8 from '@/pages/demo/table/sheets/sheet8'
import Sheet9 from '@/pages/demo/table/sheets/sheet9'

export default {
  name: 'SheetDemo',
  components: { Sheet1, Sheet2, Sheet3, Sheet4, Sheet5, Sheet6, Sheet7, Sheet8, Sheet9 }
}
</script>

<style>
.global-anchor {
  position: fixed;
  top: 100px;
  right: 0;
  max-height: calc(100vh - 120px);
  padding: 5px;
  width: 200px;
  z-index: 9999;
  overflow-y: auto;
}
</style>

<template>
  <div id="sheet9">
    <v-title-bar label="9、目录分类统计汇总报表" style="margin-bottom: 15px;"></v-title-bar>
    <nb-table
      :title-header="titleHeader"
      :column="column"
      :data="transformRows.rows"
      :merge-method="handleSpan">
    </nb-table>
    <b-divider></b-divider>
    <b-row :gutter="15">
      <b-col :span="11">
        <b-ace-editor :value="JSON.stringify(data,null,2)"
                      height="300" theme="sqlserver"
                      @change="handleChangeData">
        </b-ace-editor>
      </b-col>
      <b-col :span="2">
        <b-button type="primary" @click="transData">转换</b-button>
      </b-col>
      <b-col :span="11">
        <b-ace-editor :value="JSON.stringify(transformRows,null,2)"
                      height="300" theme="sqlserver" readonly>
        </b-ace-editor>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import NbTable from '@/components/NbTable'
import { deepCopy } from '@/common/utils/assist'
import { getAllRows, getMergeData, matchRow } from '@/components/NbTable/util'

export default {
  name: 'sheet1',
  components: { NbTable },
  data() {
    return {
      titleHeader: {
        mainHeader: '入库数据统计表-分类统计',
        subHeader: '(河北省社会信用信息中心)',
        desc: [{ content: '<span style="margin-right: 30px;">起始年月：2019年01月</span><span>截止年月：2020年11月</span>' }]
      },
      column: [
        { title: '部门分类', key: 'deptType' },
        { title: '序号', key: 'no' },
        { title: '部门名称', key: 'deptName', headAlign: 'center', align: 'left' },
        { title: '主体分类', key: 'type' },
        { title: '二级类目', key: 'type2', headAlign: 'center', align: 'left' },
        { title: '二级分类小计', key: 'count', headAlign: 'center', align: 'right' },
        { title: '主体分类小计', key: 'typeCount', headAlign: 'center', align: 'right' },
        { title: '部门小计', key: 'deptCount', headAlign: 'center', align: 'right' }
      ],
      data: [
        {
          deptType: '司法部门',
          deptName: '河北省高级人民法院',
          type: '自然人',
          type2: '强制执行信息',
          count: 12560
        },
        {
          deptType: '司法部门',
          deptName: '河北省高级人民法院',
          type: '自然人',
          type2: '政府内部审批',
          count: 75340
        },
        {
          deptType: '司法部门',
          deptName: '河北省高级人民法院',
          type: '法人',
          type2: '拖欠公共事业费用信息',
          count: 11566
        },
        {
          deptType: '司法部门',
          deptName: '河北省高级人民法院',
          type: '法人',
          type2: '强制执行信息',
          count: 2536
        },
        {
          deptType: '党委系统',
          deptName: '中共河北省委机构编制委员会办公室',
          type: '法人',
          type2: '行政许可信息',
          count: 266
        }
      ],
      transformRows: {}, // 转换后的行数据
      mergeColumns: ['deptType', 'deptName', 'type'], // 要合并的字段列表
      sumFields: []
    }
  },
  created() {
    this.transData()
  },
  methods: {
    handleChangeData(val) {
      try {
        this.data = JSON.parse(val)
      } catch (e) {
      }
    },
    transData() {
      const cloneData = deepCopy(this.data)
      // 获取转换后的值以及原始克隆值
      const { rows, map } = getAllRows(cloneData, this.mergeColumns, ['count'])
      // 2.排序是否有排序字段，orderField为依赖哪个字段追加no序号
      const orderList = map.filter(i => i.key === 'deptName')
      orderList.forEach((item, index) => {
        item.rows.forEach(i => {
          // 追加序号
          rows[i.__index].no = index + 1
          // 追加部门分类小计
          rows[i.__index]['deptCount'] = item['countSum']
        })
      })
      const sumTypeList = map.filter(i => i.key === 'type')
      sumTypeList.forEach((item) => {
        item.rows.forEach(i => {
          // 追加部门分类小计
          rows[i.__index]['typeCount'] = item['countSum']
        })
      })

      this.transformRows = deepCopy({ rows, map })
    },
    handleSpan({ row, column, rowIndex, columnIndex }) {
      const result = matchRow(row, column, this.mergeColumns, this.transformRows)
      if (result) return result

      // 追加序号以及求和判断
      if (column.key === 'no' || column.key === 'deptCount') {
        const result = getMergeData(row, this.mergeColumns, 'deptName', this.transformRows.map)
        if (result) return result
      }
      if (column.key === 'typeCount') {
        const result = getMergeData(row, this.mergeColumns, 'type', this.transformRows.map)
        if (result) return result
      }
    }
  }
}
</script>

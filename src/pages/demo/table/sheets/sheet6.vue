<template>
  <div id="sheet6">
    <v-title-bar label="6、数据入库月度趋势统计表" style="margin-bottom: 15px;"></v-title-bar>
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
import { getAllRows, matchRow, sumByFields } from '@/components/NbTable/util'

export default {
  name: 'sheet1',
  components: { NbTable },
  data() {
    return {
      titleHeader: {
        mainHeader: '数据入库月度趋势统计表',
        subHeader: '(河北省社会信用信息中心)',
        desc: [{ content: '数据时间：2019年' }, { content: '制表时间：2020-10-26' }]
      },
      column: [
        { title: '部门分类', key: 'deptType', align: 'center' },
        { title: '部门名称', key: 'deptName', headAlign: 'center', align: 'left' },
        {
          title: '数据入库量(条）',
          align: 'center',
          children: [
            { title: '1月', key: 'm1', headAlign: 'center', align: 'right' },
            { title: '2月', key: 'm2', headAlign: 'center', align: 'right' },
            { title: '3月', key: 'm3', headAlign: 'center', align: 'right' },
            { title: '4月', key: 'm4', headAlign: 'center', align: 'right' },
            { title: '5月', key: 'm5', headAlign: 'center', align: 'right' },
            { title: '6月', key: 'm6', headAlign: 'center', align: 'right' },
            { title: '7月', key: 'm7', headAlign: 'center', align: 'right' },
            { title: '8月', key: 'm8', headAlign: 'center', align: 'right' },
            { title: '9月', key: 'm9', headAlign: 'center', align: 'right' },
            { title: '10月', key: 'm10', headAlign: 'center', align: 'right' },
            { title: '11月', key: 'm11', headAlign: 'center', align: 'right' },
            { title: '12月', key: 'm12', headAlign: 'center', align: 'right' }
          ]
        }
      ],
      data: [
        {
          deptType: '司法部门',
          deptName: '河北省委编办',
          m1: 18,
          m2: 73,
          m3: 32,
          m4: 31,
          m5: 212,
          m6: 412,
          m7: 132,
          m8: 1231,
          m9: 123,
          m10: 35,
          m11: 21,
          m12: 123
        },
        {
          deptType: '党委系统',
          deptName: '省高级人民法院',
          m1: 21351,
          m2: 12312,
          m3: 241,
          m4: 42124,
          m5: 14214,
          m6: 1551,
          m7: 15125,
          m8: 152125,
          m9: 2543,
          m10: 512345,
          m11: 5123,
          m12: 2152
        }
      ],
      transformRows: {}, // 转换后的行数据
      mergeColumns: [], // 要合并的字段列表
      sumFields: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12']
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
      // 1.先进行求和转换列 根据某些字段名称进行求和注意，这里可能会有前置条件，最后会把前置条件值进行分类区分
      const { map } = sumByFields(this.data, this.sumFields)
      const total = {
        deptType: '合计',
        deptName: '合计'
      }
      for (let i = 0; i < this.sumFields.length; i++) {
        const key = this.sumFields[i]
        total[key] = map[key].total
      }

      const cloneData = deepCopy(this.data)
      cloneData.push(total)
      // 获取转换后的值以及原始克隆值
      const allRows = getAllRows(cloneData, this.mergeColumns)
      this.transformRows = deepCopy(allRows)
    },
    handleSpan({ row, column, rowIndex, columnIndex }) {
      const result = matchRow(row, column, this.mergeColumns, this.transformRows)
      if (result) return result
      // 合计行合并列
      if (row.deptType === '合计' && row.deptName === '合计') {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 2
          }
        } else if (columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

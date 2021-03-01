<template>
  <div id="sheet5">
    <v-title-bar label="数据入库季度趋势统计表" style="margin-bottom: 15px;"></v-title-bar>
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
        mainHeader: '数据入库季度趋势统计表',
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
            { title: '1季度', key: 's1', headAlign: 'center', align: 'right' },
            { title: '2季度', key: 's2', headAlign: 'center', align: 'right' },
            { title: '3季度', key: 's3', headAlign: 'center', align: 'right' },
            { title: '4季度', key: 's4', headAlign: 'center', align: 'right' }
          ]
        }
      ],
      data: [
        {
          deptType: '司法部门',
          deptName: '河北省委编办',
          s1: 18,
          s2: 73,
          s3: 32,
          s4: 52
        },
        {
          deptType: '党委系统',
          deptName: '省高级人民法院',
          s1: 1214,
          s2: 12414,
          s3: 2523,
          s4: 12414
        }
      ],
      transformRows: {}, // 转换后的行数据
      mergeColumns: [], // 要合并的字段列表
      sumFields: ['s1', 's2', 's3', 's4']
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

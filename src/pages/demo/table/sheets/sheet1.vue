<template>
  <div id="sheet1">
    <v-title-bar label="1、省直机构数据归集情况统计汇总报表" style="margin-bottom: 15px;"></v-title-bar>
    <nb-table :column="column" :data="transformRows.rows" :merge-method="handleSpan"></nb-table>
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
import { getAllRows, matchRow } from '@/components/NbTable/util'

export default {
  name: 'sheet1',
  components: { NbTable },
  data() {
    return {
      column: [
        {
          title: '省直机构数据归集情况统计汇总报表',
          align: 'center',
          style: { fontSize: '24px' },
          children: [
            {
              title: '日期范围：2020-01~2020~10',
              align: 'right',
              style: { fontSize: '24px', background: '#fff' },
              children: [
                { title: '组织类别', key: 'deptType', style: { background: '#fff' } },
                { title: '组织名称', key: 'dataName', headAlign: 'center', align: 'left', style: { background: '#fff' } },
                { title: '归集数量量', key: 'count', headAlign: 'center', align: 'right', style: { background: '#fff' } },
                { title: '格式错误量', key: 'error', headAlign: 'center', align: 'right', style: { background: '#fff' } },
                { title: '重复量', key: 'repeat', headAlign: 'center', align: 'right', style: { background: '#fff' } },
                { title: '入库率', key: 'ratio', headAlign: 'center', align: 'right', style: { background: '#fff' } }
              ]
            }
          ]
        }
      ],
      data: [
        {
          deptType: '政府系统',
          dataName: '教育厅',
          count: 1000,
          error: 2,
          repeat: 1,
          ratio: '97%'
        },
        {
          deptType: '政府系统',
          dataName: '农业厅',
          count: 100,
          error: 1,
          repeat: 0,
          ratio: '98%'
        }
      ],
      transformRows: {}, // 转换后的行数据
      mergeColumns: ['deptType']// 要合并的字段列表
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
      // 获取转换后的值以及原始克隆值
      const cloneData = deepCopy(this.data)
      // 获取转换后的值以及原始克隆值
      const { rows, map } = getAllRows(cloneData, this.mergeColumns)
      this.transformRows = deepCopy({ rows, map })
    },
    handleSpan({ row, column, rowIndex, columnIndex }) {
      const result = matchRow(row, column, this.mergeColumns, this.transformRows)
      if (result) return result
    }
  }
}
</script>

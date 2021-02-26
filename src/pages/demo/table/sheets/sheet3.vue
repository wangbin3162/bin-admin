<template>
  <div>
    <v-title-bar label="***组织归集数据量明细统计报表" style="margin-bottom: 15px;"></v-title-bar>
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
import { getAllRows } from '@/components/NbTable/util'

export default {
  name: 'sheet1',
  components: { NbTable },
  data() {
    return {
      column: [
        {
          title: '***组织归集数据量明细统计报表',
          align: 'center',
          style: { fontSize: '24px' },
          children: [
            {
              title: '主体类型',
              style: { fontSize: '24px', background: '#fff' },
              children: [
                { title: '一级分类', key: 'type', style: { background: '#fff' } },
                { title: '二级分类', key: 'type2', style: { background: '#fff' } },
                { title: '资源目录名称', key: 'resourceName', style: { background: '#fff' } }
              ]
            },
            {
              title: '日期范围：2020-01~2020~10',
              style: { fontSize: '24px', background: '#fff' },
              children: [
                { title: '归集数量量', key: 'count', style: { background: '#fff' } },
                { title: '格式错误量', key: 'error', style: { background: '#fff' } },
                { title: '重复量', key: 'repeat', style: { background: '#fff' } },
                { title: '入库率', key: 'ratio', style: { background: '#fff' } }
              ]
            }
          ]
        }
      ],
      data: [
        {
          type: '行政执法',
          type2: '行政许可',
          resourceName: '企业投资项目核准',
          count: 1000,
          error: 2,
          repeat: 1,
          ratio: '97%'
        },
        {
          type: '行政执法',
          type2: '行政许可',
          resourceName: '许可排污',
          count: 100,
          error: 1,
          repeat: 0,
          ratio: '98%'
        },
        {
          type: '行政执法',
          type2: '行政处罚',
          resourceName: '失信惩戒',
          count: 100,
          error: 1,
          repeat: 0,
          ratio: '98%'
        }
      ],
      transformRows: {}, // 转换后的行数据
      mergeColumns: ['type', 'type2']// 要合并的字段列表
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
      const allRows = getAllRows(this.data, this.mergeColumns)
      this.transformRows = deepCopy(allRows)
    },
    handleSpan({ row, column, rowIndex, columnIndex }) {
      const { map } = this.transformRows
      if (!map) return
      if (this.mergeColumns.includes(column.key)) {
        const matchRow = map.find(item => item.value === row[column.key])
        if (matchRow) {
          return {
            rowspan: row.__id === matchRow.firstId ? matchRow.rowSpan : 0,
            colspan: 1
          }
        }
      }
    }
  }
}
</script>

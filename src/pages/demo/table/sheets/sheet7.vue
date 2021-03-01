<template>
  <div id="sheet7">
    <v-title-bar label="7、入库数据年度趋势统计表" style="margin-bottom: 15px;"></v-title-bar>
    <div style="overflow-x: auto;">
      <div style="width: 2500px;">
        <nb-table
          :title-header="titleHeader"
          :column="column"
          :data="transformRows.rows"
          :merge-method="handleSpan">
        </nb-table>
      </div>
    </div>
    <div style="width: 100%;">
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
  </div>
</template>

<script>
import NbTable from '@/components/NbTable'
import { deepCopy } from '@/common/utils/assist'
import { getAllRows, getMergeData, matchRow, sumByFields } from '@/components/NbTable/util'

export default {
  name: 'sheet1',
  components: { NbTable },
  data() {
    return {
      titleHeader: {
        mainHeader: '入库数据年度趋势统计表',
        subHeader: '(河北省社会信用信息中心)'
      },
      column: [
        { title: '部门分类', key: 'deptType', width: 73, align: 'center', style: { fontSize: '12px' } },
        { title: '序号', key: 'no', width: 50, style: { fontSize: '12px' } },
        { title: '部门名称', key: 'deptName', width: 73, headAlign: 'center', align: 'left', style: { fontSize: '12px' } },
        { title: '主体分类', key: 'type', width: 73, style: { fontSize: '12px' } }
      ],
      data: [
        {
          deptType: '司法部门',
          deptName: '河北省高级人民法院',
          type: '自然人',
          data: [7112, 3052, 3220, 1465, 1401, 4600, 9864, 10010, 14961, 8078, 11577, 12560]
        },
        {
          deptType: '司法部门',
          deptName: '河北省高级人民法院',
          type: '法人',
          data: [585, 478, 167, 0, 0, 717, 1622, 1687, 2715, 1682, 1913, 2536]
        },
        {
          deptType: '党委系统',
          deptName: '中共河北省委机构编制委员会办公室',
          type: '法人',
          data: [5, 13, 0, 34, 25, 16, 21, 25, 18, 23, 70, 16]
        },
        {
          deptType: '政府系统',
          deptName: '河北省发展和改革委员会',
          type: '法人',
          data: [127, 32, 13, 16, 17, 12, 22, 16, 22, 9, 16, 13]
        },
        {
          deptType: '政府系统',
          deptName: '河北省公安厅',
          type: '法人',
          data: [5, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          deptType: '政府系统',
          deptName: '河北省交通管理局',
          type: '自然人',
          data: [0, 0, 0, 15546, 3834, 2781, 3666, 3561, 2835, 3158, 2597, 11915]
        },
        {
          deptType: '政府系统',
          deptName: '河北省民政厅',
          type: '自然人',
          data: [0, 0, 0, 0, 1122, 13, 2123, 123, 123, 213, 312, 312]
        },
        {
          deptType: '政府系统',
          deptName: '河北省交通运输厅',
          type: '自然人',
          data: [22232, 45, 123, 421, 212, 312, 6223, 1232, 41212, 41265, 122, 124]
        },
        {
          deptType: '政府系统',
          deptName: '河北省交通运输厅',
          type: '法人',
          data: [124, 124, 5212, 5132, 2363, 2341, 12, 2143, 124, 214, 521, 1212]
        },
        {
          deptType: '政府系统',
          deptName: '河北省水利厅',
          type: '自然人',
          data: [0, 0, 0, 14, 12, 13, 2412, 241, 14, 124, 124, 12441]
        },
        {
          deptType: '政府系统',
          deptName: '河北省水利厅',
          type: '法人',
          data: [17, 23, 12, 124, 112, 23, 3412, 341, 44, 224, 14, 1441]
        }
      ],
      transformRows: {}, // 转换后的行数据
      mergeColumns: ['deptType', 'deptName'], // 要合并的字段列表
      sumFields: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12']

    }
  },
  created() {
    this.column = this.column.concat(this.sumFields.map((item, index) => {
      return {
        key: item,
        title: `2019-${index < 9 ? ('0' + (index + 1)) : (index + 1)}`,
        headAlign: 'center',
        align: 'right',
        children: [
          { key: `${item}Count`, title: '主体分类小计', headAlign: 'center', align: 'right', style: { fontSize: '12px' } },
          {
            key: `${item}CountSum`,
            title: '部门小计',
            headAlign: 'center',
            align: 'right',
            width: 73,
            style: { fontSize: '12px' }
          }
        ],
        style: { fontSize: '12px' }
      }
    })).concat([{
      key: 'total',
      title: '年度合计',
      headAlign: 'center',
      align: 'right',
      children: [
        { key: 'totalCount', title: '主体分类小计', headAlign: 'center', align: 'right', style: { fontSize: '12px' } },
        { key: 'totalCountSum', title: '部门小计', headAlign: 'center', align: 'right', style: { fontSize: '12px' } }
      ],
      style: { fontSize: '12px' }
    }])
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
      const dataTrans = this.data.map(item => {
        const totalCount = item.data.reduce((total, current) => total + current, 0)
        const countMap = {}
        item.data.forEach((count, index) => {
          countMap[`m${index + 1}Count`] = count
        })
        return {
          deptType: item.deptType,
          deptName: item.deptName,
          type: item.type,
          ...countMap,
          totalCount
        }
      })
      const cloneData = deepCopy(dataTrans)
      // 合计字段数组
      const sumFields = this.sumFields.map(item => `${item}Count`).concat('totalCount')
      const { rows, map } = getAllRows(cloneData, this.mergeColumns, sumFields)
      // 2.排序是否有排序字段，orderField为依赖哪个字段追加no序号
      const orderList = map.filter(i => i.key === 'deptName')
      orderList.forEach((item, index) => {
        item.rows.forEach(i => {
          // 追加序号
          rows[i.__index].no = index + 1
          // 追加部门分类小计
          sumFields.forEach(key => {
            rows[i.__index][`${key}Sum`] = item[`${key}Sum`]
          })
        })
      })

      this.transformRows = deepCopy({ rows, map })
    },
    handleSpan({ row, column, rowIndex, columnIndex }) {
      const result = matchRow(row, column, this.mergeColumns, this.transformRows)
      if (result) return result
      // 追加序号以及求和判断
      const sumFields = this.sumFields.map(item => `${item}CountSum`).concat('totalCountSum')
      if (column.key === 'no' || sumFields.includes(column.key)) {
        const result = getMergeData(row, this.mergeColumns, 'deptName', this.transformRows.map)
        if (result) return result
      }
    }
  }
}
</script>

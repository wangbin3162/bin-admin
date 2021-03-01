<template>
  <div class="nb-table-wrapper">
    <nb-title-header :title-header="titleHeader" v-if="titleHeader"></nb-title-header>
    <table width="100%"
           border="0"
           cellspacing="0"
           cellpadding="4"
           class="nb-table"
           align="center">
      <colgroup>
        <col v-for="(column, index) in cloneColumns" :width="setCellWidth(column)" :key="'group-'+index">
      </colgroup>
      <thead>
      <tr v-for="(cols, rowIndex) in columnRows" :key="rowIndex">
        <th
            v-for="(column, index) in cols"
            :key="index"
            :colspan="column.colSpan"
            :rowspan="column.rowSpan"
            :align="column.headAlign || column.align || 'center'"
            :style="column.style"
        >
          <span class="nb-table-cell">{{ column.title }}</span>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row,index) in rebuildData" :key="index">
        <template v-for="(column,colIndex) in cloneColumns">
          <td
              :key="column._columnKey"
              v-if="showWithSpan(row, column, index, colIndex)"
              v-bind="getSpan(row, column, index, colIndex)"
              :align="column.align || 'center'"
              :style="column.style"
          >
            <span class="nb-table-cell">{{ row[column.key] }}</span>
          </td>
        </template>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import NbTitleHeader from '@/components/NbTable/nb-title-header'
import { deepCopy } from '@/common/utils/assist'
import { getAllColumns, getRandomStr, convertToRows } from './util'

let rowKey = 1
let columnKey = 1
export default {
  name: 'NbTable',
  components: { NbTitleHeader },
  props: {
    titleHeader: {
      type: Object
    },
    column: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    mergeMethod: Function
  },
  data() {
    return {
      cloneColumns: [],
      columnRows: [], // 转换后的表头
      rebuildData: [] // 排序转换data
    }
  },
  created() {
    const colsWithId = this.makeColumnsId(this.column)
    // 克隆原始列头，只会保留带有key值的实际字段
    this.cloneColumns = this.makeColumns(colsWithId)
    this.columnRows = this.makeColumnRows(false, colsWithId)
    this.rebuildData = this.makeData()
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.rebuildData = this.makeData()
      }
    }
  },
  methods: {
    setCellWidth(column) {
      let width = ''
      if (column.width) {
        width = column.width
      }
      if (width === '0') width = ''
      return width
    },
    makeColumnsId(columns) {
      return columns.map(item => {
        if ('children' in item) this.makeColumnsId(item.children)
        item.__id = getRandomStr(6)
        return item
      })
    },
    makeColumns(cols) {
      // 在 data 时，this.allColumns 暂时为 undefined
      let columns = deepCopy(getAllColumns(cols))
      columns.forEach((column, index) => {
        column._index = index
        column._columnKey = columnKey++
        column.width = parseInt(column.width)
        column._width = column.width ? column.width : '' // update in handleResize()
        column._sortType = 'normal'
      })
      return columns
    },
    makeColumnRows(fixedType, cols) {
      return convertToRows(cols, fixedType)
    },
    makeData() {
      let data = deepCopy(this.data)
      data.forEach((row, index) => {
        row._index = index
        row._rowKey = rowKey++
      })
      return data
    },
    getSpan(row, column, rowIndex, columnIndex) {
      const fn = this.mergeMethod
      if (typeof fn === 'function') {
        const result = fn({
          row,
          column,
          rowIndex,
          columnIndex
        })
        let rowspan = 1
        let colspan = 1
        if (Array.isArray(result)) {
          rowspan = result[0]
          colspan = result[1]
        } else if (typeof result === 'object') {
          rowspan = result.rowspan
          colspan = result.colspan
        }
        return {
          rowspan,
          colspan
        }
      } else {
        return {}
      }
    },
    showWithSpan(row, column, rowIndex, columnIndex) {
      const result = this.getSpan(row, column, rowIndex, columnIndex)
      return !(('rowspan' in result && result.rowspan === 0) || ('colspan' in result && result.colspan === 0))
    }
  }
}
</script>

<style lang="stylus" scoped>
.nb-table-wrapper {
  user-select: text;
  th, td {
    border: 1px solid #dbdbdb;
  }
  thead {
    th {
      height: 28px;
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      background: #e9faff;
      .nb-table-cell {
        display: inline-block;
        word-wrap: normal;
        vertical-align: middle;
        padding: 8px 12px;
        box-sizing: border-box;
        color: #333;
        white-space: normal;
      }
    }
  }
  tbody {
    td {
      height: 28px;
      font-size: 14px;
      font-weight: 400;
      .nb-table-cell {
        display: inline-block;
        word-wrap: normal;
        vertical-align: middle;
        padding: 8px;
        box-sizing: border-box;
        color: #333;
        white-space: normal;
      }
    }
  }
}
</style>

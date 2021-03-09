<template>
  <div class="nb-table-wrapper">
    <table border="0"
           cellspacing="0"
           cellpadding="0"
           class="nb-table"
           align="center"
           :style="tableStyle">
      <colgroup>
        <col v-for="(column, index) in cloneColumns" :width="setCellWidth(column)" :key="'group-'+index">
      </colgroup>
      <thead class="nb-table-header">
      <template v-if="titleHeader">
        <tr>
          <td align="center" class="main-header" height="40" :colspan="cloneColumns.length">
            {{ titleHeader.mainHeader }}
          </td>
        </tr>
        <tr>
          <td align="center" class="sub-header" height="40" :colspan="cloneColumns.length">
            {{ titleHeader.subHeader }}
          </td>
        </tr>
        <tr v-for="(desc,index) in titleHeader.desc" :key="`desc-${index}`">
          <td :colspan="cloneColumns.length" :align="desc.align" height="25" v-html="desc.content"></td>
        </tr>
      </template>
      <tr v-for="(cols, rowIndex) in columnRows" :key="`th-${rowIndex}`">
        <th
          v-for="(column, index) in cols"
          :key="index"
          :colspan="column.colSpan"
          :rowspan="column.rowSpan"
          :style="{textAlign:column.headAlign || column.align || 'center',...column.style}"
        >
          <span class="nb-table-cell">{{ column.title }}</span>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row,index) in rebuildData" :key="`row-${index}`">
        <template v-for="(column,colIndex) in cloneColumns">
          <td
            :key="column._columnKey"
            v-if="showWithSpan(row, column, index, colIndex)"
            v-bind="getSpan(row, column, index, colIndex)"
            :style="{textAlign: column.align || 'center',...column.style}"
          >
            <span class="nb-table-cell">
            <table-cell-slot
              v-if="column.slot"
              :row="row"
              :column="column"
              :index="index"></table-cell-slot>
              <span v-else>{{ row[column.key] }}</span>
            </span>
          </td>
        </template>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { deepCopy } from '@/common/utils/assist'
import { getAllColumns, getRandomStr, convertToRows } from './util'
import TableCellSlot from './slot'
import { addResizeListener, removeResizeListener } from 'bin-ui/src/utils/resize-event'
import { on, off } from 'bin-ui/src/utils/dom'

let rowKey = 1
let columnKey = 1
export default {
  name: 'NbTable',
  components: { TableCellSlot },
  provide() {
    return {
      tableRoot: this
    }
  },
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
      tableWidth: 0,
      columnsWidth: {},
      cloneColumns: [],
      columnRows: [], // 转换后的表头
      rebuildData: [] // 排序转换data
    }
  },
  computed: {
    tableStyle() {
      let style = {}
      if (this.tableWidth !== 0) {
        let width = this.tableWidth
        style.width = `${width}px`
      }
      return style
    }
  },
  mounted() {
    this.handleResize()
    on(window, 'resize', this.handleResize)
    addResizeListener(this.$el.parentElement, this.handleResize)
  },
  created() {
    const colsWithId = this.makeColumnsId(this.column)
    // 克隆原始列头，只会保留带有key值的实际字段
    this.cloneColumns = this.makeColumns(colsWithId)
    this.columnRows = this.makeColumnRows(false, colsWithId)
    this.rebuildData = this.makeData()
  },
  beforeDestroy() {
    off(window, 'resize', this.handleResize)
    removeResizeListener(this.$el.parentElement, this.handleResize)
  },
  watch: {
    column: {
      deep: true,
      handler() {
        const colsWithId = this.makeColumnsId(this.column)
        this.cloneColumns = this.makeColumns(colsWithId)
        this.columnRows = this.makeColumnRows(false, colsWithId)
        this.handleResize()
      }
    },
    data: {
      deep: true,
      handler() {
        this.rebuildData = this.makeData()
        this.handleResize()
      }
    }
  },
  methods: {
    handleResize() {
      let tableWidth = this.$el.offsetWidth
      let columnsWidth = {}
      let sumMinWidth = 0
      let hasWidthColumns = []
      let noWidthColumns = []
      let maxWidthColumns = []
      let noMaxWidthColumns = []
      this.cloneColumns.forEach((col) => {
        if (col.width) {
          hasWidthColumns.push(col)
        } else {
          noWidthColumns.push(col)
          if (col.minWidth) {
            sumMinWidth += col.minWidth
          }
          if (col.maxWidth) {
            maxWidthColumns.push(col)
          } else {
            noMaxWidthColumns.push(col)
          }
        }
        col._width = null
      })
      let unUsableWidth = hasWidthColumns.map(cell => cell.width).reduce((a, b) => a + b, 0)
      let usableWidth = tableWidth - unUsableWidth - sumMinWidth - 1
      let usableLength = noWidthColumns.length
      let columnWidth = 0
      if (usableWidth > 0 && usableLength > 0) {
        columnWidth = parseInt(usableWidth / usableLength)
      }
      for (let i = 0; i < this.cloneColumns.length; i++) {
        const column = this.cloneColumns[i]
        let width = columnWidth + (column.minWidth ? column.minWidth : 0)
        if (column.width) {
          width = column.width
        } else {
          if (column._width) {
            width = column._width
          } else {
            if (column.minWidth > width) {
              width = column.minWidth
            } else if (column.maxWidth < width) {
              width = column.maxWidth
            }

            if (usableWidth > 0) {
              usableWidth -= width - (column.minWidth ? column.minWidth : 0)
              usableLength--
              if (usableLength > 0) {
                columnWidth = parseInt(usableWidth / usableLength)
              } else {
                columnWidth = 0
              }
            } else {
              columnWidth = 0
            }
          }
        }

        column._width = width

        columnsWidth[column._index] = {
          width: width
        }
      }
      if (usableWidth > 0) {
        usableLength = noMaxWidthColumns.length
        columnWidth = parseInt(usableWidth / usableLength)
        for (let i = 0; i < noMaxWidthColumns.length; i++) {
          const column = noMaxWidthColumns[i]
          let width = column._width + columnWidth
          if (usableLength > 1) {
            usableLength--
            usableWidth -= columnWidth
            columnWidth = parseInt(usableWidth / usableLength)
          } else {
            columnWidth = 0
          }

          column._width = width

          columnsWidth[column._index] = {
            width: width
          }
        }
      }
      this.tableWidth = this.cloneColumns.map(cell => cell._width).reduce((a, b) => a + b, 0) + 1
      this.columnsWidth = columnsWidth
    },
    setCellWidth(column) {
      let width = ''
      if (column.width) {
        width = column.width
      } else if (this.columnsWidth[column._index]) {
        width = this.columnsWidth[column._index].width
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
  width: 100%;
  user-select: text;
  th, td {
    border: 1px solid #dbdbdb;
  }
  table {
    table-layout: fixed;
  }
  thead {
    th {
      height: 28px;
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      background: #fafafa;
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

.nb-table-header {
  font-family: SimSong SimHei STHeiti "PingFang SC" Arial;
  .main-header {
    font-size: 24px;
    font-weight: bold;
    //border-bottom: 1px dashed #CCCCCC;
    //color: #255e95;
  }
  .sub-header {
    font-size: 18px;
    font-weight: 500;
  }
  td {
    color: #333;
    border: none;
  }
}
</style>

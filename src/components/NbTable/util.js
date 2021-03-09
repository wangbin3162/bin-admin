import { deepCopy } from '@/common/utils/assist'
import xlsx from 'xlsx'

// 转换时将tablehead设置为true，正常情况下为false
const getAllColumns = (cols, forTableHead = false) => {
  const columns = deepCopy(cols)
  const result = []
  columns.forEach((column) => {
    if (column.children) {
      if (forTableHead) result.push(column)
      result.push.apply(result, getAllColumns(column.children, forTableHead))
    } else {
      result.push(column)
    }
  })
  return result
}

const getRandomStr = function (len = 32) {
  const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  const maxPos = $chars.length
  let str = ''
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return str
}

const convertToRows = (columns) => {
  const originColumns = deepCopy(columns)
  let maxLevel = 1
  const traverse = (column, parent) => {
    if (parent) {
      column.level = parent.level + 1
      if (maxLevel < column.level) {
        maxLevel = column.level
      }
    }
    if (column.children) {
      let colSpan = 0
      column.children.forEach((subColumn) => {
        traverse(subColumn, column)
        colSpan += subColumn.colSpan
      })
      column.colSpan = colSpan
    } else {
      column.colSpan = 1
    }
  }

  originColumns.forEach((column) => {
    column.level = 1
    traverse(column)
  })

  const rows = []
  for (let i = 0; i < maxLevel; i++) {
    rows.push([])
  }

  const allColumns = getAllColumns(originColumns, true)
  allColumns.forEach((column) => {
    if (!column.children) {
      column.rowSpan = maxLevel - column.level + 1
    } else {
      column.rowSpan = 1
    }
    rows[column.level - 1].push(column)
  })

  return rows
}

export { getAllColumns, getRandomStr, convertToRows }

// 下方是转换树形表格时使用

const makeColumnsId = (columns) => {
  return columns.map((item, index) => {
    if ('children' in item) makeColumnsId(item.children)
    item.__id = getRandomStr(6)
    item.__index = index
    return item
  })
}

const compare = (prop) => {
  return function (obj1, obj2) {
    let val1 = obj1[prop]
    let val2 = obj2[prop]
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1)
      val2 = Number(val2)
    }
    if (val1 < val2) {
      return 1
    } else if (val1 > val2) {
      return -1
    } else {
      return 0
    }
  }
}
// 获取所有需要合并行的值
const getAllRows = (data, mergeColumns, sumFields = []) => {
  // 原始列克隆，增加id，为后续判第几行合并使用
  const rowsClone = makeColumnsId(deepCopy(data))

  let map = [] // 存储映射值
  // 1. 分批记录需要合并的字段数据
  rowsClone.forEach(row => {
    mergeColumns.forEach(field => {
      // 获取上层分组名称
      const comparePath = getUpwardsPath(row, mergeColumns, field)
      // 如果不存在分组标识
      const group = map.find(i => i.value === comparePath)
      if (!group) {
        map.push({
          value: comparePath,
          key: field,
          rows: [row],
          rowSpan: 1
        })
      } else {
        group.rows.push(row)
      }
    })
  })
  // 2.计算value值需要合并的行数，并设置需要合并的单元格标识__id
  map.forEach(item => {
    sumFields.forEach(sumField => {
      item[`${sumField}Sum`] = item.rows.reduce((total, current) => total + current[sumField], 0)
    })
    item.rowSpan = item.rows.length
    item.firstId = item.rows && item.rows[0].__id
  })

  return {
    rows: rowsClone,
    map
  }
}

const getUpwardsPath = (row, mergeColumns, field) => {
  const index = mergeColumns.indexOf(field)
  if (index === -1) return null
  if (index === 0) return row[field]
  return mergeColumns.slice(0, index).map(item => row[item]).join('/') + '/' + row[field]
}

// matchRow 查询匹配的row
const matchRow = (row, column, mergeColumns, transformRows) => {
  const { map } = transformRows
  if (!map) return false
  if (mergeColumns.includes(column.key)) {
    const result = getMergeData(row, mergeColumns, column.key, map)
    if (result) return result
  }
  return false
}

// 根据某个字段、前置字段来获取合并参数
const getMergeData = (row, mergeColumns, fieldName, map = []) => {
  const comparePath = getUpwardsPath(row, mergeColumns, fieldName)
  const matchRow = map.find(item => item.value === comparePath)
  if (matchRow) {
    return {
      rowspan: row.__id === matchRow.firstId ? matchRow.rowSpan : 0,
      colspan: 1
    }
  }
  return null
}

// 根据某些字段项进行求和
const sumByFields = (data = [], fields = []) => {
  let map = {}
  data.forEach(row => {
    fields.forEach(field => {
      // 如果不存在分组标识
      const group = map[field]
      const count = row[field]
      if (!group) {
        map[field] = {
          key: field,
          value: count,
          total: count
        }
      } else {
        group.total += count
      }
    })
  })
  return { map }
}

export { getAllRows, sumByFields, getUpwardsPath, matchRow, getMergeData, compare }

const { utils, writeFile } = xlsx

export function exportTable(element, filename) {
  const worksheet = utils.table_to_sheet(element)

  /* add worksheet to workbook */
  const workbook = {
    SheetNames: [filename],
    Sheets: {
      [filename]: worksheet
    }
  }
  /* output format determined by filename */
  writeFile(workbook, filename)
}

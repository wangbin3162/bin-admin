import { deepCopy } from '@/common/utils/assist'
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
  return columns.map(item => {
    if ('children' in item) makeColumnsId(item.children)
    item.__id = getRandomStr(6)
    return item
  })
}

// 获取所有需要合并行的值
const getAllRows = (data, mergeColumns) => {
  // 原始列克隆，增加id，为后续判第几行合并使用
  const rowsClone = makeColumnsId(deepCopy(data))

  let map = [] // 存储映射值
  // 1. 分批记录需要合并的字段数据
  rowsClone.forEach(row => {
    mergeColumns.forEach(field => {
      // 如果不存在分组标识
      const group = map.find(i => i.value === row[field].trim())
      if (!group) {
        map.push({
          value: row[field].trim(),
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
    item.rowSpan = item.rows.length
    item.firstId = item.rows && item.rows[0].__id
  })
  return {
    rows: rowsClone,
    map
  }
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

export { getAllRows, sumByFields }

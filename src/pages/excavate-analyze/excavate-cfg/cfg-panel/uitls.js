/**
 * 图表类型中文名映射
 */
export const chartsNameMap = {
  line: '折线图',
  histogram: '柱状图',
  bar: '条形图',
  pie: '饼图',
  radar: '雷达图'
}

/**
 * 图表基础配置对象
 */
export const chartsOptions = {
  line: {},
  histogram: {},
  bar: {},
  pie: {},
  radar: {}
}

/**
 * 图表配置生成器
 * key为图表类型
 * 对应的内容包含，【1、基本配置项；2、配置设置颜色函数;]
 */
export const chartsBuild = {
  line: {
    name: '折线图',
    icon: 'linechart',
    options: {}
  },
  histogram: {
    name: '柱状图',
    icon: 'barchart',
    options: {}
  },
  bar: {
    name: '条形图',
    icon: 'align-left',
    options: {}
  },
  pie: {
    name: '饼图',
    icon: 'piechart',
    options: {}
  },
  radar: {
    name: '雷达图',
    icon: 'radarchart',
    options: {}
  }
}

/**
 * 图表类型中文名映射
 */
import { formatDataSet } from 'bin-charts/src/utils/util'
import { deepCopy } from '../../common/utils/assist'

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
export const basicComponents = [
  {
    name: '折线图',
    type: 'line',
    icon: 'linechart',
    options: {
      title: '折线图',
      titleStyle: {
        color: 'rgba(0,0,0,.65)',
        fontSize: 18
      },
      width: '1/3',
      height: 400,
      grid: { left: 40, top: 15, right: 20, bottom: 40 },
      tooltip: false,
      legend: {
        show: false,
        textStyle: {
          color: '#666',
          fontSize: 12
        },
        bottom: 0
      }
    },
    dataSourceType: 'static',
    sourceMap: { xField: 'x', yField: 'y', seriesField: 's' },
    dataSource: [
      { x: '1/1', y: 375, s: '系列1' },
      { x: '1/2', y: 200, s: '系列1' },
      { x: '1/3', y: 25, s: '系列1' },
      { x: '1/4', y: 190, s: '系列1' },
      { x: '1/5', y: 90, s: '系列1' },
      { x: '1/6', y: 277, s: '系列1' }
    ]
  },
  {
    name: '柱状图',
    type: 'histogram',
    icon: 'barchart',
    options: {
      titleStyle: {
        color: 'rgba(0,0,0,.65)',
        fontSize: 18
      },
      width: '1/3',
      height: 400
    }
  },
  {
    name: '条形图',
    type: 'bar',
    icon: 'align-left',
    options: {
      titleStyle: {
        color: 'rgba(0,0,0,.65)',
        fontSize: 18
      },
      width: '1/3',
      height: 400
    }
  },
  {
    name: '饼图',
    type: 'pie',
    icon: 'piechart',
    options: {
      titleStyle: {
        color: 'rgba(0,0,0,.65)',
        fontSize: 18
      },
      width: '1/3',
      height: 400
    }
  },
  {
    name: '雷达图',
    type: 'radar',
    icon: 'radarchart',
    options: {
      titleStyle: {
        color: 'rgba(0,0,0,.65)',
        fontSize: 18
      },
      width: '1/3',
      height: 400
    }
  }
]

/**
 * 图表配置生成器
 * key为图表类型
 * 根据基本的配置options调用函数返回charts需要的option
 */
export const chartsBuilder = {
  line: function (sourceMap, dataSource, opts) {
    let sMap = sourceMap || { xField: 'x', yField: 'y', seriesField: 's' }
    let dataset = formatDataSet(sMap, dataSource)
    return {
      tooltip: { show: opts.tooltip, trigger: 'axis' },
      grid: deepCopy(opts.grid),
      legend: deepCopy(opts.legend),
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: { type: 'value' },
      series: {
        type: 'line',
        name: '数量',
        areaStyle: { opacity: 0.4 }
      },
      dataset
    }
  },
  histogram: {},
  bar: {},
  pie: {},
  radar: {}
}

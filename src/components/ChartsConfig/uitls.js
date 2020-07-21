/**
 * 图表类型中文名映射
 */
import { formatSeries } from 'bin-charts/src/utils/util'
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
        color: '#666',
        fontSize: 18
      },
      width: '1/3',
      height: 400,
      grid: { left: 40, top: 15, right: 20, bottom: 40 },
      tooltip: { show: false, trigger: 'axis' },
      legend: {
        show: false,
        textStyle: {
          color: '#666',
          fontSize: 12
        },
        bottom: 0
      },
      xAxis: {
        type: 'category',
        show: true,
        name: '',
        nameTextStyle: {
          color: '#999'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#999'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#eee'
          }
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        show: true,
        name: '',
        nameTextStyle: {
          color: '#999'
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#999'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#eee'
          }
        }
      },
      series: {
        type: 'line',
        smooth: true,
        label: {
          show: false,
          color: '#666',
          fontSize: 12,
          position: 'top'
        },
        areaStyle: {
          opacity: 0
        }
      }
    },
    dataSourceType: 'static',
    sourceMap: { xField: 'x', yField: 'y', seriesField: 's' },
    dataSource: [
      {
        s: '系列1',
        data: [
          { x: '1/1', y: 375 },
          { x: '1/2', y: 200 },
          { x: '1/3', y: 25 },
          { x: '1/4', y: 190 },
          { x: '1/5', y: 90 },
          { x: '1/6', y: 277 }
        ]
      }
    ]
  },
  {
    name: '柱状图',
    type: 'histogram',
    icon: 'barchart',
    options: {
      titleStyle: {
        color: '#666',
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
        color: '#666',
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
        color: '#666',
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
        color: '#666',
        fontSize: 18
      },
      width: '1/3',
      height: 400
    }
  }
]

// 根据图表原始数据拼装实际charts options
export function buildOptions(chartData) {
  let { sourceMap, dataSource, options } = chartData
  let sMap = sourceMap || { xField: 'x', yField: 'y', seriesField: 's' }
  let data = dataSource || []
  let dataset = formatSeries(sMap, data)
  let series = []
  data.forEach(item => {
    series.push({
      name: item[sMap.seriesField],
      ...deepCopy(options.series)
    })
  })

  // 组装options
  let opts = deepCopy(options)
  delete opts['title']
  delete opts['titleStyle']
  delete opts['width']
  delete opts['height']
  opts.dataset = dataset
  opts.series = series
  return opts
}

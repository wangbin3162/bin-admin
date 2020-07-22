/**
 * 图表类型中文名映射
 */
import { formatSeries } from 'bin-charts/src/utils/util'
import { deepCopy } from '../../common/utils/assist'
import { oneOf } from 'bin-ui/src/utils/util'

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
      title: '柱状图',
      titleStyle: {
        color: '#666',
        fontSize: 18
      },
      width: '1/3',
      height: 400,
      grid: { left: 40, top: 15, right: 20, bottom: 40 },
      tooltip: {
        show: false,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
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
        type: 'bar',
        smooth: true,
        label: {
          show: false,
          color: '#666',
          fontSize: 12,
          position: 'top'
        },
        barWidth: 'auto' // 可选
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
      },
      {
        s: '系列2',
        data: [
          { x: '1/1', y: 75 },
          { x: '1/2', y: 100 },
          { x: '1/3', y: 225 },
          { x: '1/4', y: 390 },
          { x: '1/5', y: 190 },
          { x: '1/6', y: 77 }
        ]
      }
    ]
  },
  {
    name: '条形图',
    type: 'bar',
    icon: 'align-left',
    options: {
      title: '条形图',
      titleStyle: {
        color: '#666',
        fontSize: 18
      },
      width: '1/3',
      height: 400,
      grid: { left: 40, top: 15, right: 20, bottom: 40 },
      tooltip: {
        show: false,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        show: false,
        textStyle: {
          color: '#666',
          fontSize: 12
        },
        bottom: 0
      },
      xAxis: {
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
      yAxis: {
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
        }
      },
      series: {
        type: 'bar',
        smooth: true,
        label: {
          show: false,
          color: '#666',
          fontSize: 12,
          position: 'top'
        },
        barWidth: 'auto' // 可选
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
      },
      {
        s: '系列2',
        data: [
          { x: '1/1', y: 75 },
          { x: '1/2', y: 100 },
          { x: '1/3', y: 225 },
          { x: '1/4', y: 390 },
          { x: '1/5', y: 190 },
          { x: '1/6', y: 77 }
        ]
      }
    ]
  },
  {
    name: '饼图',
    type: 'pie',
    icon: 'piechart',
    options: {
      title: '饼图',
      titleStyle: {
        color: '#666',
        fontSize: 18
      },
      width: '1/3',
      height: 400,
      tooltip: { show: false, trigger: 'item' },
      legend: {
        show: false,
        textStyle: {
          color: '#666',
          fontSize: 12
        },
        bottom: 0
      },
      series: {
        type: 'pie',
        label: {
          show: true,
          color: '',
          fontSize: 12,
          position: 'outside' // 可选inside
        },
        roseType: false, // 饼图可选玫瑰图
        center: ['50%', '40%'], // 饼图可选
        radius: ['0', '70%']// 饼图可选
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
    name: '雷达图',
    type: 'radar',
    icon: 'radarchart',
    options: {
      title: '雷达图',
      titleStyle: {
        color: '#666',
        fontSize: 18
      },
      width: '1/3',
      height: 400,
      tooltip: { show: false, trigger: 'item' },
      legend: {
        show: false,
        textStyle: {
          color: '#666',
          fontSize: 12
        },
        bottom: 0
      },
      radar: { // 雷达图可选
        shape: 'circle', // polygon
        center: ['50%', '55%'],
        radius: '75%'
      },
      series: {
        type: 'radar',
        label: {
          show: false,
          color: '',
          fontSize: 12,
          position: 'top' // 可选inside
        },
        areaStyle: { // 可选的
          opacity: 0
        }
      }
    },
    dataSourceType: 'static',
    sourceMap: { xField: 'x', yField: 'y', seriesField: 's' },
    dataSource: [
      {
        s: '维度1',
        data: [
          { x: '类别一', y: 375 },
          { x: '类别二', y: 200 },
          { x: '类别三', y: 25 }
        ]
      },
      {
        s: '维度2',
        data: [
          { x: '类别一', y: 111 },
          { x: '类别二', y: 33 },
          { x: '类别三', y: 234 }
        ]
      },
      {
        s: '维度3',
        data: [
          { x: '类别一', y: 45 },
          { x: '类别二', y: 100 },
          { x: '类别三', y: 222 }
        ]
      },
      {
        s: '维度4',
        data: [
          { x: '类别一', y: 145 },
          { x: '类别二', y: 300 },
          { x: '类别三', y: 422 }
        ]
      },
      {
        s: '维度5',
        data: [
          { x: '类别一', y: 215 },
          { x: '类别二', y: 200 },
          { x: '类别三', y: 522 }
        ]
      }
    ]
  }
]

// 根据图表原始数据拼装实际charts options
export function buildOptions(chartData) {
  let { sourceMap, dataSource, options, type } = chartData
  let sMap = sourceMap || { xField: 'x', yField: 'y', seriesField: 's' }
  let data = dataSource || []
  let dataset = formatSeries(sMap, data)

  // 组装options
  let opts = deepCopy(options)
  delete opts['title']
  delete opts['titleStyle']
  delete opts['width']
  delete opts['height']
  opts.dataset = dataset

  if (oneOf(type, ['line', 'histogram', 'bar', 'pie'])) {
    let seriesList = []
    data.forEach(item => {
      seriesList.push({
        name: item[sMap.seriesField],
        ...deepCopy(options.series)
      })
    })
    opts.series = seriesList
  }
  // 雷达图特殊处理
  if (type === 'radar') {
    opts.radar.indicator = dataset.source[0].slice(1).map(item => ({ name: item }))
    let seriesData = dataset.source.slice(1).map(item => ({ name: item[0], value: item.slice(1) }))
    let series = opts.series
    series.data = seriesData
    opts.series = [series]
  }
  return opts
}

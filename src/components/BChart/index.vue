<template>
  <div class="bin-chart" :style="wrapStyle"/>
</template>

<script>
  import echarts from './echarts-import'
  import resize from './resize'

  require('./charts-theme')

  export default {
    name: 'BChart',
    mixins: [resize],
    props: {
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '400px'
      },
      options: {
        type: Object,
        required: true
      },
      data: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        chart: null
      }
    },
    computed: {
      wrapStyle() {
        return {
          width: this.width,
          height: this.height
        }
      },
      formatDataSet() {
        let { xField, yField, data } = this.data
        return {
          source: [
            [xField, yField],
            ...data.map(item => {
              return [item[xField], item[yField]]
            })
          ]
        }
      }
    },
    watch: {
      options: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    mounted() {
      this.initChart()
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'charts-theme')
        this.setOptions()
      },
      setOptions() {
        this.options.dataset = this.formatDataSet
        this.chart.setOption(this.options)
      }
    }
  }
</script>

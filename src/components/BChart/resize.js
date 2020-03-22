export default {
  mounted() {
    this.$resize.addResizeListener(this.$el, this.resizeChart)
  },
  beforeDestroy() {
    this.$resize.removeResizeListener(this.$el, this.resizeChart)
    this.chart = null
  },
  methods: {
    resizeChart() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}

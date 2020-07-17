<template>
  <div>
    <page-header-wrap>
      <b-collapse-wrap title="图表配置">
        <div style="margin-bottom: 8px;">
          <b-button @click="handleInit">初始化配置</b-button>
          <b-button>获取默认列表配置</b-button>
        </div>
        <b-code-editor :value="JSON.stringify(chartsList,null,2)" readonly/>
      </b-collapse-wrap>
    </page-header-wrap>
    <charts-config-panel ref="cfgPanel"/>
  </div>
</template>

<script>
  import ChartsConfigPanel from '../../../components/ChartsConfig/ChartConfigPanel'

  export default {
    name: 'ChartsConfig',
    components: { ChartsConfigPanel },
    data() {
      return {
        resource: {
          resourceName: ''
        }, // 当前资源
        chartsList: []
      }
    },
    methods: {
      handleInit() {
        this.resource = {
          resourceName: '测试资源名称'
        }
        this.$refs.cfgPanel.open(this.resource, [])
      }
    }
  }
</script>

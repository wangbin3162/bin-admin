<template>
  <div>
    <page-header-wrap>
      <b-collapse-wrap title="图表配置">
        <div style="margin-bottom: 8px;">
          <b-button type="primary" @click="handleOpen">打开配置弹窗</b-button>
          <b-button @click="handleInit">初始化数据</b-button>
          <b-button @click="handleLoad">加载测试数据</b-button>
        </div>
        <b-ace-editor :value="JSON.stringify(chartsList,null,2)"
                      lang="json" theme="chrome" height="400" ref="jsonEditor"
                      @init="editorInit" readonly
        />
      </b-collapse-wrap>
    </page-header-wrap>
    <charts-config-panel ref="chartsConfigPanel" @save-success="(list)=>{this.chartsList=list}"/>
  </div>
</template>

<script>
  import ChartsConfigPanel from '../../../components/ChartsConfig/ChartConfigPanel'
  import testData from './testData.json'
  import BAceEditor from '../../../components/AceEditor'

  export default {
    name: 'ChartsConfig',
    components: { ChartsConfigPanel, BAceEditor },
    data() {
      return {
        resource: {
          resourceName: ''
        }, // 当前资源
        chartsList: []
      }
    },
    methods: {
      editorInit() {
        require('brace/ext/language_tools') // language extension
        require('brace/mode/html')
        require('brace/mode/json') // language
        require('brace/theme/chrome')
        require('brace/snippets/json') // snippet
      },
      handleInit() {
        this.chartsList = []
      },
      handleLoad() {
        this.chartsList = testData
      },
      handleOpen() {
        this.resource = {
          resourceName: '测试资源名称'
        }
        this.$refs.chartsConfigPanel.open(this.resource, this.chartsList)
      }
    }
  }
</script>

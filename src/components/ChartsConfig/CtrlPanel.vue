<template>
  <div class="ctrl-panel">
    <div class="left">
      <div class="top-fix">图表组件</div>
      <div class="scroll-content" style="padding: 0 16px;">
        <draggable tag="ul" :list="basicComponents"
                   v-bind="{group:{ name:'charts', pull:'clone',put:false}, sort:false}">
          <li v-for="(chart,key) in basicComponents" :key="key" class="chart-item">
            <svg-icon :icon-class="chart.icon" style="width: 28px;height:28px;"/>
            <div>{{ chart.name }}</div>
          </li>
        </draggable>
      </div>
    </div>
    <div class="center">
      <div class="top-fix">
        <b-button type="text" @click="handlePreview">
          <b-icon name="ios-eye"/>&nbsp;预览
        </b-button>&nbsp;&nbsp;
        <b-button type="text" @click="handleShowJson" :disabled="jsonDisable">
          <b-icon name="ios-paper"/>&nbsp;编辑JSON
        </b-button>&nbsp;&nbsp;
        <b-button type="text" @click="handleSaveCfg">
          <b-icon name="ios-save"/>&nbsp;保存
        </b-button>&nbsp;&nbsp;
      </div>
      <div class="scroll-content">
        <div class="chart-widget">
          <b-empty class="chart-empty" v-if="currentList.length===0">拖拽左侧图表至当前面板新增</b-empty>
          <draggable
            class="drag-area list-group"
            :list="currentList"
            v-bind="{group:'charts', ghostClass: 'ghost',animation: 200,handle:'.widget-view-drag'}"
            @add="handleWidgetAdd"
            @end="handleMoveEnd"
          >
            <template v-for="(element,index) in currentList">
              <charts-wrap v-if="element&&element.key" :key="element.key"
                           :element="element"
                           :select.sync="selectWidget"
                           :index="index"
                           :list="currentList"
                           :log="chartLog"
                           @on-delete="handleSaveCfg">
              </charts-wrap>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <div class="right">
      <config :data="selectWidget"/>
    </div>
    <!--查看json-->
    <b-modal v-model="jsonModal" title="编辑JSON" width="800px">
      <div v-if="jsonModal">
        <b-ace-editor v-model="jsonOptions"
                      lang="json" theme="chrome" height="400"
                      width="752" ref="jsonEditor"
                      @init="editorInit"
        />
      </div>
      <div slot="footer">
        <b-button @click="jsonModal=false">取消</b-button>
        <b-button type="primary" @click="saveJson">确定</b-button>
      </div>
    </b-modal>
    <!--预览弹窗-->
    <b-modal v-model="previewModal" title="预览" fullscreen footer-hide width="100%">
      <div class="preview-wrapper" v-if="previewModal">
        <template v-for="element in currentList">
          <charts-preview-item v-if="element&&element.key"
                               :key="element.key"
                               :element="element"
                               :wrap-style="{margin:'8px'}"/>
        </template>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import { deepCopy, isEmpty } from '../../common/utils/assist'
  import { basicComponents } from './utils/util'
  import ChartsWrap from './ChartsWrap'
  import BAceEditor from '../AceEditor'
  import Config from './Config'
  import ChartsPreviewItem from './ChartsPreviewItem'

  export default {
    name: 'CtrlPanel',
    components: { ChartsPreviewItem, Config, BAceEditor, ChartsWrap, Draggable },
    props: {
      list: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        basicComponents: basicComponents,
        currentList: [],
        selectWidget: {}, // 当前选择的，
        jsonModal: false,
        jsonOptions: '',
        chartLog: false, // 是否打印图表参数
        previewModal: false
      }
    },
    mounted() {
      document.body.ondrop = function (event) {
        let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
        if (isFirefox) {
          event.preventDefault()
          event.stopPropagation()
        }
      }
    },
    watch: {
      list: {
        handler(val) {
          this.currentList = deepCopy(val)
          if (this.currentList.length > 0) {
            this.selectWidget = this.currentList[0]
          }
        },
        immediate: true
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
      // 调试移动结束
      handleMoveEnd({ newIndex, oldIndex }) {
        this.$log.warning(`====MoveEnd-(newIndex:${newIndex})-(oldIndex:${oldIndex})====`)
      },
      // 新增一个
      handleWidgetAdd({ newIndex }) {
        // 为拖拽到容器的元素添加唯一 key
        const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
        let object = deepCopy(this.currentList[newIndex])
        object.key = this.currentList[newIndex].type + '_' + key
        this.$set(this.currentList, newIndex, object)
        this.selectWidget = this.currentList[newIndex]
      },
      // 更新列表值
      updateData() {
        let index = this.currentList.findIndex(i => i.key === this.selectWidget.key)
        this.currentList.splice(index, 1, this.selectWidget) // 更新currentList
      },
      // 查看json
      handleShowJson() {
        this.jsonModal = true
        this.jsonOptions = JSON.stringify(this.selectWidget.options, null, 2)
      },
      // 直接保存json
      saveJson() {
        try {
          this.selectWidget.options = JSON.parse(this.jsonOptions)
          this.updateData()
        } catch (e) {
        }
        this.jsonModal = false
      },
      // 保存配置项
      handleSaveCfg() {
        this.$log.warning('====保存按钮触发,发送save指令====>')
        console.log(this.currentList)
        this.updateData()
        this.$emit('on-save', this.currentList)
      },
      // 预览弹窗
      handlePreview() {
        this.previewModal = true
      }
    },
    computed: {
      jsonDisable() {
        return isEmpty(this.selectWidget)
      }
    }
  }
</script>

<style lang="stylus">
  @import "./style.styl";
</style>

<template>
  <div class="ctrl-panel">
    <div class="left">
      <div class="top-fix">图表组件</div>
      <div class="scroll-content" style="padding: 0 16px;">
        <draggable tag="ul" :list="basicComponents"
                   v-bind="{ group: { name: 'charts', pull: 'clone', put: false }, sort: false }">
          <li v-for="(chart, key) in basicComponents" :key="key" class="chart-item">
            <svg-icon :icon-class="chart.icon" style="width: 28px;height:28px;"/>
            <div>{{ chart.name }}</div>
          </li>
        </draggable>
      </div>
    </div>
    <div class="center">
      <div class="top-fix">
        <b-button type="text" @click="handlePreview">
          <b-icon name="ios-eye"/>
          &nbsp;预览
        </b-button>
        <b-button type="text" @click="handleShowJson" :disabled="jsonDisable">
          <b-icon name="ios-paper"/>
          &nbsp;编辑JSON
        </b-button>
        <b-button type="text" @click="handleSaveCfg">
          <b-icon name="ios-save"/>
          &nbsp;保存
        </b-button>
      </div>
      <div class="scroll-content">
        <div class="chart-widget">
          <b-empty class="chart-empty" v-if="currentList.length === 0">拖拽左侧图表至当前面板新增</b-empty>
          <draggable
            class="drag-area list-group"
            :list="currentList"
            v-bind="{ group: 'charts', ghostClass: 'ghost', animation: 200, handle: '.widget-view-drag' }"
            @add="handleWidgetAdd"
            @end="handleMoveEnd"
          >
            <template v-for="(element, index) in currentList">
              <template v-if="element && element.key">
                <index-card v-if="element.type==='index'"
                            :key="element.key"
                            :element="element"
                            :select.sync="selectWidget"
                            :index="index"
                            :list="currentList"
                            @on-delete="handleDeleteWidget">
                </index-card>
                <charts-wrap
                  v-else
                  :key="element.key"
                  :element="element"
                  :select.sync="selectWidget"
                  :index="index"
                  :list="currentList"
                  :log="chartLog"
                  @on-delete="handleDeleteWidget"
                ></charts-wrap>
              </template>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <div class="right">
      <config :data="selectWidget" @update-data="emitUpdateData"/>
    </div>
    <!--查看json-->
    <b-modal v-model="jsonModal" title="编辑JSON" width="800px" stop-remove-scroll>
      <div v-if="jsonModal">
        <b-ace-editor v-model="jsonOptions" height="400" width="752" :snippets="false"/>
      </div>
      <div slot="footer">
        <b-button @click="jsonModal = false">取消</b-button>
        <b-button type="primary" @click="saveJson">确定</b-button>
      </div>
    </b-modal>
    <!--预览弹窗-->
    <preview ref="preview"/>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { deepCopy, isEmpty, isNotEmpty } from '@/common/utils/assist'
import { basicComponents } from './utils/util'
import ChartsWrap from './ChartsWrap'
import Config from './Config'
import Preview from './preview/Preview'
import IndexCard from '@/components/ChartsConfig/IndexCard'

export default {
  name: 'CtrlPanel',
  components: { IndexCard, Preview, Config, ChartsWrap, Draggable },
  inject: ['ConfigRoot'],
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
      chartLog: false // 是否打印图表参数
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
        if (this.currentList.length > 0 && isEmpty(this.selectWidget)) {
          this.selectWidget = this.currentList[0]
        } else if (isNotEmpty(this.selectWidget)) {
          let index = this.currentList.findIndex(i => i.key === this.selectWidget.key)
          this.selectWidget = this.currentList[index]
        }
      },
      immediate: true
    }
  },
  methods: {
    // 调试移动结束
    handleMoveEnd() {
      // this.$log.warning(`====MoveEnd-(newIndex:${newIndex})-(oldIndex:${oldIndex})====`)
      this.emitUpdateData()
    },
    // 新增一个
    handleWidgetAdd({ newIndex }) {
      // 为拖拽到容器的元素添加唯一 key
      const key = Date.parse(new Date().toString()) + '_' + Math.ceil(Math.random() * 99999)
      let object = deepCopy(this.currentList[newIndex])
      object.key = this.currentList[newIndex].type + '_' + key
      this.$set(this.currentList, newIndex, object)
      this.selectWidget = this.currentList[newIndex]
      this.emitUpdateData()
    },
    // 移除一个
    handleDeleteWidget() {
      this.emitUpdateData()
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
        this.emitUpdateData()
      } catch (e) {
      }
      this.jsonModal = false
    },
    // 保存配置项
    handleSaveCfg() {
      // this.$log.warning('====保存按钮触发,发送save指令====>')
      this.$emit('on-save', this.currentList)
    },
    // 预览弹窗
    handlePreview() {
      this.$refs.preview.open(this.currentList, this.ConfigRoot.resource)
    },
    // 更新list
    emitUpdateData() {
      this.$emit('on-update', this.currentList)
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
@import './style.styl'
</style>

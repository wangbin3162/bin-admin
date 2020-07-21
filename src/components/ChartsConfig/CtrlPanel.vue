<template>
  <div class="ctrl-panel">
    <div class="left">
      <div class="top-fix">图表组件</div>
      <div class="scroll-content" style="padding: 0 16px;">
        <draggable tag="ul" :list="basicComponents"
                   v-bind="{group:{ name:'charts', pull:'clone',put:false}, sort:false}"
                   :clone="cloneChart"
                   @end="handleMoveEnd"
        >
          <li v-for="(chart,key) in basicComponents" :key="key" class="chart-item">
            <svg-icon :icon-class="chart.icon" style="width: 28px;height:28px;"/>
            <div>{{ chart.name }}</div>
          </li>
        </draggable>
      </div>
    </div>
    <div class="center">
      <div class="top-fix">
        <b-button type="text">
          <b-icon name="ios-eye"/>&nbsp;预览
        </b-button>&nbsp;&nbsp;
        <b-button type="text" @click="handleShowJson" :disabled="selectIndex===-1">
          <b-icon name="ios-paper"/>&nbsp;编辑JSON
        </b-button>&nbsp;&nbsp;
      </div>
      <div class="scroll-content">
        <div class="chart-widget">
          <b-empty class="chart-empty" v-if="currentList.length===0">拖拽左侧图表至当前面板新增</b-empty>
          <draggable
            class="drag-area list-group"
            :list="currentList"
            v-bind="{group:'charts', ghostClass: 'ghost',animation: 200,handle:'.widget-view-drag'}"
            @end="handleMoveEnd"
          >
            <charts-wrap v-for="(chart,index) in currentList" :key="index"
                         :index="index" :data="chart"
                         @select-one="handleSelectWidget"
                         @delete-one="handleWidgetDelete"/>
          </draggable>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top-fix">
        <span v-for="item in tabs" :key="item.key" class="tab-item" :class="{'active':item.key === activeTab}"
              @click="activeTab=item.key">
          {{ item.title }}
        </span>
      </div>
      <div class="scroll-content">
        <div class="block-config" v-if="selectIndex>-1">
          <!--图表配置-->
          <div v-if="activeTab==='tab1'">
            <gui-group group-name="基础属性">
              <gui-field label="标题">
                <b-input v-model="selfOptions.title" size="small" @on-change="emitValue" clearable></b-input>
              </gui-field>
              <gui-field label="标题文本">
                <gui-inline label="字号">
                  <b-input-number v-model="selfOptions.titleStyle.fontSize" size="small"
                                  :min="14" :max="22" @on-change="emitValue"></b-input-number>
                </gui-inline>
                <gui-inline label="颜色">
                  <b-color-picker v-model="selfOptions.titleStyle.color" size="small"
                                  @on-change="emitValue"></b-color-picker>
                </gui-inline>
              </gui-field>
              <gui-field label="图表尺寸">
                <gui-inline label="宽度">
                  <b-select v-model="selfOptions.width" size="small"
                            @on-change="emitValue">
                    <b-option v-for="(val,key) in widthMap" :value="key" :key="key">{{ key }}</b-option>
                  </b-select>
                </gui-inline>
                <gui-inline label="高度">
                  <b-input-number v-model="selfOptions.height" size="small"
                                  @on-change="emitValue"></b-input-number>
                </gui-inline>
              </gui-field>
            </gui-group>
            <!--图表分类配置-->
            <b-collapse simple accordion>
              <b-collapse-panel title="通用配置" name="grid" v-if="showGrid">
                <gui-field label="上下边距">
                  <gui-inline label="顶部">
                    <b-input-number v-model="selfOptions.grid.top" size="small"
                                    :min="0" :max="60" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                  <gui-inline label="底部">
                    <b-input-number v-model="selfOptions.grid.bottom" size="small"
                                    :min="0" :max="60" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                </gui-field>
                <gui-field label="左右边距">
                  <gui-inline label="左侧">
                    <b-input-number v-model="selfOptions.grid.left" size="small"
                                    :min="0" :max="60" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                  <gui-inline label="右侧">
                    <b-input-number v-model="selfOptions.grid.right" size="small"
                                    :min="0" :max="60" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                </gui-field>
                <gui-field label="悬停提示">
                  <b-switch v-model="selfOptions.tooltip.show" size="small"
                            @on-change="emitValue"></b-switch>
                </gui-field>
              </b-collapse-panel>
              <b-collapse-panel title="图例" name="legend" v-if="selfOptions.legend">
                <gui-field label="是否显示">
                  <b-switch v-model="selfOptions.legend.show" size="small"
                            @on-change="emitValue"></b-switch>
                </gui-field>
                <gui-field label="样式">
                  <gui-inline label="字号">
                    <b-input-number v-model="selfOptions.legend.textStyle.fontSize"
                                    size="small" :min="12" :max="20" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                  <gui-inline label="颜色">
                    <b-color-picker v-model="selfOptions.legend.textStyle.color"
                                    @on-change="emitValue" size="small"></b-color-picker>
                  </gui-inline>
                </gui-field>
              </b-collapse-panel>
              <!--x轴-->
              <b-collapse-panel title="x轴" name="xAxis" v-if="showXAxis">
                <gui-field label="是否显示">
                  <b-switch v-model="selfOptions.xAxis.show" size="small"
                            @on-change="emitValue"></b-switch>
                </gui-field>
                <gui-field label="坐标轴">
                  <gui-inline label="标题">
                    <b-input v-model="selfOptions.xAxis.name" size="small" clearable
                             @on-change="emitValue"></b-input>
                  </gui-inline>
                  <gui-inline label="颜色">
                    <b-color-picker v-model="selfOptions.xAxis.nameTextStyle.color"
                                    @on-change="emitValue" size="small"></b-color-picker>
                  </gui-inline>
                </gui-field>
                <gui-field label="标签对齐">
                  <b-switch v-model="selfOptions.xAxis.axisTick.alignWithLabel" size="small"
                            @on-change="emitValue"></b-switch>
                </gui-field>
                <gui-wrap label="轴线" v-model="selfOptions.xAxis.axisLine.show"
                          @on-change="emitValue">
                  <gui-field label="颜色">
                    <b-color-picker v-model="selfOptions.xAxis.axisLine.lineStyle.color"
                                    placement="bottom-start"
                                    @on-change="emitValue" size="small"></b-color-picker>
                  </gui-field>
                </gui-wrap>
                <gui-wrap label="网格线" v-model="selfOptions.xAxis.splitLine.show"
                          @on-change="emitValue">
                  <gui-field label="颜色">
                    <b-color-picker v-model="selfOptions.xAxis.splitLine.lineStyle.color"
                                    placement="bottom-start"
                                    @on-change="emitValue" size="small"></b-color-picker>
                  </gui-field>
                </gui-wrap>
              </b-collapse-panel>
              <!--y轴-->
              <b-collapse-panel title="y轴" name="yAxis" v-if="showYAxis">
                <gui-field label="是否显示">
                  <b-switch v-model="selfOptions.yAxis.show" size="small"
                            @on-change="emitValue"></b-switch>
                </gui-field>
                <gui-field label="坐标轴">
                  <gui-inline label="标题">
                    <b-input v-model="selfOptions.yAxis.name" size="small" clearable
                             @on-change="emitValue"></b-input>
                  </gui-inline>
                  <gui-inline label="颜色">
                    <b-color-picker v-model="selfOptions.yAxis.nameTextStyle.color"
                                    @on-change="emitValue" size="small"></b-color-picker>
                  </gui-inline>
                </gui-field>
                <gui-wrap label="轴线" v-model="selfOptions.yAxis.axisLine.show"
                          @on-change="emitValue">
                  <gui-field label="颜色">
                    <b-color-picker v-model="selfOptions.yAxis.axisLine.lineStyle.color"
                                    placement="bottom-start"
                                    @on-change="emitValue" size="small"></b-color-picker>
                  </gui-field>
                </gui-wrap>
                <gui-wrap label="网格线" v-model="selfOptions.yAxis.splitLine.show"
                          @on-change="emitValue">
                  <gui-field label="颜色">
                    <b-color-picker v-model="selfOptions.yAxis.splitLine.lineStyle.color"
                                    placement="bottom-start"
                                    @on-change="emitValue" size="small"></b-color-picker>
                  </gui-field>
                </gui-wrap>
              </b-collapse-panel>
              <!--数据系列-->
              <b-collapse-panel title="数据系列" name="series" v-if="selfOptions.series">
                <gui-wrap label="指标" v-model="selfOptions.series.label.show" @on-change="emitValue">
                  <gui-field label="指标文本">
                    <gui-inline label="字号">
                      <b-input-number v-model="selfOptions.series.label.fontSize" size="small"
                                      :min="12" :max="40" @on-change="emitValue"></b-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <b-color-picker v-model="selfOptions.series.label.color" size="small"
                                      @on-change="emitValue"></b-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="指标位置">
                    <b-select v-model="selfOptions.series.label.position" size="small"
                              @on-change="emitValue">
                      <b-option label="inside" value="inside"></b-option>
                      <b-option v-if="isPie" label="outside" value="outside"></b-option>
                      <b-option v-else label="top" value="top"></b-option>
                    </b-select>
                  </gui-field>
                </gui-wrap>
                <gui-field label="区域透明度">
                  <v-slider v-model="selfOptions.series.areaStyle.opacity" :max="0.5" :step="0.1"
                            @on-change="emitValue">
                  </v-slider>
                </gui-field>
                <gui-field label="近似曲线" v-if="isLine">
                  <b-switch v-model="selfOptions.series.smooth" size="small" @on-change="emitValue"></b-switch>
                </gui-field>
              </b-collapse-panel>
            </b-collapse>
          </div>
          <!--数据配置-->
          <div v-else>
            <gui-group group-name="数据映射">
              <gui-field label="字段映射">
                <gui-inline label="x轴字段">
                  <b-input v-model="currentList[selectIndex].sourceMap.xField" size="small"/>
                </gui-inline>
                <gui-inline label="y轴字段">
                  <b-input v-model="currentList[selectIndex].sourceMap.yField" size="small"/>
                </gui-inline>
                <gui-inline label="系列字段">
                  <b-input v-model="currentList[selectIndex].sourceMap.seriesField" size="small"/>
                </gui-inline>
              </gui-field>
              <gui-field label="数据来源">
                <b-switch v-model="currentList[selectIndex].dataSourceType"
                          true-value="api" size="large"
                          false-value="static">
                  <span slot="open">动态</span>
                  <span slot="close">静态</span>
                </b-switch>
              </gui-field>
            </gui-group>
            <gui-group group-name="数据源">
              <b-ace-editor v-model="staticData"
                            lang="json" theme="chrome" height="200"
                            @on-change="staticDataChange"
                            @init="editorInit"
              />
            </gui-group>
          </div>
        </div>
        <b-empty v-else>暂未选择图表</b-empty>
      </div>
    </div>
    <!--查看json-->
    <b-modal v-model="jsonModal" title="编辑JSON" width="800px">
      <div v-if="jsonModal&&currentList[selectIndex].options">
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
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import { deepCopy, isNotEmpty } from '../../common/utils/assist'
  import { basicComponents } from './uitls'
  import ChartsWrap from './ChartsWrap'
  import GuiGroup from './gui/gui-group'
  import GuiField from './gui/gui-field'
  import GuiInline from './gui/gui-inline'
  import Enum from './enum'
  import GuiWrap from './gui/gui-wrap'
  import VSlider from '../VSlider/VSlider'
  import BAceEditor from '../AceEditor'

  export default {
    name: 'CtrlPanel',
    components: { BAceEditor, VSlider, GuiWrap, GuiInline, GuiField, GuiGroup, ChartsWrap, Draggable },
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      }
    },
    provide() {
      return { Ctrl: this }
    },
    data() {
      return {
        basicComponents: basicComponents,
        currentList: [],
        selectIndex: -1, // 当前选择的，
        tabs: [
          { key: 'tab1', title: '图表配置' },
          { key: 'tab2', title: '数据配置' }
        ],
        activeTab: 'tab1',
        widthMap: Enum.widthMap,
        jsonModal: false,
        selfOptions: {},
        staticData: '',
        jsonOptions: ''
      }
    },
    watch: {
      value: {
        handler(val) {
          this.currentList = deepCopy(val)
          this.$log.warning('=========缓存当前操作值=========')
          console.log(this.currentList)
        }
      },
      selectIndex(val) {
        if (val !== -1 && this.currentList[val]) {
          this.selfOptions = deepCopy(this.currentList[val].options)
          this.staticData = JSON.stringify(this.currentList[val].dataSource, null, 2)
        }
      }
    },
    methods: {
      editorInit: function () {
        require('brace/ext/language_tools') // language extension
        require('brace/mode/html')
        require('brace/mode/json') // language
        require('brace/theme/chrome')
        require('brace/snippets/json') // snippet
      },
      // ============图表拖拽生成============ //
      handleMoveEnd({ newIndex }) {
        this.selectIndex = newIndex
        console.log('move end', newIndex)
      },
      // 新增一个
      cloneChart(obj) {
        let newOne = deepCopy(obj)
        newOne.dataSourceType = 'static'
        newOne.options.title = newOne.name
        return newOne
      },
      // 选中widget
      handleSelectWidget(index) {
        this.selectIndex = index
      },
      // 删除一个
      handleWidgetDelete(index) {
        if (this.currentList.length - 1 === index) {
          if (index === 0) {
            this.selectIndex = -1
          } else {
            this.selectIndex = index - 1
          }
        } else {
          this.selectIndex = index + 1
        }
        this.$nextTick(() => {
          this.currentList.splice(index, 1)
        })
      },
      // 设置基本属性
      emitValue() {
        // 将缓存的配置项更新至原列表
        if (this.selectIndex !== -1 &&
          this.currentList[this.selectIndex] &&
          this.currentList[this.selectIndex].options) {
          this.currentList[this.selectIndex].options = deepCopy(this.selfOptions)
        }
      },
      // 静态数据改变事件
      staticDataChange(val) {
        try {
          let data = JSON.parse(val)
          if (this.selectIndex !== -1 &&
            this.currentList[this.selectIndex] &&
            this.currentList[this.selectIndex].dataSource) {
            this.currentList[this.selectIndex].dataSource = deepCopy(data)
          }
        } catch (e) {
        }
      },
      // 查看json
      handleShowJson() {
        this.jsonModal = true
        this.jsonOptions = JSON.stringify(this.currentList[this.selectIndex].options, null, 2)
      },
      // 直接保存json
      saveJson() {
        try {
          let data = JSON.parse(this.jsonOptions)
          this.selfOptions = deepCopy(data)
          this.emitValue()
        } catch (e) {
        }
        this.jsonModal = false
      }
    },
    computed: {
      isLine() {
        if (this.selectIndex < 0) {
          return false
        }
        return this.currentList[this.selectIndex].type === 'line'
      },
      isHistogram() {
        if (this.selectIndex < 0) {
          return false
        }
        return this.currentList[this.selectIndex].type === 'histogram'
      },
      isPie() {
        if (this.selectIndex < 0) {
          return false
        }
        return this.currentList[this.selectIndex].type === 'pie'
      },
      isRadar() {
        if (this.selectIndex < 0) {
          return false
        }
        return this.currentList[this.selectIndex].type === 'radar'
      },
      showGrid() {
        if (this.selectIndex < 0) {
          return false
        }
        return isNotEmpty(this.currentList[this.selectIndex].options.grid)
      },
      showXAxis() {
        if (this.selectIndex < 0) {
          return false
        }
        let options = this.currentList[this.selectIndex].options
        return options.xAxis && (this.isLine || this.isHistogram)
      },
      showYAxis() {
        if (this.selectIndex < 0) {
          return false
        }
        let options = this.currentList[this.selectIndex].options
        return options.yAxis && (this.isLine || this.isHistogram)
      }
    }
  }
</script>

<style lang="stylus">
  @import "./style.styl";
</style>

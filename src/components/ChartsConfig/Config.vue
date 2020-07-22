<template>
  <div class="config-panel">
    <div class="top-fix">
        <span v-for="item in tabs" :key="item.key" class="tab-item" :class="{'active':item.key === activeTab}"
              @click="activeTab=item.key">
          {{ item.title }}
        </span>
    </div>
    <div class="scroll-content">
      <div class="block-config" v-if="show">
        <!--图表配置-->
        <div v-if="activeTab==='tab1'">
          <gui-group group-name="基础属性">
            <gui-field label="标题">
              <b-input v-model="data.options.title" size="small" @on-change="emitValue" clearable></b-input>
            </gui-field>
            <gui-field label="标题文本">
              <gui-inline label="字号">
                <b-input-number v-model="data.options.titleStyle.fontSize" size="small"
                                :min="14" :max="22" @on-change="emitValue"></b-input-number>
              </gui-inline>
              <gui-inline label="颜色">
                <b-color-picker v-model="data.options.titleStyle.color" size="small"
                                @on-change="emitValue"></b-color-picker>
              </gui-inline>
            </gui-field>
            <gui-field label="图表尺寸">
              <gui-inline label="宽度">
                <b-select v-model="data.options.width" size="small"
                          @on-change="emitValue">
                  <b-option v-for="(val,key) in widthMap" :value="key" :key="key">{{ key }}</b-option>
                </b-select>
              </gui-inline>
              <gui-inline label="高度">
                <b-input-number v-model="data.options.height" size="small"
                                @on-change="emitValue"></b-input-number>
              </gui-inline>
            </gui-field>
          </gui-group>
          <!--图表分类配置-->
          <b-collapse simple accordion>
            <b-collapse-panel title="通用配置" name="grid">
              <template v-if="showGrid">
                <gui-field label="上下边距">
                  <gui-inline label="顶部">
                    <b-input-number v-model="data.options.grid.top" size="small"
                                    :min="0" :max="60" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                  <gui-inline label="底部">
                    <b-input-number v-model="data.options.grid.bottom" size="small"
                                    :min="0" :max="60" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                </gui-field>
                <gui-field label="左右边距">
                  <gui-inline label="左侧">
                    <b-input-number v-model="data.options.grid.left" size="small"
                                    :min="0" :max="60" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                  <gui-inline label="右侧">
                    <b-input-number v-model="data.options.grid.right" size="small"
                                    :min="0" :max="60" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                </gui-field>
              </template>
              <gui-field label="悬停提示">
                <b-checkbox v-model="data.options.tooltip.show" @on-change="emitValue"/>
              </gui-field>
            </b-collapse-panel>
            <b-collapse-panel title="图例" name="legend" v-if="data.options.legend">
              <gui-field label="是否显示">
                <b-checkbox v-model="data.options.legend.show" @on-change="emitValue"></b-checkbox>
              </gui-field>
              <gui-field label="样式">
                <gui-inline label="字号">
                  <b-input-number v-model="data.options.legend.textStyle.fontSize"
                                  size="small" :min="12" :max="20" @on-change="emitValue"></b-input-number>
                </gui-inline>
                <gui-inline label="颜色">
                  <b-color-picker v-model="data.options.legend.textStyle.color"
                                  @on-change="emitValue" size="small"></b-color-picker>
                </gui-inline>
              </gui-field>
            </b-collapse-panel>
            <!--x轴-->
            <b-collapse-panel title="x轴" name="xAxis" v-if="showXAxis">
              <gui-wrap label="x轴" v-model="data.options.xAxis.show" @on-change="emitValue">
                <gui-field label="坐标轴">
                  <gui-inline label="标题">
                    <b-input v-model="data.options.xAxis.name" size="small" clearable
                             @on-change="emitValue"></b-input>
                  </gui-inline>
                  <gui-inline label="颜色">
                    <b-color-picker v-model="data.options.xAxis.nameTextStyle.color"
                                    @on-change="emitValue" size="small"></b-color-picker>
                  </gui-inline>
                </gui-field>
                <gui-field label="标签对齐" v-if="isLine">
                  <b-switch v-model="data.options.xAxis.axisTick.alignWithLabel" size="small"
                            @on-change="emitValue"></b-switch>
                </gui-field>
              </gui-wrap>
              <gui-wrap label="轴线" v-model="data.options.xAxis.axisLine.show"
                        @on-change="emitValue">
                <gui-field label="颜色">
                  <b-color-picker v-model="data.options.xAxis.axisLine.lineStyle.color"
                                  placement="bottom-start"
                                  @on-change="emitValue" size="small"></b-color-picker>
                </gui-field>
              </gui-wrap>
              <gui-wrap label="网格线" v-model="data.options.xAxis.splitLine.show"
                        @on-change="emitValue">
                <gui-field label="颜色">
                  <b-color-picker v-model="data.options.xAxis.splitLine.lineStyle.color"
                                  placement="bottom-start"
                                  @on-change="emitValue" size="small"></b-color-picker>
                </gui-field>
              </gui-wrap>
            </b-collapse-panel>
            <!--y轴-->
            <b-collapse-panel title="y轴" name="yAxis" v-if="showYAxis">
              <gui-wrap label="坐标轴" v-model="data.options.yAxis.show" @on-change="emitValue">
                <gui-field label="y轴">
                  <gui-inline label="标题">
                    <b-input v-model="data.options.yAxis.name" size="small" clearable
                             @on-change="emitValue"></b-input>
                  </gui-inline>
                  <gui-inline label="颜色">
                    <b-color-picker v-model="data.options.yAxis.nameTextStyle.color"
                                    @on-change="emitValue" size="small"></b-color-picker>
                  </gui-inline>
                </gui-field>
              </gui-wrap>
              <gui-wrap label="轴线" v-model="data.options.yAxis.axisLine.show"
                        @on-change="emitValue">
                <gui-field label="颜色">
                  <b-color-picker v-model="data.options.yAxis.axisLine.lineStyle.color"
                                  placement="bottom-start"
                                  @on-change="emitValue" size="small"></b-color-picker>
                </gui-field>
              </gui-wrap>
              <gui-wrap label="网格线" v-model="data.options.yAxis.splitLine.show"
                        @on-change="emitValue">
                <gui-field label="颜色">
                  <b-color-picker v-model="data.options.yAxis.splitLine.lineStyle.color"
                                  placement="bottom-start"
                                  @on-change="emitValue" size="small"></b-color-picker>
                </gui-field>
              </gui-wrap>
            </b-collapse-panel>
            <!--雷达图独有-->
            <b-collapse-panel title="坐标系" name="radar" v-if="isRadar">
              <gui-field label="中心坐标">
                <gui-inline label="offsetX">
                  <b-input v-model="data.options.radar.center[0]" size="small"
                           placeholder="支持百分比或像素" @on-change="emitValue"></b-input>
                </gui-inline>
                <gui-inline label="offsetY">
                  <b-input v-model="data.options.radar.center[1]" size="small"
                           placeholder="支持百分比或像素" @on-change="emitValue"></b-input>
                </gui-inline>
              </gui-field>
              <gui-field label="图形">
                <gui-inline label="雷达图半径">
                  <b-input v-model="data.options.radar.radius" size="small" @on-change="emitValue"></b-input>
                </gui-inline>
                <gui-inline label="雷达图类型">
                  <b-select v-model="data.options.radar.shape" @on-change="emitValue" size="small">
                    <b-option value="circle">圆形</b-option>
                    <b-option value="polygon">多边形</b-option>
                  </b-select>
                </gui-inline>
              </gui-field>
            </b-collapse-panel>
            <!--数据系列-->
            <b-collapse-panel title="数据系列" name="series" v-if="data.options.series">
              <gui-wrap label="指标" v-model="data.options.series.label.show" @on-change="emitValue">
                <gui-field label="指标文本">
                  <gui-inline label="字号">
                    <b-input-number v-model="data.options.series.label.fontSize" size="small"
                                    :min="12" :max="40" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                  <gui-inline label="颜色">
                    <b-color-picker v-model="data.options.series.label.color" size="small"
                                    @on-change="emitValue"></b-color-picker>
                  </gui-inline>
                </gui-field>
                <gui-field label="指标位置">
                  <b-select v-model="data.options.series.label.position" size="small"
                            @on-change="emitValue">
                    <b-option label="inside" value="inside"></b-option>
                    <b-option v-if="isPie" label="outside" value="outside"></b-option>
                    <b-option v-else label="top" value="top"></b-option>
                  </b-select>
                </gui-field>
              </gui-wrap>
              <gui-field label="区域透明度" v-if="isLine||isRadar">
                <v-slider v-model="data.options.series.areaStyle.opacity" :max="0.5" :step="0.1"
                          @on-change="emitValue">
                </v-slider>
              </gui-field>
              <gui-field label="近似曲线" v-if="isLine">
                <b-switch v-model="data.options.series.smooth" size="small" @on-change="emitValue"></b-switch>
              </gui-field>
              <gui-field label="柱条宽度" v-if="isHistogram||isBar">
                <div flex>
                  <b-input size="small" style="width:150px;" @on-change="emitValue"
                           v-model="data.options.series.barWidth" clearable/>
                  <b-button size="small" @click="autoClick">自适应</b-button>
                </div>
              </gui-field>
              <!--饼图独有-->
              <template v-if="isPie">
                <gui-field label="玫瑰图">
                  <b-switch v-model="data.options.series.roseType" size="small" @on-change="emitValue"/>
                </gui-field>
                <gui-field label="中心坐标">
                  <gui-inline label="offsetX">
                    <b-input v-model="data.options.series.center[0]" size="small"
                             placeholder="像素或百分比"
                             @on-change="emitValue"></b-input>
                  </gui-inline>
                  <gui-inline label="offsetY">
                    <b-input v-model="data.options.series.center[1]" size="small"
                             placeholder="像素或百分比%"
                             @on-change="emitValue"></b-input>
                  </gui-inline>
                </gui-field>
                <gui-field label="饼图半径">
                  <gui-inline label="内半径">
                    <b-input v-model="data.options.series.radius[0]" size="small"
                             placeholder="像素或百分比"
                             @on-change="emitValue"></b-input>
                  </gui-inline>
                  <gui-inline label="外半径">
                    <b-input v-model="data.options.series.radius[1]" size="small"
                             placeholder="像素或百分比%"
                             @on-change="emitValue"></b-input>
                  </gui-inline>
                </gui-field>
              </template>
            </b-collapse-panel>
          </b-collapse>
        </div>
        <!--数据配置-->
        <div v-else>
          <gui-group group-name="数据映射">
            <gui-field label="字段映射">
              <gui-inline label="x轴字段">
                <b-input v-model="data.sourceMap.xField" size="small"/>
              </gui-inline>
              <gui-inline label="y轴字段">
                <b-input v-model="data.sourceMap.yField" size="small"/>
              </gui-inline>
              <gui-inline label="系列字段">
                <b-input v-model="data.sourceMap.seriesField" size="small"/>
              </gui-inline>
            </gui-field>
            <gui-field label="数据来源">
              <b-switch v-model="data.dataSourceType" size="large" true-value="api" false-value="static">
                <span slot="open">动态</span>
                <span slot="close">静态</span>
              </b-switch>
            </gui-field>
          </gui-group>
          <gui-group group-name="数据源">
            <div v-if="data.dataSourceType==='static'">
              <b-ace-editor :value="JSON.stringify(data.dataSource,null,2)"
                            lang="json" theme="chrome" height="400"
                            @on-change="staticDataChange"
                            @init="editorInit"
              />
            </div>
            <div v-else>动态api配置</div>
          </gui-group>
        </div>
      </div>
      <b-empty v-else>暂未选择图表</b-empty>
    </div>
  </div>
</template>

<script>
  import { isNotEmpty } from '../../common/utils/assist'
  import Enum from './enum'
  import GuiWrap from './gui/gui-wrap'
  import GuiGroup from './gui/gui-group'
  import GuiField from './gui/gui-field'
  import GuiInline from './gui/gui-inline'
  import VSlider from '../VSlider/VSlider'
  import BAceEditor from '../AceEditor'

  export default {
    name: 'Config',
    components: { GuiInline, GuiField, GuiGroup, GuiWrap, VSlider, BAceEditor },
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      show() {
        return !!(this.data && isNotEmpty(this.data))
      },
      showGrid() {
        return this.data.options && this.data.options.grid
      },
      isLine() {
        return this.data.type === 'line'
      },
      isBar() {
        return this.data.type === 'bar'
      },
      isHistogram() {
        return this.data.type === 'histogram'
      },
      isPie() {
        return this.data.type === 'pie'
      },
      isRadar() {
        return this.data.type === 'radar'
      },
      showXAxis() {
        let options = this.data.options
        return options.xAxis && (this.isLine || this.isHistogram || this.isBar)
      },
      showYAxis() {
        let options = this.data.options
        return options.yAxis && (this.isLine || this.isHistogram || this.isBar)
      }
    },
    data() {
      return {
        tabs: [
          { key: 'tab1', title: '图表配置' },
          { key: 'tab2', title: '数据配置' }
        ],
        activeTab: 'tab1',
        widthMap: Enum.widthMap
      }
    },
    watch: {
      'data.key'() {
        this.activeTab = 'tab1'
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
      // 自适应按钮事件
      autoClick() {
        this.data.options.series.barWidth = 'auto'
        this.emitValue()
      },
      // 静态数据改变事件
      staticDataChange(val) {
        try {
          this.data.dataSource = JSON.parse(val)
        } catch (e) {
        }
      },
      emitValue() {

      }
    }
  }
</script>

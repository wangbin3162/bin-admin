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
                         @delete-one="handleSelectWidget"/>
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
        <b-empty v-if="selectIndex<0">暂未选择图表</b-empty>
        <div class="block-config" v-else>
          <!--图表配置-->
          <div v-if="activeTab==='tab1'">
            <gui-group group-name="基础属性">
              <gui-field label="标题">
                <b-input v-model="currentList[selectIndex].options.title" size="small" @on-change="emitValue"></b-input>
              </gui-field>
              <gui-field label="标题文本">
                <gui-inline label="字号">
                  <b-input-number v-model="currentList[selectIndex].options.titleStyle.fontSize" size="small"
                                  :min="14" :max="22" @on-change="emitValue"></b-input-number>
                </gui-inline>
                <gui-inline label="颜色">
                  <b-color-picker v-model="currentList[selectIndex].options.titleStyle.color" size="small"
                                  alpha @on-change="emitValue"></b-color-picker>
                </gui-inline>
              </gui-field>
              <gui-field label="图表尺寸">
                <gui-inline label="宽度">
                  <b-select v-model="currentList[selectIndex].options.width" size="small"
                            @on-change="emitValue">
                    <b-option v-for="(val,key) in widthMap" :value="key" :key="key">{{ key }}</b-option>
                  </b-select>
                </gui-inline>
                <gui-inline label="高度">
                  <b-input-number v-model="currentList[selectIndex].options.height" size="small"
                                  @on-change="emitValue"></b-input-number>
                </gui-inline>
              </gui-field>
              <gui-field label="悬停提示">
                <b-checkbox v-model="currentList[selectIndex].options.tooltip"></b-checkbox>
              </gui-field>
            </gui-group>
            <!--图表分类配置-->
            <b-collapse simple accordion>
              <b-collapse-panel title="全局配置" name="grid" v-if="showGrid">
                <gui-field label="上下边距">
                  <gui-inline label="顶部">
                    <b-input-number v-model="currentList[selectIndex].options.grid.top" size="small"
                                    :min="0" :max="60" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                  <gui-inline label="底部">
                    <b-input-number v-model="currentList[selectIndex].options.grid.bottom" size="small"
                                    :min="0" :max="60" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                </gui-field>
                <gui-field label="左右边距">
                  <gui-inline label="左侧">
                    <b-input-number v-model="currentList[selectIndex].options.grid.left" size="small"
                                    :min="0" :max="60" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                  <gui-inline label="右侧">
                    <b-input-number v-model="currentList[selectIndex].options.grid.right" size="small"
                                    :min="0" :max="60" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                </gui-field>
              </b-collapse-panel>
              <b-collapse-panel title="图例" name="legend" v-if="currentList[selectIndex].options.legend">
                <gui-field label="是否显示">
                  <b-checkbox v-model="currentList[selectIndex].options.legend.show"></b-checkbox>
                </gui-field>
                <gui-field label="样式">
                  <gui-inline label="字号">
                    <b-input-number v-model="currentList[selectIndex].options.legend.textStyle.fontSize"
                                    size="small" :min="12" :max="20" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                  <gui-inline label="颜色">
                    <b-color-picker v-model="currentList[selectIndex].options.legend.textStyle.color"
                                    @change="emitValue" size="small"></b-color-picker>
                  </gui-inline>
                </gui-field>
              </b-collapse-panel>
            </b-collapse>
          </div>
          <div>
            {{ currentList[selectIndex] }}
          </div>
        </div>
      </div>
    </div>
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

  export default {
    name: 'CtrlPanel',
    components: { GuiInline, GuiField, GuiGroup, ChartsWrap, Draggable },
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
        widthMap: Enum.widthMap
      }
    },
    watch: {
      value: {
        handler(val) {
          this.currentList = deepCopy(val)
          this.$log.warning('=========缓存当前操作值=========')
          console.log(this.currentList)
        }
      }
    },
    methods: {
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

      }
    },
    computed: {
      showGrid() {
        if (this.selectIndex < 0) {
          return false
        }
        return isNotEmpty(this.currentList[this.selectIndex].options.grid)
      }
    }
  }
</script>

<style lang="stylus">
  @import "./style.styl";
</style>

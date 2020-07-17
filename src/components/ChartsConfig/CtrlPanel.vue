<template>
  <div class="ctrl-panel">
    <div class="left">
      <div class="top-fix">图表组件</div>
      <div class="scroll-content" style="padding: 0 16px;">
        <draggable tag="ul" :list="basicComponents"
                   v-bind="{group:{ name:'charts', pull:'clone',put:false}, sort:false}"
                   @end="handleMoveEnd"
                   @start="handleMoveStart"
                   :move="handleMove"
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
        <draggable
          class="drag-area list-group"
          :list="currentList"
          v-bind="{group:'charts', ghostClass: 'ghost',animation: 200,handle:'.widget-view-drag'}"
          @end="handleMoveEnd"
          @add="handleWidgetAdd"
        >
          <div v-for="(charts,index) in currentList" :key="charts.id||index"
               class="list-widget-item" :class="{'active' : index === selectWidgetIndex}"
               @click="handleSelectWidget(index)">
            <template v-if="index === selectWidgetIndex">
              <div class="widget-view-drag">
                <b-icon name="ios-move"/>
              </div>
              <div class="widget-view-action" @click="handleWidgetDelete(index)">
                <b-icon name="ios-trash"/>
              </div>
            </template>
            <h2>
              {{ charts.name }}
            </h2>
          </div>
        </draggable>
        <b-code-editor :value="JSON.stringify(currentList,null,2)" readonly/>
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
        开启的面板是 {{ activeTab }}
        <div>
          {{ currentList[selectWidgetIndex] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import { deepCopy } from '../../common/utils/assist'
  import { basicComponents } from './uitls'

  export default {
    name: 'CtrlPanel',
    components: { Draggable },
    props: {
      value: {
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
        selectWidgetIndex: -1, // 当前选择的，
        tabs: [
          { key: 'tab1', title: '图表配置' },
          { key: 'tab2', title: '数据配置' }
        ],
        activeTab: 'tab1'
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
      handleMoveEnd(evt) {
        console.log('end', evt)
        this.selectWidgetIndex = evt.newIndex
      },
      handleMoveStart({ oldIndex }) {
        console.log('start', oldIndex, this.basicComponents)
      },
      handleMove() {
        return true
      },
      handleWidgetAdd(evt) {
        console.log('add', evt)
        console.log('end', evt)
        const newIndex = evt.newIndex
        const to = evt.to
        console.log(to)

        // 为拖拽到容器的元素添加唯一 key
        const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
        this.$set(this.currentList, newIndex, {
          ...this.currentList[newIndex],
          options: {
            ...this.currentList[newIndex].options,
            remoteFunc: 'func_' + key
          },
          // 绑定键值
          model: this.currentList[newIndex].type + '_' + key
        })

        this.selectWidgetIndex = newIndex
      },
      // 选中widget
      handleSelectWidget(index) {
        this.selectWidgetIndex = index
      },
      // 删除一个
      handleWidgetDelete(index) {
        if (this.currentList.length - 1 === index) {
          if (index === 0) {
            this.selectWidgetIndex = -1
          } else {
            this.selectWidgetIndex = index - 1
          }
        } else {
          this.selectWidgetIndex = index + 1
        }
        this.$nextTick(() => {
          this.currentList.splice(index, 1)
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .ctrl-panel {
    width: 100%;
    height: 100%;
    display: flex;
    .top-fix {
      height: 42px;
      line-height: 42px;
    }
    .scroll-content {
      height: calc(100% - 42px);
      overflow-y: auto;
    }
    .left {
      width: 120px;
      height: 100%;
      overflow: hidden;
      .top-fix {
        text-align: center;
        font-size: 16px;
      }
      .chart-item {
        border: 1px dashed rgba(11, 28, 36, 0.2);
        padding: 4px 8px;
        text-align: center;
        margin-bottom: 8px;
        cursor: grab;
        transition: border-color .2s;
        &:hover {
          border-color: rgba(11, 28, 36, 0.5);
        }
      }
    }
    .center {
      width: calc(100% - 500px);
      height: 100%;
      overflow: hidden;
      border-left: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
      .top-fix {
        text-align: right;
        padding: 0 16px;
        border-bottom: 1px solid #e0e0e0;
      }
      .scroll-content {
        background: #fafafa;
      }
    }
    .right {
      width: 380px;
      height: 100%;
      overflow: hidden;
      .top-fix {
        display: flex;
        border-bottom: 1px solid #e0e0e0;
        .tab-item {
          width: 50%;
          text-align: center;
          font-size: 16px;
          transition: background .2s;
          cursor: pointer;
          &.active {
            background: #e0e0e0;
          }
        }
      }
      .scroll-content {
        padding: 12px;
      }
    }
  }
  .drag-area {
    background: #fff;
    border: 1px dashed #999;
    min-height: 100%;
    margin: 10px;
    .list-widget-item {
      position: relative;
      display: inline-block;
      vertical-align: top;
      border: 1px dashed hsla(0, 0%, 66.7%, .5);
      background-color: rgba(236, 245, 255, .3);
      margin: 2px;
      padding: 0 18px;
      overflow: hidden;
      height: 200px;
      width: calc(33.33% - 4px);
      &:hover {
        background: #ecf5ff;
        outline: 1px solid #1089ff;
        outline-offset: 0;
      }
      &.active {
        outline: 1px solid #1089ff;
        border: 1px solid #1089ff;
      }
      &.ghost {
        position: relative;
        font-size: 0;
        border: 1px dashed #1089ff;
        &::after {
          position: absolute;
          content: '';
          background: #fff;
          display: block;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      }
      .widget-view-drag {
        position: absolute;
        left: -2px;
        top: -2px;
        height: 24px;
        line-height: 22px;
        background: #1089ff;
        width: 24px;
        text-align: center;
        z-index: 10;
        cursor: move;
        i {
          font-size: 18px;
          color: #fff;
        }
      }
      .widget-view-action {
        position: absolute;
        right: -2px;
        top: -2px;
        height: 24px;
        line-height: 22px;
        background: #1089ff;
        width: 24px;
        text-align: center;
        z-index: 9;
        i {
          font-size: 18px;
          color: #fff;
          cursor: pointer;
        }
      }
    }
    .chart-item.ghost {
      position: relative;
      margin: 2px;
      width: calc(33.33% - 4px);
      display: inline-block;
      vertical-align: top;
      height: 5px;
      padding: 0;
      font-size: 0;
      overflow: hidden;
      &::after {
        position: absolute;
        content: '';
        background: #f5222d;
        display: block;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  }
</style>

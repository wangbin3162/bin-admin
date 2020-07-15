<template>
  <div class="ctrl-panel">
    <div class="left">
      <div class="top-fix">图表组件</div>
      <div class="scroll-content" style="padding: 0 16px;">
        <div v-for="(chart,key) in chartsBuild" :key="key" class="chart-item"
             draggable="true" @dragstart="onDrag($event,key)">
          <svg-icon :icon-class="chart.icon" style="width: 28px;height:28px;"/>
          <div>{{chart.name}}</div>
        </div>
      </div>
    </div>
    <div class="center" @drop="onDrop($event)">center</div>
    <div class="right">
      <div class="top-fix">配置tabs</div>
      <div class="scroll-content">right-content</div>
    </div>
  </div>
</template>

<script>
  import { deepCopy } from '../../../../common/utils/assist'
  import { chartsBuild } from './uitls'

  export default {
    name: 'CtrlPanel',
    inject: ['Excavate'],
    data() {
      return {
        chartsBuild: chartsBuild,
        currentValue: {}
      }
    },
    watch: {
      'Excavate.cfgInfo': {
        handler(val) {
          this.currentValue = deepCopy(val)
          this.$log.warning('=========缓存当前操作值=========')
          console.log(this.currentValue)
        },
        deep: true
      }
    },
    methods: {
      // ============图表拖拽生成============ //
      onDrag(e, name) {
        console.log('开始拖拽', name)
        e.dataTransfer.setData('chart-name', name)
      },
      onDrop(e) {
        let chartName = e.dataTransfer.getData('chart-name')
        console.log(chartName)
        e.preventDefault()
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
      border-right: 1px solid #eeeeee;
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
      min-height: 100%;
      padding: 42px 24px;
      overflow: hidden;
    }
    .right {
      width: 380px;
      border-left: 1px solid #eeeeee;
      height: 100%;
      overflow: hidden;
    }
  }
</style>

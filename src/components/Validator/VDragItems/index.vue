<template>
  <div class="item-wrap">
    <draggable v-model="totalData"
               v-bind="{ group: 'item', ghostClass:'item-over', handle: '.item-inner' }"
               @end="onDragEnd">
      <div v-for="(item,index) in totalData" :key="index" class="item"
           :class="{'is-textarea':item.controlType==='TEXTAREA'}">
        <!--自定义拖拽实现-->
        <!--        <div class="item-inner" @click="handleSelect(index)"-->
        <!--             :class="{'item-selected':currentIndex===index}"-->
        <!--             draggable="true" @dragstart="onDrag($event,index)" @drop="onDrop($event,index)"-->
        <!--             @dragenter="onEnter($event)" @dragleave="onLeave($event)" @dragover="allowDrop($event)">-->
        <div class="item-inner" @click="handleSelect(index)"
             :class="{'item-selected':currentIndex===index}">
          {{ item.fieldTitle }}
        </div>
      </div>
    </draggable>
    <b-empty v-if="totalData.length===0">{{noDataText}}</b-empty>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import { addClass, removeClass } from 'bin-ui/src/utils/dom'
  import { deepCopy } from '../../../common/utils/assist'

  export default {
    name: 'VDragItems',
    components: { Draggable },
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      },
      noDataText: {
        type: String,
        default: '暂无数据'
      },
      isFull: {
        type: Boolean
      },
      selectCancel: { // 是否可以取消
        type: Boolean
      }
    },
    data() {
      return {
        totalData: [],
        currentIndex: -1
      }
    },
    watch: {
      value: {
        handler(val) {
          this.totalData = deepCopy(val)
        },
        immediate: true
      }
    },
    methods: {
      // ============拖拽监听函数开始============ //
      onDrag(e, index) {
        e.dataTransfer.setData('index', index)
      },
      onDrop(e, index) {
        const dragIndex = e.dataTransfer.getData('index')
        if (parseInt(dragIndex) !== index) {
          this.$emit('on-drag-drop', dragIndex, index)
        }
        removeClass(e.target, 'item-over')
        e.preventDefault()
      },
      onEnter(e) {
        addClass(e.target, 'item-over')
        e.preventDefault()
      },
      onLeave(e) {
        removeClass(e.target, 'item-over')
        e.preventDefault()
      },
      allowDrop(e) {
        e.preventDefault()
      },
      // ============拖拽监听函数结束============ //
      // 选中一项
      handleSelect(index) {
        if (this.currentIndex !== index) {
          this.currentIndex = index
          this.$emit('on-select', this.currentIndex)
        } else {
          if (this.selectCancel) {
            this.currentIndex = -1
            this.$emit('on-select', this.currentIndex)
          }
        }
      },
      // 清空选中
      clearSelect() {
        this.currentIndex = -1
      },
      onDragEnd(event) {
        let { oldIndex, newIndex } = event
        if (oldIndex !== newIndex) {
          this.$emit('on-drag-drop', oldIndex, newIndex)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .item {
    box-sizing: border-box;
    display: inline-block;
    width: 25%;
    padding: 5px;
    transition: .2s;
    &-wrap {
      padding: 6px;
    }
    &-inner {
      cursor: pointer;
      border: 1px solid #d9d9d9;
      background: #fff;
      border-radius: 2px;
      line-height: 32px;
      padding: 0 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: .2s;
      &:hover {
        border-color: #1089ff;
      }
    }
    &-over {
      opacity: .5;
      box-shadow: 0 0 20px inset rgba(16, 137, 255, 0.5);
    }
    &-selected {
      transition: .2s;
      border-color: rgba(16, 137, 255, 0.5);
      animation: selectAnim 3s infinite ease-in-out;
    }
    &.is-textarea {
      width: 100%;
    }
  }
  @keyframes selectAnim {
    0% {
      box-shadow: 0 0 0 3px rgba(64, 158, 255, .2);
    }
    50% {
      box-shadow: 0 0 0 2px rgba(64, 158, 255, .1);
    }
    100% {
      box-shadow: 0 0 0 3px rgba(64, 158, 255, .2);
    }
  }
</style>

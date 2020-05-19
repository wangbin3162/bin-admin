<template>
  <div class="item-wrap">
    <draggable v-model="totalData"
               v-bind="{ group: 'item', ghostClass:'item-over', handle: '.item-inner' }"
               @end="onDragEnd">
      <div v-for="(item,index) in totalData" :key="index" class="item"
           :class="[{'ignore':item.status==='ignore'},{'is-textarea':item.controlType==='TEXTAREA'}]">
        <!--自定义拖拽实现-->
        <!--        <div class="item-inner" @click="handleSelect(index)"-->
        <!--             :class="{'item-selected':currentIndex===index}"-->
        <!--             draggable="true" @dragstart="onDrag($event,index)" @drop="onDrop($event,index)"-->
        <!--             @dragenter="onEnter($event)" @dragleave="onLeave($event)" @dragover="allowDrop($event)">-->
        <div class="item-inner" @click="handleSelect(index)"
             :class="{'item-selected':currentIndex===index}"
             :title="item.fieldTitle">
          {{ item.fieldTitle }}
        </div>
        <span class="item-field">{{ item.fieldName }}</span>
        <span class="item-required" v-if="item.required==='Y'">核</span>
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
    position: relative;
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
      border: 1px dashed #d9d9d9;
      background: #fff;
      border-radius: 2px;
      line-height: 45px;
      padding: 0 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: .2s;
      color: rgba(0, 0, 0, .65);
      &:hover {
        border: 1px solid #1089ff;
      }
    }
    &-field {
      position: absolute;
      top: 5px;
      right: 7px;
      color: #52c41a;
      font-size: 10px;
    }
    &-required {
      position: absolute;
      bottom: 5px;
      right: 7px;
      color: #1089ff;
      font-size: 10px;
    }
    &-over {
      opacity: .5;
      box-shadow: 0 0 20px inset rgba(16, 137, 255, 0.5);
    }
    &-selected {
      transition: .2s;
      border: 1px solid #1089ff;
      animation: selectAnim 3s infinite ease-in-out;
    }
    &.is-textarea {
      width: 100%;
    }
    &.ignore .item-inner {
      background: #f3f3f3;
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

<template>
  <div class="item-wrap">
    <draggable v-model="totalData"
               v-bind="{ group: 'item', animation: 200, ghostClass:'item-over', handle: '.item-drag' }"
               @end="onDragEnd">
      <div v-for="(item,index) in totalData" :key="index" class="item"
           :class="[{'ignore':item.status==='ignore'},{'is-textarea':['FILE_UPLOAD', 'TEXTAREA'].indexOf(item.controlType) > -1 }]">
        <!--自定义拖拽实现-->
        <!--        <div class="item-inner" @click="handleSelect(index)"-->
        <!--             :class="{'item-selected':currentIndex===index}"-->
        <!--             draggable="true" @dragstart="onDrag($event,index)" @drop="onDrop($event,index)"-->
        <!--             @dragenter="onEnter($event)" @dragleave="onLeave($event)" @dragover="allowDrop($event)">-->
        <div class="item-inner" @click="handleSelect(index)"
             :class="[{'item-selected':currentIndex===index},{'empty-title':item.fieldTitle.length===0}]"
             :title="item.fieldTitle">
          <div class="item-field">
            <div class="item-drag">
              <b-icon name="ios-move"></b-icon>
            </div>
            <span draggable="true" @dragstart="onDrag($event,item.fieldName)">{{ item.fieldName }}</span>
          </div>
          <div class="item-name" v-if="item.fieldTitle.length>0">{{ item.fieldTitle }}</div>
          <div class="item-name" v-else>
            <b-tag type="danger" size="mini">空标题</b-tag>
          </div>
          <span class="item-required" :class="{'active':item.required==='Y'}">核心</span>
          <span class="item-required rule" :class="{'active':hasRequiredRule(item)}">必填</span>
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
        // 拖拽字段名称并存储，用于自动填充使用
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
      // 判断有没有配置必填项校验
      hasRequiredRule(field) {
        return field.checkRules.indexOf('$required') > -1
      },
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
          this.currentIndex = -1
          this.$emit('input', this.totalData)
          this.$emit('on-drop')
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
    &-wrap {
      padding: 6px;
    }
    &-inner {
      cursor: pointer;
      border: 1px solid #dfdfdf;
      background: #fff;
      border-radius: 2px;
      height: 80px;
      color: rgba(0, 0, 0, .65);
      &:hover {
        border: 1px solid #1089ff;
      }
      &.empty-title {
        border-color: #ff4d4f;
        &.item-selected {
          transition: .2s;
          border-color: #ff4d4f;
          animation: selectAnimError 2s infinite ease-in-out;
        }
      }
    }
    &-field {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fafafa;
      text-align: right;
      color: #52c41a;
      font-size: 12px;
      line-height: 22px;
      padding: 0 4px;
    }
    &-drag {
      color: #666;
      cursor: move;
    }
    &-required {
      position: absolute;
      bottom: 10px;
      left: 15px;
      font-size: 12px;
      color: #dadada;
      border: 1px solid #dadada;
      line-height: 1;
      padding: 2px;
      border-radius: 2px;
      &.active {
        color: #1089ff;
        border: 1px solid #1089ff;
      }
      &.rule {
        left: 50px;
        &.active {
          color: #fa8c16;
          border: 1px solid #fa8c16;
        }
      }
    }
    &-name {
      padding: 0 10px;
      line-height: 35px;
      height: 35px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-over {
      .item-inner {
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
    }
    &-selected {
      transition: .2s;
      border: 1px solid #1089ff;
      animation: selectAnim 2s infinite ease-in-out;
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
      box-shadow: 0 1px 0 3px rgba(64, 158, 255, .2);
    }
    50% {
      box-shadow: 0 1px 0 2px rgba(64, 158, 255, .1);
    }
    100% {
      box-shadow: 0 1px 0 3px rgba(64, 158, 255, .2);
    }
  }
  @keyframes selectAnimError {
    0% {
      box-shadow: 0 1px 0 3px rgba(255, 77, 79, 0.2);
    }
    50% {
      box-shadow: 0 1px 0 2px rgba(255, 77, 79, 0.1);
    }
    100% {
      box-shadow: 0 1px 0 3px rgba(255, 77, 79, 0.2);
    }
  }
</style>

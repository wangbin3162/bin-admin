<template>
  <div class="widget-form-container">
    <b-scrollbar style="height: 100%;">
      <b-empty class="form-empty" v-if="data.list.length === 0">从左侧拖拽或点击来添加字段</b-empty>
      <b-form ref="form" :label-position="data.config.labelPosition" :label-width="data.config.labelWidth"
              :class="'form-'+data.config.size">
        <draggable class=""
                   v-model="data.list"
                   v-bind="{group:'form', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                   @end="handleMoveEnd"
                   @add="handleWidgetAdd"
        >
          <transition-group name="fade" tag="div" class="widget-form-list">
            <template v-for="(element, index) in data.list">
              <!--布局-->
              <template v-if="element.type === 'grid'">
                <div class="widget-col widget-view" v-if="element && element.key" :key="element.key"
                     :class="{active: selectWidget.key === element.key}"
                     @click="handleSelectWidget(index)">
                  <b-row type="flex"
                         :gutter="element.options.gutter"
                         :justify="element.options.justify"
                         :align="element.options.align">
                    <b-col v-for="(col, colIndex) in element.columns" :key="colIndex" :span="col.span ? col.span : 0">
                      <draggable
                        v-model="col.list"
                        :no-transition-on-drag="true"
                        v-bind="{group:'form', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                        @end="handleMoveEnd"
                        @add="handleWidgetColAdd($event, element, colIndex)"
                      >
                        <transition-group name="fade" tag="div" class="widget-col-list">
                          <template v-for="(el, i) in col.list">
                            <widget-form-item
                              :key="el.key"
                              v-if="el.key"
                              :element="el"
                              :select.sync="selectWidget"
                              :index="i"
                              :data="col">
                            </widget-form-item>
                          </template>
                        </transition-group>
                      </draggable>
                    </b-col>
                  </b-row>
                  <!--拖拽删除-->
                  <div class="widget-view-action widget-col-action" v-if="selectWidget.key === element.key">
                    <i class="iconfont icon-ios-trash" title="删除" @click.stop="handleWidgetDelete(index)"></i>
                  </div>
                  <div class="widget-view-drag widget-col-drag" v-if="selectWidget.key === element.key">
                    <i class="iconfont icon-ios-move drag-widget"></i>
                  </div>
                </div>
              </template>
              <template v-else-if="element.type === 'divider'">
                <div class="widget-col widget-view" v-if="element && element.key" :key="element.key"
                     :class="{active: selectWidget.key === element.key}"
                     @click="handleSelectWidget(index)">
                  <b-divider v-if="!element.options.simple" :align="element.options.align"
                             :style="{fontSize:element.options.fontSize,margin:element.options.margin}">
                    {{ element.name }}
                  </b-divider>
                  <!--拖拽删除-->
                  <div class="widget-view-action widget-col-action" v-if="selectWidget.key === element.key">
                    <i class="iconfont icon-ios-trash" title="删除" @click.stop="handleWidgetDelete(index)"></i>
                  </div>
                  <div class="widget-view-drag widget-col-drag" v-if="selectWidget.key === element.key">
                    <i class="iconfont icon-ios-move drag-widget"></i>
                  </div>
                </div>
              </template>
              <template v-else>
                <widget-form-item v-if="element && element.key" :key="element.key" :element="element"
                                  :select.sync="selectWidget" :index="index" :data="data"></widget-form-item>
              </template>
            </template>
          </transition-group>
        </draggable>
      </b-form>
    </b-scrollbar>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from '@/components/FormMaking/WidgetFormItem'
import { getKey, getUid } from './config/utils'
import { deepCopy } from '@/common/utils/assist'

export default {
  name: 'WidgetForm',
  components: { WidgetFormItem, Draggable },
  props: ['data', 'select'],
  data() {
    return {
      selectWidget: this.select
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
  methods: {
    // 排序move
    handleMoveEnd({ newIndex, oldIndex }) {
      console.log('index', newIndex, oldIndex)
    },
    // 选中一个布局
    handleSelectWidget(index) {
      console.log(index, '#####')
      this.selectWidget = this.data.list[index]
    },
    // 基础布局模块增加
    handleWidgetAdd({ newIndex }) {
      // 克隆对象,并为拖拽到容器的元素添加唯一 key
      let cloneObj = this.cloneObjAndExtend(this.data.list[newIndex])
      this.$set(this.data.list, newIndex, cloneObj)

      this.selectWidget = this.data.list[newIndex]
    },
    // grid布局列增加事件
    handleWidgetColAdd($event, row, colIndex) {
      console.log('col add', $event, row, colIndex)
      const newIndex = $event.newIndex
      const oldIndex = $event.oldIndex
      const item = $event.item
      console.log('from', item)
      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf('no-put') >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === 'DIV' && this.data.list.splice(oldIndex, 0, row.columns[colIndex].list[newIndex])
        row.columns[colIndex].list.splice(newIndex, 1)
        console.log('不能嵌套布局')
        return false
      }
      // 克隆对象,并为拖拽到容器的元素添加唯一 key
      let cloneObj = this.cloneObjAndExtend(row.columns[colIndex].list[newIndex])
      this.$set(row.columns[colIndex].list, newIndex, cloneObj)
      this.selectWidget = row.columns[colIndex].list[newIndex]
    },
    // 容器删除事件
    handleWidgetDelete(index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.list[index - 1]
        }
      } else {
        this.selectWidget = this.data.list[index + 1]
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1)
      })
    },
    // 克隆并扩展属性函数
    cloneObjAndExtend(copyObj) {
      let cloneObj = deepCopy(copyObj)
      cloneObj.key = getKey()
      cloneObj.fieldName = getUid(cloneObj.type)
      cloneObj.rules = []
      return cloneObj
    }
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  }
}
</script>

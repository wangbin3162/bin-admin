<template>
  <b-form-item class="widget-view "
               v-if="element && element.key"
               :class="{active: selectWidget.key === element.key, 'bin-form-item-required': element.options.required}"
               :label="element.name"
               @click.native.stop="handleSelectWidget(index)"
  >
    <template v-if="element.type === 'input'">
      <b-input
        v-model="element.options.defaultValue"
        :style="{width: element.options.width}"
        :placeholder="element.options.placeholder"
        :disabled="element.options.disabled"
        :size="element.options.size"
      ></b-input>
    </template>
    <template v-if="element.type === 'textarea'">
      <b-input type="textarea" :rows="3"
               v-model="element.options.defaultValue"
               :style="{width: element.options.width}"
               :placeholder="element.options.placeholder"
               :disabled="element.options.disabled"
      ></b-input>
    </template>

    <div class="widget-view-action" v-if="selectWidget.key === element.key">
      <i class="iconfont icon-ios-copy" title="复制" @click.stop="handleWidgetClone(index)"></i>
      <i class="iconfont icon-ios-trash" title="删除" @click.stop="handleWidgetDelete(index)"></i>
    </div>

    <div class="widget-view-drag" v-if="selectWidget.key === element.key">
      <i class="iconfont icon-ios-move drag-widget"></i>
    </div>

  </b-form-item>
</template>

<script>
import { getKey } from './utils'

export default {
  name: 'WidgetFormItem',
  props: ['element', 'select', 'index', 'data'],
  data() {
    return {
      selectWidget: this.select
    }
  },
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index]
    },
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
    handleWidgetClone(index) {
      const key = getKey()
      let cloneData = {
        ...this.data.list[index],
        options: {
          ...this.data.list[index].options
        },
        key
      }

      if (this.data.list[index].type === 'radio' || this.data.list[index].type === 'checkbox' || this.data.list[index].type === 'select') {
        cloneData = {
          ...cloneData,
          options: {
            ...cloneData.options,
            options: cloneData.options.options.map(item => ({ ...item }))
          }
        }
      }

      this.data.list.splice(index, 0, cloneData)

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]
      })
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

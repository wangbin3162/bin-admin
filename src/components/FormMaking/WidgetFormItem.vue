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
        :clearable="element.options.clearable"
        :size="size"
        :maxlength="element.options.length"
        :show-word-count="element.options.showWordCount"
      ></b-input>
    </template>
    <template v-if="element.type === 'textarea'">
      <b-input type="textarea" :rows="3"
               v-model="element.options.defaultValue"
               :style="{width: element.options.width}"
               :placeholder="element.options.placeholder"
               :disabled="element.options.disabled"
               :maxlength="element.options.length"
               :show-word-count="element.options.showWordCount"
      ></b-input>
    </template>
    <template v-if="element.type === 'number'">
      <b-input-number
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :min="element.options.min"
        :max="element.options.max"
        :step="element.options.step"
        :style="{width: element.options.width}"
        :precision="element.options.precision"
        :size="size"
      ></b-input-number>
    </template>
    <template v-if="element.type === 'radio'">
      <b-radio-group v-model="element.options.defaultValue"
                     :style="{width: element.options.width}"
                     :disabled="element.options.disabled"
                     :type="element.options.buttonModel?'button':null"
                     :size="size"
      >
        <b-radio :style="element.options.buttonModel?null:blockStyle" :key="item.value + index"
                 :label="item.value" v-for="(item, index) in element.options.options"
        >
          {{ item.label }}
        </b-radio>
      </b-radio-group>
    </template>
    <template v-if="element.type === 'checkbox'">
      <b-checkbox-group :value="splitValue(element.options.defaultValue)"
                        :style="{width: element.options.width}"
                        @on-change="(list)=>{element.options.defaultValue=joinValue(list)}"
      >
        <b-checkbox :style="blockStyle" :label="item.value" v-for="(item, index) in element.options.options"
                    :disabled="element.options.disabled"
                    :key="item.value + index">
          {{ item.label }}
        </b-checkbox>
      </b-checkbox-group>
    </template>
    <template v-if="element.type === 'select'">
      <!--单选模式-->
      <b-select v-if="!element.options.multiple"
                key="1"
                v-model="element.options.defaultValue"
                :disabled="element.options.disabled"
                :clearable="element.options.clearable"
                :filterable="element.options.filterable"
                :placeholder="element.options.placeholder"
                :style="{width: element.options.width}"
                :size="size"
      >
        <b-option v-for="item in element.options.options" :key="item.value" :value="item.value"
                  :label="item.label"></b-option>
      </b-select>
      <!--多选模式-->
      <b-select v-else
                key="2"
                :value="splitValue(element.options.defaultValue)"
                :disabled="element.options.disabled"
                :multiple="element.options.multiple"
                :clearable="element.options.clearable"
                :filterable="element.options.filterable"
                :placeholder="element.options.placeholder"
                :style="{width: element.options.width}"
                :max-tag-count="element.options.maxTagCount"
                :size="size"
                @on-change="(list)=>{element.options.defaultValue=joinValue(list)}"
      >
        <b-option v-for="item in element.options.options" :key="item.value" :value="item.value"
                  :label="item.label"></b-option>
      </b-select>
    </template>
    <template v-if="element.type === 'time'">
      <b-time-picker
        v-model="element.options.defaultValue"
        :type="element.options.isRange?'timerange':'time'"
        :placeholder="element.options.placeholder"
        :readonly="element.options.readonly"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :format="element.options.format"
        :style="{width: element.options.width}"
        :size="size"
      >
      </b-time-picker>
    </template>
    <template v-if="element.type === 'date'">
      <b-date-picker
        :value="element.options.defaultValue"
        :type="element.options.type"
        :placeholder="element.options.placeholder"
        :readonly="element.options.readonly"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :style="{width: element.options.width}"
        :format="element.options.format"
        :size="size"
        separator=" ~ "
        @on-change="(val)=>{element.options.defaultValue=val}"
      >
      </b-date-picker>
    </template>
    <template v-if="element.type === 'switch'">
      <label :style="{ lineHeight : sizeHeightMap[size]}">
        <b-switch
          v-model="element.options.defaultValue"
          :disabled="element.options.disabled"
          :size="element.options.size"
          :true-value="element.options.trueValue" :false-value="element.options.falseValue"
          :active-color="element.options.activeColor" :inactive-color="element.options.inactiveColor"
        >
          <span slot="open" v-if="element.options.openText">{{ element.options.openText }}</span>
          <span slot="close" v-if="element.options.closeText">{{ element.options.closeText }}</span>
        </b-switch>
      </label>
    </template>
    <template v-if="element.type === 'color'">
      <b-color-picker
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :alpha="element.options.alpha"
        :recommend="element.options.recommend"
        :size="size"
      ></b-color-picker>
    </template>
    <template v-if="element.type === 'rate'">
      <div flex="cross:center" :style="{ height : sizeHeightMap[size]}">
        <b-rate v-model="element.options.defaultValue"
                :max="element.options.max"
                :disabled="element.options.disabled"
                :allow-half="element.options.allowHalf"
                :show-score="element.options.showScore"
        ></b-rate>
        <b-button v-if="element.options.clearable" type="text" style="margin-left: 10px;">清空</b-button>
      </div>
    </template>
    <template v-if="element.type === 'slider'">
      <div style="padding: 0 4px;">
        <b-slider
          v-model="element.options.defaultValue"
          :min="element.options.min"
          :max="element.options.max"
          :disabled="element.options.disabled"
          :step="element.options.step"
          :show-input="element.options.showInput"
          :range="element.options.range"
          :style="{width: element.options.width}"
          :input-size="size"
        ></b-slider>
      </div>
    </template>

    <div class="widget-view-action" v-if="selectWidget.key === element.key">
      <i class="iconfont icon-ios-copy" title="复制" @click.stop="handleWidgetClone(index)"></i>
      <i class="iconfont icon-ios-trash" title="删除" @click.stop="handleWidgetDelete(index)"></i>
    </div>

    <div class="widget-view-drag" v-if="selectWidget.key === element.key">
      <i class="iconfont icon-ios-move drag-widget"></i>
    </div>

    <div class="widget-view-field-name"
         :style="{color:repeatModel.indexOf(element.model)>=0?'#ff4d4f':'#52c41a'}">
      <span draggable="true" @dragstart="onDrag($event,element.model)">{{ element.model }}</span>
    </div>

  </b-form-item>
</template>

<script>
import { getKey, getUid, splitValue, joinValue } from './config/utils'
import { deepCopy } from '@/common/utils/assist'

export default {
  name: 'WidgetFormItem',
  props: ['element', 'select', 'index', 'data'],
  inject: ['ConfigRoot'],
  data() {
    return {
      selectWidget: this.select,
      sizeHeightMap: { large: '42px', default: '32px', small: '28px', mini: '24px' }
    }
  },
  computed: {
    size() {
      return this.ConfigRoot.widgetForm.config.size
    },
    blockStyle() {
      return {
        display: this.element.options.inline ? 'inline-block' : 'block',
        paddingTop: this.element.options.inline ? '0' : '4px'
      }
    },
    repeatModel() {
      return this.ConfigRoot.repeatModels
    }
  },
  methods: {
    onDrag(e, index) {
      // 拖拽字段名称并存储，用于自动填充使用
      e.dataTransfer.setData('index', index)
    },
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
      let cloneObj = this.cloneObjAndExtend(this.data.list[index])
      this.data.list.splice(index, 0, cloneObj)

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]
      })
    },
    // 克隆并扩展属性函数
    cloneObjAndExtend(copyObj) {
      let cloneObj = deepCopy(copyObj)
      cloneObj.key = getKey()
      cloneObj.model = getUid(cloneObj.type)
      cloneObj.rules = []
      return cloneObj
    },
    splitValue(value) {
      return splitValue(value)
    },
    joinValue(arr) {
      return joinValue(arr)
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

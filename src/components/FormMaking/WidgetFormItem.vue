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
        :size="size"
      ></b-input-number>
    </template>
    <template v-if="element.type === 'radio'">
      <!--按钮模式-->
      <div flex="cross:center" :style="{ height : sizeHeightMap[size]}" v-if="element.options.buttonModel">
        <btn-radio v-model="element.options.defaultValue"
                   :options="element.options.options"
                   :disabled="element.options.disabled"
                   :size="element.options.size"
                   :active="element.options.active"></btn-radio>
      </div>
      <b-radio-group v-else v-model="element.options.defaultValue"
                     :style="{width: element.options.width}"
                     :disabled="element.options.disabled"
      >
        <b-radio
          :style="{display: element.options.inline ? 'inline-block' : 'block',paddingTop:element.options.inline?'0':'4px'}"
          :label="item.value" v-for="(item, index) in element.options.options" :key="item.value + index"
        >
          {{ item.label }}
        </b-radio>
      </b-radio-group>
    </template>
    <template v-if="element.type === 'checkbox'">
      <b-checkbox-group v-model="element.options.defaultValue"
                        :style="{width: element.options.width}"
                        :disabled="element.options.disabled"
      >
        <b-checkbox
          :style="{display: element.options.inline ? 'inline-block' : 'block',paddingTop:element.options.inline?'0':'4px'}"
          :label="item.value" v-for="(item, index) in element.options.options" :key="item.value + index"
        >
          {{ item.label }}
        </b-checkbox>
      </b-checkbox-group>
    </template>
    <template v-if="element.type === 'select'">
      <b-select
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :multiple="element.options.multiple"
        :clearable="element.options.clearable"
        :filterable="element.options.filterable"
        :placeholder="element.options.placeholder"
        :style="{width: element.options.width}"
        :max-tag-count="element.options.maxTagCount"
        :size="size"
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
      </div>
    </template>
    <template v-if="element.type === 'slider'">
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
    </template>

    <div class="widget-view-action" v-if="selectWidget.key === element.key">
      <i class="iconfont icon-ios-copy" title="复制" @click.stop="handleWidgetClone(index)"></i>
      <i class="iconfont icon-ios-trash" title="删除" @click.stop="handleWidgetDelete(index)"></i>
    </div>

    <div class="widget-view-drag" v-if="selectWidget.key === element.key">
      <i class="iconfont icon-ios-move drag-widget"></i>
    </div>

    <div class="widget-view-field-name" v-if="selectWidget.key === element.key">
      <span draggable="true" @dragstart="onDrag($event,element.fieldName)">{{ element.fieldName }}</span>
    </div>

  </b-form-item>
</template>

<script>
import { getKey } from './config/utils'
import BtnRadio from '@/components/FormMaking/components/BtnRadio'

export default {
  name: 'WidgetFormItem',
  components: { BtnRadio },
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

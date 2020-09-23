<template>
  <b-form-item :label="widget.name" :prop="widget.model">
    <template v-if="widget.type === 'input'">
      <b-input
        v-model="currentValue"
        :style="{width: widget.options.width}"
        :placeholder="widget.options.placeholder"
        :disabled="widget.options.disabled"
        :clearable="widget.options.clearable"
        :size="size"
        :maxlength="widget.options.length"
        :show-word-count="widget.options.showWordCount"
        @on-change="handleInputEvent"
      ></b-input>
    </template>
    <template v-if="widget.type === 'textarea'">
      <b-input type="textarea" :rows="3"
               v-model="currentValue"
               :style="{width: widget.options.width}"
               :placeholder="widget.options.placeholder"
               :disabled="widget.options.disabled"
               :maxlength="widget.options.length"
               :show-word-count="widget.options.showWordCount"
               @on-change="handleInputEvent"
      ></b-input>
    </template>
    <template v-if="widget.type === 'number'">
      <b-input-number
        v-model="currentValue"
        :disabled="widget.options.disabled"
        :min="widget.options.min"
        :max="widget.options.max"
        :step="widget.options.step"
        :style="{width: widget.options.width}"
        :precision="widget.options.precision"
        :size="size"
        @on-change="handleInput"
      ></b-input-number>
    </template>
    <template v-if="widget.type === 'radio'">
      <b-radio-group v-model="currentValue"
                     :style="{width: widget.options.width}"
                     :disabled="widget.options.disabled"
                     :type="widget.options.buttonModel?'button':null"
                     :size="size"
                     @on-change="handleInput"
      >
        <b-radio :style="widget.options.buttonModel?null:blockStyle" :key="item.value + index"
                 :label="item.value" v-for="(item, index) in widget.options.options"
        >
          {{ item.label }}
        </b-radio>
      </b-radio-group>
    </template>
    <template v-if="widget.type === 'checkbox'">
      <b-checkbox-group :value="splitValue(currentValue)"
                        :style="{width: widget.options.width}"
                        @on-change="handleInputMultiple"
      >
        <b-checkbox
          :disabled="widget.options.disabled"
          :style="{display: widget.options.inline ? 'inline-block' : 'block',paddingTop:widget.options.inline?'0':'4px'}"
          :label="item.value" v-for="(item, index) in widget.options.options" :key="item.value + index"
        >
          {{ item.label }}
        </b-checkbox>
      </b-checkbox-group>
    </template>
    <template v-if="widget.type === 'select'">
      <b-select v-if="!widget.options.multiple" key="1"
                v-model="currentValue"
                :disabled="widget.options.disabled"
                :clearable="widget.options.clearable"
                :filterable="widget.options.filterable"
                :placeholder="widget.options.placeholder"
                :style="{width: widget.options.width}"
                :size="size"
                @on-change="handleInput"
      >
        <b-option v-for="item in widget.options.options" :key="item.value" :value="item.value"
                  :label="item.label"></b-option>
      </b-select>
      <b-select v-else key="2"
                :value="splitValue(currentValue)"
                :disabled="widget.options.disabled"
                :multiple="widget.options.multiple"
                :clearable="widget.options.clearable"
                :filterable="widget.options.filterable"
                :placeholder="widget.options.placeholder"
                :style="{width: widget.options.width}"
                :max-tag-count="widget.options.maxTagCount"
                :size="size"
                @on-change="handleInputMultiple"
      >
        <b-option v-for="item in widget.options.options" :key="item.value" :value="item.value"
                  :label="item.label"></b-option>
      </b-select>
    </template>
    <template v-if="widget.type === 'time'">
      <b-time-picker
        v-model="currentValue"
        :type="widget.options.isRange?'timerange':'time'"
        :placeholder="widget.options.placeholder"
        :readonly="widget.options.readonly"
        :disabled="widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :format="widget.options.format"
        :style="{width: widget.options.width}"
        :size="size"
        @on-change="handleInput"
      >
      </b-time-picker>
    </template>
    <template v-if="widget.type === 'date'">
      <b-date-picker
        :value="currentValue"
        :type="widget.options.type"
        :placeholder="widget.options.placeholder"
        :readonly="widget.options.readonly"
        :disabled="widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :style="{width: widget.options.width}"
        :format="widget.options.format"
        :size="size"
        separator=" ~ "
        @on-change="handleInput"
      >
      </b-date-picker>
    </template>
    <template v-if="widget.type === 'switch'">
      <label :style="{ lineHeight : sizeHeightMap[size]}">
        <b-switch
          v-model="currentValue"
          :disabled="widget.options.disabled"
          :size="widget.options.size"
          :true-value="widget.options.trueValue" :false-value="widget.options.falseValue"
          :active-color="widget.options.activeColor" :inactive-color="widget.options.inactiveColor"
          @on-change="handleInput"
        >
          <span slot="open" v-if="widget.options.openText">{{ widget.options.openText }}</span>
          <span slot="close" v-if="widget.options.closeText">{{ widget.options.closeText }}</span>
        </b-switch>
      </label>
    </template>
    <template v-if="widget.type === 'color'">
      <b-color-picker
        v-model="currentValue"
        :disabled="widget.options.disabled"
        :alpha="widget.options.alpha"
        :recommend="widget.options.recommend"
        :size="size"
        @on-change="handleInput"
      ></b-color-picker>
    </template>
    <template v-if="widget.type === 'rate'">
      <div flex="cross:center" :style="{ height : sizeHeightMap[size]}">
        <b-rate v-model="currentValue"
                :max="widget.options.max"
                :disabled="widget.options.disabled"
                :allow-half="widget.options.allowHalf"
                :show-score="widget.options.showScore"
                @on-change="handleInput"
        ></b-rate>
        <b-button v-if="widget.options.clearable" type="text" style="margin-left: 10px;" @click="handleInput(0)">清空
        </b-button>
      </div>
    </template>
    <template v-if="widget.type === 'slider'">
      <b-slider
        v-model="currentValue"
        :min="widget.options.min"
        :max="widget.options.max"
        :disabled="widget.options.disabled"
        :step="widget.options.step"
        :show-input="widget.options.showInput"
        :range="widget.options.range"
        :style="{width: widget.options.width}"
        :input-size="size"
        @on-change="handleInput"
      ></b-slider>
    </template>
  </b-form-item>
</template>

<script>
import { joinValue, splitValue } from '@/components/FormMaking/config/utils'

export default {
  name: 'GenerateFormItem',
  props: ['widget', 'value', 'formConfig'],
  computed: {
    size() {
      return this.formConfig.size
    },
    blockStyle() {
      return {
        display: this.widget.options.inline ? 'inline-block' : 'block',
        paddingTop: this.widget.options.inline ? '0' : '4px'
      }
    }
  },
  data() {
    return {
      currentValue: this.value,
      sizeHeightMap: { large: '42px', default: '32px', small: '28px', mini: '24px' }
    }
  },
  methods: {
    // 输入框输入
    handleInputEvent(event) {
      this.handleInput(event.target.value)
    },
    // 触发emit input函数
    handleInput(value) {
      this.currentValue = value
      this.$emit('input', this.currentValue)
      this.$emit('input-change', this.currentValue, this.widget.model)
    },
    // 触发多选input函数
    handleInputMultiple(value) {
      this.currentValue = joinValue(value)
      this.$emit('input', this.currentValue)
      this.$emit('input-change', this.currentValue, this.widget.model)
    },
    splitValue(value) {
      return splitValue(value)
    }
  },
  watch: {
    value: {
      handler(val) {
        this.currentValue = val
      },
      immediate: true
    }
  }
}
</script>

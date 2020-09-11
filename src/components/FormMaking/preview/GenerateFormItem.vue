<template>
  <b-form-item :label="widget.name" :prop="widget.model">
    <template v-if="widget.type === 'input'">
      <b-input
        v-model="dataModel"
        :style="{width: widget.options.width}"
        :placeholder="widget.options.placeholder"
        :disabled="widget.options.disabled"
        :clearable="widget.options.clearable"
        :size="size"
        :maxlength="widget.options.length"
        :show-word-count="widget.options.showWordCount"
      ></b-input>
    </template>
    <template v-if="widget.type === 'textarea'">
      <b-input type="textarea" :rows="3"
               v-model="dataModel"
               :style="{width: widget.options.width}"
               :placeholder="widget.options.placeholder"
               :disabled="widget.options.disabled"
               :maxlength="widget.options.length"
               :show-word-count="widget.options.showWordCount"
      ></b-input>
    </template>
    <template v-if="widget.type === 'number'">
      <b-input-number
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :min="widget.options.min"
        :max="widget.options.max"
        :step="widget.options.step"
        :style="{width: widget.options.width}"
        :size="size"
      ></b-input-number>
    </template>
    <template v-if="widget.type === 'radio'">
      <!--按钮模式-->
      <div flex="cross:center" :style="{ height : sizeHeightMap[size]}" v-if="widget.options.buttonModel">
        <btn-radio v-model="dataModel"
                   :options="widget.options.options"
                   :disabled="widget.options.disabled"
                   :size="widget.options.size"
                   :active="widget.options.active"></btn-radio>
      </div>
      <b-radio-group v-else v-model="dataModel"
                     :style="{width: widget.options.width}"
                     :disabled="widget.options.disabled"
      >
        <b-radio
          :style="{display: widget.options.inline ? 'inline-block' : 'block',paddingTop:widget.options.inline?'0':'4px'}"
          :label="item.value" v-for="(item, index) in widget.options.options" :key="item.value + index"
        >
          {{ item.label }}
        </b-radio>
      </b-radio-group>
    </template>
    <template v-if="widget.type === 'checkbox'">
      <b-checkbox-group v-model="dataModel"
                        :style="{width: widget.options.width}"
                        :disabled="widget.options.disabled"
      >
        <b-checkbox
          :style="{display: widget.options.inline ? 'inline-block' : 'block',paddingTop:widget.options.inline?'0':'4px'}"
          :label="item.value" v-for="(item, index) in widget.options.options" :key="item.value + index"
        >
          {{ item.label }}
        </b-checkbox>
      </b-checkbox-group>
    </template>
    <template v-if="widget.type === 'select'">
      <b-select
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :multiple="widget.options.multiple"
        :clearable="widget.options.clearable"
        :filterable="widget.options.filterable"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
        :max-tag-count="widget.options.maxTagCount"
        :size="size"
      >
        <b-option v-for="item in widget.options.options" :key="item.value" :value="item.value"
                  :label="item.label"></b-option>
      </b-select>
    </template>
    <template v-if="widget.type === 'time'">
      <b-time-picker
        v-model="dataModel"
        :type="widget.options.isRange?'timerange':'time'"
        :placeholder="widget.options.placeholder"
        :readonly="widget.options.readonly"
        :disabled="widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :format="widget.options.format"
        :style="{width: widget.options.width}"
        :size="size"
      >
      </b-time-picker>
    </template>
    <template v-if="widget.type === 'date'">
      <b-date-picker
        :value="widget.options.defaultValue"
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
        @on-change="(val)=>{widget.options.defaultValue=val}"
      >
      </b-date-picker>
    </template>
    <template v-if="widget.type === 'switch'">
      <label :style="{ lineHeight : sizeHeightMap[size]}">
        <b-switch
          v-model="dataModel"
          :disabled="widget.options.disabled"
          :size="widget.options.size"
          :true-value="widget.options.trueValue" :false-value="widget.options.falseValue"
          :active-color="widget.options.activeColor" :inactive-color="widget.options.inactiveColor"
        >
          <span slot="open" v-if="widget.options.openText">{{ widget.options.openText }}</span>
          <span slot="close" v-if="widget.options.closeText">{{ widget.options.closeText }}</span>
        </b-switch>
      </label>
    </template>
    <template v-if="widget.type === 'color'">
      <b-color-picker
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :alpha="widget.options.alpha"
        :recommend="widget.options.recommend"
        :size="size"
      ></b-color-picker>
    </template>
    <template v-if="widget.type === 'rate'">
      <div flex="cross:center" :style="{ height : sizeHeightMap[size]}">
        <b-rate v-model="dataModel"
                :max="widget.options.max"
                :disabled="widget.options.disabled"
                :allow-half="widget.options.allowHalf"
                :show-score="widget.options.showScore"
        ></b-rate>
      </div>
    </template>
    <template v-if="widget.type === 'slider'">
      <div style="padding: 0 4px;">
        <b-slider
          v-model="dataModel"
          :min="widget.options.min"
          :max="widget.options.max"
          :disabled="widget.options.disabled"
          :step="widget.options.step"
          :show-input="widget.options.showInput"
          :range="widget.options.range"
          :style="{width: widget.options.width}"
          :input-size="size"
        ></b-slider>
      </div>
    </template>
  </b-form-item>
</template>

<script>
import BtnRadio from '@/components/FormMaking/components/BtnRadio'

export default {
  name: 'GenerateFormItem',
  components: { BtnRadio },
  props: ['widget', 'models', 'rules', 'formConfig'],
  computed: {
    size() {
      return this.formConfig.size
    }
  },
  data() {
    return {
      dataModel: this.models[this.widget.model],
      sizeHeightMap: { large: '42px', default: '32px', small: '28px', mini: '24px' }
    }
  },
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.model] = val
        this.$emit('update:models', {
          ...this.models,
          [this.widget.model]: val
        })
        this.$emit('input-change', val, this.widget.model)
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.widget.model]
      }
    }
  }
}
</script>

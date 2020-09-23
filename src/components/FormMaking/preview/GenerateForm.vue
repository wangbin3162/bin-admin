<template>
  <div class="fm-style">
    <b-form ref="generateForm"
            :model="models" :rules="rules"
            :label-position="data.config.labelPosition"
            :label-width="data.config.labelWidth"
            :size="data.config.size">
      <template v-for="element in data.list">
        <!--显示grid-->
        <template v-if="element.type === 'grid'">
          <b-row
            :key="element.key"
            type="flex"
            :gutter="element.options.gutter"
            :justify="element.options.justify"
            :align="element.options.align"
          >
            <b-col v-for="(col, colIndex) in element.columns" :key="colIndex" :span="col.span">
              <template v-for="el in col.list">
                <generate-form-item
                  :key="el.key"
                  v-model="models[el.model]"
                  :form-config="data.config"
                  :widget="el"
                  @input-change="onInputChange">
                </generate-form-item>
              </template>
            </b-col>
          </b-row>
        </template>
        <!--显示分割线-->
        <template v-else-if="element.type === 'divider'">
          <b-divider v-if="!element.options.simple" :align="element.options.align" :key="element.key"
                     :dashed="element.options.dashed"
                     :style="{margin:element.options.margin}">
            {{ element.name }}
          </b-divider>
        </template>
        <!--基础字段-->
        <template v-else>
          <generate-form-item
            :key="element.key"
            v-model="models[element.model]"
            :form-config="data.config"
            :widget="element"
            @input-change="onInputChange">
          </generate-form-item>
        </template>
      </template>
    </b-form>
  </div>
</template>

<script>
import { buildRules } from '../config/utils'
import GenerateFormItem from '@/components/FormMaking/preview/GenerateFormItem'
import { getFieldsByList } from '@/components/FormMaking/config/utils'

export default {
  name: 'GenerateForm',
  components: { GenerateFormItem },
  props: ['data', 'defaultModel'],
  data() {
    return {
      models: {
        id: ''
      },
      rules: {}
    }
  },
  methods: {
    // 动态组装models和rules
    generateModel() {
      if (this.defaultModel && this.defaultModel.id) {
        this.models.id = this.defaultModel.id
      }
      let allFields = getFieldsByList(this.data.list)
      allFields.forEach(item => {
        let value = item.options.defaultValue
        if (this.defaultModel && this.defaultModel.hasOwnProperty(item.model)) {
          value = this.defaultModel[item.model]
        }
        this.$set(this.models, item.model.toLowerCase(), value)
        let rules = buildRules(item.rules, this.models)
        if (rules.length > 0) {
          this.$set(this.rules, item.model, rules)
        }
      })
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            resolve(this.models)
          } else {
            reject(new Error('校验失败'))
          }
        })
      })
    },
    reset() {
      this.$refs.generateForm.resetFields()
    },
    // 字段输入改变事件，字段名，值，models
    onInputChange(value, field) {
      // console.log(value, field)
      this.$emit('on-change', field, value, this.models)
    }
  },
  created() {
    this.generateModel()
    console.log(this.models)
    console.log(this.rules)
  }
}
</script>

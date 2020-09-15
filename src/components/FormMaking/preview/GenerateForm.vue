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
                  :models.sync="models"
                  :form-config="data.config"
                  :rules="rules"
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
            :models.sync="models"
            :form-config="data.config"
            :rules="rules"
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

export default {
  name: 'GenerateForm',
  components: { GenerateFormItem },
  props: ['data'],
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
    generateModel(genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this.generateModel(item.list)
          })
        }
        if (['grid', 'divider'].indexOf(genList[i].type) < 0) {
          // 1、先根据filedName扩展form对象
          this.$set(this.models, genList[i].model.toLowerCase(), genList[i].options.defaultValue)
          let rules = buildRules(genList[i].rules, this.models)
          if (rules.length > 0) {
            this.$set(this.rules, genList[i].model, rules)
          }
        }
      }
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
      this.$emit('on-change', field, value, this.models)
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.generateModel(val.list)
        console.log(this.models)
        console.log(this.rules)
      },
      immediate: true
    }
  }
}
</script>

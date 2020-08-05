<template>
  <div class="data-source-params">
    <div style="padding-bottom: 5px;">
      <gui-field label="配置模式" label-width="70px">
        <b-tag :type="activeTab==='ctrl'?'primary':'info'" size="mini"
               style="cursor: pointer" @click.native="activeTab='ctrl'">
          控件模式
        </b-tag>
        <b-tag :type="activeTab==='json'?'primary':'info'" size="mini"
               style="cursor: pointer" @click.native="activeTab='json'">
          开发模式
        </b-tag>
      </gui-field>
    </div>
    <b-collapse simple accordion v-if="activeTab==='ctrl'">
      <b-collapse-panel v-for="(item,index) in params" :key="item.id" :name="item.id">
        <div slot="title" style="display:inline-block;width:calc(100% - 20px);padding:0 4px;">
          <div flex="main:justify">
            <span>{{ item.paramName }}</span>
            <b-tag type="warning" size="mini" style="margin: 0;font-size: 12px;">
              {{ controlTypeMap[item.controlType] }}
            </b-tag>
          </div>
        </div>
        <div v-if="item.realVal">
          <template v-if="item.controlType==='TEXT'">
            <gui-field label="实际值:" label-width="60px">
              <b-input v-model="params[index].realVal.value" size="small" placeholder="实际值" clearable
                       @on-change="emitValue"/>
            </gui-field>
          </template>
          <template v-if="item.controlType==='NUM'">
            <gui-field label="实际值:" label-width="60px">
              <b-input-number v-model="params[index].realVal.value" size="small" style="width: 100%;"
                              @on-change="emitValue"/>
            </gui-field>
          </template>
          <template v-if="item.controlType==='NUM_RANGE'">
            <num-range v-model="params[index].realVal.value" @on-change="emitValue"/>
          </template>
          <template v-if="item.controlType==='DATA_RANGE'">
            <date-range v-model="params[index].realVal.value" @on-change="emitValue"/>
          </template>
          <template v-if="item.controlType==='ITEM'">
            <gui-field label="信息项:" label-width="60px">
              <item-ctrl v-model="params[index].realVal" @on-change="emitValue"/>
            </gui-field>
          </template>
          <template v-if="item.controlType==='PREFIX'">
            <prefix-ctrl v-model="params[index].realVal" @on-change="emitValue"/>
          </template>
          <template v-if="item.controlType==='TERM'">
            <term-ctrl v-model="params[index].realVal" @on-change="emitValue"/>
          </template>
        </div>
      </b-collapse-panel>
    </b-collapse>
    <b-ace-editor v-else :value="JSON.stringify(params.map(i=>({paramName:i.paramName,realVal:i.realVal})),null,2)" wrap
                  @on-change="jsonChange"/>
  </div>
</template>

<script>
import { deepCopy } from '@/common/utils/assist'
import { getTplControlType } from '@/api/analyze-engine/da-business-temp.api'
import GuiField from '../gui/gui-field'
import NumRange from './ctrl/NumRange'
import DateRange from './ctrl/DateRange'
import ItemCtrl from './ctrl/ItemCtrl'
import PrefixCtrl from './ctrl/PrefixCtrl'
import TermCtrl from './ctrl/TermCtrl'

export default {
  name: 'DataSourceParam',
  components: { TermCtrl, PrefixCtrl, ItemCtrl, DateRange, NumRange, GuiField },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      tabs: [
        { key: 'ctrl', title: '控件编辑' },
        { key: 'json', title: '开发模式' }
      ],
      activeTab: 'ctrl',
      params: [],
      controlTypeMap: {
        DATA_RANGE: '日期范围',
        DICT: '字典',
        ENUM: '枚举',
        ITEM: '信息项',
        NUM: '数字框',
        NUM_RANGE: '数字范围',
        PREFIX: '行业代码过滤控件',
        TERM: '精确过滤控件',
        TEXT: '文本框'
      }
    }
  },
  created() {
    // 获取参数类型和控件类型枚举
    getTplControlType().then(resp => {
      this.controlTypeMap = resp.data.data || {}
    })
  },
  watch: {
    value: {
      handler(val) {
        this.params = deepCopy(val)
      },
      immediate: true
    }
  },
  methods: {
    jsonChange(str) {
      try {
        let values = JSON.parse(str)
        if (values) {
          values.forEach((item, index) => {
            this.params[index].realVal = item.realVal
          })
          this.emitValue()
        }
      } catch (e) {
      }
    },
    emitValue() {
      this.$emit('input', this.params)
      this.$emit('on-change', this.params)
    }
  }
}
</script>

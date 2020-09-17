<template>
  <div v-if="show" class="widget-config-container">
    <b-form :model="data" size="small" label-position="top">
      <cfg-group group-name="字段属性" v-if="data.type!=='grid'&&data.type!=='divider'">
        <div class="form-config-item">
          <b-form-item label="字段名称" prop="model" class="bin-form-item-required">
            <b-input v-model="data.model" size="small" clearable @on-blur="checkModel"/>
          </b-form-item>
          <b-form-item label="控件标题" prop="name">
            <b-input v-model="data.name" size="small" clearable/>
          </b-form-item>
          <b-row :gutter="10">
            <b-col span="12">
              <b-form-item label="数据长度" prop="length">
                <b-input-number v-model="data.length" size="small" :min="0" style="width:100%;"/>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="数据精度" prop="precision">
                <b-input-number v-model="data.precision" size="small" :min="0" style="width:100%;"/>
              </b-form-item>
            </b-col>
          </b-row>
        </div>
      </cfg-group>
      <cfg-group group-name="控件属性">
        <cfg-field label="控件宽度" v-if="hasProperty('width')">
          <b-input v-model="data.options.width" size="small" placeholder="支持百分比(%)和像素(px)" clearable/>
        </cfg-field>
        <cfg-field label="文本长度" v-if="hasProperty('length')">
          <b-input-number v-model="data.options.length" size="small" :max="data.length"></b-input-number>
        </cfg-field>
        <cfg-field label="数值精度" v-if="hasProperty('precision')">
          <b-input-number v-model="data.options.precision" size="small" :max="data.precision"></b-input-number>
        </cfg-field>
        <cfg-field label="最小值" v-if="hasProperty('min')">
          <b-input-number v-model="data.options.min" size="small"></b-input-number>
          <b-button-group style="margin-left: 8px;" v-if="data.type==='number'">
            <b-button :type="data.options.min===-Infinity?'primary':'default'" size="small"
                      @click="data.options.min = -Infinity">min
            </b-button>
            <b-button :type="data.options.min===0?'primary':'default'" size="small"
                      @click="data.options.min = 0">0
            </b-button>
            <b-button :type="data.options.min===Infinity?'primary':'default'" size="small"
                      @click="data.options.min = Infinity">max
            </b-button>
          </b-button-group>
        </cfg-field>
        <cfg-field label="最大值" v-if="hasProperty('max')">
          <b-input-number v-model="data.options.max" size="small"></b-input-number>
          <b-button-group style="margin-left: 8px;" v-if="data.type==='number'">
            <b-button :type="data.options.max===-Infinity?'primary':'default'" size="small"
                      @click="data.options.max = -Infinity">min
            </b-button>
            <b-button :type="data.options.max===0?'primary':'default'" size="small"
                      @click="data.options.max = 0">0
            </b-button>
            <b-button :type="data.options.max===Infinity?'primary':'default'" size="small"
                      @click="data.options.max = Infinity">max
            </b-button>
          </b-button-group>
        </cfg-field>
        <cfg-field label="步长" v-if="hasProperty('step')">
          <b-input-number v-model="data.options.step" size="small" :min="1"></b-input-number>
        </cfg-field>
        <cfg-field label="布局方式" v-if="hasProperty('inline')">
          <b-button-group>
            <b-button :type="data.options.inline===true?'primary':'default'" size="small"
                      @click="data.options.inline=true">行内
            </b-button>
            <b-button :type="data.options.inline===false?'primary':'default'" size="small"
                      @click="data.options.inline=false">块级
            </b-button>
          </b-button-group>
        </cfg-field>
        <cfg-field label="按钮模式" v-if="hasProperty('buttonModel')">
          <b-switch v-model="data.options.buttonModel"/>
        </cfg-field>
        <cfg-field label="大小" v-if="hasProperty('size')">
          <b-radio-group v-model="data.options.size" size="small" type="button">
            <b-radio label="large">大号</b-radio>
            <b-radio label="default">默认</b-radio>
            <b-radio label="small">小号</b-radio>
          </b-radio-group>
        </cfg-field>
        <cfg-field label="开关文字" v-if="hasProperty('openText')&&hasProperty('closeText')">
          <cfg-inline label="open">
            <b-input v-model="data.options.openText" size="small" clearable/>
          </cfg-inline>
          <cfg-inline label="close">
            <b-input v-model="data.options.closeText" size="small" clearable/>
          </cfg-inline>
        </cfg-field>
        <cfg-field label="格式" v-if="hasProperty('format')">
          <b-input v-model="data.options.format" size="small" clearable/>
          <b-button size="small" @click="data.options.format=data.type==='time'?'HH:mm:ss':'yyyy-MM-dd'"
                    style="margin-left: -1px;">
            复位
          </b-button>
        </cfg-field>
        <cfg-field label="占位内容" v-if="hasProperty('placeholder')">
          <b-input v-model="data.options.placeholder" size="small" clearable/>
        </cfg-field>
        <cfg-field label="显示类型" v-if="hasProperty('type')">
          <b-radio-group v-model="data.options.type" size="small" type="button">
            <b-radio label="date">date</b-radio>
            <b-radio label="datetime">datetime</b-radio>
          </b-radio-group>
        </cfg-field>
        <!--不同组件的默认值-->
        <cfg-field label="默认值" v-if="hasProperty('defaultValue') && !hasOptions">
          <b-input v-if="data.type==='input'" size="small"
                   v-model="data.options.defaultValue"
                   :clearable="data.options.clearable"/>
          <b-input v-if="data.type==='textarea'" type="textarea" :rows="3" show-word-count
                   v-model="data.options.defaultValue"/>
          <b-input-number v-if="data.type==='number'" size="small" :precision="data.options.precision"
                          v-model="data.options.defaultValue" :step="data.options.step"/>
          <b-switch v-if="data.type==='switch'" v-model="data.options.defaultValue"/>
          <template v-if="data.type==='color'">
            <b-color-picker v-model="data.options.defaultValue" recommend size="small"
                            :alpha="data.options.alpha" placement="bottom-start"/>
            <b-input v-model="data.options.defaultValue" size="small" readonly clearable/>
          </template>
          <template v-if="data.type==='rate'">
            <b-rate :max="data.options.max" :allow-half="data.options.allowHalf"
                    v-model="data.options.defaultValue"></b-rate>
            <b-button type="text" style="margin-left: 10px;" @click="data.options.defaultValue=0">清空</b-button>
          </template>
          <b-slider style="width: 280px;"
                    v-if="data.type==='slider'" v-model="data.options.defaultValue" :range="data.options.range"
                    :step="data.options.step"/>
          <template v-if="data.type==='time'">
            <b-time-picker
              key="1" size="small"
              style="width: 100%;"
              v-if="!data.options.isRange"
              v-model="data.options.defaultValue"
              :value-format="data.options.format"
              :clearable="data.options.clearable"
            >
            </b-time-picker>
            <b-time-picker
              key="2" size="small"
              v-if="data.options.isRange"
              style="width: 100%;"
              v-model="data.options.defaultValue"
              :type="data.options.isRange?'timerange':'time'"
              :value-format="data.options.format"
              :clearable="data.options.clearable"
            >
            </b-time-picker>
          </template>
          <b-date-picker v-if="data.type==='date'" style="width: 100%;" size="small"
                         :value="data.options.defaultValue"
                         :type="data.options.type"
                         :placeholder="data.options.placeholder"
                         :clearable="data.options.clearable"
                         :format="data.options.format"
                         @on-change="(val)=>{data.options.defaultValue=val}"
          >
          </b-date-picker>
        </cfg-field>
        <cfg-field label="最大标签" v-if="hasProperty('maxTagCount')">
          <b-input-number v-model="data.options.maxTagCount" size="small" :min="1" :max="3"
                          :disabled="!data.options.multiple"/>
        </cfg-field>
        <!--选项-->
        <div class="form-config-item" v-if="hasProperty('options')">
          <b-divider style="margin: 16px 0;"/>
          <b-form-item label="选项" style="margin-bottom: 0;">
            <template v-if="data.type==='radio' || (data.type==='select'&&!data.options.multiple)">
              <b-radio-group v-model="data.options.defaultValue">
                <draggable tag="ul" :list="data.options.options"
                           v-bind="{group:{ name:'options'},animation:200,ghostClass: 'ghost',handle: '.drag-item'}"
                >
                  <li v-for="(item, index) in data.options.options" :key="index" class="drag-li">
                    <b-radio :label="item.value" style="margin-right: 0;" :key="index">
                      <b-input style="width:120px;" size="small" v-model="item.value" placeholder="value"
                               title="value" clearable></b-input>
                      <b-input style="width:120px;" size="small" v-model="item.label" placeholder="label"
                               title="label" clearable></b-input>
                    </b-radio>
                    <i class="drag-item iconfont icon-ios-menu" style="font-size: 20px;margin: 0 5px;cursor: move;"></i>
                    <b-button @click="handleOptionsRemove(index)" type="text" text-color="danger"
                              style="margin-left: 5px;">
                      <b-icon name="ios-remove-circle-outline" :size="20"></b-icon>
                    </b-button>
                  </li>
                </draggable>
              </b-radio-group>
            </template>
            <template v-if="data.type==='checkbox' || (data.type==='select' && data.options.multiple)">
              <b-checkbox-group :value="splitValue(data.options.defaultValue)"
                                @on-change="(list)=>{data.options.defaultValue=joinValue(list)}">
                <draggable tag="ul" :list="data.options.options"
                           v-bind="{group:{ name:'options'},animation:200,ghostClass: 'ghost',handle: '.drag-item'}"
                >
                  <li v-for="(item, index) in data.options.options" :key="index" class="drag-li">
                    <b-checkbox :label="item.value" style="margin-right: 0;width: auto;" :key="index">
                      <b-input style="width:120px;" size="small" v-model="item.value" placeholder="value"
                               title="value" clearable></b-input>
                      <b-input style="width:120px;" size="small" v-model="item.label" placeholder="label"
                               title="label" clearable></b-input>
                    </b-checkbox>
                    <i class="drag-item iconfont icon-ios-menu" style="font-size: 20px;margin: 0 5px;cursor: move;"></i>
                    <b-button @click="handleOptionsRemove(index)" type="text" text-color="danger"
                              style="margin-left: 5px;">
                      <b-icon name="ios-remove-circle-outline" :size="20"></b-icon>
                    </b-button>
                  </li>
                </draggable>
              </b-checkbox-group>
            </template>
            <div style="margin: 4px 0 0 28px;">
              <b-button type="text" @click="handleAddOption">添加项</b-button>
              <b-button type="text" @click="data.options.defaultValue=''">重置选择</b-button>
            </div>
          </b-form-item>
        </div>
        <!--栅格布局专属-->
        <template v-if="data.type==='grid'">
          <div class="form-config-item">
            <b-form-item label="栅格间隔" v-if="hasProperty('gutter')">
              <b-input-number v-model="data.options.gutter" :min="4" :step="2" :max="24" size="small"></b-input-number>
              <b-button-group style="margin-left: 16px;">
                <b-button :type="data.options.gutter===8?'primary':'default'" size="small"
                          @click="data.options.gutter=8">8
                </b-button>
                <b-button :type="data.options.gutter===16?'primary':'default'" size="small"
                          @click="data.options.gutter=16">16
                </b-button>
                <b-button :type="data.options.gutter===24?'primary':'default'" size="small"
                          @click="data.options.gutter=24">24
                </b-button>
              </b-button-group>
            </b-form-item>
            <b-divider style="margin: 16px 0;"/>
            <b-form-item label="列配置项">
              <b-button-group style="margin-bottom: 4px;">
                <b-button :type="data.columns.length===2?'primary':'default'" size="small" @click="changeCol(2)">2列
                </b-button>
                <b-button :type="data.columns.length===3?'primary':'default'" size="small" @click="changeCol(3)">3列
                </b-button>
                <b-button :type="data.columns.length===4?'primary':'default'" size="small" @click="changeCol(4)">4列
                </b-button>
              </b-button-group>
              <draggable tag="ul" :list="data.columns"
                         v-bind="{group:{ name:'options'}, ghostClass: 'ghost',animation: 200,handle: '.drag-item'}"
              >
                <li v-for="(item, index) in data.columns" :key="index" class="drag-li">
                  <i class="drag-item iconfont icon-ios-menu" style="font-size: 20px;margin: 0 5px;cursor: move;"></i>
                  <b-input-number size="small" v-model="item.span"></b-input-number>
                  <b-button @click="handleOptionsRemove(index)" type="text" text-color="danger"
                            style="margin-left: 5px;">
                    <b-icon name="ios-remove-circle-outline" :size="20"></b-icon>
                  </b-button>
                </li>
              </draggable>
              <div style="margin: 4px 0 0 28px;">
                <b-button type="text" @click="handleAddColumn">添加列</b-button>
              </div>
            </b-form-item>
            <b-divider style="margin: 16px 0;"/>
          </div>
          <cfg-field label="对齐方式">
            <cfg-inline label="水平排列方式" v-if="hasProperty('justify')">
              <b-select v-model="data.options.justify" size="small">
                <b-option v-for="item in justifyOptions" :key="item.value"
                          :value="item.value">
                  {{ item.label }}
                </b-option>
              </b-select>
            </cfg-inline>
            <cfg-inline label="竖直排列方式" v-if="hasProperty('align')">
              <b-select v-model="data.options.align" size="small">
                <b-option v-for="item in alignOptions" :key="item.value"
                          :value="item.value">
                  {{ item.label }}
                </b-option>
              </b-select>
            </cfg-inline>
          </cfg-field>
        </template>
        <!--分割线专属-->
        <template v-if="data.type==='divider'">
          <div class="form-config-item">
            <b-form-item label="标题" prop="name">
              <b-input v-model="data.name" size="small" clearable/>
            </b-form-item>
            <b-form-item label="标题位置" v-if="hasProperty('align')">
              <b-radio-group v-model="data.options.align" size="small" type="button">
                <b-radio label="left">左侧</b-radio>
                <b-radio label="center">居中</b-radio>
                <b-radio label="right">右侧</b-radio>
              </b-radio-group>
            </b-form-item>
            <b-form-item label="线间距" v-if="hasProperty('margin')">
              <b-input v-model="data.options.margin" size="small"/>
            </b-form-item>
            <b-form-item label="是否虚线" v-if="hasProperty('dashed')">
              <b-switch v-model="data.options.dashed"/>
            </b-form-item>
          </div>
        </template>
        <!--非布局控件-->
        <template v-if="data.type!=='grid'&&data.type!=='divider'">
          <div class="form-config-item">
            <b-divider style="margin: 16px 0;"/>
            <b-form-item label="操作属性">
              <b-checkbox v-if="hasProperty('readonly')" v-model="data.options.readonly">完全只读</b-checkbox>
              <b-checkbox v-if="hasProperty('disabled')" v-model="data.options.disabled">禁用</b-checkbox>
              <b-checkbox v-if="hasProperty('showWordCount')" v-model="data.options.showWordCount">字数统计</b-checkbox>
              <b-checkbox v-if="hasProperty('alpha')" v-model="data.options.alpha">透明度</b-checkbox>
              <b-checkbox v-if="hasProperty('recommend')" v-model="data.options.recommend">颜色预设</b-checkbox>
              <b-checkbox v-if="hasProperty('allowHalf')" v-model="data.options.allowHalf">允许半选</b-checkbox>
              <b-checkbox v-if="hasProperty('showScore')" v-model="data.options.showScore">显示分数</b-checkbox>
              <b-checkbox v-if="hasProperty('showInput')" v-model="data.options.showInput">允许输入</b-checkbox>
              <template v-if="data.type === 'time'||data.type === 'date'">
                <b-checkbox v-if="hasProperty('isRange')" v-model="data.options.isRange">是否范围选择</b-checkbox>
              </template>
              <b-checkbox v-if="hasProperty('multiple')" v-model="data.options.multiple"
                          @on-change="handleSelectMultiple">
                是否可多选
              </b-checkbox>
              <b-checkbox v-if="hasProperty('filterable')" v-model="data.options.filterable">是否可搜索</b-checkbox>
              <b-checkbox v-if="hasProperty('editable')" v-model="data.options.editable">文本框可输入</b-checkbox>
              <b-checkbox v-if="hasProperty('clearable')" v-model="data.options.clearable">显示清除按钮</b-checkbox>
            </b-form-item>
            <b-divider style="margin: 16px 0;"/>
            <rules-setting :data="data"/>
          </div>
        </template>
      </cfg-group>
    </b-form>
    <div>
      <b-divider align="left">data</b-divider>
      <b-ace-editor :value="JSON.stringify(data,null,2)" readonly/>
    </div>
  </div>
  <div v-else style="position:relative;">
    <b-empty class="form-empty">请添加字段</b-empty>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import CfgGroup from './components/CfgGroup'
import CfgField from '@/components/FormMaking/components/CfgField'
import { deepCopy } from '@/common/utils/assist'
import CfgInline from '@/components/FormMaking/components/CfgInline'
import RulesSetting from '@/components/FormMaking/components/RulesSetting'
import { joinValue, splitValue } from '@/components/FormMaking/config/utils'

export default {
  name: 'WidgetConfig',
  components: { RulesSetting, CfgInline, CfgField, CfgGroup, Draggable },
  props: ['data'],
  inject: ['ConfigRoot'],
  data() {
    return {
      justifyOptions: [
        { value: 'start', label: '左对齐' },
        { value: 'end', label: '右对齐' },
        { value: 'center', label: '居中' },
        { value: 'space-between', label: '两端对齐' },
        { value: 'space-around', label: '两侧间隔相等' }
      ],
      alignOptions: [
        { value: 'top', label: '顶部对齐' },
        { value: 'bottom', label: '底部对齐' },
        { value: 'middle', label: '居中对齐' }
      ],
      fieldNames: []
    }
  },
  computed: {
    show() {
      return !!(this.data && Object.keys(this.data).length > 0)
    },
    dataOptions() {
      return Object.keys(this.data.options)
    },
    hasOptions() {
      return ['radio', 'checkbox', 'select'].indexOf(this.data.type) >= 0
    }
  },
  methods: {
    // 添加项
    handleAddOption() {
      let index = this.data.options.options.length + 1
      this.data.options.options.push({
        value: 'Option ' + index,
        label: 'Option ' + index
      })
    },
    // 列添加项
    handleAddColumn() {
      this.data.columns.push({
        span: null,
        list: []
      })
    },
    // 列操作
    changeCol(num) {
      // 缓存现有list
      let oldList = deepCopy(this.data.columns)
      this.data.columns = []
      for (let i = 0; i < num; i++) {
        this.data.columns.push({
          span: 24 / num,
          list: oldList[i] ? oldList[i].list : []
        })
      }
    },
    // 项移除
    handleOptionsRemove(index) {
      if (this.data.type === 'grid') {
        this.data.columns.splice(index, 1)
      } else {
        this.data.options.options.splice(index, 1)
      }
    },
    // 多选模式
    handleSelectMultiple(value) {
      this.data.options.defaultValue = ''
    },
    // 是否存在options属性
    hasProperty(property) {
      return this.dataOptions.indexOf(property) >= 0
    },
    // 判断是否有重复
    checkModel() {
      if (this.data.model.length === 0) {
        this.$message({ type: 'danger', content: '字段名称必填' })
        return
      }
      let repeatModels = this.ConfigRoot.repeatModels
      if (repeatModels.indexOf(this.data.model) >= 0) {
        this.$message({ type: 'danger', content: `当前字段名称 { ${this.data.model} } 重复` })
      }
    },
    splitValue(value) {
      return splitValue(value)
    },
    joinValue(arr) {
      return joinValue(arr)
    }
  }
}
</script>

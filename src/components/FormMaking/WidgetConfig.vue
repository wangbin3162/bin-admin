<template>
  <div v-if="show" class="widget-config-container">
    <b-form :model="data" class="form-small" label-position="top" :rules="fieldRule">
      <cfg-group group-name="字段属性" v-if="data.type!=='grid'&&data.type!=='divider'">
        <div style="padding: 5px 10px 0;">
          <b-form-item label="字段标识" prop="fieldName">
            <b-input v-model="data.fieldName" size="small"/>
          </b-form-item>
          <b-form-item label="标题" prop="name">
            <b-input v-model="data.name" size="small"/>
          </b-form-item>
        </div>
      </cfg-group>
      <cfg-group group-name="控件属性">
        <cfg-field label="宽度" v-if="hasProperty('width')">
          <b-input v-model="data.options.width" size="small" placeholder="支持百分比(%)和像素(px)"/>
        </cfg-field>
        <cfg-field label="占位内容" v-if="hasProperty('placeholder')">
          <b-input v-model="data.options.placeholder" size="small"/>
        </cfg-field>
        <cfg-field label="默认值" v-if="hasProperty('defaultValue')">
          <b-input v-if="data.type==='input'" v-model="data.options.defaultValue" size="small"/>
        </cfg-field>
        <!--栅格布局专属-->
        <template v-if="data.type==='grid'">
          <div style="padding: 5px 10px 0;">
            <b-form-item label="栅格间隔" v-if="hasProperty('gutter')">
              <b-input-number v-model="data.options.gutter" :min="4" :step="2" :max="24" size="small"></b-input-number>
            </b-form-item>
            <b-divider/>
            <b-form-item label="列配置项">
              <b-button-group>
                <b-button size="small" @click="changeCol(2)">2列</b-button>
                <b-button size="small" @click="changeCol(3)">3列</b-button>
                <b-button size="small" @click="changeCol(4)">4列</b-button>
              </b-button-group>
              <draggable tag="ul" :list="data.columns"
                         v-bind="{group:{ name:'options'}, ghostClass: 'ghost',animation: 200,handle: '.drag-item'}"
              >
                <li v-for="(item, index) in data.columns" :key="index">
                  <i class="drag-item iconfont icon-ios-menu" style="font-size: 18px;margin: 0 5px;cursor: move;"></i>
                  <b-input-number size="small" v-model="item.span"></b-input-number>
                  <b-button @click="handleOptionsRemove(index)" type="text" text-color="danger"
                            style="margin-left: 5px;">
                    <b-icon name="ios-remove-circle-outline" :size="20"></b-icon>
                  </b-button>
                </li>
              </draggable>
              <div style="margin-left: 22px;">
                <b-button type="text" @click="handleAddColumn">添加列</b-button>
              </div>
            </b-form-item>
            <b-divider/>
            <b-form-item label="水平排列方式" v-if="hasProperty('justify')">
              <b-select v-model="data.options.justify" size="small" style="width: 190px;">
                <b-option v-for="item in justifyOptions" :key="item.value"
                          :value="item.value">
                  {{ item.label }}
                </b-option>
              </b-select>
            </b-form-item>
            <b-form-item label="竖直排列方式" v-if="hasProperty('align')">
              <b-select v-model="data.options.align" size="small" style="width: 190px;">
                <b-option v-for="item in alignOptions" :key="item.value"
                          :value="item.value">
                  {{ item.label }}
                </b-option>
              </b-select>
            </b-form-item>
          </div>
        </template>
        <!--分割线专属-->
        <template v-if="data.type==='divider'">
          <div style="padding: 5px 10px 0;">
            <b-form-item label="标题" prop="name">
              <b-input v-model="data.name" size="small"/>
            </b-form-item>
            <b-form-item label="标题位置" v-if="hasProperty('align')">
              <btn-radio v-model="data.options.justify"
                         :options="[
                            {value: 'left',label: '左侧'},
                            {value: 'center',label: '居中'},
                            {value: 'right',label: '右侧'}
                          ]"
                         size="small"></btn-radio>
            </b-form-item>
            <b-form-item label="文字大小" v-if="hasProperty('fontSize')">
              <b-input v-model="data.options.fontSize" size="small"/>
            </b-form-item>
            <b-form-item label="线间距" v-if="hasProperty('margin')">
              <b-input v-model="data.options.margin" size="small"/>
            </b-form-item>
          </div>
        </template>
      </cfg-group>
    </b-form>
  </div>
  <div v-else style="position:relative;">
    <b-empty class="form-empty">请添加字段</b-empty>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import CfgGroup from './components/CfgGroup'
import CfgField from '@/components/FormMaking/components/CfgField'
import BtnRadio from '@/components/FormMaking/components/BtnRadio'
import { deepCopy } from '@/common/utils/assist'

export default {
  name: 'WidgetConfig',
  components: { BtnRadio, CfgField, CfgGroup, Draggable },
  props: ['data'],
  data() {
    return {
      fieldRule: {
        fieldName: [{ required: true, message: '字段名必填', trigger: 'blur' }],
        name: [{ required: true, message: '标题必填', trigger: 'blur' }]
      },
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
      ]
    }
  },
  computed: {
    show() {
      return !!(this.data && Object.keys(this.data).length > 0)
    },
    dataOptions() {
      return Object.keys(this.data.options)
    }
  },
  methods: {
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
    // 是否存在options属性
    hasProperty(property) {
      return this.dataOptions.indexOf(property) >= 0
    }
  }
}
</script>

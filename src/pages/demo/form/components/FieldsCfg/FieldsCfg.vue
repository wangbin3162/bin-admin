<template>
  <div class="config-panel" :style="{maxHeight:(maxHeight+2)+'px'}">
    <div class="left-fields">
      <v-title-bar label="信息项" tip-pos="left">
        <b-tooltip content="可拖动信息项进行布局">
          <b-icon name="ios-help-circle" class="pl-10 pr-10"/>
        </b-tooltip>
      </v-title-bar>
      <!--信息项组件-->
      <v-drag-items v-model="totalData" no-data-text="暂无信息项" ref="dragItems"
                    @on-drag-drop="handleDrag" @on-select="handleSelect"/>
    </div>
    <div class="right-panel">
      <v-title-bar label="配置项" tip-pos="left"/>
      <div class="config-item" v-if="currentIndex!==-1">
        <b-form v-model="totalData[currentIndex]" label-position="top">
          <!--标题，字段名，数据类型-->
          <b-row :gutter="15">
            <b-col span="8">
              <b-form-item label="标题" class="bin-form-item-required">
                <b-input v-model.trim="totalData[currentIndex].fieldTitle" @on-change="emitValue"/>
              </b-form-item>
            </b-col>
            <b-col span="8">
              <b-form-item label="字段名" class="bin-form-item-required">
                <b-input :value="totalData[currentIndex].fieldName" disabled/>
              </b-form-item>
            </b-col>
            <b-col span="8">
              <b-form-item label="数据类型" class="bin-form-item-required">
                <b-input :value="enumMap.dataType[totalData[currentIndex].dataType]" disabled/>
              </b-form-item>
            </b-col>
          </b-row>
          <div class="config-line"/>
          <!--信息项类型，控件类型，公开类型-->
          <b-row :gutter="15">
            <b-col span="8">
              <b-form-item label="信息项类型" class="bin-form-item-required">
                <b-select v-model="totalData[currentIndex].required" @on-change="emitValue">
                  <b-option v-for="(value,key) in enumMap.required" :key="key" :value="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
            <b-col span="8">
              <b-form-item label="控件类型" class="bin-form-item-required">
                <b-select v-model="totalData[currentIndex].controlType" @on-change="emitValue">
                  <b-option v-for="(value,key) in enumMap.controlType" :key="key" :value="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
            <b-col span="8">
              <b-form-item label="公开类型" class="bin-form-item-required">
                <b-select v-model="totalData[currentIndex].openType" @on-change="emitValue">
                  <b-option v-for="(value,key) in enumMap.openType" :key="key" :value="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
          </b-row>
          <div class="config-line"/>
          <!--有效值-->
          <b-form-item label="有效值">
            <valid-value v-model="totalData[currentIndex].validValue" @on-change="emitValue"/>
          </b-form-item>
          <!--校验-->
          <b-form-item label="校验">
            校验字段
          </b-form-item>
          <div class="config-line"/>
          <b-form-item label="启用状态">
            <div style="padding-top: 3px;">
              <b-switch v-model="totalData[currentIndex].status"
                        true-value="use" false-value="ignore"
                        @on-change="emitValue"/>&nbsp;&nbsp;
              <b-tag :type="totalData[currentIndex].status==='use'?'primary':'danger'" no-border font-size="14px">
                {{ enumMap.status[totalData[currentIndex].status] }}
              </b-tag>
            </div>
          </b-form-item>
          <div class="config-line"/>
          <!--分词，加密，掩码-->
          <b-row :gutter="15">
            <b-col span="8">
              <b-form-item label="是否分词">
                <b-select v-model="totalData[currentIndex].tokenizer" clearable @on-change="emitValue"
                          :disabled="tokenizerDisabled">
                  <b-option v-for="(value,key) in enumMap.tokenizer" :key="key" :value="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
            <b-col span="8">
              <b-form-item label="是否加密">
                <b-select v-model="totalData[currentIndex].isEncrypt" clearable @on-change="emitValue">
                  <b-option v-for="(value,key) in enumMap.isEncrypt" :key="key" :value="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
            <b-col span="8">
              <b-form-item label="掩码方式">
                <b-select v-model="totalData[currentIndex].maskModel" clearable @on-change="emitValue">
                  <b-option v-for="(value,key) in enumMap.maskModel" :key="key" :value="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
          </b-row>
          <div class="config-line"/>
          <!--描述-->
          <b-form-item label="信息项描述">
            <b-input v-model.trim="totalData[currentIndex].fieldDesc"
                     @on-change="emitValue" placeholder="输入信息项描述" type="textarea"/>
          </b-form-item>
        </b-form>
      </div>
      <b-empty v-else>没有选择信息项</b-empty>
    </div>
  </div>
</template>

<script>
  import enumObj from './enum'
  import { deepCopy } from '../../../../../common/utils/assist'
  import VDragItems from '../../../../../components/VDragItems/index'
  import ValidValue from './ValidValue'

  export default {
    name: 'FieldsCfg',
    components: { ValidValue, VDragItems },
    data() {
      return {
        enumMap: enumObj,
        fieldsColumns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', key: 'fieldName' },
          { title: '标题', key: 'fieldTitle' }
        ],
        totalData: [],
        currentIndex: -1,
        editItem: null
      }
    },
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      },
      maxHeight: {
        type: Number
      }
    },
    watch: {
      value: {
        handler(val) {
          this.totalData = this.formatItems(val)
        },
        immediate: true
      }
    },
    created() {
      this.resetEditItem()
    },
    computed: {
      tokenizerDisabled() {
        if (this.currentIndex !== -1) {
          let item = this.totalData[this.currentIndex]
          return item.dataType !== 'string' || item.validValue.length > 0
        }
        return false
      }
    },
    methods: {
      // resetForm
      resetEditItem() {
        this.editItem = {
          fieldName: '', // 元信息名称（英文）
          fieldTitle: '', // 元信息标题
          dataType: '', // 数据类型
          openType: '', // 信息项公开类型,默认社会公开
          controlType: '', // 控件类型,默认文本框
          fieldDesc: '', // 提示信息
          validValue: '', // 有效值
          maskModel: '', // 掩码方式
          isEncrypt: '', // 是否加密
          required: 'Y', // 信息项类型，默认核心项
          status: '', // 启用状态，默认启用
          tokenizer: '', // 是否分词
          checkRules: ''// 校验配置,校验配置默认配置一个必填项
        }
      },
      // 针对传入的数组对是否分词进行初始化
      formatItems(items) {
        return items.map(i => {
          let item = { ...i }
          // 如果已经有值
          if (item.tokenizer) {
            // 如果设置了有效值则必须为Y
            if (item.validValue.length > 0) {
              item.tokenizer = 'Y'
            }
          } else {
            // 如果类型为字符型
            if (item.dataType === 'string') {
              // 如果有效值存在
              item.tokenizer = item.validValue.length > 0 ? 'Y' : 'N'
            } else {
              item.validValue = '' // 如果类型不是字符型，则有效值必须为空
              item.tokenizer = '' // 是否分词也必须为空
            }
          }
          return item
        })
      },
      // 选中项
      handleSelect(index) {
        this.currentIndex = index
      },
      // 拖拽重绘
      handleDrag(index1, index2) {
        // 复制一个data
        let arr = deepCopy(this.totalData)
        let temp1 = deepCopy(arr[index1])
        arr[index1] = deepCopy(arr[index2])
        arr[index2] = temp1
        this.totalData = arr
        this.resetHandle('重排成功')
      },
      // 重置操作和更新model
      resetHandle(message) {
        // 清空当前修改行
        this.currentIndex = -1
        this.$refs.dragItems.clearSelect()
        // 1.emit-input
        this.emitValue()
        // 3.打印操作
        this.$message({ type: 'success', content: message })
      },
      // 更新model value
      emitValue() {
        this.$emit('input', this.totalData)
        this.$emit('on-change', this.totalData)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .config-panel {
    display: flex;
    justify-content: space-between;
    border: 1px solid #d9d9d9;
    .left-fields {
      width: 50%;
    }
    .right-panel {
      width: 50%;
      border-left: 1px solid #d9d9d9;
      .config-item {
        padding: 10px 15px;
        .config-line {
          border-top: 1px solid #eee;
          margin-top: -7px;
        }
      }
    }
  }
</style>

<template>
  <div class="config-panel" :style="{maxHeight:(maxHeight+2)+'px'}">
    <div class="left-fields">
      <v-title-bar label="信息项" tip-pos="left">
        <b-tooltip max-width="200" content="点击选中信息项进行配置，也可以拖动元素排序">
          <b-icon name="ios-help-circle" class="pl-10 pr-10"/>
        </b-tooltip>
      </v-title-bar>
      <!--信息项组件-->
      <v-drag-items v-model="totalData" no-data-text="暂无信息项" ref="dragItems"
                    @on-drop="handleDrag" @on-select="handleSelect"/>
    </div>
    <div class="right-panel">
      <v-title-bar label="配置项" tip-pos="left"/>
      <div class="config-item" v-if="currentIndex>-1" ref="rightPanel">
        <b-form v-model="totalData[currentIndex]" label-position="top" ref="cfgForm">
          <!--标题，公开类型，数据类型-->
          <b-row :gutter="15">
            <b-col span="8">
              <b-form-item label="标题" class="bin-form-item-required"
                           :class="{'bin-form-item-error':totalData[currentIndex].fieldTitle.length===0}">
                <b-input v-model.trim="totalData[currentIndex].fieldTitle" @on-change="emitValue"/>
                <span class="bin-form-item-error-tip"
                      v-if="totalData[currentIndex].fieldTitle.length===0">标题不能为空</span>
              </b-form-item>
            </b-col>
            <b-col span="8">
              <b-form-item label="公开类型" class="bin-form-item-required">
                <b-select v-model="totalData[currentIndex].openType" @on-change="emitValue">
                  <b-option v-for="(value,key) in enumMap.openType" :key="key" :value="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
            <b-col span="8">
              <b-form-item label="数据类型" class="bin-form-item-required">
                <b-input :value="enumMap.dataType[totalData[currentIndex].dataType]" disabled/>
              </b-form-item>
            </b-col>
          </b-row>
          <b-divider/>
          <!--控件类型，有效值-->
          <valid-value v-model="totalData[currentIndex].validValue"
                       :show-valid-value="showValidValue" @on-change="emitValue"
          >
            <b-form-item label="控件类型" class="bin-form-item-required">
              <b-select v-model="totalData[currentIndex].controlType" @on-change="controlTypeChange">
                <b-option v-for="(value,key) in controlTypeFilter" :key="key" :value="key">{{ value }}</b-option>
              </b-select>
            </b-form-item>
          </valid-value>
          <b-divider/>
          <!--校验-->
          <validator v-model="totalData[currentIndex].checkRules"
                     :field-name="totalData[currentIndex].fieldName"
                     :field-title="totalData[currentIndex].fieldTitle"
                     :control-type="totalData[currentIndex].controlType"
                     :data-type="totalData[currentIndex].dataType"
                     :required="totalData[currentIndex].required"
                     :data-length="totalData[currentIndex].dataLength"
                     :original-rules="originalRules"
                     @on-change="emitValue"
          >
            <b-form-item label="信息项类型" class="bin-form-item-required">
              <b-radio-group v-model="totalData[currentIndex].required" @on-change="emitValue">
                <b-radio v-for="(value,key) in enumMap.required" :key="key" :label="key">{{ value }}</b-radio>
              </b-radio-group>
              <!--              <b-select v-model="totalData[currentIndex].required" @on-change="emitValue">-->
              <!--                <b-option v-for="(value,key) in enumMap.required" :key="key" :value="key">{{ value }}</b-option>-->
              <!--              </b-select>-->
            </b-form-item>
          </validator>
          <b-divider/>
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
          <!--分词，加密，掩码-->
          <b-row :gutter="15">
            <b-col span="6">
              <b-form-item label="是否分词">
                <b-select v-model="totalData[currentIndex].tokenizer" clearable @on-change="emitValue"
                          :disabled="tokenizerDisabled">
                  <b-option v-for="(value,key) in enumMap.tokenizer" :key="key" :value="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
            <b-col span="6">
              <b-form-item label="字段长度" v-if="totalData[currentIndex].dataLength">
                <b-input :value="totalData[currentIndex].dataLength" readonly/>
              </b-form-item>
            </b-col>
            <b-col span="6">
              <b-form-item label="是否加密">
                <b-select v-model="totalData[currentIndex].isEncrypt" placeholder="" @on-change="emitValue" clearable>
                  <b-option v-for="(value,key) in enumMap.isEncrypt" :key="key" :value="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
            <b-col span="6">
              <b-form-item label="掩码方式">
                <b-select v-model="totalData[currentIndex].maskModel" clearable @on-change="emitValue">
                  <b-option v-for="(value,key) in enumMap.maskModel" :key="key" :value="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
          </b-row>
          <!--描述-->
          <b-form-item label="信息项描述">
            <b-input v-model.trim="totalData[currentIndex].fieldDesc" :rows="1"
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
  import { isNotEmpty } from '../../../common/utils/assist'
  import VDragItems from '../VDragItems/index'
  import ValidValue from './ValidValue'
  import Validator from './Validator'

  export default {
    name: 'FieldsCfg',
    components: { Validator, ValidValue, VDragItems },
    data() {
      return {
        enumMap: enumObj,
        fieldsColumns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', key: 'fieldName' },
          { title: '标题', key: 'fieldTitle' }
        ],
        totalData: [],
        personIds: [],
        currentIndex: -1,
        originalRules: null
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
          if (val.length === 0) {
            this.currentIndex = -1
            this.totalData = []
            this.$refs.dragItems && this.$refs.dragItems.clearSelect()
            return
          }
          // 存储原始值
          if (!this.originalRules) {
            let obj = {}
            val.forEach(item => {
              obj[item.fieldName] = item.checkRules
            })
            this.originalRules = obj
          }
          this.personIds = val.filter(item => item.fieldName.indexOf('person_id') > -1)
          this.totalData = this.formatItems(val).filter(item => item.fieldName.indexOf('person_id') === -1)
          if (this.totalData.length > 0 && this.currentIndex === -1) {
            this.currentIndex = 0
          }
        },
        immediate: true
      }
    },
    computed: {
      // 是否分词禁用条件
      tokenizerDisabled() {
        if (this.currentIndex !== -1) {
          let item = this.totalData[this.currentIndex]
          return item.dataType !== 'string' || isNotEmpty(item.validValue)
        }
        return false
      },
      // 是否显示有效值配置
      showValidValue() {
        if (this.currentIndex !== -1) {
          let current = this.totalData[this.currentIndex]
          return current.dataType === 'string' && ['SELECT', 'MULTIPLE_SELECT'].indexOf(current.controlType) > -1
        }
        return false
      },
      // 根据数据类型选定控件类型
      controlTypeFilter() {
        if (this.currentIndex === -1) {
          return []
        }
        const controlType = this.enumMap.controlType
        const dataType = this.totalData[this.currentIndex].dataType
        switch (dataType) {
          case 'number':
            return {
              'NUMBER_TEXT': '数值文本框'
            }
          case 'date':
            return {
              'TEXT': '文本框',
              'DATE': '日期'
            }
          case 'datetime':
            return {
              'TEXT': '文本框',
              'DATE_TIME': '日期时间'
            }
          case 'text':
            return {
              'TEXT': '文本框',
              'TEXTAREA': '文本域'
            }
          case 'string':
            return {
              'TEXT': '文本框',
              'SELECT': '下拉框',
              'MULTIPLE_SELECT': '多选下拉框',
              'DATE': '日期',
              'DATE_TIME': '日期时间',
              'TEXTAREA': '文本域',
              'NAT_PERSON': '选择自然人',
              'LEG_PERSON': '选择法人',
              'NAT_OR_LEG_PERSON': '选择自然人或法人',
              'FILE_UPLOAD': '文件上传',
              'REGION_SELECT': '选择行政区域',
              'HYDM_SELECT': '选择行业代码'
            }
          default:
            return controlType
        }
      }
    },
    methods: {
      // 针对传入的数组对是否分词进行初始化
      formatItems(items) {
        return items.map(i => {
          let item = { ...i }
          // 如果已经有值
          if (item.tokenizer) {
            // 如果设置了有效值则必须为Y
            if (item.validValue && item.validValue.length > 0) {
              item.tokenizer = 'N'
            }
          } else {
            // 如果类型为字符型
            if (item.dataType === 'string') {
              // 如果有效值存在
              item.tokenizer = (item.validValue && item.validValue.length > 0) ? 'N' : ''
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
        this.$refs.rightPanel.scrollTop = 0 // 触发伪滚动更新
      },
      // 拖拽重绘
      handleDrag() {
        this.resetHandle('重排成功')
      },
      // 控件类型改变事件
      controlTypeChange(type) {
        // 1.根据选择的控件类型，如不是多选和下拉多选，则都需要清空有效值
        if (['SELECT', 'MULTIPLE_SELECT'].indexOf(type) === -1) {
          this.totalData[this.currentIndex].validValue = ''
        } else {
          this.totalData[this.currentIndex].tokenizer = 'N'
        }
        // 2.根据选择的控件类型，批量设置校验格式触发条件
        const trigger = (type === 'TEXT' || type === 'TEXTAREA') ? 'blur' : 'change'
        try {
          let checkRules = JSON.parse(this.totalData[this.currentIndex].checkRules)
          Object.keys(checkRules).forEach(key => {
            checkRules[key]['trigger'] = trigger
          })
          this.totalData[this.currentIndex].checkRules = JSON.stringify(checkRules)
        } catch (e) {
          console.warn('校验字符串格式化失败')
        }
        this.emitValue()
      },
      // 重置操作和更新model
      resetHandle(message) {
        // 清空当前修改行
        this.currentIndex = -1
        // 1.emit-input
        this.emitValue()
        // 3.打印操作
        this.$message({ type: 'success', content: message })
      },
      // 更新model value
      emitValue() {
        this.$emit('input', this.totalData.concat(this.personIds))
        this.$emit('on-change', this.totalData.concat(this.personIds))
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .config-panel {
    display: flex;
    justify-content: space-between;
    border: 1px solid #d9d9d9;
    .left-fields {
      width: 45%;
      .item-wrap {
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
      }
    }
    .right-panel {
      width: 55%;
      border-left: 1px solid #d9d9d9;
      .config-item {
        padding: 10px 15px;
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
        .bin-form-item {
          margin-bottom: 0;
        }
        .bin-divider-horizontal {
          margin: 20px 0 10px;
        }
      }
    }
  }
</style>

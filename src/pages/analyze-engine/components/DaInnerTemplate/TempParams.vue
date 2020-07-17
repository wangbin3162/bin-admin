<template>
  <!--模板参数 for DaInnerTemplate.vue 模板参数项-->
  <div class="temp-params">
    <draggable
      class="list-group"
      :list="totalData"
      v-bind="{group:'params', ghostClass: 'ghost',animation: 200,handle:'.handle'}"
      @end="emitValue"
    >
      <div class="param-item" v-for="(row,index) in totalData" :key="index">
        <div class="handle" v-if="!row.expand">
          <b-icon name="ios-move" style="vertical-align: -1px;"/>
        </div>
        <div class="top">
          <div class="front">

            <span class="label">
            <b-tag type="primary" no-border style="margin: 0 5px 0 0;">参数名称</b-tag>
            <span>{{ row.paramName }}</span>
          </span>
            <span class="label">
            <b-tag type="primary" no-border style="margin: 0 5px 0 0;">参数编码</b-tag>
            <span>{{ row.paramCode }}</span>
          </span>
          </div>
          <div class="right">
            <b-button type="text" @click="row.expand=!row.expand">{{ row.expand?'收起':'展开' }}</b-button>
            <b-button type="text" text-color="danger" @click="handleRemove(index)">删除</b-button>
          </div>
        </div>
        <div class="form-warp" v-show="row.expand">
          <b-form label-position="top" ref="expandForm" :model="row" :rules="infoRules">
            <b-row :gutter="20">
              <b-col span="6">
                <b-form-item label="参数名称" style="margin-bottom: 17px;" prop="paramName">
                  <b-input type="text" v-model="totalData[index].paramName" size="small" @on-change="emitValue"
                           clearable/>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="参数编码" style="margin-bottom: 17px;" prop="paramCode">
                  <b-input type="text" v-model="totalData[index].paramCode" size="small" @on-change="emitValue"
                           clearable/>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="控件类型" style="margin-bottom: 17px;" prop="controlType">
                  <b-select v-model="totalData[index].controlType" size="small" @on-change="emitValue">
                    <b-option v-for="(val,key) in controlTypeMap" :key="key" :value="key">{{ val }}</b-option>
                  </b-select>
                </b-form-item>
              </b-col>
            </b-row>
            <b-row :gutter="20">
              <b-col span="6">
                <b-form-item label="数据类型" style="margin-bottom: 17px;" prop="paramType">
                  <b-radio-group v-model="totalData[index].paramType" style="line-height: 26px;" @on-change="emitValue">
                    <b-radio label="string"></b-radio>
                    <b-radio label="number"></b-radio>
                  </b-radio-group>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="参数类型" style="margin-bottom: 17px;" prop="analysisType">
                  <b-radio-group v-model="totalData[index].analysisType" style="line-height: 26px;"
                                 @on-change="emitValue">
                    <b-radio v-for="(val,key) in analysisTypeMap" :key="key" :label="key">{{ val }}</b-radio>
                  </b-radio-group>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="是否配置" style="margin-bottom: 17px;" prop="configFlag">
                  <b-radio-group v-model="totalData[index].configFlag" style="line-height: 26px;"
                                 @on-change="emitValue">
                    <b-radio v-for="(val,key) in configFlagMap" :key="key" :label="key">{{ val }}</b-radio>
                  </b-radio-group>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="是否必填" style="margin-bottom: 17px;" prop="isRequired">
                  <b-switch v-model="totalData[index].isRequired" true-value="Y" false-value="N" @on-change="emitValue">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                  </b-switch>
                </b-form-item>
              </b-col>
            </b-row>
            <b-row :gutter="20">
              <b-col span="6">
                <b-form-item label="默认值" style="margin-bottom: 17px;" prop="defaultVal">
                  <b-input type="text" v-model="totalData[index].defaultVal" size="small" @on-change="emitValue"
                           clearable/>
                </b-form-item>
              </b-col>
              <b-col span="6">
                <b-form-item label="参数描述" style="margin-bottom: 17px;" prop="paramDesc">
                  <b-input type="text" v-model="totalData[index].paramDesc" size="small" @on-change="emitValue"
                           clearable/>
                </b-form-item>
              </b-col>
            </b-row>
          </b-form>
        </div>
      </div>
    </draggable>
    <b-button type="primary" dashed icon="ios-add-circle-outline" style="width: 100%;" @click="handleAdd">
      添加参数
    </b-button>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import { deepCopy } from '../../../../common/utils/assist'
  import { getTplAnalysisType, getTplControlType } from '../../../../api/analyze-engine/da-business-temp.api'

  export default {
    name: 'TempParams',
    components: { Draggable },
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
        totalData: [],
        isRequiredMap: { N: '否', Y: '是' },
        configFlagMap: { Y: '需要', N: '不需要' },
        controlTypeMap: {},
        analysisTypeMap: {},
        infoRules: {
          paramName: [{ required: true, message: '参数名称必填', trigger: 'blur' }],
          paramCode: [{ required: true, message: '参数编码必填', trigger: 'blur' }],
          controlType: [{ required: true, message: '控件类型必填', trigger: 'change' }],
          analysisType: [{ required: true, message: '参数类型必填', trigger: 'change' }]
        }
      }
    },
    created() {
      // 获取参数类型和控件类型枚举
      getTplControlType().then(resp => {
        this.controlTypeMap = resp.data.data || {}
      })
      getTplAnalysisType().then(resp => {
        this.analysisTypeMap = resp.data.data || {}
      })
    },
    watch: {
      value: {
        handler(val) {
          this.totalData = deepCopy(val)
        },
        immediate: true
      }
    },
    methods: {
      handleAdd() {
        let newRow = {
          paramName: '', // 参数名称
          paramCode: '', // 参数编码
          paramType: 'string', // 参数类型
          controlType: 'TEXT',
          analysisType: 'ALL',
          isRequired: 'Y', // 是否必填
          configFlag: 'Y',
          defaultVal: '', // 默认值
          paramDesc: '', // 参数说明
          expand: true
        }
        this.totalData.push(newRow)
        this.emitValue()
      },
      handleRemove(index) {
        this.totalData.splice(index, 1) // 清除一个未保存的项
        this.emitValue()
      },
      // 更新model value
      emitValue() {
        this.$emit('input', this.totalData)
        this.$emit('on-change', this.totalData)
      },
      // 校验列表表单
      validateList() {
        const formsValid = [] // 用于验证展开项内的form
        return new Promise(resolve => {
          if (this.totalData.length) { // 配置项存在则验证配置项内的form
            this.$refs.expandForm.forEach(item => {
              item.validate((valid) => {
                formsValid.push(valid)
                if (!valid) {
                  resolve(false)
                }
              })
            })
            formsValid.forEach((item, index) => {
              if (!item) { // 验证不通过时展开可能收起的内容
                this.totalData[index].expand = true
              }
            })
          }
          resolve(true)
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .temp-params {
    .param-item {
      position relative;
      border: 1px solid #e0e0e0;
      background: #fafafa;
      margin-bottom: 8px;
      .handle {
        position absolute;
        top: 12px;
        left: 4px;
        cursor: move;
      }
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 40px;
        background: #fff;
        padding: 0 24px;
        .front {
          width: 80%;
          line-height: 40px;
        }
        .label {
          display: inline-block;
          width: 40%;
          margin-right: 8px;
          height: 22px;
          line-height: 1.5715;
          span {
            vertical-align: middle;
          }
        }
      }
      .form-warp {
        border-top: 1px solid #e0e0e0;
        padding: 16px 30px;
      }
      &.ghost {
        font-size: 0;
        opacity: .5;
        border: 1px solid #1089ff;
      }
    }
  }
</style>

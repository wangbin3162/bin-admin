<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <b-form :model="form" ref="form" :rules="rules" :label-width="100">
          <b-row>
            <b-col span="12">
              <b-form-item label="变量名称" prop="varName">
                <b-input v-model="form.varName" placeholder="请输入变量名称" clearable></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="变量编码" prop="varCode">
                <b-input v-model="form.varCode" placeholder="请输入变量编码" clearable></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="变量类型" prop="varType">
                <b-select v-model="form.varType">
                  <b-option :value="varTypeEnum.Complex">复合变量</b-option>
                  <b-option :value="varTypeEnum.Common">一般变量</b-option>
                </b-select>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="数据类型" prop="dataType">
                <b-select v-model="form.dataType">
                  <b-option :value="dataTypeEnum.N">数值类型</b-option>
                  <b-option :value="dataTypeEnum.S">字符串类型</b-option>
                </b-select>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row v-if="form.varType === varTypeEnum.Common" :key="form.varType">
            <b-col span="12">
              <b-form-item label="业务模板" prop="tplContent"
                :rules=" { required: true, message: '请选择业务模板', trigger: 'change' }">
                <div flex style="width:100%;">
                  <b-input class="choose-btn" :value="form.tplContent" placeholder="请选择业务模板"
                    disabled readonly></b-input>
                  <b-button slot="suffix" type="primary" plain
                    @click="openBelongTypeHandler" style="flex: 0 0 auto;">
                    选择
                  </b-button>
                </div>
              </b-form-item>
            </b-col>
            <b-col span="12"></b-col>
          </b-row>
          <b-row v-else>
            <b-col span="22">
              <b-form-item label="表达式" prop="tplContent"
                :rules=" { required: true, message: '请输入el表达式', trigger: 'blur' }">
                <b-input v-model="form.tplContent" type="textarea" placeholder="请输入el表达式"></b-input>
              </b-form-item>
            </b-col>
            <b-col span="2" style="text-align: center">
              <b-button type="primary" plain
                @click="openSelectVarHandler">
                选择
              </b-button>
            </b-col>
          </b-row>
          <b-form-item label="描述" prop="varDesc">
            <b-input v-model="form.varDesc" placeholder="请输入描述" type="textarea"></b-input>
          </b-form-item>
        </b-form>
        <template slot="footer">
          <b-button @click="handleCancel">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>

      <!-- 一般变量时，选择模板带过来的参数不可改动与删除 -->
      <!-- 复合变量时，新增的参数不可再选择变量带过来的参数中 -->
      <edit-param-manage ref="paramManage" :paramTypeEnum="paramTypeEnum"
        :params="params" @params-change="params => form.params = params"></edit-param-manage>
    </page-header-wrap>

    <!-- 返回的参数：模板id、模板名称、fields字段[paramName、paramCode、paraDesc] 不可删除，描述 -->
    <edit-select-biz-template :open="openBelongType" @close="openBelongType = false"
      @selected="handleSelectedTemp"></edit-select-biz-template>
    <!-- 返回的参数：变量编码 -->
    <edit-select-var :open="openSelectVar" @close="openSelectVar = false"></edit-select-var>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import EditSelectBizTemplate from './EditSelectBizTemplate'
  import EditSelectVar from './EditSelectVar'
  import EditParamManage from './EditParamManage'
  import { createIndexVar } from '../../../api/credit-rating/index-var.api'

  export default {
    name: 'IndexVarEdit',
    mixins: [commonMixin, permission],
    props: [
      'title',
      'varTypeEnum',
      'dataTypeEnum',
      'paramTypeEnum'
    ],
    components: {
      EditSelectBizTemplate,
      EditSelectVar,
      EditParamManage
    },
    data () {
      return {
        params: [], // 存储业务模板组件选中的参数列表params
        form: {
          varName: '',
          varType: this.varTypeEnum.Common,
          varDesc: '',
          dataType: '',
          tplId: '', // 业务模板id | el表达式选择的变量编码
          tplContent: '', // 业务模板name | el表达式字符串
          params: []
        },
        rules: {
          varName: [
            { required: true, message: '变量名称不能为空', trigger: 'blur' }
          ],
          varCode: [
            { required: true, message: '变量编码不能为空', trigger: 'blur' }
          ],
          varType: [
            { required: true, message: '请选择变量类型', trigger: 'change' }
          ],
          dataType: [
            { required: true, message: '请选择数据类型', trigger: 'change' }
          ],
          tplId: [
            { required: true, message: '请选择业务模板', trigger: 'blur' }
          ]
        },
        openBelongType: false,
        openSelectVar: false
      }
    },
    created () {

    },
    methods: {
      openBelongTypeHandler () {
        this.openBelongType = true
      },
      openSelectVarHandler () {
        this.openSelectVar = true
      },
      handleSelectedTemp (tempObj) {
        this.form = { ...this.form, ...tempObj }
        this.params = tempObj.params
      },
      async handleSubmit () {
        // paramManage.validateAll()用于验证参数管理
        const [valid1, valid2] = await Promise.all([this.$refs.form.validate(), this.$refs.paramManage.validateAll()])
        if (valid1 && valid2) {
          const [success, errorMsg] = await createIndexVar(this.form)
          if (success) {
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('success') // 发送成功事件
            this.$emit('close') // 关闭编辑组件
          } else {
            this.$notice.danger({ title: '操作错误', desc: errorMsg })
          }
        }
      }
    }
  }
</script>

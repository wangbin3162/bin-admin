<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息" collapse>
          <b-form :model="form" ref="form" :rules="rules" :label-width="100">
            <b-row>
              <b-col span="12">
                <b-form-item label="变量名称" prop="varName">
                  <b-input v-model="form.varName" placeholder="请输入变量名称" clearable></b-input>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="变量编码" prop="varCode">
                  <b-input v-model="form.varCode" placeholder="请输入变量编码" clearable :disabled="editData !== null">
                  </b-input>
                </b-form-item>
              </b-col>
            </b-row>
            <b-row>
              <b-col span="12">
                <b-form-item label="变量类型" prop="varType">
                  <b-select v-model="form.varType" @on-change="handleVarTypeChange">
                    <b-option v-for="item in varTypeOptions" :key="item.value"
                      :value="item.value">{{ item.label }}</b-option>
                  </b-select>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="数据类型" prop="dataType">
                  <b-select v-model="form.dataType">
                    <b-option v-for="item in dataTypeOptions" :key="item.value"
                      :value="item.value">{{ item.label }}</b-option>
                  </b-select>
                </b-form-item>
              </b-col>
            </b-row>
            <b-row v-if="form.varType === 'Common'" :key="form.varType">
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
            <b-row v-if="form.varType === 'Complex'">
              <b-col span="24">
                <b-form-item label="el表达式" prop="tplContent">
                  <edit-el-var ref="elVar"
                    @var-change="handleVarChange"
                    @el-change="elText => form.tplContent = elText"
                    @var-params-change="handleVarParamsChange"
                    :initData="elExpreData">
                  </edit-el-var>
                </b-form-item>
              </b-col>
            </b-row>
            <!-- <b-row v-else>
              <b-col span="24">
                <b-form-item label="已选变量">
                  <b-tag color="#409EFF" dot closable
                    v-for="(item, index) in tempVarCodeList" :key="item"
                    @on-close="handleTagClose(index)"
                    @on-click="handleTagClick(item)">
                    {{ item }}
                  </b-tag>
                  <b-button type="primary" plain style="margin-left: 5px;"
                    @click="openSelectVarHandler">
                    选择
                  </b-button>
                </b-form-item>
                <b-form-item label="表达式" prop="tplContent"
                  :rules=" { required: true, message: '请输入el表达式', trigger: 'blur' }">
                  <b-input v-model="form.tplContent"
                    element-id="elInput"
                    type="textarea"
                    :rows="4"
                    style="max-width: 93%;"
                    placeholder="请输入el表达式">
                  </b-input>
                </b-form-item>
              </b-col>
            </b-row> -->
            <b-form-item label="描述" prop="varDesc">
              <b-input v-model="form.varDesc" placeholder="请输入描述" type="textarea" :rows="4"></b-input>
            </b-form-item>
          </b-form>
        </b-collapse-wrap>

        <!-- 一般变量时，选择模板带过来的参数不可改动与删除 -->
        <!-- 复合变量时，新增的参数不可在选择变量带过来的参数中 -->
        <edit-param-manage ref="paramManage"
          :paramTypeOptions="paramTypeOptions"
          :params="params"
          :tempVarCodeList="tempVarCodeList"
          @params-change="params => form.params = params">
        </edit-param-manage>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>

    </page-header-wrap>

    <!-- 返回的参数：模板id、模板名称、fields字段[paramName、paramCode、paraDesc] 不可删除，描述 -->
    <edit-select-biz-template :open="openBelongType" @close="openBelongType = false"
      @selected="handleSelectedTemp"></edit-select-biz-template>
    <!-- 返回的参数：变量编码 -->
    <edit-select-var :open="openSelectVar" @close="openSelectVar = false"
      @choose-mul="handleVarChooseMul"></edit-select-var>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { createIndexVar, updateIndexVar } from '../../../api/credit-rating/index-var.api'
  import EditSelectBizTemplate from './EditSelectBizTemplate'
  import EditSelectVar from './EditSelectVar'
  import EditParamManage from './EditParamManage'
  import EditElVar from './EditElVar'

  export default {
    name: 'IndexVarEdit',
    mixins: [commonMixin, permission],
    props: [
      'title',
      'varTypeOptions',
      'dataTypeOptions',
      'paramTypeOptions',
      'editData'
    ],
    components: {
      EditSelectBizTemplate,
      EditSelectVar,
      EditParamManage,
      EditElVar
    },
    data () {
      return {
        curCursor: 0, // 表达式输入框当前光标位置
        form: {
          varName: '',
          varType: 'Common', // 变量类型默认选择一般变量
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
          ],
          tplContent: [
            { required: true, message: ' ', trigger: 'blur' }
          ]
        },
        openBelongType: false,
        openSelectVar: false,
        openElVar: false,
        params: [], // 存储模板选择组件选中的参数列表params
        tempVarCodeList: [], // 存储变量选择组件选中的变量
        elExpreData: null
      }
    },
    created () {
      this.initEditData()
    },
    methods: {
      // 打开摸板选择组件
      openBelongTypeHandler () {
        this.openBelongType = true
      },
      // 打开变量选择组件
      openSelectVarHandler () {
        this.openSelectVar = true
      },
      // 变量类型select change回调，改变时清空对应数据
      handleVarTypeChange () {
        this.form.tplId = ''
        this.form.tplContent = ''
        this.form.params = []
        this.params = []
        this.tempVarCodeList = []
      },
      // 模板选择组件选中回调
      handleSelectedTemp (tempObj) {
        this.form = { ...this.form, ...tempObj }
        this.params = tempObj.params
      },
      // el表达式组件var-change事件回调
      handleVarChange (indexVarCodeList) {
        this.tempVarCodeList = indexVarCodeList
      },
      // el表达式组件var-params-change事件回调
      handleVarParamsChange (varParams) {
        console.log(varParams)
        this.params = varParams
      },
      // 变量选择组件选中回调
      handleVarChooseMul (tempVarCodeList) {
        // 业务相同的变量只允许选择一次，所以这里做个去重处理
        this.tempVarCodeList = [...new Set([...this.tempVarCodeList, ...tempVarCodeList])]
      },
      // tag关闭回调
      handleTagClose (index) {
        this.tempVarCodeList.splice(index, 1)
      },
      // tag点击回调
      handleTagClick (text) {
        // Astlvk
        const strArr = [...this.form.tplContent]
        let curCursor = document.getElementById('elInput').selectionStart
        if (curCursor === 0 && this.curCursor !== 0) {
          curCursor = this.curCursor
        } else {
          this.curCursor = curCursor
        }
        strArr.splice(curCursor, 0, text)
        this.form.tplContent = strArr.join('')
      },
      async handleSubmit () {
        let valid3 = true
        if (this.form.varType === 'Complex') { // 符合变量时做特殊处理与验证
          this.form.tplId = this.tempVarCodeList.join()
          // if (this.form.tplContent === '') {
          //   this.$message({ type: 'warning', content: 'el表达式不能为空' })
          //   valid3 = await this.$refs.elVar.validate()
          // }
        }
        // paramManage.validateAll()用于验证参数管理
        const [valid1, valid2] = await Promise.all([
          this.$refs.form.validate(),
          this.$refs.paramManage.validateAll()
        ])
        if (valid1 && valid2 && valid3) {
          const [success, errorMsg] = this.editData ? await updateIndexVar(this.form) : await createIndexVar(this.form)
          if (success) {
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('success') // 发送成功事件
            this.$emit('close') // 关闭编辑组件
          } else {
            this.$notice.danger({ title: '操作错误', desc: errorMsg })
          }
        }
      },
      initEditData () {
        if (this.editData) {
          this.form = { ...this.editData }
          // 把form.params放入params，params用于向管理参数组件传递参数
          this.params = this.form.params
          if (this.form.varType === 'Complex') {
            // 如果是符合变量那么需要把tplId还原成数组用于渲染已选变量tag
            this.tempVarCodeList = this.form.tplId.length > 0 ? this.form.tplId.split(',') : []
            // 初始化编辑时el表达式组件需要的参数
            this.elExpreData = {
              tempVarCodeList: this.tempVarCodeList,
              elText: this.form.tplContent
            }
          }
        }
      }
    }
  }
</script>

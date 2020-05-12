<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <template slot="full">
          <b-collapse v-model="collapseValue" simple>
            <b-collapse-panel title="基本信息" name="index">
              <!-- <EditBaseInfo ref="baseInfo"
                @data-update="handleUpdateBaseInfo"
                :natureOptions="natureOptions"
                :dataTypeOptions="dataTypeOptions"
                :calcTypeOptions="calcTypeOptions"
                :scaleOptions="scaleOptions"
                :treeData="treeData"
                :formData="form.index"></EditBaseInfo> -->

              <b-form :model="form.index" ref="form" :rules="roles" :label-width="100">
                <b-row>
                  <b-col span="12">
                    <b-form-item label="名称" prop="indexName">
                      <b-input v-model="form.index.indexName" placeholder="请输入名称" clearable></b-input>
                    </b-form-item>
                  </b-col>
                  <b-col span="12">
                    <b-form-item label="编码" prop="indexCode">
                      <b-input v-model="form.index.indexCode" placeholder="请输入编码" clearable></b-input>
                    </b-form-item>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col span="12">
                    <b-form-item label="指标性质" prop="indexKind">
                      <b-select v-model="form.index.indexKind">
                        <b-option v-for="item in natureOptions" :key="item.value" :value="item.value">
                          {{ item.label }}
                        </b-option>
                      </b-select>
                    </b-form-item>
                  </b-col>
                  <b-col span="12">
                    <b-form-item label="指标类型" prop="bizType">
                      <b-cascader :data="cascadeData" placeholder="请选择指标类型"
                        change-on-select @on-change="handleCascadeChange"></b-cascader>
                    </b-form-item>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col span="12">
                    <b-form-item label="数据类型" prop="dataType">
                      <b-select v-model="form.index.dataType">
                        <b-option v-for="item in dataTypeOptions" :key="item.value" :value="item.value">
                          {{ item.label }}
                        </b-option>
                      </b-select>
                    </b-form-item>
                  </b-col>
                  <b-col span="12">
                    <b-form-item label="计算类型" prop="calClass">
                      <b-select v-model="form.index.calClass">
                        <b-option v-for="item in calcTypeOptions" :key="item.value" :value="item.value">
                          {{ item.label }}
                        </b-option>
                      </b-select>
                    </b-form-item>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col span="12">
                    <b-form-item label="变量" prop="varId">
                      <div flex style="width:100%;">
                        <b-input :value="varName" placeholder="请选择变量" class="choose-btn"
                          readonly disabled></b-input>
                        <b-button slot="suffix" type="primary" plain
                          @click="openSelectVarHandler" style="flex: 0 0 auto;">
                          选择
                        </b-button>
                      </div>
                    </b-form-item>
                  </b-col>
                  <b-col span="12">
                    <b-form-item label="标度" prop="indexScale">
                      <b-select v-model="form.index.indexScale">
                        <b-option v-for="item in scaleOptions" :key="item.value" :value="item.value">
                          {{ item.label }}
                        </b-option>
                      </b-select>
                    </b-form-item>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col span="12">
                    <b-form-item label="有效期字段" prop="validParamName">
                      <b-input v-model="form.index.validParamName" placeholder="请输入有效期字段" style="width: 100%;">
                      </b-input>
                    </b-form-item>
                  </b-col>
                  <b-col span="12">
                    <b-form-item label="有效期" prop="validMonth">
                      <b-input-number v-model="form.index.validMonth" :max="12" :min="1" placeholder="请输入有效期" style="width: 100%;">
                      </b-input-number>
                    </b-form-item>
                  </b-col>
                </b-row>
                <b-form-item label="描述" prop="desc">
                  <b-input v-model="form.index.desc" placeholder="请输入描述" type="textarea" :maxlength="100"></b-input>
                </b-form-item>
              </b-form>

              <edit-select-var :open="open" :radio="true" @close="open = false" @selected="handleVarChange"></edit-select-var>
            </b-collapse-panel>

            <b-collapse-panel title="指标配置规则" name="rules">
              <EditIndexRule :scale="form.index.indexScale" :rules="form.rules"></EditIndexRule>
            </b-collapse-panel>

            <b-collapse-panel title="信息资源配置" name="resources">
              <EditSourceInfo></EditSourceInfo>
            </b-collapse-panel>
          </b-collapse>
        </template>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" @click="handleSubmit">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import EditIndexRule from './EditIndexRule'
  import EditSourceInfo from './EditSourceInfo'
  import EditSelectVar from '../index-var/EditSelectVar'
  import { saveAndUpdate, getIndeManageDetail } from '../../../api/credit-rating/index-manage.api'

  export default {
    name: 'IndexManageEdit',
    props: [
      'title',
      'editData',
      'natureOptions',
      'dataTypeOptions',
      'calcTypeOptions',
      'scaleOptions',
      'treeData'
    ],
    components: {
      EditSelectVar,
      EditIndexRule,
      EditSourceInfo
    },
    data () {
      return {
        collapseValue: ['index'], // 控制手风琴展开
        open: false,
        cascadeData: [], // 指标类型级联数据
        varName: '', // 变量名称 用于显示
        form: {
          index: {
            indexName: '',
            indexCode: '',
            indexDesc: '',
            bizType: '', // 指标类型[类别编码[类别数据为树形结构]]
            indexKind: '', // 指标性质
            calClass: '', // 计算类型
            dataType: '', // 数据类型
            validParamName: '', // 有效期参数名
            validMonth: 1, // 有效期 单位：月
            indexScale: 'F', // 标度
            varId: '' // 引用变量id
          },
          rules: [],
          resources: []
        },
        roles: {
          indexName: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          indexCode: [
            { required: true, message: '编码不能为空', trigger: 'blur' }
          ],
          bizType: [
            { required: true, message: '请选择指标类型', trigger: 'change' }
          ],
          indexKind: [
            { required: true, message: '请选择指标性质', trigger: 'change' }
          ],
          dataType: [
            { required: true, message: '请选择数据类型', trigger: 'change' }
          ],
          calClass: [
            { required: true, message: '请选择计算类型', trigger: 'change' }
          ],
          validParamName: [
            { required: true, message: '有效期字段不能为空', trigger: 'blur' }
          ],
          validMonth: [
            { type: 'integer', required: true, message: '必须为1-12的整数', trigger: 'blur' }
          ],
          indexScale: [
            { required: true, message: '请选择标度', trigger: 'change' }
          ],
          varId: [
            { required: true, message: '变量不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.cascadeData = this.treeToCascade(this.treeData[0].children) // 生成级联选择框使用的数据
      this.init()
    },
    methods: {
      // 级联选择回调
      handleCascadeChange (val) {
        if (val.length > 0) {
          this.form.index.bizType = val[0]
        } else {
          this.form.index.bizType = ''
        }
      },
      // 选择变量组件已选回调
      handleVarChange (val) {
        this.varName = val.varName
        this.form.index.varId = val.id
      },
      openSelectVarHandler () {
        this.open = true
      },
      async handleSubmit () {
        // 验证组件内的form
        const status = await this.$refs.form.validate()
        if (status) {
          try {
            const [success, errorMsg] = await saveAndUpdate(this.form)
            if (success) {
              this.$message({ type: 'success', content: '操作成功' })
              this.$emit('success')
              this.$emit('close')
            } else {
              this.$notice.danger({ title: '操作失败', desc: errorMsg })
            }
          } catch (error) {
            this.$log.pretty('searchList Error', error, 'danger')
            this.$notice.danger({ title: '操作失败', desc: error })
          }
        }
      },
      // 处理EditBaseInfo组件数据更新事件
      // handleUpdateBaseInfo (data) {
      //   this.form.index = data
      // },
      // 初始化编辑数据
      async init () {
        if (this.editData) {
          try {
            const res = await getIndeManageDetail(this.editData.id)
            this.form = res
          } catch (error) {
            this.$log.pretty('searchList Error', error, 'danger')
          }
        }
      },
      // 把类目的树形数据转换为级联选择框可用的树形结构
      treeToCascade (tree) {
        const list = []
        for (const item of tree) {
          const obj = {
            label: item.title,
            value: item.code,
            children: []
          }
          if (item.children && item.children.length > 0) {
            obj.children = this.treeToCascade(item.children)
          }
          list.push(obj)
        }
        return list
      }
    }
  }
</script>

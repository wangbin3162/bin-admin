<template>
  <div class="credit-report-config-info-class-edit">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full">
          <v-title-bar label="基本信息" class="mb-15"></v-title-bar>
          <b-form :model="form" ref="form" :rules="rules"
            :label-width="100" label-position="left" style="padding: 0 100px;">
            <b-row :gutter="15">
              <b-col span="12">
                <b-form-item label="信息类名称" prop="categoryName">
                  <b-input v-model="form.categoryName" placeholder="请输入信息类名称" clearable></b-input>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="信息类类型" prop="categoryCode">
                  <b-select v-model="form.categoryCode" clearable>
                    <b-option v-for="(value, key) in reportItemTypeEnum" :key="key" :value="key">
                      {{ value }}
                    </b-option>
                  </b-select>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="排序序号" prop="orderNo">
                  <b-input-number :min="0" v-model="form.orderNo" placeholder="请输入排序序号" clearable></b-input-number>
                </b-form-item>
              </b-col>
            </b-row>
          </b-form>

          <v-title-bar label="配置信用报告信息项" class="mb-15">
            <b-button type="text" @click="handleAddSourceInfo">+ 添加资源信息</b-button>
          </v-title-bar>

          <b-table :columns="columns" :data="list" :show-header="false" size="small">
            <template v-slot:orderNo="{ index }">
              排序：<b-input-number v-model="listCopy[index].orderNo" :min="0"></b-input-number>
            </template>

            <template v-slot:action="{ index }">
              <b-button type="text" @click="handleRemove(index)">删除</b-button>
              <b-button type="text" @click="handleEdit(index)">编辑</b-button>
            </template>
          </b-table>
        </div>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>

    </page-header-wrap>

    <source-info-select
      @close="openSource = false"
      @choose-mul-info="handleSourceSelected"
      paraType="I"
      :open="openSource"
      :infoMulModel="true">
    </source-info-select>

    <edit-source-info-field
      @close="openSourceField = false"
      @save="handleSave"
      :open="openSourceField"
      :resourceKey="resourceKey"
      :fieldNames="fieldNames"
      :fieldMap="fieldMap">
    </edit-source-info-field>
  </div>
</template>

<script>
  import SourceInfoSelect from '../../../../credit-rating/index-manage/SourceInfoSelect'
  import EditSourceInfoField from './EditSourceInfoField'
  import { createInfoClass, updateCreditReport, updateInfoClass } from '../../../../../api/sys/credit-report-config.api'

  export default {
    name: 'CreditReportConfigInfoClassEdit',
    props: [
      'configId', // 报告配置id
      'title',
      'editData'
    ],
    components: {
      SourceInfoSelect,
      EditSourceInfoField
    },
    data () {
      return {
        curIndex: 0, // 存储当前行index
        resourceKey: '', // 传递给edit-source-info-field
        fieldNames: '', // 当前编辑行的fieldNames，传递给edit-source-info-field
        fieldMap: null, // 当前编辑行的fieldNames与fieldTitles，传递给edit-source-info-field
        btnLoading: false,
        openSource: false, // 打开source-info-select组件
        openSourceField: false, // 打开edit-source-info-field组件
        form: {
          configId: this.configId,
          categoryName: '',
          categoryCode: '',
          orderNo: 0,
          items: []
        },
        rules: {
          categoryName: [
            { required: true, message: '信息类名称不能为空', trigger: 'blur' }
          ],
          categoryCode: [
            { required: true, message: '信息类类型不能为空', trigger: 'blur' }
          ],
          orderNo: [
            { type: 'integer', required: true, message: '必须为整数', trigger: 'blur' }
          ]
        },
        jsxRules: {
          displayName: [
            { required: true, message: '显示名称不能为空', trigger: 'blur' }
          ],
          layout: [
            { required: true, message: '布局方式不能为空', trigger: 'blur' }
          ],
          fieldNames: [
            { required: true, message: '字段列表不能为空', trigger: 'blur' }
          ],
          fieldTitles: [
            { required: true, message: '字段标题不能为空', trigger: 'blur' }
          ]
        }, // JSX内form用的验证规则
        list: [],
        listCopy: [],
        columns: [
          {
            type: 'expand',
            width: 50,
            // model={{}} rules={this.jsxRules}
            render: (h, { index }) => {
              const row = this.listCopy[index]
              return (
                <div class="expand-row">
                  <b-form>
                    <b-row gutter={15}>
                      <b-col span={12}>
                        <b-form-item label="显示名称">
                          <b-input value={row.displayName}
                            onInput={
                              val => { row.displayName = val }
                            }></b-input>
                        </b-form-item>
                      </b-col>

                      <b-col span={12}>
                        <b-form-item label="布局方式">
                          <b-select value={ row.layout }
                            on-on-change={
                              val => { row.layout = val }
                            }>
                            {
                              Object.keys(this.reportLayoutTypeEnum).map(key => {
                                return (
                                  <b-option key={key} value={key}>
                                    { this.reportLayoutTypeEnum[key] }
                                  </b-option>
                                )
                              })
                            }
                          </b-select>
                        </b-form-item>
                      </b-col>

                      <b-col span={24}>
                        <b-form-item label="字段列表">
                          <b-input disabled value={
                            row.fieldNames
                          }></b-input>
                        </b-form-item>
                      </b-col>

                      <b-col span={24}>
                        <b-form-item label="字段标题">
                          <b-input disabled value={
                            row.fieldTitles
                          }></b-input>
                        </b-form-item>
                      </b-col>

                      <b-col span={24}>
                        <b-form-item label="数据过滤">
                          <b-input></b-input>
                        </b-form-item>
                      </b-col>
                    </b-row>
                  </b-form>
                </div>
              )
            }
          },
          { type: 'index', width: 50 },
          { title: 'resourceName', key: 'resourceName', align: 'left' },
          { title: 'orderNo', slot: 'orderNo', align: 'right' },
          { title: 'Action', slot: 'action', width: 140, align: 'right' }
        ]
      }
    },
    computed: {
      reportItemTypeEnum () {
        return this.$store.state.creditReportConfig.reportItemTypeEnum
      },
      reportLayoutTypeEnum () {
        return this.$store.state.creditReportConfig.reportLayoutTypeEnum
      }
    },
    created () {
      this.initEditData()
    },
    methods: {
      // 添加资源信息按钮回调
      handleAddSourceInfo () {
        this.openSource = true
      },
      // 资源选择组件选中的回调
      handleSourceSelected ({ resource, infoItems }) {
        const exist = this.list.some(item => {
          return resource.resourceKey === item.resourceKey
        })
        if (exist) {
          this.$message({ type: 'warning', content: '选择的资源已存在。' })
        } else {
          const nameArr = []
          const titleArr = []
          infoItems.forEach(item => {
            nameArr.push(item.fieldName)
            titleArr.push(item.fieldTitle)
          })

          const obj = {
            displayName: '',
            layout: '',
            orderNo: this.list.length,
            categoryId: this.configId,
            resourceKey: resource.resourceKey,
            resourceName: resource.resourceName,
            tableName: resource.tableName,
            fieldNames: nameArr.join(','),
            fieldTitles: titleArr.join(','),
            onelineNames: '',
            fieldFilter: ''
          }
          this.listCopy.push(obj)
          this.list.push(JSON.parse(JSON.stringify(obj)))
        }
      },
      // 删除按钮的回调
      handleRemove (index) {
        this.$confirm({
          title: '删除',
          content: '确定要删除当前信息报告信息项？',
          loading: true,
          okType: 'danger',
          onOk: () => {
            this.list.splice(index, 1)
            this.listCopy.splice(index, 1)
            this.$modal.remove()
          }
        })
      },
      // 编辑按钮回调
      handleEdit (index) {
        this.curIndex = index

        const row = this.listCopy[index]
        const fieldMap = new Map()
        const fieldNamesList = row.fieldNames.split(',')
        const fieldTitlesList = row.fieldTitles.split(',')

        for (let i = 0; i < fieldNamesList.length; i++) {
          fieldMap.set(fieldNamesList[i], fieldTitlesList[i])
        }

        this.resourceKey = row.resourceKey
        this.fieldMap = fieldMap

        this.openSourceField = true
      },
      // 资源编辑组件保存后的回调
      handleSave ({ fieldNames, fieldTitles }) {
        const row = this.listCopy[this.curIndex]
        row.fieldNames = fieldNames
        row.fieldTitles = fieldTitles
      },
      async handleSubmit () {
        this.form.items = this.listCopy
        const valid = await this.$refs.form.validate()
        if (valid) {
          try {
            this.btnLoading = true
            this.editData ? await updateInfoClass(this.form) : await createInfoClass(this.form)
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('success') // 发送成功事件
            this.$emit('close') // 关闭编辑组件
          } catch (error) {
            this.$notice.danger({ title: '操作错误', desc: error })
          }
          this.btnLoading = false
        }
      },
      initEditData () {
        if (this.editData) {
          // this.form = this.$util.deepClone(this.editData)
        }
      }
    }
  }
</script>

<style lang="stylus">
.credit-report-config-info-class-edit {
  .bin-table-expanded-cell { // 重写展开列默认样式
    // background: #f0f2f5;
    // background: #ffffff;
  }
}
</style>

<template>
  <div class="credit-report-config-info-class-edit">
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息" collapse style="position: relative;">
          <b-loading fix show-text="loading" v-if="loading"></b-loading>
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
        </b-collapse-wrap>

        <b-collapse-wrap title="配置信用报告信息项" collapse :value="!loading">
          <b-button slot="right" type="text" @click="handleAddSourceInfo">+ 添加资源信息</b-button>

          <b-collapse-wrap v-model="item.customExpand" v-for="(item, index) in infoList" :key="item.resourceKey">
            <div slot="title" style="font-size: 14px; padding: 10px;">
              {{ item.resourceName }}
            </div>
            <div slot="right">
              <span style="font-size: 14px;">排序：</span>
              <b-input-number v-model="item.orderNo" :min="0" style="margin-right: 8px;"></b-input-number>
              <b-button type="text" text-color="danger" @click="handleRemove(index)">删除</b-button>
              <b-button type="text" @click="handleEdit(index)">编辑</b-button>
              <b-button type="text" @click="item.customExpand = !item.customExpand">
                {{ item.customExpand ? '收起' : '展开' }}
              </b-button>
            </div>
            <div>
              <b-form ref="expandForm" :model="item" :rules="infoRules" :label-width="100">
                <b-row :gutter="15">
                  <b-col span="12">
                    <b-form-item label="显示名称" prop="displayName">
                      <b-input v-model="item.displayName"></b-input>
                    </b-form-item>
                  </b-col>
                  <b-col span="12">
                    <b-form-item label="布局方式" prop="layout">
                      <b-select v-model="item.layout">
                        <b-option v-for="(value, key) in reportLayoutTypeEnum" :key="key" :value="key">
                          {{ value }}
                        </b-option>
                      </b-select>
                    </b-form-item>
                  </b-col>
                  <b-col span="24">
                    <b-form-item label="字段列表" prop="fieldNames">
                      <b-input v-model="item.fieldNames" disabled></b-input>
                    </b-form-item>
                  </b-col>
                  <b-col span="24">
                    <b-form-item label="字段标题" prop="fieldTitles">
                      <b-input v-model="item.fieldTitles" disabled></b-input>
                    </b-form-item>
                  </b-col>
                  <b-col span="24">
                    <b-form-item label="数据过滤">
                      <b-input v-model="item.fieldFilter"></b-input>
                    </b-form-item>
                  </b-col>
                </b-row>
              </b-form>
            </div>
          </b-collapse-wrap>

        </b-collapse-wrap>

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
      :fieldMap="fieldMap">
    </edit-source-info-field>
  </div>
</template>

<script>
  import SourceInfoSelect from '../../../credit-rating/index-manage/SourceInfoSelect'
  import EditSourceInfoField from './EditSourceInfoField'
  import { createInfoClass, updateInfoClass, getInfoClassDetaiil } from '../../../../api/credit-rating/credit-report-config.api'

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
        loading: false, // 遮罩loading
        btnLoading: false,
        curIndex: 0, // 存储当前行index
        resourceKey: '', // 传递给edit-source-info-field
        fieldMap: null, // 当前编辑行的fieldNames与fieldTitles，传递给edit-source-info-field
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
        infoRules: {
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
        }, // 信息项内form内form用验证规则
        infoList: []
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
      expandRender (h, row) {
        // console.log(row)
        // const displayName = h(
        //   'b-form-item',
        //   {
        //     props: {
        //       label: '显示名称',
        //       prop: 'displayName'
        //     }
        //   },
        //   [h(
        //     'b-input',
        //     {
        //       props: {
        //         value: row.displayName
        //       },
        //       nativeOn: {
        //         input (e) {
        //           row.displayName = e.target.value
        //         }
        //       }
        //     }
        //   )]
        // )
        // const layout = h(
        //   'b-form-item',
        //   {
        //     props: {
        //       label: '布局方式',
        //       prop: 'layout'
        //     }
        //   },
        //   [h(
        //     'b-select',
        //     {
        //       props: {
        //         value: row.layout,
        //         appendToBody: true
        //       },
        //       on: {
        //         'on-change' (val) {
        //           console.log(val)
        //           row.layout = val
        //         }
        //       }
        //     },
        //     Object.keys(this.reportLayoutTypeEnum).map(key => {
        //       const text = this.reportLayoutTypeEnum[key]
        //       return h(
        //         'b-option',
        //         {
        //           props: {
        //             value: key
        //           },
        //           key: key
        //         },
        //         text
        //       )
        //     })
        //   )]
        // )
        // const fieldNames = h(
        //   'b-form-item',
        //   {
        //     props: {
        //       label: '字段列表',
        //       prop: 'fieldNames'
        //     }
        //   },
        //   [h(
        //     'b-input',
        //     {
        //       props: {
        //         disabled: true,
        //         value: row.fieldNames
        //       }
        //     }
        //   )]
        // )
        // const fieldTitles = h(
        //   'b-form-item',
        //   {
        //     props: {
        //       label: '字段标题',
        //       prop: 'fieldTitles'
        //     }
        //   },
        //   [h(
        //     'b-input',
        //     {
        //       props: {
        //         disabled: true,
        //         value: row.fieldTitles
        //       }
        //     }
        //   )]
        // )
        // const fieldFilter = h(
        //   'b-form-item',
        //   {
        //     props: {
        //       label: '数据过滤'
        //     }
        //   },
        //   [h(
        //     'b-input',
        //     {
        //       props: {
        //         value: row.fieldFilter
        //       },
        //       nativeOn: {
        //         input (e) {
        //           row.fieldFilter = e.target.value
        //         }
        //       }
        //     }
        //   )]
        // )
        // const bForm = h(
        //   'b-form',
        //   {
        //     props: {
        //       model: row,
        //       rules: this.jsxRules,
        //       labelWidth: 100
        //     },
        //     ref: 'expandForm',
        //     refInFor: true
        //   },
        //   [
        //     h(
        //       'b-row',
        //       { props: { gutter: 15 } },
        //       [
        //         h(
        //           'b-col',
        //           { props: { span: 12 } },
        //           [displayName]
        //         ),
        //         h(
        //           'b-col',
        //           { props: { span: 12 } },
        //           [layout]
        //         ),
        //         h(
        //           'b-col',
        //           { props: { span: 24 } },
        //           [fieldNames]
        //         ),
        //         h(
        //           'b-col',
        //           { props: { span: 24 } },
        //           [fieldTitles]
        //         ),
        //         h(
        //           'b-col',
        //           { props: { span: 24 } },
        //           [fieldFilter]
        //         )
        //       ]
        //     )
        //   ]
        // )
        // return bForm
      },
      // 添加资源信息按钮回调
      handleAddSourceInfo () {
        this.openSource = true
      },
      // 资源选择组件选中的回调
      handleSourceSelected ({ resource, infoItems }) {
        const exist = this.infoList.some(item => {
          return resource.resourceKey === item.resourceKey
        })
        if (exist) {
          this.$alert({
            type: 'warning',
            title: '资源已存在',
            content: '选择的资源已存在，请重新选择。'
          })
        } else {
          const nameArr = []
          const titleArr = []
          infoItems.forEach(item => {
            nameArr.push(item.fieldName)
            titleArr.push(item.fieldTitle)
          })

          const obj = {
            customExpand: true, // 自定义展开
            displayName: '',
            layout: '',
            orderNo: this.infoList.length,
            categoryId: this.configId,
            resourceKey: resource.resourceKey,
            resourceName: resource.resourceName,
            tableName: resource.tableName,
            fieldNames: nameArr.join(','),
            fieldTitles: titleArr.join(','),
            onelineNames: '',
            fieldFilter: ''
          }
          this.infoList.push(obj)
        }
      },
      // 删除按钮的回调
      handleRemove (index) {
        this.$confirm({
          title: '删除',
          content: '确定要删除当前信用报告信息项？',
          loading: true,
          okType: 'danger',
          onOk: () => {
            this.infoList.splice(index, 1)
            this.$modal.remove()
          }
        })
      },
      // 编辑按钮回调
      handleEdit (index) {
        this.curIndex = index

        const row = this.infoList[index]
        const fieldMap = new Map()
        const fieldNamesList = row.fieldNames.split(',')
        const fieldTitlesList = row.fieldTitles.split(',')
        const onelineNamesList = row.onelineNames === undefined ? [] : row.onelineNames.split(',')

        for (let i = 0; i < fieldNamesList.length; i++) {
          const fieldName = fieldNamesList[i]
          const fieldTitle = fieldTitlesList[i]
          const isOneLine = onelineNamesList.some(item => item === fieldName) // 判单当前fieldName是否占满一行

          const fieldObj = {
            fieldName,
            fieldTitle,
            isOneLine
          }

          fieldMap.set(fieldNamesList[i], fieldObj)
        }

        this.resourceKey = row.resourceKey
        this.fieldMap = fieldMap

        this.openSourceField = true
      },
      // 资源编辑组件保存后的回调
      handleSave ({ fieldNames, fieldTitles, onelineNames }) {
        const row = this.infoList[this.curIndex]
        row.fieldNames = fieldNames
        row.fieldTitles = fieldTitles
        row.onelineNames = onelineNames
      },
      async handleSubmit () {
        this.form.items = this.infoList
        const valid = await this.$refs.form.validate()
        const formsValid = [] // 验证展开项内的form
        for (const item of this.$refs.expandForm) {
          const valid = await item.validate()
          formsValid.push(valid)
        }
        formsValid.forEach((item, index) => {
          if (!item) { // 验证不通过时展开可能收起的内容
            this.infoList[index].customExpand = true
          }
        })
        if (valid && !formsValid.includes(false)) {
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
      async getInfoClassDetaiil (id) {
        this.loading = true
        try {
          const res = await getInfoClassDetaiil(id)
          this.form = { ...this.form, ...res }
          this.infoList = this.$util.deepClone(res.items)
          this.infoList.forEach(item => {
            this.$set(item, 'customExpand', false)
          })
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },
      initEditData () {
        if (this.editData) {
          this.getInfoClassDetaiil(this.editData.id)
        }
      }
    }
  }
</script>

<style lang="stylus">
.credit-report-config-info-class-edit {

}
</style>

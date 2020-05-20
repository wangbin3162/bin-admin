<template>
  <page-header-wrap v-if="visible" :title="resource.resourceName"
                    show-close @on-close="handleClose">
    <v-edit-wrap>
      <template slot="full">
        <v-title-bar :label="hasTestData?'修改示例数据':'新增示例数据'" class="mb-15"/>
        <b-form :model="form" :rules="rules" ref="dynamicFormRef" label-position="top">
          <!--自定义form-item-->
          <form-item :key="item.id||index" v-for="(item,index) in dynamicForm"
                     :label="item.fieldTitle"
                     :prop="item.fieldName"
                     :control-type="item.controlType">
            <!--动态控件-->
            <form-control v-model="form[item.fieldName]"
                          :resource-key="resource.resourceKey"
                          :control-type="item.controlType"
                          :field-name="item.fieldName"
                          :field-desc="item.fieldDesc"
                          :field-title="item.fieldTitle"
                          :data-length="item.dataLength"
                          :data-precision="item.dataPrecision"
                          :options="item.validOptions"
                          :table-name="resource.tableName"
                          @on-select="handleSelectNatLeg">
            </form-control>
          </form-item>
        </b-form>
      </template>
      <!--保存提交-->
      <template slot="footer">
        <b-button @click="handleClose">返 回</b-button>
        <b-button type="primary" @click="handleSubmit" :loading="btnLoading">{{hasTestData?'修 改':'新 增'}}</b-button>
      </template>
    </v-edit-wrap>
  </page-header-wrap>
</template>

<script>
  import { deepCopy } from '../../../../../common/utils/assist'
  import dynamicForm from '../../../../../common/mixins/dynamic-form'
  import { addTestData, modifyTestData, searchTestData } from '../../../../../api/data-manage/res-info.api'
  import { initFormList } from '../../../../../components/Validator/FieldsCfg/cfg-util'

  export default {
    name: 'SampleData',
    mixins: [dynamicForm],
    data() {
      return {
        isLeg: false, // 是否是法人，这里用resource.tableName 来判断
        resource: null,
        visible: false,
        hasTestData: false
      }
    },
    methods: {
      // 打开弹窗
      open(res, columns) {
        this.resource = deepCopy(res)
        this.isLeg = this.resource.tableName.includes('leg_')
        // 过滤person_id 获取原始列数组
        this.columns = columns.filter(item => item.fieldName.indexOf('_id') === -1)
        // 根据原始列扩展动态表单列表数据
        initFormList(this.columns).then(res => {
          this.dynamicForm = res
          this.handleDynamicFormReset()
          this.initDynamicForm(res) // 根据动态列扩展form，rules和
          this.visible = true
          // 查询填充示例数据第一个
          searchTestData(this.resource.resourceKey).then(res => {
            if (res.data.code === '0' && res.data.data) {
              const form = this.decodeAndMaskFormat([res.data.data])
              this.hasTestData = true // 添加过示例数据
              this.setFormObj(form[0])
            } else {
              this.hasTestData = false // 没有添加过示例数据
            }
          })
        })
      },
      handleClose() {
        this.visible = false
        this.$emit('on-close')
      },
      // 表单提交
      handleSubmit() {
        if (!this.$refs.dynamicFormRef) return
        this.$refs.dynamicFormRef.validate((valid) => {
          if (valid) {
            let tmpForm = this.getEncodeFormObj()
            console.log(tmpForm)
            this.btnLoading = true
            let fun = this.hasTestData ? modifyTestData : addTestData
            fun(this.resource.resourceKey, tmpForm).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.handleClose()
              } else {
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
              this.btnLoading = false // 按钮状态清空
            })
          } else {
            this.$message({ type: 'danger', content: '表单校验失败,请填写正确后提交!' })
          }
        })
      }
    }
  }
</script>

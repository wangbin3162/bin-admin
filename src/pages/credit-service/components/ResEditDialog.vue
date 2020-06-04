<template>
  <div class="res-detail-dialog">
    <page-header-wrap :title="'编辑 ' + diffDetail.resourceName">
      <v-edit-wrap>
        <div slot="full" style="position: relative; min-height: 70vh;">
          <b-loading fix show-text="加载中...." v-if="loading"></b-loading>
          <b-form :model="form" ref="dynamicFormRef" label-position="top" :rules="rules">
            <form-item v-for="item in dynamicForm"
              :key="item.id"
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
        </div>

        <!--保存提交-->
        <template slot="footer">
          <b-button @click="handleCancelBtn">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import dynamicForm from '../../../common/mixins/dynamic-form'
  import { deepCopy } from '../../../common/utils/assist'
  import { initFormList } from '../../../components/Validator/FieldsCfg/cfg-util'
  import { Decode, MaskCode } from '../../../common/utils/secret'
  import { getResourceInfo, queryOne, modifyGather } from '../../../api/data-manage/gather.api'

  export default {
    name: 'ResEditDialog',
    mixins: [dynamicForm],
    props: [
      'open',
      'diffDetail'
    ],
    data () {
      return {
        loading: false,
        btnLoading: false,
        resource: {}
      }
    },
    async created () {
      const { detail, columns } = await this.getResourceInfo()
      this.initForm(detail, columns)
      await this.queryOne()
    },
    methods: {
      // 取消按钮回调
      handleCancelBtn () {
        this.handleDynamicFormReset()
        this.$emit('close')
      },
      // 提交按钮回调
      async handleSubmit () {
        if (!this.$refs.dynamicFormRef) return
        const valid = await this.$refs.dynamicFormRef.validate()

        if (valid) {
          this.btnLoading = true
          try {
            let tmpForm = this.getEncodeFormObj()

            const res = await modifyGather(this.resource.resourceKey, tmpForm)

            if (res.data.code !== '0') {
              this.$notice.danger({ title: '操作错误', desc: res.data.message })
            }
          } catch (error) {
            console.error(error)
            this.$notice.danger({ title: '操作错误', desc: error })
          }
          this.btnLoading = false // 按钮状态清空
        } else {
          this.$message({ type: 'danger', content: '表单校验失败,请填写正确后提交!' })
        }
      },
      // 根据resourceKey获取资源详情
      async getResourceInfo () {
        return new Promise(async (resolve, reject) => {
          this.loading = true
          try {
            const res = await getResourceInfo(this.diffDetail.resourceKey)
            let detail = res.data.data
            let columns = detail.items.filter(i => i.id)
            this.resource = detail
            resolve({
              detail,
              columns
            })
          } catch (error) {
            console.error(error)
            this.loading = false
            this.$notice.danger({ title: '请求失败', desc: error })
          }
        })
      },
      // 获取需要编辑的数据
      async queryOne () {
        try {
          const res = await queryOne(this.diffDetail.recordId, this.resource.resourceKey)
          if (res.data.code === '0') {
            // 针对一个对象进行解码，并逐字段设置至form
            let detail = this.decodeFormObj(res.data.data)
            this.setFormObj(detail)
          }
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '获取编辑数据失败', desc: error })
        }
        this.loading = false
      },
      // 初始化动态form
      initForm (res, columns) {
        // 过滤 person_id 获取原始列数组
         const filtered = columns.filter(item => item.fieldName.indexOf('_id') === -1 && item.status === 'use')
        // 根据原始列扩展动态表单列表数据
        initFormList(filtered).then(resp => {
          this.dynamicForm = resp
          this.initDynamicForm(resp) // 根据动态列扩展form，rules和
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
.res-detail-dialog {
  .table-con {
    min-height: 300px;
    max-height: 600px;
    overflow: auto;

    table {
      width: 100%;
      font-size: 13px;
      border-collapse: collapse;

      td {
        height: 40px;
        width: 50%;
        padding: 5px 12px
      }
    }
  }
}
</style>

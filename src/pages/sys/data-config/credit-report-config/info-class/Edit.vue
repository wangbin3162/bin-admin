<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full">
          <v-title-bar label="基本信息" class="mb-15"></v-title-bar>
          <b-form :model="form" ref="form" :rules="rules"
            :label-width="100" label-position="left" style="padding: 0 100px;">
            <b-row :gutter="15">
              <b-col span="12">
                <b-form-item label="信息类名称" prop="displayName">
                  <b-input v-model="form.displayName" placeholder="请输入信息类名称" clearable></b-input>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="信息类类型" prop="category">
                  <b-select v-model="form.category" clearable>
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

          <v-title-bar label="配置信用报告信息项" class="mb-15"></v-title-bar>
        </div>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>

    </page-header-wrap>
  </div>
</template>

<script>
  import { } from '../../../../../api/sys/credit-report-config.api'

  export default {
    name: 'CreditReportConfigInfoClassEdit',
    props: [
      'reportId',
      'title',
      'editData'
    ],
    components: {
    },
    data () {
      return {
        btnLoading: false,
        form: {
          displayName: '',
          category: '',
          orderNo: 0
        },
        rules: {
          displayName: [
            { required: true, message: '信息类名称不能为空', trigger: 'blur' }
          ],
          category: [
            { required: true, message: '信息类类型不能为空', trigger: 'blur' }
          ],
          orderNo: [
            { required: true, message: '排序序号不能为空', trigger: 'blur' }
          ]
        }
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
      // this.initEditData()
    },
    methods: {
      // 图片组件上传成功的回调
      handleFileUploadSuccess (val) {
        this.form.reportWaterMark = val
      },
      // 图片上传组件清空的回调
      handleFileClear () {
        this.form.reportWaterMark = ''
      },
      async handleSubmit () {
        let imgValid = true
        if (this.form.reportWaterMark === '') {
          imgValid = false
          this.$message({ type: 'warning', content: '请上传水印图片。' })
        }
        const valid = await this.$refs.form.validate()
        if (imgValid && valid) {
          // try {
          //   this.btnLoading = true
          //   this.editData ? await updateCreditReport(this.form) : await createCreditReport(this.form)
          //   this.$message({ type: 'success', content: '操作成功' })
          //   this.$emit('success') // 发送成功事件
          //   this.$emit('close') // 关闭编辑组件
          // } catch (error) {
          //   this.$notice.danger({ title: '操作错误', desc: error })
          // }
          this.btnLoading = false
        }
      },
      initEditData () {
        if (this.editData) {
          this.form = { ...this.editData }
        }
      }
    }
  }
</script>

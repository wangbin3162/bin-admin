<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息">
          <b-form :model="form" ref="form" :rules="rules"
            :label-width="100" label-position="right" style="padding: 0 100px;">
            <b-row :gutter="15">
              <b-col span="12">
                <b-form-item label="报告名称" prop="reportName">
                  <b-input v-model="form.reportName" placeholder="请输入报告名称" clearable></b-input>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="报告类型" prop="reportType">
                  <b-select v-model="form.reportType" clearable>
                    <b-option v-for="(value, key) in reportTypeEnum" :key="key" :value="key">
                      {{ value }}
                    </b-option>
                  </b-select>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="主体类型" prop="personClass">
                  <b-select v-model="form.personClass" clearable>
                    <b-option v-for="(value, key) in personClassEnum" :key="key" :value="key">
                      {{ value }}
                    </b-option>
                  </b-select>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="名称(市/区)" prop="unit">
                  <b-input v-model="form.unit" placeholder="请输入名称(市/区)" clearable></b-input>
                </b-form-item>
              </b-col>

              <b-col span="12">
                <b-form-item label="联系电话" prop="unitPhone">
                  <b-input v-model="form.unitPhone" placeholder="请输入联系电话" clearable></b-input>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="邮箱" prop="unitEmail">
                  <b-input v-model="form.unitEmail" placeholder="请输入邮箱" clearable></b-input>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="单位名称" prop="unitName">
                  <b-input v-model="form.unitName" placeholder="请输入单位名称" clearable></b-input>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="单位网址" prop="unitUrl">
                  <b-input v-model="form.unitUrl" placeholder="请输入单位网址" clearable></b-input>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="单位地址" prop="unitAddress">
                  <b-input v-model="form.unitAddress" placeholder="请输入单位地址" clearable></b-input>
                </b-form-item>
              </b-col>
            </b-row>

            <!-- <b-divider></b-divider> -->

            <b-form-item label="报告须知" prop="varDesc">
              <b-input v-model="form.reportDesc" placeholder="请输入报告须知" type="textarea" :rows="4"></b-input>
            </b-form-item>

            <b-form-item label="水印图片">
              <img-upload moduleName="report"
                :echoId="form.reportWaterMark"
                @success="handleFileUploadSuccess"
                @clear="handleFileClear"></img-upload>
            </b-form-item>
          </b-form>
        </b-collapse-wrap>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>

    </page-header-wrap>
  </div>
</template>

<script>
  import { createCreditReport, updateCreditReport } from '../../../api/credit-rating/credit-report-config.api'
  import ImgUpload from './ImgUpload'

  export default {
    name: 'CreditReportConfigEdit',
    props: [
      'title',
      'editData'
    ],
    components: {
      ImgUpload
    },
    data () {
      return {
        btnLoading: false,
        form: {
          reportName: '',
          reportType: '',
          personClass: '',
          unit: '',
          unitPhone: '',
          unitEmail: '',
          unitName: '',
          unitUrl: '',
          unitAddress: '',
          reportDesc: '',
          reportWaterMark: '' // 水印图片
        },
        rules: {
          reportName: [
            { required: true, message: '报告名称不能为空', trigger: 'blur' }
          ],
          reportType: [
            { required: true, message: '请选择报告类型', trigger: 'blur' }
          ],
          personClass: [
            { required: true, message: '请选择主体', trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      personClassEnum () {
        return this.$store.state.creditReportConfig.personClassEnum
      },
      reportDefaultEnum () {
        return this.$store.state.creditReportConfig.reportDefaultEnum
      },
      reportTypeEnum () {
        return this.$store.state.creditReportConfig.reportTypeEnum
      }
    },
    created () {
      this.initEditData()
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
          try {
            this.btnLoading = true
            this.editData ? await updateCreditReport(this.form) : await createCreditReport(this.form)
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
          this.form = { ...this.editData }
        }
      }
    }
  }
</script>

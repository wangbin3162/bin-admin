<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full">
          <v-title-bar label="基本信息" tipPos="left" class="mb-20"></v-title-bar>
          <b-form :model="form" ref="form" :rules="rules" :label-width="100">
            <b-row>
               <b-col span="24">
                <b-col span="12">
                  <b-form-item label="申请目录" prop="configType">
                    <b-select v-model="form.configType">
                      <b-option v-for="(value, key) in []" :key="key"
                        :value="key">
                        {{ value }}
                      </b-option>
                    </b-select>
                  </b-form-item>
                </b-col>
              </b-col>

              <b-col span="24">
                <b-form-item label="选择记录" prop="tableName">
                  <b-input v-model="form.tableName" type="textarea" :rows="4" disabled></b-input>
                </b-form-item>
              </b-col>

              <b-col span="24">
                <b-form-item label="修复原因" prop="resourceKey">
                  <b-input v-model="form.resourceKey" type="textarea" :rows="4"></b-input>
                </b-form-item>
              </b-col>

              <b-col span="24">
                <b-divider></b-divider>
              </b-col>
            </b-row>

            <b-form-item label="附件列表">
              <repair-apply-attach-list>
              </repair-apply-attach-list>
            </b-form-item>

            <b-form-item label="处理方法">
              <b-radio label="">信用修复</b-radio>
            </b-form-item>

            <b-form-item label="修复内容" prop="resourceKey">
                  <b-input v-model="form.resourceKey" type="textarea" :rows="4"></b-input>
                </b-form-item>
          </b-form>
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
  import RepairApplyAttachList from '../components/RepairApplyAttachList'
  import { } from '../../../../api/credit-service/credit-repair.api'

  export default {
    name: 'RepairApplyEdit',
    props: [
      'title',
      'editData'
    ],
    components: {
      RepairApplyAttachList
    },
    data () {
      return {
        btnLoading: false,
        open: false,
        form: {
          // resourceName: '',
          // resourceKey: '',
          // tableName: '',
          // configType: '',
          // bz: ''
        },
        rules: {
          // resourceName: [
          //   { required: true, message: '目录名称不能为空', trigger: 'blur' }
          // ],
          // resourceKey: [
          //   { required: true, message: '资源ID不能为空', trigger: 'blur' }
          // ],
          // tableName: [
          //   { required: true, message: '目录表名不能为空', trigger: 'change' }
          // ],
          // configType: [
          //   { required: true, message: '配置类型不能为空', trigger: 'change' }
          // ]
        }
      }
    },
    computed: {
      // configTypeEnum () {
      //   return this.$store.state.creditRepair.configTypeEnum
      // }
    },
    created () {
      this.init()
    },
    methods: {
      // 选择目录按钮回到
      handleSelectBtn () {
        this.open = true
      },
      async handleSubmit () {
        const valid = await this.$refs.form.validate()
        if (valid) {
          this.btnLoading = true
          try {
            if (this.editData) {
              await updateDirConfig(this.form)
            } else {
              await createDirConfig(this.form)
            }
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('success')
            this.$emit('close')
          } catch (error) {
            console.error(error)
            this.$notice.danger({ title: '操作失败', desc: error })
          }
          this.btnLoading = false
        }
      },
      init () {
        if (this.editData) {
          this.form = { ...this.editData }
        }
      }
    }
  }
</script>

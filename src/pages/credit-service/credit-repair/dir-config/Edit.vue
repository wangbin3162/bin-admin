<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div slot="full">
          <v-title-bar label="基本信息" tipPos="left" class="mb-20"></v-title-bar>
          <b-form :model="form" ref="form" :rules="rules" :label-width="100">
            <b-row>
              <b-col span="12">
                <b-form-item label="目录名称" prop="resourceName">
                  <div flex>
                    <b-input v-model="form.resourceName" placeholder="请选择目录" disabled></b-input>
                    <b-button type="primary" plain style="flex: 0 0 auto;"
                      @click="handleSelectBtn">
                      选择目录
                    </b-button>
                  </div>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="配置类型" prop="configType">
                  <b-select v-model="form.configType">
                    <b-option v-for="(value, key) in configTypeEnum" :key="key"
                      :value="key">
                      {{ value }}
                    </b-option>
                  </b-select>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="目录表名" prop="tableName">
                  <b-input v-model="form.tableName" disabled></b-input>
                </b-form-item>
              </b-col>
              <b-col span="12">
                <b-form-item label="资源ID" prop="resourceKey">
                  <b-input v-model="form.resourceKey" disabled></b-input>
                </b-form-item>
              </b-col>
            </b-row>

            <b-form-item label="备注" prop="varDesc">
              <b-input v-model="form.bz" placeholder="请输入备注" type="textarea"></b-input>
            </b-form-item>
          </b-form>
        </div>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" @click="handleSubmit" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>

    </page-header-wrap>

    <source-info-select
      @close="open = false"
      @choose-sin="handleSelected"
      :open="open"
      paraType='S'
      :sourceRadioModel="true">
    </source-info-select>
  </div>
</template>

<script>
  import SourceInfoSelect from '../../../credit-rating/index-manage/SourceInfoSelect'
  import { createDirConfig, updateDirConfig } from '../../../../api/credit-service/credit-repair.api'

  export default {
    name: 'DirConfigEdit',
    props: [
      'title',
      'editData'
    ],
    components: {
      SourceInfoSelect
    },
    data () {
      return {
        btnLoading: false,
        open: false,
        form: {
          resourceName: '',
          resourceKey: '',
          tableName: '',
          configType: '',
          bz: ''
        },
        rules: {
          resourceName: [
            { required: true, message: '目录名称不能为空', trigger: 'blur' }
          ],
          resourceKey: [
            { required: true, message: '资源ID不能为空', trigger: 'blur' }
          ],
          tableName: [
            { required: true, message: '目录表名不能为空', trigger: 'change' }
          ],
          configType: [
            { required: true, message: '配置类型不能为空', trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      configTypeEnum () {
        return this.$store.state.creditRepair.configTypeEnum
      }
    },
    created () {
      this.init()
    },
    methods: {
      // 选择目录按钮回到
      handleSelectBtn () {
        this.open = true
      },
      // 资源选择组件单选回调
      handleSelected ({ resourceName, resourceKey, tableName }) {
        this.form.resourceKey = resourceKey
        this.form.resourceName = resourceName
        this.form.tableName = tableName
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

<template>
  <div>
    <page-header-wrap v-show="visible" show-close @on-close="close"
                      :title="`[${temp.tempName}] 测试`">
      <v-edit-wrap>
        <template slot="full">
          <b-row :gutter="20">
            <b-col span="12">
              <v-title-bar label="基础参数" class="mb-20"/>
              <b-empty v-if="params.length===0">没有配置参数</b-empty>
              <b-form v-else :model="form" ref="form" :label-width="100">
                <b-form-item v-for="item in params" :key="item.paramCode"
                             :label="item.paramName" :prop="item.paramCode"
                             :rules="{ required: true, message: `${item.paramName}不能为空`, trigger: 'blur' }">
                  <b-input v-model="form[item.paramCode]" clearable placeholder="请输入"/>
                </b-form-item>
                <b-form-item>
                  <b-button type="primary" @click="handleTest" :loading="btnLoading">测 试</b-button>
                </b-form-item>
              </b-form>
            </b-col>
            <b-col span="12">
              <v-title-bar label="执行结果" class="mb-20"/>
              <div>
                <div v-if="result">
                  <b-code-editor :value="resultJson" readonly/>
                </div>
                <b-empty v-else>暂无执行结果</b-empty>
              </div>
            </b-col>
          </b-row>
        </template>
        <!--保存提交-->
        <div slot="footer">
          <b-button @click="close">取 消</b-button>
        </div>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import * as api from '../../../../api/data-analyze/da-business-temp.api'
  import { deepCopy } from '../../../../common/utils/assist'

  export default {
    name: 'BizTestPanel',
    mixins: [commonMixin, permission],
    data() {
      return {
        visible: false,
        temp: null,
        params: null,
        form: {},
        result: null
      }
    },
    created() {
      this.reset()
    },
    computed: {
      resultJson() {
        try {
          if (!this.result) {
            return ''
          }
          return JSON.stringify(this.result, null, 2)
        } catch (e) {
          return ''
        }
      }
    },
    methods: {
      open(template, params) {
        this.temp = deepCopy(template)
        this.params = deepCopy(params)
        // 转换params为form表单对象
        this.params.forEach(p => {
          this.$set(this.form, p.paramCode, p.defaultVal)
        })
        this.visible = true
        this.$refs.form && this.$refs.form.resetFields()
      },
      close() {
        this.visible = false
        this.result = null
        this.$emit('on-close')
      },
      reset() {
        this.temp = {
          id: '',
          tempCode: '',
          tempType: '',
          tempName: '',
          tempSource: '',
          reqType: '',
          tempDesc: '',
          indices: ''
        }
        this.params = []
      },
      handleTest() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let bizId = this.temp.id
            let params = this.form
            api.testBusinessTemplate(bizId, params).then(res => {
              if (res.status === 200) {
                this.result = res.data
                this.btnLoading = false
              }
            }).catch(err => {
              this.btnLoading = false
              this.$notice.danger({ title: '错误', desc: err.message })
            })
          }
        })
      }
    }
  }
</script>

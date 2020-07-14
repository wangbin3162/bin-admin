<template>
  <div>
    <page-header-wrap :title="'编辑测试'" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息" collapse>
          <b-form ref="form" :model="form" :rules="rules" label-position="top">
            <b-form-item label="内容标题" prop="title">
              <b-input v-model="form.title" placeholder="请输入内容标题"></b-input>
            </b-form-item>

            <b-form-item label="内容摘要" prop="summary">
              <b-input v-model="form.summary" type="textarea" :autosize="{minRows: 3,maxRows: 5}"
               placeholder="请输入内容摘要">
              </b-input>
            </b-form-item>

            <div flex="box:mean">
              <b-form-item label="内容类型" class="mr-15">
                <b-select v-model="form.contentType">
                  <b-option v-for="(value, key) in conType" :key="key" :value="key">
                    {{ value }}
                  </b-option>
                </b-select>
              </b-form-item>

              <b-form-item label="发布组织" class="mr-15">
                <b-input placeholder="发布组织" disabled :value="departName"></b-input>
              </b-form-item>

              <b-form-item label="发布时间" class="mr-15">
                <b-date-picker type="datetime" placeholder="选择发布时间">
                </b-date-picker>
              </b-form-item>

              <b-form-item label="排序">
                <b-input-number v-model="form.orderNo" :min="0" placeholder="请输入序号" style="width: 100%;">
                </b-input-number>
              </b-form-item>
            </div>

            <b-form-item label="关键字">
              <b-input v-model="form.keywords" placeholder="向搜索引擎说明内容的关键字，多个以英文逗号隔开"></b-input>
            </b-form-item>

            <b-form-item label="描述">
              <b-input v-model="form.description" type="textarea" :autosize="{minRows: 1,maxRows: 5}"
               placeholder="向搜索引擎说明内容描述">
              </b-input>
            </b-form-item>

            <b-form-item label="备注">
              <b-input v-model="form.brief" type="textarea" :autosize="{minRows: 3,maxRows: 5}"
               placeholder="内容备注">
              </b-input>
            </b-form-item>
          </b-form>
        </b-collapse-wrap>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" @click="submitHandler" :loading="btnLoading">提 交</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { createContent, updateContent } from '../../../api/cms/news-mgmt.api'

  /**
   * @typedef {import('../../../api/cms/news-mgmt.api').Content} Content
   */

  export default {
    name: 'newsMgmtEdit',
    props: {
      columnId: {
        type: String,
        required: true
      },
      editData: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        btnLoading: false,
        form: {
          colId: this.columnId,
          title: '',
          summary: '',
          linkUrl: '',
          contentType: '',
          isTop: false,
          orderNo: null,
          keywords: '',
          description: '',
          source: this.$store.state.user.info.departId,
          brief: '',
          detail: ''
        },
        rules: {
          title: [
            { required: true, message: '内容标题不能为空', trigger: 'blur' }
          ],
          summary: [
            { required: true, message: '内容摘要不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapState({
        conType: state => state.newsMgmt.conType
      }),
      departName () {
        return this.$store.state.user.info.departName
      },
      isEdit () {
        return Boolean(this.editData)
      }
    },
    created () {
      this.init()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 提交按钮回调
       */
      async submitHandler () {
        this.btnLoading = true
        try {
          const valid = await this.$refs.form.validate()

          if (valid) {
             if (this.isEdit) {
               await updateContent(this.form)
             } else {
               await createContent(this.form)
             }

            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('success')
          }
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
        this.btnLoading = false
      },

      /**
       * @author haodongdong
       * @description 初始化操作，主要处理编辑时数据回显
       */
      init () {
        if (this.isEdit) {
          const editData = this.$util.deepClone(this.editData)
          this.form = editData
        }
      }
    }
  }
</script>

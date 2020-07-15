<template>
  <div>
    <page-header-wrap :title="'编辑内容'" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap v-show="view === 'baseInfo'" title="基本信息">
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
              <b-form-item label="内容类型" prop="contentType" class="mr-15">
                <b-select v-model="form.contentType">
                  <b-option v-for="(value, key) in contentType" :key="key" :value="key">
                    {{ value }}
                  </b-option>
                </b-select>
              </b-form-item>

              <b-form-item label="发布组织" class="mr-15">
                <b-input placeholder="发布组织" disabled :value="departName"></b-input>
              </b-form-item>

              <b-form-item label="排序">
                <b-input-number v-model="form.orderNo" :min="0" placeholder="请输入序号" style="width: 100%;">
                </b-input-number>
              </b-form-item>
            </div>

            <b-form-item v-if="form.contentType === 'LINK'" label="链接地址" prop="linkUrl">
              <b-input v-model="form.linkUrl" placeholder="请输入链接地址"></b-input>
            </b-form-item>

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

        <b-collapse-wrap v-show="view === 'content'" title="编辑内容">
          <rich-text v-model="form.detail" :contentId="form.id">
          </rich-text>
        </b-collapse-wrap>

        <template slot="footer">
          <b-button v-if="view === 'baseInfo'" @click="$emit('close')">取 消</b-button>
          <b-button v-if="view === 'content'" @click="backBtnHandler">返 回</b-button>
          <b-button v-if="showSaveBtn" type="primary" @click="submitHandler" :loading="btnLoading">
            保 存
          </b-button>
          <b-button v-if="showEditContentBtn" type="primary"
            @click="editContent" :loading="conBtnLoading">
            编辑内容
          </b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { createContent, updateContent } from '../../../api/cms/news-mgmt.api'
  import RichText from './RichText'

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
    components: {
      RichText
    },
    data () {
      return {
        view: 'baseInfo',
        btnLoading: false,
        conBtnLoading: false,
        form: {
          id: null,
          colId: this.columnId,
          title: '',
          summary: '',
          linkUrl: '',
          contentType: 'CONTENT',
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
          ],
          linkUrl: [
            { required: true, message: '链接地址不能为空', trigger: 'blur' }
          ],
          contentType: [
            { required: true, message: '内容类型不能为空', trigger: 'change' }
          ]
        },
        detailCache: ''
      }
    },
    computed: {
      ...mapState({
        contentType: state => state.newsMgmt.contentType
      }),
      departName () {
        return this.$store.state.user.info.departName
      },
      isEdit () {
        return Boolean(this.editData)
      },
      showSaveBtn () { // 是否显示保存按钮
        let res = false
        if (this.isEdit) {
          res = true
        } else {
          if (this.form.contentType === 'LINK') {
            res = true
          } else if (this.view === 'content') {
            res = true
          }
        }
        return res
      },
      showEditContentBtn () { // 是否显示编辑内容按钮
        return this.form.contentType === 'CONTENT' && this.view === 'baseInfo'
      }
    },
    created () {
      this.init()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 返回按钮回调
       */
      backBtnHandler () {
        this.$confirm({
          title: '提示',
          content: '未保存的内容将会丢失，确认要返回吗？',
          onOk: () => {
            this.form.detail = this.detailCache
            this.view = 'baseInfo'
          }
        })
      },

      /**
       * @author haodongdong
       * @description 提交按钮回调
       */
      async submitHandler () {
        this.btnLoading = true
        try {
          const valid = await this.$refs.form.validate()
          if (valid) {
            if (this.view === 'content') { // 编辑内容视图只调用修改接口
              await updateContent(this.form)
            } else { // 基本信息视图判断是新增还是编辑，然后调用对应接口
              if (this.isEdit) {
                await updateContent(this.form)
              } else {
                await createContent(this.form)
              }
            }
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('success')
            this.$emit('close')
          }
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
        this.btnLoading = false
      },

      /**
       * @author haodongdong
       * @description 编辑内容按钮回调，触发基本信息的保存，保存成功后切换至内容编辑视图。
       */
      async editContent () {
        this.conBtnLoading = true
        try {
          // 缓存富文本编辑器内容，用于返回时恢复默认
          this.detailCache = this.form.detail

          if (this.isEdit) {
            this.view = 'content'
          } else {
            const valid = await this.$refs.form.validate()
            if (valid) {
              const id = await createContent(this.form)
              this.form.id = id
              this.view = 'content'
            }
          }
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
        this.conBtnLoading = false
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

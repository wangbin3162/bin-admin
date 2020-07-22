<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap transparent>
        <b-collapse-wrap title="基本信息" collapse>
          <b-form ref="form" :model="form" :rules="rules" label-position="top">
            <b-form-item label="通知标题" prop="title">
              <b-input v-model="form.title" placeholder="请输入通知标题"></b-input>
            </b-form-item>

            <div flex="box:mean">
              <b-form-item label="通知类型" prop="type" class="mr-15">
                <b-select v-model="form.type">
                  <b-option v-for="(value, key) in noticeType" :key="key" :value="key">
                    {{ value }}
                  </b-option>
                </b-select>
              </b-form-item>

              <b-form-item label="发布组织" class="mr-15">
                <b-input placeholder="发布组织" disabled :value="departName"></b-input>
              </b-form-item>

              <b-form-item label="过期时间" prop="validDate">
                <b-date-picker type="datetime" placeholder="选择时间" style="padding-right: 20px;"
                 :value="form.validDate"
                 format="yyyy-MM-dd"
                 @on-change="dateStr => form.validDate = dateStr">
                </b-date-picker>
              </b-form-item>

              <b-form-item label="通知状态">
                <b-radio-group v-model="form.notifyStatus">
                  <b-radio v-for="(value, key) in noticeStatus" :key="key" :label="key">
                    <span>{{ value }}</span>
                  </b-radio>
                </b-radio-group>
              </b-form-item>
            </div>

            <b-form-item label="备注">
              <b-input type="textarea" placeholder="通知备注" :autosize=" { minRows: 2, maxRows: 4 }"></b-input>
            </b-form-item>
          </b-form>
        </b-collapse-wrap>

        <b-collapse-wrap title="通知内容" collapse>
          <rich-text v-model="form.content"></rich-text>
          <file-upload :initFileList="form.fileList"
            @files-change="filesChangeHandler">
          </file-upload>
        </b-collapse-wrap>

        <template slot="footer">
          <b-button @click="$emit('close')">取 消</b-button>
          <b-button type="primary" :loading="btnLoading" @click="submitHandler">
            提 交
          </b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { createNotice, updateNotice } from '../../../../api/cms/notice-mgmt.api'
  import RichText from './RichText'
  import FileUpload from './FileUpload'

  /**
   * @typedef {import('../../../../api/cms/notice-mgmt.api').Notice} Notice
   */

  export default {
    name: 'NoticeMgmtEdit',
    props: {
      title: {
        type: String
      },
      editData: {
        type: Object,
        default: null
      }
    },
    components: {
      RichText,
      FileUpload
    },
    data () {
      return {
        btnLoading: false,
        form: {
          id: null,
          type: '',
          title: '',
          content: '',
          files: '',
          validDate: '',
          remark: '',
          notifyStatus: 'DRAFT'
        },
        rules: {
          title: [
            { required: true, message: '通知标题不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '通知类型不能为空', trigger: 'change' }
          ],
          validDate: [
            { required: true, message: '过期时间不能为空', trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      ...mapState({
        noticeType: state => state.noticeMgmt.noticeType,
        noticeStatus: state => {
          const noticeStatus = state.noticeMgmt.noticeStatus
          const obj = {}
          Object.keys(noticeStatus).forEach(key => {
            if (key !== 'INVALID') obj[key] = noticeStatus[key]
          })
          return obj
        },
        departName: state => state.user.info.departName
      }),
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
       * @description 初始化操作，处理编辑时的赋值
       */
      init () {
        if (this.isEdit) {
          this.form = this.editData
        }
      },

      /**
       * @author haodongdong
       * @description file-upload组件files-change事件回调
       * @param {string} files 包含已上传文件id的字符串，每个id用逗号分隔
       */
      filesChangeHandler (files) {
        this.form.files = files
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
            if (this.isEdit) {
              await updateNotice(this.form)
            } else {
               await createNotice(this.form)
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
      }
    }
  }
</script>

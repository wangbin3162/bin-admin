<template>
  <div class="thumbnail">
    <b-modal v-model="open"
      title="设置新闻缩略图"
      @on-visible-change="visibleChangeHandler">

      <b-form ref="form" :model="form" :rules="rules" :label-width="70">
        <b-form-item label="缩略图" prop="thumbnailPath">
          <img-upload ref="imgUpload" funName="cms" moduleName="thumbnail"
            :echoId="form.thumbnailPath"
            @success="val => form.thumbnailPath = val"
            @clear="imgClearHandler">
            删 除
          </img-upload>
        </b-form-item>

        <b-form-item label="高度" prop="thumbnailHeight">
          <b-input-number style="width: 100%" :min="0"
            v-model="form.thumbnailHeight" placeholder="请输入缩略图高度">
          </b-input-number>
        </b-form-item>

        <b-form-item label="宽度" prop="thumbnailWidth">
          <b-input-number style="width: 100%" :min="0"
            v-model="form.thumbnailWidth" placeholder="请输入缩略图宽度">
          </b-input-number>
        </b-form-item>
      </b-form>

      <div slot="footer">
        <b-button @click="open = false">取消</b-button>
        <b-button type="primary" @click="submitHandler" :loading="btnLoading">确认</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { updateContentThumbnail, removeContentThumbnail } from '../../../../api/cms/news-mgmt.api'
  import ImgUpload from '../../../../components/ImgUpload'

  export default {
    name: 'Thumbnail',
    props: {
      value: {
        type: Boolean,
        required: true
      },
      thumbnailData: {
        type: Object,
        default: null
      }
    },
    components: {
      ImgUpload
    },
    data () {
      return {
        btnLoading: false,
        open: this.value,
        form: {
          id: this.newsId,
          thumbnailPath: null,
          thumbnailHeight: null,
          thumbnailWidth: null
        },
        rules: {
          thumbnailPath: [
            { required: true, message: '请添加缩略图', trigger: 'change' }
          ],
          thumbnailHeight: [
            { required: true, type: 'integer', message: '必须为整数', trigger: 'blur' }
          ],
          thumbnailWidth: [
            { required: true, type: 'integer', message: '必须为整数', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      value: {
        handler (newVal) {
          this.open = newVal
        }
      },
      open: {
        handler (newVal) {
          this.$emit('input', newVal)
        }
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description b-modal组件显示状态改变的回调
       * @param {boolean} visible 显示状态
       */
      visibleChangeHandler (visible) {
        if (visible) {
          this.init()
        } else {
          this.$refs.form.resetFields()
        }
      },

      /**
       * @author haodongdong
       * @description ImgUpload组件清空图片后的回调,调用删除缩略图接口
       */
      async imgClearHandler () {
        try {
          await removeContentThumbnail(this.form.id)
          this.open = false
          this.$message({ type: 'success', content: '操作成功' })
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
      },

      /**
       * @author haodongdong
       * @description 确定按钮的回调
       */
      async submitHandler () {
        this.btnLoading = true
        try {
          const valid = await this.$refs.form.validate()
          if (valid) {
            await updateContentThumbnail(this.form)
            this.$message({ type: 'success', content: '操作成功' })
            this.$emit('success')
            this.open = false
          }
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
        this.btnLoading = false
      },

      /**
       * @author haodongdong
       * @description 初始化操作，主要传递新闻id，也可用于回显
       */
      init () {
        this.form = this.thumbnailData
        this.$nextTick(() => {
          this.$refs.imgUpload.init() // 回显存在的图片
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
 .thumbnail {

 }
</style>

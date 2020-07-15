<template>
  <div class="file-upload">
    <div class="upload">
      <b-upload action="/" type="drag" :show-upload-list="false"
        :before-upload="handleUpload" :disabled="disabled">
        <div class="con" flex="dir:top main:center cross:center">
          <b-button icon="ios-add" :loading="disabled">上传附件</b-button>
        </div>
      </b-upload>
    </div>

    <div class="list ml-15">
      <b-table :columns="columns" :data="flieList" :loading="loading"
        :show-header="false" no-data-text="暂无上传附件">
        <template v-slot:fileName="{ row }">
          <b-icon name="ios-document"></b-icon>{{ row.fileName }}
        </template>

        <template v-slot:action="{ row }">
          <b-button type="text" icon="ios-trash"
            text-color="danger" :icon-style="{fontSize: '20px'}"
            @click="delBtnHandler(row.commInfoId)">
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
  import { UploadAttachments, getAttachments, removeAttachment } from '../../../../api/cms/news-mgmt.api'

  export default {
    name: 'FileUpload',
    props: {
      contentId: {
        type: String,
        default: null
      }
    },
    data () {
      return {
        disabled: false, // 用于上传时禁止点击
        loading: false,
        flieList: [],
        columns: [
          { title: 'FileName', slot: 'fileName' },
          { title: 'Action', slot: 'action', width: 50, align: 'right' }
        ]
      }
    },
    created () {
      if (this.contentId) this.getAttachments(this.contentId)
    },
    methods: {
      /**
       * @author haodongdong
       * @description 上传组件上传前的回调
       * @param {File} file
       * @returns {boolean} 返回false取消发组件默认的上传行为
       */
      handleUpload (file) {
        console.log(file)
        this.fileUpdate(this.contentId, file)
        return false
      },

      /**
       * @author haodongdong
       * @description 请求附件上传接口，上传成功后调用附件列表接口，刷新列表
       * @param {string} contentId 内容(新闻)id
       * @param {File} file 文件
       */
      async fileUpdate (contentId, file) {
        this.disabled = true
        try {
          await UploadAttachments(contentId, [file])
          await this.getAttachments(contentId)
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
        this.disabled = false
      },

      /**
       * @author haodongdong
       * @description 获取附件列表
       * @param {string} contentId 内容(新闻)id
       */
      async getAttachments (contentId) {
        this.loading = true
        try {
          const res = await getAttachments(contentId)
          this.flieList = res
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '加载附件失败', desc: error })
        }
        this.loading = false
      },

      /**
       * @author haodongdong
       * @description 附件删除按钮回调
       * @param {string} attachmentId 附件id
       */
      async delBtnHandler (attachmentId) {
        try {
          await removeAttachment(attachmentId)
          this.getAttachments(this.contentId)
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
      }

    }
  }
</script>

<style lang="stylus" scoped>
  .file-upload {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #f0f0f0;

    .upload {
      width: 115px;
      margin-left: 32px;
    }

    .list {

    }
  }
</style>

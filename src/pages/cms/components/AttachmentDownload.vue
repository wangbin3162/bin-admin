<template>
  <div class="attachment-download">
    <!-- <b-modal v-model="open"
      title="附件下载"
      :body-styles="{ padding: '0 5px 10px' }"
      footer-hide
      @on-visible-change="visibleChangeHandler"> -->

     <div class="list" v-if="fileList.length > 0">
      <span>附件下载：</span>

      <div class="table-con">
        <b-table :columns="columns" :data="fileList" :loading="loading"
          :show-header="false" no-data-text="暂无上传附件" class="mt-10">
          <template v-slot:fileName="{ row }">
            <b-icon name="ios-document"></b-icon>
            <span>{{ row.fileName }}</span>
          </template>

          <template v-slot:action="{ row }">
            <b-button type="text" icon="ios-download" title="下载"
              text-color="primary" :icon-style="{fontSize: '20px'}"
              @click="downLoadBtnHandler(row.id, row.fileName)">
            </b-button>
          </template>
        </b-table>
      </div>
    </div>

    <!-- </b-modal> -->
  </div>
</template>

<script>
  import { getAttachments } from '../../../api/cms/news.api'
  import { fileDownLoad } from '../../../api/common.api'

  export default {
    name: 'AttachmentDownload',
    props: {
      value: {
        type: Boolean,
        required: true
      },
      initFileList: { // 用于通知附件的初始化
        type: Array,
        default () {
          return []
        }
      },
      contentId: { // 用于新闻附件的初始化
        type: String,
        default: null
      }
    },
    data () {
      return {
        open: this.value,
        loading: false,
        fileList: this.initFileList,
        columns: [
          { title: 'FileName', slot: 'fileName' },
          { title: 'Action', slot: 'action', width: 90, align: 'right' }
        ]
      }
    },
    watch: {
      value (newVal) {
        this.open = newVal
      },
      open (newVal) {
        this.$emit('input', newVal)
      },
      initFileList (newVal) {
        this.fileList = newVal
      }
    },
    created () {
      if (this.contentId) this.getAttachments(this.contentId)
    },
    methods: {
      /**
       * @author haodongdong
       * @description b-modal组件显示状态改变回调
       * @param {boolean} visible
       */
      visibleChangeHandler (visible) {
        if (visible) {
          if (this.contentId) this.getAttachments(this.contentId)
        }
      },

      /**
       * @author haodongdong
       * @description 获取新闻附件列表
       * @param {string} contentId 内容(新闻)id
       */
      async getAttachments (contentId) {
        this.loading = true
        try {
          const res = await getAttachments(contentId)
          this.fileList = res
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '加载附件失败', desc: error })
        }
        this.loading = false
      },

      /**
       * @author haodongdong
       * @description 附件下载按钮的回调
       * @param {string} attachmentId 附件id
       * @param {string} fileName 附件名称
       */
      async downLoadBtnHandler (attachmentId, fileName) {
        try {
          const res = await fileDownLoad(attachmentId, 'cms', 'content_attachments')
          this.downloadFile(res, fileName)
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '下载失败', desc: error })
        }
      },

      /**
       * @author haodongdong
       * @description 触发下载的函数
       * @param {Blob} 文件的blob数据
       * @param {string} fileName 文件名
       */
      downloadFile (blob, fileName) {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName)
        } else {
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(link.href)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .attachment-download {
    .list {
      .table-con {
        margin-left: -9px;
      }
    }
  }
</style>

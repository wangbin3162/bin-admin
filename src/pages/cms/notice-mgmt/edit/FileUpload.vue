<template>
  <div class="file-upload">
    <div v-if="!showMode" class="upload">
      <b-upload action="/" type="drag" :show-upload-list="false"
        :before-upload="handleUpload" :disabled="disabled">
        <div class="con" flex="dir:top main:center cross:center">
          <b-button icon="ios-add" :loading="disabled">上传附件</b-button>
        </div>
      </b-upload>
    </div>

    <div class="list ml-15">
      <b-table :columns="columns" :data="fileList"
        :show-header="false" no-data-text="暂无上传附件">
        <template v-slot:fileName="{ row }">
          <b-icon name="ios-document"></b-icon>{{ row.fileName }}
        </template>

        <template v-slot:action="{ row }">
          <b-button type="text" icon="ios-download" title="下载"
            text-color="primary" :icon-style="{fontSize: '20px'}"
            @click="downLoadBtnHandler(row.id, row.fileName)">
          </b-button>

          <b-button v-if="!showMode" type="text" icon="ios-trash"
            text-color="danger" :icon-style="{fontSize: '20px'}"
            @click="delBtnHandler(row.id)">
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
  import { UploadNotifyFile, removeNotifyFile } from '../../../../api/cms/notice-mgmt.api'
  import { fileDownLoad } from '../../../../api/import-export.api'

  export default {
    name: 'FileUpload',
    props: {
      initFileList: {
        type: Array,
        default () {
          return []
        }
      },
      showMode: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        disabled: false, // 用于上传时禁止点击
        fileList: this.initFileList,
        columns: [
          { title: 'FileName', slot: 'fileName' },
          { title: 'Action', slot: 'action', width: 90, align: 'right' }
        ]
      }
    },
    watch: {
      initFileList (newVal) {
        this.fileList = newVal
      },
      fileList (newVal) {
        const files = []
        newVal.forEach(item => {
          files.push(item.id)
        })
        this.$emit('files-change', files.join(','))
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description 上传组件上传前的回调
       * @param {File} file
       * @returns {boolean} 返回false取消发组件默认的上传行为
       */
      handleUpload (file) {
        this.fileUpdate(file)
        return false
      },

      /**
       * @author haodongdong
       * @description 请求附件上传接口，刷新列表
       * @param {File} file 文件
       */
      async fileUpdate (file) {
        this.disabled = true
        try {
          const res = await UploadNotifyFile(file)
          this.fileList.push(res)
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '操作失败', desc: error })
        }
        this.disabled = false
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
       * @description 附件删除按钮回调
       * @param {string} attachmentId 附件id
       */
      async delBtnHandler (attachmentId) {
        this.$confirm({
          title: '删除',
          content: '确定要删除附件？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              await removeNotifyFile(attachmentId)
              const index = this.fileList.findIndex(item => item.id === attachmentId)
              this.fileList.splice(index, 1)
              this.$message({ type: 'success', content: '操作成功' })
            } catch (error) {
              console.error(error)
              this.$notice.danger({ title: '操作失败', desc: error })
            }
            this.$modal.remove()
          }
        })
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
  .file-upload {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #f0f0f0;

    .upload {
      width: 115px;
      margin-left: 32px;
      margin-bottom: 5px;
    }

    .list {

    }
  }
</style>

<template>
  <div style="width: 50%;">
    <div flex>
      <b-upload action="/" multiple type="drag" :before-upload="handleUpload">
        <b-button type="primary" plain size="small">添加</b-button>
      </b-upload>
      <div class="ml-5">
        <b-button type="primary" plain size="small" @click="handleTempDownlodBtn">申请模板下载</b-button>
      </div>
    </div>

    <!-- 已经上传的附件列表 -->
    <div v-for="item in attachments" :key="item.id">
      <div flex="main:justify">
        <span>{{ item.fileName }}</span>
        <b-button type="text" @click="handleDlBtn(item)">下载</b-button>
      </div>
    </div>
    <!-- 待上传的附件列表 -->
    <div v-for="(item, index) in fileList" :key="index">
      <div flex="main:justify">
        <span>{{ item.name }}</span>
        <b-button type="text" @click="handleDeleteBtn(index)">删除</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Util from '../../../../common/utils/util'
  import { downLoadTemplate, downLoadAttach } from '../../../../api/credit-service/credit-repair.api'

  export default {
    name: 'RepairApplyAttachList',
    props: {
      attachments: { // 已上传的附件
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        fileList: []
      }
    },
    watch: {
      fileList: {
        handler (newVal, oldVal) {
          this.$emit('files-change', newVal)
        },
        immediate: true
      }
    },
    created () {

    },
    methods: {
      handleUpload (file) {
        this.fileList.push(file)
        return false
      },
      // 模板下载按钮回调
      async handleTempDownlodBtn () {
        try {
          const res = await downLoadTemplate()
          console.log(res)
          this.downloadFile(res, '申请模板')
        } catch (error) {
          this.$notice.danger({ title: '下载失败', desc: error })
        }
      },
      // 附件列表下载按钮回调
      async handleDlBtn (attachments) {
        try {
          const res = await downLoadAttach(attachments.id)
          console.log(res)
          this.downloadFile(res, attachments.fileName)
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '下载失败', desc: error })
        }
      },
      // 删除按钮回调
      handleDeleteBtn (index) {
        this.fileList.splice(index, 1)
      },
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

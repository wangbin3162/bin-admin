<template>
  <div class="file-upload-wrap" :style="{width:isShow?'100%':'25%'}">
    <template v-if="!isShow">
      <div class="file-upload">
        <input
          ref="input"
          type="file"
          class="file-input"
          @change="handleChange"
          :multiple="multiple"
          :accept="accept">
        <slot>
          <b-button type="primary" icon="ios-open" plain @click="handleClick">选择文件</b-button>
        </slot>
        <b-button v-if="fileList.length>0&&!result"
                  type="success" plain :loading="loadingStatus" icon="ios-cloud-upload"
                  @click="handleUpload">上传
        </b-button>
      </div>
      <div v-if="tip&&fileList.length===0" class="file-tip">{{tip}}</div>
      <ul class="file-list">
        <li v-for="(file,index) in fileList" :key="index" class="file-item upload">
        <span :class="['file-name',{success:file.id&&result}]" @click="handleDownload(file.id,file.name)">
          <b-icon :name="format(file)"></b-icon>&nbsp;{{ file.name }}
        </span>
          <b-icon v-if="!result" name="ios-close" class="list-item-remove" @click.native="handleRemove(index)"/>
          <b-icon v-else name="ios-checkmark-circle-outline" class="list-item-success"/>
        </li>
      </ul>
    </template>
    <ul v-else class="file-list">
      <li v-for="(file,index) in fileList" :key="index" class="file-item">
        <span :class="['file-name',{success:file.id&&result}]" @click="handleDownload(file.id,file.name)"
              :title="`下载: ${file.name}`">
          <b-icon :name="format(file)"></b-icon>&nbsp;{{ file.name }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
  import { attachmentUpload, downloadAttachment, getAttachmentList } from '../../../api/data-manage/attachment.api'
  import Util from '../../../common/utils/util'
  import Emitter from 'bin-ui/src/mixins/emitter'

  export default {
    name: 'FileUpload',
    mixins: [Emitter],
    props: {
      value: {
        type: String
      },
      resourceKey: {
        type: String,
        required: true
      },
      multiple: {
        type: Boolean,
        default: true
      },
      accept: {
        type: String
      },
      isShow: {
        type: Boolean
      },
      tip: String,
      maxSize: { // kb
        type: Number
      }
    },
    data() {
      return {
        fileList: [],
        loadingStatus: false,
        result: false, // 上传成功失败标识
        ids: ''
      }
    },
    watch: {
      value: {
        handler(val) {
          this.ids = val
          // 如果有ids，且列表为空，则表示回显状态，需要查询显示列表
          if (val.length > 0 && this.fileList.length === 0) {
            this.handleSearchFileList()
          }
        },
        immediate: true
      }
    },
    methods: {
      // =======通用上传控件函数============ //
      format(file) {
        const format = file.name.split('.').pop().toLocaleLowerCase() || ''
        let type = 'ios-document-outline'
        if (['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'].indexOf(format) > -1) {
          type = 'ios-image'
        }
        if (['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'].indexOf(format) > -1) {
          type = 'ios-film'
        }
        if (['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'].indexOf(format) > -1) {
          type = 'ios-musical-notes'
        }
        if (['doc', 'txt', 'docx', 'pages', 'epub', 'pdf'].indexOf(format) > -1) {
          type = 'ios-document'
        }
        if (['numbers', 'csv', 'xls', 'xlsx'].indexOf(format) > -1) {
          type = 'ios-stats'
        }
        if (['keynote', 'ppt', 'pptx'].indexOf(format) > -1) {
          type = 'ios-videocam'
        }
        return type
      },
      handleClick() {
        this.$refs.input.click()
      },
      handleRemove(index) {
        this.fileList.splice(index, 1)
        if (this.fileList.length === 0) {
          this.emitValue('')
        }
      },
      handleChange(e) {
        const files = e.target.files
        if (!files) {
          return
        }
        // 转换文件列表对象为数组
        let oldList = Array.prototype.slice.call(files)
        if (this.maxSize && this.maxSize !== 0) {
          this.fileList = oldList.filter(i => i.size < this.maxSize * 1024)
          if (this.fileList.length !== oldList.length) {
            this.$message({ type: 'warning', content: '超出最大限制的文件已被过滤！' })
          }
        } else {
          this.fileList = oldList
        }
        if (this.fileList.length === 0) {
          this.emitValue('')
        }
        this.loadingStatus = false
        this.result = false // 上传成功失败标识
      },
      // =======上传业务相关============ //
      handleUpload() {
        let promiseUpload = []
        this.fileList.forEach(file => {
          promiseUpload.push(attachmentUpload(this.resourceKey, file))
        })
        this.loadingStatus = true
        Promise.all(promiseUpload).then(resList => {
          // 判断上传成功与否 所有的都成功
          this.result = resList.every(resp => resp.data.code === '0')
          if (this.result) {
            this.ids = resList.map(resp => resp.data.data).join(',')
            this.emitValue(this.ids)
          }
          this.loadingStatus = false
        })
      },
      emitValue(ids) {
        this.$emit('input', ids)
        this.dispatch('BFormItem', 'form-change', ids)
      },
      // 回显数据
      handleSearchFileList() {
        getAttachmentList(this.ids).then(res => {
          if (res.status === 200) {
            this.fileList = res.data.rows.map(file => ({
              id: file.id,
              name: file.fileName,
              fileUrl: file.fileUrl
            }))
            this.result = true
          }
        })
      },
      // 下载回显数据
      handleDownload(id, name) {
        if (!id) {
          return
        }
        if (!this.downloadEvent) { // 点击下载事件，需要函数防抖动
          this.downloadEvent = this.$util.debounce((id, name) => {
            downloadAttachment(id).then(res => {
              if (res.status === 200) {
                Util.downloadFile(res.data, name)
              }
            })
          }, 1000)
        }
        this.downloadEvent(id, name)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .file-upload-wrap {
    width: 25%;
  }
  .file-upload input[type="file"] {
    display: none;
  }
  .file-tip {
    width: 100%;
    padding: 4px 22px 0 4px;
    margin-top: 4px;
    color: #515a6e;
    line-height: 1.5em;
    font-size: 12px;
  }
  .file-list {
    margin-top: 4px;
  }
  .file-item {
    position: relative;
    width: 100%;
    padding: 4px 22px 4px 4px;
    color: #515a6e;
    border-radius: 2px;
    line-height: 1.5em;
    font-size: 12px;
    -webkit-transition: background-color 0.2s ease-in-out;
    transition: background-color 0.2s ease-in-out;
    overflow: hidden;
    > span i {
      display: inline-block;
      vertical-align: -1px;
      width: 12px;
      height: 12px;
      color: #515a6e;
      text-align: center;
    }
    .list-item-remove {
      position: absolute;
      right: 4px;
      top: 4px;
      opacity: 0;
      font-size: 20px;
      cursor: pointer;
      color: #999;
      -webkit-transition: all 0.2s ease;
      transition: all 0.2s ease;
      &:hover {
        color: #666;
      }
    }
    .list-item-success {
      position: absolute;
      right: 4px;
      top: 4px;
      font-size: 20px;
      color: #52c41a;
    }
    &.upload:hover {
      background: #f3f3f3;
      .list-item-remove {
        opacity: 1;
      }
    }
    .file-name {
      display: inline-block;
      vertical-align: middle;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis
      .success:hover {
        color: #1089ff;
        cursor: pointer;
      }
    }
  }
</style>

<template>
  <div style="display: inline-block;" class="ml-15">
    <b-button  icon="ios-exit" @click="handleBatchImport">
      <slot>批量导入</slot>
    </b-button>
    <!--批量导入弹窗-->
    <b-modal v-model="batchDialog"
             :title="$slots.default?$slots.default[0].text:'批量导入'"
             :styles="{top: '200px',width:'350px'}"
             class="file-dialog">
      <b-upload action="/" :before-upload="handleUpload">
        <b-button type="primary" plain icon="ios-pricetags">选择文件</b-button>
      </b-upload>
      <div v-if="file !== null" flex="main:justify" class="file-list">
        <div class="f-color-666">
          <b-icon name="ios-document"></b-icon>
          {{ file.name }}
        </div>
        <div class="close">
          <b-icon name="ios-close-circle-outline" style="cursor: pointer;" @click.native="file=null"></b-icon>
        </div>
      </div>
      <div slot="footer">
        <b-button type="primary"  @click="handleImport" :loading="uploadLoading">
          {{ uploadLoading ? '导入中' : '导入' }}
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { commDataImport } from '../../api/import-export.api'

  export default {
    name: 'VBatchImport',
    props: {
      moduleName: {
        type: String,
        validate(val) {
          return ['SysUserController', 'SysDepartController'].indexOf(val) > -1
        },
        required: true
      },
      precondition: {
        type: Boolean,
        default: true
      },
      currentTreeNode: {
        type: Object
      }
    },
    data() {
      return {
        batchDialog: false,
        file: null,
        uploadLoading: false
      }
    },
    methods: {
      // 批量上传按钮事件
      handleBatchImport() {
        if (this.precondition) { // 有前置条件需要判断前置对象是否存在
          if (!this.currentTreeNode) {
            this.$message({ type: 'danger', content: '请选择左侧组织再导入' })
            return
          }
        }
        this.batchDialog = true
      },
      // 上传组件钩子
      handleUpload(file) {
        const fileFormat = file.name.split('.').pop().toLocaleLowerCase()
        if (fileFormat !== 'xlsx') {
          this.$message({ type: 'danger', content: '请选择后缀为xlsx的文件！' })
          return false
        }
        this.file = file
        return false
      },
      // 确认进行上传操作
      handleImport() {
        if (this.file) {
          this.uploadLoading = true
          const id = this.precondition ? this.currentTreeNode.id : ''
          commDataImport(this.file, this.moduleName, id)
            .then(res => {
              if (res.status === 200 && res.data.code === '0') {
                this.$message({ type: 'success', content: '导入成功，请查看[导入/导出记录]。' })
              } else {
                this.$notice.danger({ title: '操作错误', desc: res.data.message })
              }
              this.file = null
              this.uploadLoading = false
              this.batchDialog = false
            })
            .catch(() => {
              this.file = null
              this.uploadLoading = false
              this.batchDialog = false
            })
        } else {
          this.batchDialog = false
        }
      }
    }
  }
</script>

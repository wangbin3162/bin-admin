<template>
  <b-button type="text" @click="handleExport">
    <slot>导出</slot>
  </b-button>
</template>

<script>
  import { commDataExport } from '../../api/import-export.api'

  export default {
    name: 'VBatchExport',
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
    methods: {
      // 导出
      handleExport() {
        if (!this.exportEvent) { // 导出事件，需要函数防抖动
          this.exportEvent = this.$util.debounce(() => {
            const id = this.precondition ? this.currentTreeNode.id : ''
            commDataExport(this.moduleName, id).then(res => {
              if (res.status === 200 && res.data.code === '0') {
                this.$message({ type: 'success', content: '导出成功，请查看[导入/导出记录]。' })
              }
            })
          }, 1000)
        }
        this.exportEvent()
      }
    }
  }
</script>

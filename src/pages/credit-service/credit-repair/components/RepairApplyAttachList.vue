<template>
  <div style="width: 50%;">
    <b-upload action="/" multiple type="drag" :before-upload="handleUpload">
      <b-button type="primary" plain size="small">添加</b-button>
    </b-upload>
    <div v-for="(item, index) in fileList" :key="index">
      <div flex="main:justify">
        <span>{{ item.name }}</span>
        <b-button type="text" @click="handleDeleteBtn(index)">删除</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RepairApplyAttachList',
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
      // 删除按钮回调
      handleDeleteBtn (index) {
        this.fileList.splice(index, 1)
      }
    }
  }
</script>

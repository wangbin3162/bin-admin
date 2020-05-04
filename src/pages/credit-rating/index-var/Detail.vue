<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div>
          <v-key-label label="名称">名称</v-key-label>
          <v-key-label label="编码">编码</v-key-label>
          <v-key-label label="变量类型">变量类型</v-key-label>
          <v-key-label label="数据类型">数据类型</v-key-label>
          <v-key-label label="模板类型">模板类型</v-key-label>
          <v-key-label label="描述" is-bottom>描述</v-key-label>
        </div>
        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  export default {
    name: 'IndexVarDetail',
    props: ['title'],
    data () {
      return {}
    },
    created () {

    },
    methods: {

    }
  }
</script>

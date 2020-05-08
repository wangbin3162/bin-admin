<template>
  <div>
    <page-header-wrap :title="title" show-close @on-close="$emit('close')">
      <v-edit-wrap>
        <div>
          <v-key-label label="变量名称" is-half is-first></v-key-label>
          <v-key-label label="变量编码" is-half></v-key-label>
          <v-key-label label="变量类型" is-half is-first></v-key-label>
          <v-key-label label="数据类型" is-half></v-key-label>
          <v-key-label label="变量模板" is-half is-first></v-key-label>
          <v-key-label label="状态" is-half></v-key-label>
          <v-key-label label="摘要" is-bottom></v-key-label>
        </div>
        <template slot="full">
          <b-divider align="left">参数项</b-divider>
          <b-table :columns="columns" :data="detail.params"></b-table>
        </template>
        <template slot="footer">
          <b-button @click="$emit('close')">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import { getIndexVarDetail } from '../../../api/credit-rating/index-var.api'

  export default {
    name: 'IndexVarDetail',
    props: ['title', 'id'],
    data () {
      return {
        detail: {},
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '参数名称', key: 'paraName' },
          { title: '参数编码', key: 'paraCode' },
          { title: '参数类型', key: 'paraType' },
          { title: '描述', key: 'paraDesc' }
        ]
      }
    },
    created () {
      this.getIndexVarDetail()
    },
    methods: {
      async getIndexVarDetail () {
        try {
          const res = await getIndexVarDetail(this.id)
          this.detail = res
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
</script>

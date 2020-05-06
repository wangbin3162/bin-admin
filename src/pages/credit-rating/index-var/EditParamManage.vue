<template>
  <div class="edit-param-manage">
    <v-table-wrap>
      <h3 style="margin: 20px 0;">参数管理</h3>
      <b-table :columns="columns" :data="list">
        <template v-slot:name="scope">
          <b-input v-model="scope.row.name"></b-input>
        </template>
        <template v-slot:type="scope">
          <b-select v-model="scope.row.type" append-to-body>
            <b-option :value="0">资源信息</b-option>
            <b-option :value="1">信息项</b-option>
          </b-select>
        </template>
        <template v-slot:sort>
          <v-sort-arrow></v-sort-arrow>
        </template>
        <template v-slot:action>
          <b-button type="text">删除</b-button>
        </template>
      </b-table>
      <b-button style="width: 100%; margin-top: 10px;" type="primary" plain>+ 添加</b-button>
    </v-table-wrap>
  </div>
</template>

<script>
  export default {
    name: 'IndexVarEditParamManage',
    data () {
      return {
        list: [
          { name: 'test', type: 0, desc: '' }
        ],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '参数名称', slot: 'name' },
          { title: '参数类型', slot: 'type' },
          { title: '描述', key: 'desc' },
          { title: '排序', slot: 'sort' },
          { title: '操作', slot: 'action', width: 120 }
        ]
      }
    },
    created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
.edit-param-manage {

}
</style>

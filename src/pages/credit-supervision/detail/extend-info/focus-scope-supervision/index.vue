<template>
  <div class="focus-scope-supervision">
    <b-card head-tip shadow="never"
      :bordered="false" divider="no"
      :body-style="{ padding: 0 }">
      <template v-slot:header>
          <div flex="main:justify cross:center">
            <span>重点领域监管</span>
          </div>
      </template>

      <b-table :columns="columns" :data="list">
        <template v-slot:action>
          操作
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
  export default {
    name: 'FocusScopeSupervision',
    data () {
      return {
        columns: [
          { title: '资源名称', key: '' },
          { title: '创建部门', key: '' },
          { title: '创建日期', key: '' },
          { title: '操作', slot: 'action', width: 70 }
        ],
        list: []
      }
    },
    created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
 .focus-scope-supervision {

 }
</style>

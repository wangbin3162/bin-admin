<template>
  <div class="recent-dynamic">
    <b-card shadow="never">
      <template v-slot:header>
          <div flex="main:justify cross:center">
            <span>企业关联图谱</span>
            <b-button type="text">
              全屏查看 >>
            </b-button>
          </div>
      </template>

      <div v-for="o in 4" :key="o" class="text item">
        {{'这是内容区域 ' + o }}
      </div>
    </b-card>

    <b-card head-tip shadow="never"
      :bordered="false" divider="no"
      :body-style="{ padding: 0 }"
      class="mt-20">
      <template v-slot:header>
          <div flex="main:justify cross:center">
            <span>近期动态</span>
            <span>
              近1月内动态
            </span>
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
    name: 'RecentDynamic',
    data () {
      return {
        columns: [
          { title: '资源名称', key: '' },
          { title: '资源性质', key: '' },
          { title: '创建部门', key: '' },
          { title: '创建日期', key: '' },
          { title: '操作', slot: 'action', width: 70 }
        ],
        list: []
      }
    },
    created () {
      return {

      }
    },
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
 .recent-dynamic {

 }
</style>

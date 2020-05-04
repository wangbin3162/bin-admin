<template>
  <div>
    <b-table :columns="columns" :data="list">
      <template v-slot:action>
        <b-button type="text">选择</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
  export default {
    name: 'IndexManageSourceInfo',
    props: [],
    data () {
      return {
        list: [
          {
            name: '参数名称',
            desc: '参数描述',
            type: '参数类型'
          }
        ],
        columns: [
          {
            type: 'expand',
            width: 50,
            render: () => {
              return (
                <div class="test">
                  <b-input></b-input>
                </div>
              )
            }
          },
          { title: '参数名称', key: 'name' },
          { title: '参数描述', key: 'desc' },
          { title: '参数类型', key: 'type' },
          { title: '参数名称', slot: 'action' }
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
.test {
  width: 40%;
}
</style>

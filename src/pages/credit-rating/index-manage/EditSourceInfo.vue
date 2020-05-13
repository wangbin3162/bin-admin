<template>
  <div>
    <b-table :columns="columns" :data="list">
      <template v-slot:paraType="{ row }">
        {{ paramTypeEnum[row.paraType] }}
      </template>

      <template v-slot:defaultValue="{ index }">
        <b-input v-model="list[index].defaultValue"></b-input>
      </template>

      <template v-slot:action="{ row }">
        <b-button type="text" @click="openSourceInfoSelect(row)">+ 配置资源</b-button>
      </template>
    </b-table>

    <b-button @click="open = true">click</b-button>

    <!-- 资源配置弹框 -->
    <edit-source-info-select
      @close="open = false"
      :open="open"
      :paraType="paraType">
    </edit-source-info-select>
  </div>
</template>

<script>
  import { getEvalParamType } from '../../../api/enum.api'
  import EditSourceInfoSelect from './EditSourceInfoSelect'

  export default {
    name: 'IndexManageSourceInfo',
    props: {
      params: {
        type: Array
      }
    },
    components: {
      EditSourceInfoSelect
    },
    data () {
      return {
        open: false, // 配置资源弹框
        paramTypeEnum: {}, // 参数类型枚举
        list: [],
        columns: [
          {
            type: 'expand',
            width: 50,
            render: () => {
              return (
                <div class="test">
                  <b-input value={this.cache} onInput={this.input}></b-input>
                </div>
              )
            }
          },
          { type: 'index', width: 50, align: 'center' },
          { title: '参数名称', key: 'paraName', align: 'center' },
          { title: '参数类型', slot: 'paraType', align: 'center' },
          { title: '参数描述', key: 'paraDesc', align: 'center', ellipsis: true, tooltip: true },
          { title: '缺省值', slot: 'defaultValue', align: 'center' },
          { title: '参数名称', slot: 'action', align: 'center' }
        ],
        paraType: null // 配置资源弹框组件使用，参数类型
      }
    },
    watch: {
      params: {
        handler (newVal, oldVal) {
          this.list = this.initList(newVal)
        },
        immediate: true
      }
    },
    created () {
      this.getEvalParamType()
    },
    methods: {
      // 配置资源按钮回调
      openSourceInfoSelect (row) {
        this.paraType = row.paraType
        this.open = true
      },
      // 获取所需枚举值
      async getEvalParamType () {
        try {
          const res = await getEvalParamType()
          this.paramTypeEnum = res
        } catch (error) {

        }
      },
      // 初始化需要的数据结构
      initList (paramList) {
        const list = [...paramList]
        for (const item of list) {
          // 扩展所需提交的字段
          if (item.paraValue === undefined) {
            item.paraValue = ''
          }
          if (item.defaultValue === undefined) {
            item.defaultValue = ''
          }
        }
        return list
      }
    }
  }
</script>

<style lang="stylus" scoped>
.test {
  width: 40%;
}
</style>

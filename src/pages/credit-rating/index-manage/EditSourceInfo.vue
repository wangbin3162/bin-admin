<template>
  <div>
    <b-table :columns="columns" :data="list" @on-expand="handleExpand">
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

    <b-button @click="test">click</b-button>
    <!-- 资源配置弹框 -->
    <edit-source-info-select
      @close="open = false"
      @choose-mul="handleChooseMul"
      @choose-sin="handleChooseSin"
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
        map: new Map(),
        open: false, // 配置资源弹框
        paramTypeEnum: {}, // 参数类型枚举
        list: [],
        columns: [
          {
            type: 'expand',
            width: 50,
            render: () => {
              return (
                <div class="expandRow">
                  <div>
                    所选资源 清空 新增
                  </div>
                  <div class="table-con">
                    <template>
                      ssss
                    </template>
                  </div>
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
        paraType: null, // 配置资源弹框组件使用，参数类型
        rowId: null // 存储点击配置资源行的id
      }
    },
    watch: {
      params: { // 观察变量选择带来的参数变动
        handler (newVal, oldVal) {
          this.list = this.initList(newVal)
          console.log(newVal)
          console.log(this.map)
        },
        immediate: true
      }
    },
    created () {
      this.getEvalParamType()
    },
    methods: {
      // 行展开状态回调
      handleExpand (row, status) {
        console.log(row)
        console.log(status)
        if (status) {
          // 获取当前展开行的resourceKey
          const resKeys = this.map.get(row.id)
          console.log('resKeys', resKeys)
        }
      },
      // 配置资源按钮回调
      openSourceInfoSelect (row) {
        this.rowId = row.id // 当前行唯一参数编码
        this.paraType = row.paraType
        this.open = true
      },
      // 资源组件 多选回调
      handleChooseMul (arr) {
        console.log('多选回调', arr)
        const resKeyList = []
        for (const item of arr) {
          resKeyList.push(item.resourceKey)
        }
        this.map.set(this.rowId, resKeyList) // 保存每一行所获取的resourceKey
      },
      // 资源组件 单选回调
      handleChooseSin ({ fieldName, fieldTitle, dataType, resourceKey }) {
        console.log('单选回调', { fieldName, fieldTitle, dataType, resourceKey })
        // 保存每一行所获取的fieldName:resourceKey，信息项只有一条资源数据
        this.map.set(this.rowId, [{ fieldName, fieldTitle, dataType, resourceKey }])
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
          this.map.set(item.id, []) // 构建map，用于保存对应行所获取的resourceKey
        }
        return list
      },
      test () {

      }
    }
  }
</script>

<style lang="stylus" scoped>
.expandRow {
  // width: 40%;
}
</style>

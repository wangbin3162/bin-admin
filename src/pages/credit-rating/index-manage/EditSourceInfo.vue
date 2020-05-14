<template>
  <div class="edit-source-info">
    <b-table id="customTable" :columns="columns" :data="list" @on-expand="handleExpand">
      <template v-slot:paraType="{ row }">
        {{ paramTypeEnum[row.paraType] }}
      </template>

      <template v-slot:defaultValue="{ index }">
        <b-input v-model="list[index].defaultValue"></b-input>
      </template>

      <template v-slot:action="{ row, index }">
        <b-button type="text" @click="openSourceInfoSelect(row, index)">+ 配置资源</b-button>
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
      resources: {
        type: Array
      }
    },
    components: {
      EditSourceInfoSelect
    },
    data () {
      return {
        arr: [1, 2, 3],
        dataTypeMap: {
          string: '字符型',
          number: '数值型',
          money: '货币型',
          boolean: '逻辑型',
          date: '日期型',
          datetime: '日期时间型',
          text: '备注型'
        },
        map: new Map(),
        open: false, // 配置资源弹框
        paramTypeEnum: {}, // 参数类型枚举
        list: [], // 渲染table的list
        columns: [
          {
            type: 'expand',
            width: 50,
            className: 'expand-custom-column', // 用于查找需要点击的列的自定义class
            render: (h, { row, index }) => {
              // 这里渲染函数如果添加参数，则jsx内的class会脱离于当前样式作用域 <style lang="stylus" scoped>
              // 需要去除scoped样式才生效
              let sourceInfoTemplate = <div class="table-con">
                    <b-row class="title">
                      <b-col span={5}>资源名称</b-col>
                      <b-col span={5}>主题类别</b-col>
                      <b-col span={5}>资源性质</b-col>
                      <b-col span={5}>描述</b-col>
                      <b-col span={4}></b-col>
                    </b-row>

                    <div class="row">
                      {
                        this.arr.map(item => {
                          return (
                            <b-row>
                              <b-col span={5}>资源名称</b-col>
                              <b-col span={5}>主题类别</b-col>
                              <b-col span={5}>资源性质</b-col>
                              <b-col span={5}>描述</b-col>
                              <b-col span={4} style="text-align: right">
                                <b-button type="text" size="mini" onClick={() => this.remove()}>移除</b-button>
                              </b-col>
                            </b-row>
                          )
                        })
                      }
                    </div>
                  </div>
              let infoItemTempLate = <div class="table-con">
                  <b-row class="title">
                    <b-col span={5}>信息项名称</b-col>
                    <b-col span={5}>标题</b-col>
                    <b-col span={5}>数据类型</b-col>
                    <b-col span={5}>所属资源</b-col>
                    <b-col span={4}></b-col>
                  </b-row>

                  <div class="row">
                    {
                      Object.keys(this.list[index].info).map(key => {
                        return (
                          <b-row>
                            <b-col span={5}>{this.list[index].info[key].fieldName}</b-col>
                            <b-col span={5}>{this.list[index].info[key].fieldTitle}</b-col>
                            <b-col span={5}>{this.dataTypeMap[this.list[index].info[key].dataType]}</b-col>
                            <b-col span={5}>{this.list[index].info[key].resourceName}</b-col>
                            <b-col span={4} style="text-align: right">
                              <b-button type="text" disabled size="mini" onClick={() => this.remove()}>移除</b-button>
                            </b-col>
                          </b-row>
                        )
                      })
                    }
                  </div>
                </div>
              const template = row.paraType === 'S' ? sourceInfoTemplate : infoItemTempLate
              return (
                <div class="expandRow">
                  <div class="header" flex="main:justify">
                    <h4>
                      { row.paraType === 'S' ? '所选资源信息' : '所选信息项'}
                    </h4>
                    <span onClick={this.clearAll}><b-icon name="ios-trash"></b-icon> 清空</span>
                  </div>
                  { template }
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
        rowId: null, // 存储点击配置资源行的id
        rowIndex: 0, // 当前行index
        domList: [] // 存储获取的用于点击的可展开列的dom集合
      }
    },
    watch: {
      resources: { // 观察变量选择带来的参数变动
        handler (newVal, oldVal) {
          this.list = this.initList(newVal)
          console.log('resources', this.list)
          this.$nextTick(() => { // 数据变动后获取需要点击的dom元素，并默认展开第1行
            this.getExpandColumn()
            this.hackClick(0)
          })
        },
        immediate: true
      },
      list: {
        handler (newVal) {
          this.$emit('data-change', this.list)
        },
        immediate: true,
        deep: true
      }
    },
    created () {
      this.getEvalParamType()
    },
    methods: {
      // 行展开状态回调
      handleExpand (row, status) {
        // console.log(row)
        // console.log(status)
        // if (status) {
        //   // 获取当前展开行的resourceKey
        //   const resKeys = this.map.get(row.id)
        //   console.log('resKeys', resKeys)
        // }
      },
      // 配置资源按钮回调
      openSourceInfoSelect (row, index) {
        this.rowIndex = index // 保存点击行的index
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
        // 把数据填充到对应row的字段中
        this.list[this.rowIndex].paraValue = resKeyList.join(',')
        this.hackClick(this.rowIndex) // 回调后展开对应行
      },
      // 资源组件 单选回调
      handleChooseSin ({ fieldName, fieldTitle, dataType, resourceName, resourceKey }) {
        console.log('单选回调', { fieldName, fieldTitle, dataType, resourceName, resourceKey })
        // this.map.set(this.rowId, [{ fieldName, fieldTitle, dataType, resourceName, resourceKey }])
        // 把数据填充到对应row的字段中
        const obj = this.list[this.rowIndex]
        if (obj.paraValue !== '') this.$delete(obj.info, obj.paraValue) // 用于更新显示
        obj.paraValue = `${fieldName}:${resourceKey}` // 更新提交的字段
        this.$set(obj.info, obj.paraValue, { fieldName, fieldTitle, dataType, resourceName }) // 更新显示信息
        this.hackClick(this.rowIndex) // 回调后展开对应行
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
      initList (resources) {
        const list = JSON.parse(JSON.stringify(resources))
        for (const item of list) {
          // 扩展所需提交的字段
          if (item.paraValue === undefined) {
            item.paraValue = ''
          }
          if (item.defaultValue === undefined) {
            item.defaultValue = ''
          }
          if (item.source === undefined) {
            item.source = {}
          }
          if (item.info === undefined) {
            item.info = {}
          }
          if (item.paraType === 'I') {
            this.map.set(item.id, item.info) // 构建map，用于保存对应行所获取的resourceKey
          } else {
            this.map.set(item.id, item.source) // 构建map，用于保存对应行所获取的resourceKey
          }
        }
        return list
      },
      clearAll () {
        console.log('clearAll')
      },
      remove () {
        console.log('remove')
      },
      // 获取用于点击的可展开列的dom元素集合
      getExpandColumn () {
        this.domList = []
        const table = document.getElementById('customTable')
        const expandColumnList = table.getElementsByClassName('expand-custom-column')
        for (const item of expandColumnList) {
          const el = item.getElementsByTagName('div')[0].getElementsByTagName('div')[0]
          this.domList.push(el)
        }
        this.domList.shift() // 去除标题中的列
      },
      // hack的方式，使用原生js的click()主动触发对应行的展开操作
      hackClick (index) {
        if (this.domList.length > 0) {
          // 阻止bin-ui自身的报错，猜测可能是bin-in的dom渲染没有结束
          // 或者是任务队列没执行完触发click导致没获取的需要的数据而json报错
          setTimeout(() => {
            const el = this.domList[index]
            const str = el.className
            // 已展开则不点击
            if (!str.includes('bin-table-cell-expand-expanded')) el.click()
          }, 0)
        }
      },
      test () {

      }
    }
  }
</script>

<style lang="stylus">
.edit-source-info {
  .expandRow {
    .header {
      font-size: 13.5px;
      span {
        cursor: pointer;
      }
    }
    .table-con {
      margin-top: 10px;
      font-size: 13px;

      .title {
        color: #909399;
        // text-align: center;
      }
      .row {
        margin-top: 7px;
      }
    }
  }
}
</style>

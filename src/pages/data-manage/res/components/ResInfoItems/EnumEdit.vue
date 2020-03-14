<template>
  <!--枚举值编辑组件 for ResInfoItems.vue -->
  <b-modal v-model="chooseDialog" title="编辑枚举值" width="860" class="layout-inner" :mask-closable="false">
    <div>
      <b-table :columns="columns" :data="totalData" size="small" disabled-hover>
        <!--编码-->
        <template v-slot:code="scope">
          <b-input v-model="totalData[scope.index].code" placeholder="编码" clearable></b-input>
        </template>
        <!--名称-->
        <template v-slot:name="scope">
          <b-input v-model="totalData[scope.index].name" placeholder="名称" clearable></b-input>
        </template>
        <template v-slot:sort="scope">
          <v-sort-arrow @on-up="handleSort('up',scope.index)" @on-down="handleSort('down',scope.index)"></v-sort-arrow>
        </template>
        <!--操作栏-->
        <template v-slot:action="scope">
          <b-button type="text" @click="handleRemove(scope.row,scope.index)">删除</b-button>
        </template>
      </b-table>
      <b-button type="dashed" icon="ios-add-circle-outline"
                style="width: 100%;margin-top: 16px;margin-bottom: 8px;"
                @click="handleCreate">添加信息项
      </b-button>
    </div>
    <div slot="footer">
      <b-button type="primary" @click="handleSubmit">确 定</b-button>
      <b-button @click="chooseDialog = false">取 消</b-button>
    </div>
  </b-modal>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import { deepCopy } from '../../../../../common/utils/assist'
  import { downGo, upGo } from '../../../../../common/utils/arr-utils'

  export default {
    name: 'EnumEdit',
    mixins: [commonMixin],
    data() {
      return {
        columns: [
          { title: '代码', slot: 'code' },
          { title: '名称', slot: 'name' },
          { title: '排序', slot: 'sort', width: 80, align: 'center' },
          { title: '操作', slot: 'action', width: 80, align: 'center' }
        ],
        totalData: [],
        chooseDialog: false
      }
    },
    computed: {
      // 检查totalData中的值是否都不为空
      checkTotalDataNotEmpty() {
        return this.totalData.every(item => item.code.length > 0 && item.name.length > 0)
      }
    },
    methods: {
      open(valid) {
        // 根据传入值格式化当前表格数据
        if (!valid || valid.length === 0) {
          this.totalData = []
        } else {
          // 判断是否是枚举类型字符串
          const index = valid.indexOf(';')
          if (index > -1) {
            this.totalData = []
            let names = valid.slice(0, index).split('/')
            let codes = valid.slice(index + 1).split('/')
            for (let i = 0; i < codes.length; i++) {
              this.totalData.push({ code: codes[i], name: names[i] })
            }
          } else { // 此时是选择字典填充的
            let dict = valid.split('/')
            this.totalData = [{ code: dict[1], name: dict[0] }]
          }
        }
        this.chooseDialog = true
      },
      handleCreate() {
        this.totalData.push({ code: '', name: '' })
      },
      handleRemove(row, index) {
        this.totalData.splice(index, 1) // 清除一个未保存的项
      },
      // 信息项排序方法
      handleSort(type, index) {
        // 复制一个data
        if (type === 'up') { // 上移操作
          if (index > 0) {
            this.totalData = upGo(this.totalData, index)
          }
        } else if (type === 'down') { // 下移一层操作
          if (index !== this.totalData - 1) {
            this.totalData = downGo(this.totalData, index)
          }
        }
      },
      handleSubmit() {
        if (!this.checkTotalDataNotEmpty) {
          this.$alert.danger({ title: '警告', content: '存在未填写完整的枚举值!' })
          return
        }
        // 过滤空值项
        let codes = []
        let names = []
        this.totalData.forEach(item => {
          codes.push(item.code)
          names.push(item.name)
        })
        // 拼接字符串 为[ 1/0;启用/禁用 ]
        const result = this.totalData.length === 0 ? '' : (names.join('/') + ';' + codes.join('/'))
        this.$emit('on-change', result)
        this.chooseDialog = false
      }
    }
  }
</script>

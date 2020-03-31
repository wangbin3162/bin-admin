<template>
  <div class="config-panel" :style="{maxHeight:(maxHeight+2)+'px'}">
    <div class="left-fields">
      <b-table :max-height="maxHeight" :data="totalData" :columns="fieldsColumns" size="small"
               highlight-row ref="currentRowTable" @on-row-click="handleCurrentRowChange">
        <template v-slot:sort="scope">
          <v-sort-arrow @on-up="handleSort('up',scope.index)" @on-down="handleSort('down',scope.index)"/>
        </template>
      </b-table>
    </div>
    <div class="right-panel">
      <v-title-bar label="配置项"/>
      <div v-if="currentIndex!==-1">
        <div>{{totalData[currentIndex].fieldName}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import enumObj from './enum'
  import { deepCopy } from '../../../../../common/utils/assist'
  import { downGo, upGo } from '../../../../../common/utils/arr-utils'

  export default {
    name: 'FieldsCfg',
    data() {
      return {
        enumMap: enumObj,
        fieldsColumns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', key: 'fieldName' },
          { title: '标题', key: 'fieldTitle' },
          { title: '排序', slot: 'sort', width: 75, align: 'center' }
        ],
        totalData: [],
        currentIndex: -1
      }
    },
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      },
      maxHeight: {
        type: Number
      }
    },
    watch: {
      value: {
        handler(val) {
          this.totalData = this.formatItems(val)
        },
        immediate: true
      }
    },
    methods: {
      // 针对传入的数组对是否分词进行初始化
      formatItems(items) {
        return items.map(i => {
          let item = { ...i }
          // 如果已经有值
          if (item.tokenizer) {
            // 如果设置了有效值则必须为Y
            if (item.validValue.length > 0) {
              item.tokenizer = 'Y'
            }
          } else {
            // 如果类型为字符型
            if (item.dataType === 'string') {
              // 如果有效值存在
              item.tokenizer = item.validValue.length > 0 ? 'Y' : 'N'
            } else {
              item.validValue = '' // 如果类型不是字符型，则有效值必须为空
              item.tokenizer = '' // 是否分词也必须为空
            }
          }
          return item
        })
      },
      // 表格行选中
      handleCurrentRowChange(currentRow, index) {
        console.log(currentRow, index)
        this.currentIndex = index
      },
      // 信息项排序方法
      handleSort(type, index) {
        // 复制一个data
        let arr = deepCopy(this.totalData)
        if (type === 'up') { // 上移操作
          if (index > 0) {
            let newArr = upGo(arr, index)
            this.totalData = deepCopy(newArr)
            this.resetHandle('上移一层')
          }
        } else if (type === 'down') { // 下移一层操作
          if (index !== arr.length - 1) {
            let newArr = downGo(arr, index)
            this.totalData = deepCopy(newArr)
            this.resetHandle('下移一层')
          }
        }
      },
      // 重置操作和更新model
      resetHandle(message) {
        // 清空当前修改行
        this.currentIndex = -1
        // 1.emit-input
        this.emitValue()
        // 3.打印操作
        this.$message({ type: 'success', content: message })
      },
      // 更新model value
      emitValue() {
        this.$emit('input', this.totalData)
        this.$emit('on-change', this.totalData)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .config-panel {
    display: flex;
    justify-content: space-between;
    border: 1px solid #eee;
    .left-fields {
      width: 50%;
    }
    .right-panel {
      width: 50%;
      border-left: 1px solid #eee;
    }
  }
</style>

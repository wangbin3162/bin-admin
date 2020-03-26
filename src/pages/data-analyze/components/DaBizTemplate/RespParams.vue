<template>
  <div>
    <b-table disabled-hover :data="totalData" :columns="fieldsColumns" size="small">
      <template v-slot:keyName="{row,index}">
        <b-input v-model="totalData[index].keyName" v-if="row.edit" size="small"/>
        <span v-else>{{ row.keyName }}</span>
      </template>
      <template v-slot:keyAlias="{row,index}">
        <b-input v-model="totalData[index].keyAlias" v-if="row.edit" size="small"/>
        <span v-else>{{ row.keyAlias }}</span>
      </template>
      <template v-slot:keyPath="{row,index}">
        <b-input v-model="totalData[index].keyPath" v-if="row.edit" size="small"/>
        <span v-else>{{ row.keyPath }}</span>
      </template>
      <template v-slot:dataType="{row,index}">
        <b-select v-model="totalData[index].dataType" placeholder="请选择" v-if="row.edit" size="small" append-to-body>
          <b-option v-for="(value,key) in dataTypeMap" :key="key" :value="key">{{ value }}</b-option>
        </b-select>
        <span v-else>{{ dataTypeMap[row.dataType] }}</span>
      </template>
      <template v-slot:memo="{row,index}">
        <b-input v-model="totalData[index].memo" v-if="row.edit" size="small"/>
        <span v-else>{{ row.memo }}</span>
      </template>
      <template v-slot:action="{row,index}">
        <div v-if="row.newOne">
          <b-button @click="handleSave(row,index)" type="success" size="small" transparent>添加</b-button>
          <b-button @click="handleCancel(index)" size="small">取消</b-button>
        </div>
        <div v-else>
          <b-button v-if="row.edit" @click="handleSave(row,index)" type="primary" size="small" transparent>保存</b-button>
          <b-button v-else @click="handleEdit(index)" type="primary" size="small" transparent>编辑</b-button>
          <b-button v-if="row.edit" @click="handleCancel(index)" size="small">取消</b-button>
          <span v-else style="margin-left: 10px;">
            <b-popover
              confirm append-to-body
              title="确认删除此项吗?"
              @on-ok="handleRemove(index)">
              <b-button type="danger" size="small" transparent>删除</b-button>
            </b-popover>
          </span>
        </div>
      </template>
    </b-table>
    <b-button type="dashed" icon="ios-add-circle-outline"
              style="width: 100%;margin-top: 16px;margin-bottom: 8px;"
              @click="handleAdd">添加项
    </b-button>
  </div>
</template>

<script>
  import { deepCopy } from '../../../../common/utils/assist'

  export default {
    name: 'RespParams',
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      },
      dataTypeMap: {
        type: Object,
        default() {
          return {}
        }
      },
      bizId: {
        type: String,
        required: true
      },
      parentId: {
        type: String,
        required: true
      },
      respKind: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        fieldsColumns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '键名', slot: 'keyName' },
          { title: '别名', slot: 'keyAlias' },
          { title: '键路径', slot: 'keyPath' },
          { title: '数据类型', slot: 'dataType', width: 150 },
          { title: '说明', slot: 'memo' },
          { title: '操作', slot: 'action', width: 150 }
        ],
        totalData: []
      }
    },
    watch: {
      value: {
        handler(val) {
          this.totalData = deepCopy(val)
        },
        immediate: true
      }
    },
    methods: {
      handleAdd() {
        let newRow = {
          bizId: this.bizId,
          parentId: this.parentId,
          respKind: this.respKind,
          keyName: '', // 键名
          keyAlias: '', // 别名
          keyPath: '', // 建路径
          dataType: '', // 数据类型
          memo: '', // 说明
          edit: false,
          newOne: true
        }
        this.totalData.push(newRow)
        this.handleEdit(this.totalData.length - 1)
        this.emitValue()
      },
      handleEdit(index) {
        this.totalData[index].edit = true
      },
      handleCancel(index) {
        if (this.totalData[index].newOne) { // 如果当前是新增未保存的则取消即为移除
          this.totalData.splice(index, 1)
          this.emitValue() // 移除后需要更新
        } else { // 编辑的则设置取消
          // 从value里获取当前行恢复
          const { keyName, keyAlias, keyPath, dataType, memo } = this.value[index]
          // 检查键名是否有重复
          if (this.checkInclude('keyName', keyName)) {
            this.$message({ type: 'danger', content: '键名不能重复' })
            return
          }
          this.totalData[index].keyName = keyName
          this.totalData[index].keyAlias = keyAlias
          this.totalData[index].keyPath = keyPath
          this.totalData[index].dataType = dataType
          this.totalData[index].memo = memo
          this.totalData[index].edit = false
        }
      },
      handleRemove(index) {
        this.totalData.splice(index, 1) // 清除一个未保存的项
        this.emitValue()
      },
      handleSave(row, index) {
        if (row.keyName.length === 0 || row.keyAlias.length === 0 || row.keyPath.length === 0) {
          this.$message({ type: 'danger', content: '键名，别名和键路径不为空' })
          return
        }
        // 检查键名是否有重复
        if (this.checkInclude('keyName', row.keyName)) {
          this.$message({ type: 'danger', content: '键名不能重复' })
          return
        }
        this.totalData[index].edit = false
        this.totalData[index].newOne = false
        this.emitValue()
      },
      // 判断重复（根据字段名字）
      checkInclude(fieldName, value) {
        let saveList = this.totalData.filter(i => (!i.edit && !i.newOne))
        let index = saveList.findIndex(i => i[fieldName] === value)
        return index > -1
      },
      // 更新model value
      emitValue() {
        this.$emit('input', this.totalData)
        this.$emit('on-change', this.totalData)
      }
    }
  }
</script>

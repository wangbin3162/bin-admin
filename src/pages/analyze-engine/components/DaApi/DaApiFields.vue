<template>
  <div>
    <b-table disabled-hover :data="totalData" :columns="fieldsColumns" size="small">
      <template v-slot:name="{row,index}">
        <b-input type="text" v-model="totalData[index].name" size="small" v-if="row.edit"
                 placeholder="中文释义"></b-input>
        <span v-else>{{ row.name }}</span>
      </template>
      <template v-slot:fieldName="{row,index}">
        <b-input type="text" v-model="totalData[index].fieldName" v-if="row.edit" size="small"
                 placeholder="字段编码"></b-input>
        <span v-else>{{ row.fieldName }}</span>
      </template>
      <template v-slot:dataType="{row,index}">
        <b-select v-if="row.edit" v-model="totalData[index].dataType" placeholder="请选择类型"
                  clearable append-to-body size="small">
          <b-option v-for="item in dataTypeOptions" :value="item.value" :key="item.value" :label="item.label">
            <span>{{ item.label }}</span>
            <span style="float:right;color:#ccc">{{ item.value }}</span>
          </b-option>
        </b-select>
        <span v-else>{{ row.dataType }}</span>
      </template>
      <template v-slot:defaultValue="{row,index}">
        <b-input type="text" v-model="totalData[index].defaultValue" v-if="row.edit" size="small"
                 placeholder="默认值"></b-input>
        <span v-else>{{ row.defaultValue }}</span>
      </template>
      <template v-slot:describe="{row,index}">
        <b-input type="text" v-model="totalData[index].describe" v-if="row.edit" size="small"
                 placeholder="参数描述"></b-input>
        <span v-else>{{ row.describe }}</span>
      </template>
      <!--操作栏-->
      <template v-slot:action="{row,index}">
        <div v-if="row.newOne">
          <b-button @click="handleSave(row,index)" type="success" size="small" transparent>添加</b-button>
          <b-button @click="handleCancel(index)" size="small">取消</b-button>
        </div>
        <div v-else>
          <b-button v-if="row.edit" @click="handleSave(row,index)" type="primary" size="small" transparent>保存
          </b-button>
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
              @click="handleAdd">添加参数
    </b-button>
  </div>
</template>

<script>
  import { deepCopy } from '../../../../common/utils/assist'

  export default {
    name: 'daApi-Fields',
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      },
      dataTypeOptions: {
        type: Array
      }
    },
    data() {
      return {
        fieldsColumns: [
          { title: '中文释义', slot: 'name' },
          { title: '字段编码', slot: 'fieldName' },
          { title: '参数类型', slot: 'dataType' },
          { title: '默认值', slot: 'defaultValue' },
          { title: '参数描述', slot: 'describe' },
          { title: '操作', slot: 'action', width: 150, align: 'center' }
        ],
        totalData: [],
        ruleValidate: {
          name: [{ required: true, message: '请输入中文释义', trigger: 'change' }],
          fieldName: [{ required: true, message: '请输入参数字段名', trigger: 'change' }],
          dataType: [{ required: true, message: '参数类型必选', trigger: 'change' }]
        }
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
          name: '',
          fieldName: '',
          dataType: 'string',
          defaultValue: '', // 默认值
          describe: '', // 参数说明
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
          const { name, fieldName, dataType, defaultValue, describe } = this.value[index]
          this.totalData[index].name = name
          this.totalData[index].fieldName = fieldName
          this.totalData[index].dataType = dataType
          this.totalData[index].defaultValue = defaultValue
          this.totalData[index].describe = describe
          this.totalData[index].edit = false
        }
      },
      handleRemove(index) {
        this.totalData.splice(index, 1) // 清除一个未保存的项
        this.emitValue()
      },
      handleSave(row, index) {
        if (row.name.length === 0 || row.fieldName.length === 0) {
          this.$message({ type: 'danger', content: '中文释义和编码必填' })
          return
        }
        this.totalData[index].edit = false
        this.totalData[index].newOne = false
        this.emitValue()
      },
      // 更新model value
      emitValue() {
        this.$emit('input', this.totalData)
        this.$emit('on-change', this.totalData)
      }
    }
  }
</script>

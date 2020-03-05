<template>
  <!--模板参数 for DaInnerTemplate.vue 模板参数项-->
  <div>
    <b-table disabled-hover :data="totalData" size="small" :columns="fieldsColumns">
      <template v-slot:paramName="{row,index}">
        <b-input type="text" v-model="totalData[index].paramName" v-if="row.edit" size="mini"
                 placeholder="参数名称"></b-input>
        <span v-else>{{ row.paramName }}</span>
      </template>
      <template v-slot:paramCode="{row,index}">
        <b-input type="text" v-model="totalData[index].paramCode" v-if="row.edit" size="mini"
                 placeholder="参数编码"></b-input>
        <span v-else>{{  row.paramCode }}</span>
      </template>
      <template v-slot:paramType="{row,index}">
        <b-select v-model="totalData[index].paramType" v-if="row.edit" size="mini" placeholder="参数类型" append-to-body>
          <b-option value="string">string</b-option>
          <b-option value="number">number</b-option>
        </b-select>
        <span v-else>{{ {row,index}.row.paramType }}</span>
      </template>
      <template v-slot:isRequired="{row,index}">
        <b-switch v-model="totalData[index].isRequired" v-if="row.edit" true-value="Y" false-value="N">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </b-switch>
        <span v-else>{{ isRequiredMap[row.isRequired] }}</span>
      </template>
      <template v-slot:defaultVal="{row,index}">
        <b-input type="text" v-model="totalData[index].defaultVal" v-if="row.edit" size="mini"
                 placeholder="默认值"></b-input>
        <span v-else>{{ row.defaultVal }}</span>
      </template>
      <template v-slot:paramDesc="{row,index}">
        <b-input type="text" v-model="totalData[index].paramDesc" v-if="row.edit" size="mini"
                 placeholder="参数描述"></b-input>
        <span v-else>{{ row.paramDesc }}</span>
      </template>
      <template v-slot:action="{row,index}">
        <div v-if="row.newOne">
          <b-button @click="handleSave(row,index)" size="mini" type="success" transparent>添加</b-button>
          <b-button @click="handleCancel(index)" size="mini" type="info" transparent>取消</b-button>
        </div>
        <div v-else>
          <b-button v-if="row.edit" @click="handleSave(row,index)" size="mini" type="primary" transparent>保存</b-button>
          <b-button v-else @click="handleEdit(index)" size="mini" type="primary" transparent>编辑</b-button>
          <b-button v-if="row.edit" @click="handleCancel(index)" size="mini" type="info" transparent>取消</b-button>
          <b-button v-else @click="handleRemove(index)" type="danger" size="mini" transparent>删除</b-button>
        </div>
      </template>
    </b-table>
    <b-button type="dashed" size="small" icon="ios-add"
              style="width: 100%;margin-top: 16px;margin-bottom: 8px;"
              @click="handleAdd">添加参数
    </b-button>
  </div>
</template>

<script>
  import { deepCopy } from '../../../../common/utils/assist'
  // 非空字段提示
  const requiredRule = { required: true, message: '必填项', trigger: 'blur' }

  export default {
    name: 'TempParams',
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        fieldsColumns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '参数名称', slot: 'paramName' },
          { title: '参数编码', slot: 'paramCode' },
          { title: '参数类型', slot: 'paramType', width: 100 },
          { title: '是否必填', slot: 'isRequired', width: 100, align: 'center' },
          { title: '默认值', slot: 'defaultVal' },
          { title: '参数说明', slot: 'paramDesc' },
          { title: '操作', slot: 'action', width: 150, align: 'center' }
        ],
        totalData: [],
        beforeEditItem: {
          paramName: '',
          paramCode: '',
          paramType: '',
          isRequired: '',
          defaultVal: '',
          paramDesc: ''
        },
        isRequiredMap: { N: '否', Y: '是' }
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
          paramName: '', // 参数名称
          paramCode: '', // 参数编码
          paramType: 'string', // 参数类型
          isRequired: 'Y', // 是否必填
          defaultVal: '', // 默认值
          paramDesc: '', // 参数说明
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
          const { paramName, paramCode, paramType, isRequired, defaultVal, paramDesc } = this.value[index]
          this.totalData[index].paramName = paramName
          this.totalData[index].paramCode = paramCode
          this.totalData[index].paramType = paramType
          this.totalData[index].isRequired = isRequired
          this.totalData[index].defaultVal = defaultVal
          this.totalData[index].paramDesc = paramDesc
          this.totalData[index].edit = false
        }
      },
      handleRemove(index) {
        this.$confirm({
          title: '警告',
          content: '确认删除此参数项吗？',
          onOk: () => {
            this.totalData.splice(index, 1) // 清除一个未保存的项
            this.resetHandle('删除项成功')
          }
        })
      },
      handleSave(row, index) {
        if (row.paramName.length === 0 || row.paramCode.length === 0) {
          this.$message({ type: 'danger', content: '参数名称和编码需要填写完整' })
          return
        }
        this.totalData[index].edit = false
        this.totalData[index].newOne = false
        this.resetHandle('保存成功')
      },
      // 重置操作和更新model
      resetHandle(message) {
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

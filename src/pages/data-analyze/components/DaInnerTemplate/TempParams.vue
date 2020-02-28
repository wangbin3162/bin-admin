<template>
  <!--资源信息，信息项表格组件 for ResInfo.vue 模板参数项-->
  <div style="padding: 10px 0;">
    <b-table disabled-hover :data="totalData" size="small" :columns="fieldsColumns">
      <!--参数名-->
      <template v-slot:paramName="scope">
        <b-input v-model="totalData[scope.index].paramName" size="small" @on-change="emitValue"></b-input>
      </template>
      <!--参数编码-->
      <template v-slot:paramCode="scope">
        <b-input v-model="totalData[scope.index].paramCode" size="small" @on-change="emitValue"></b-input>
      </template>
      <!--参数类型-->
      <template v-slot:paramType="scope">
        <b-select v-model="totalData[scope.index].paramType" append-to-body @on-change="emitValue" size="small">
          <b-option v-for="(value,key) in dataTypeMap" :key="key" :value="key">{{ value }}</b-option>
        </b-select>
      </template>
      <!--是否必填-->
      <template v-slot:isRequired="scope">
        <b-switch v-model="totalData[scope.index].isRequired" size="small"
                  true-value="Y" false-value="N"
                  @on-change="emitValue"></b-switch>
      </template>
      <!--默认值-->
      <template v-slot:defaultVal="scope">
        <b-input v-model="totalData[scope.index].defaultVal" size="small" @on-change="emitValue"></b-input>
      </template>
      <!--参数说明-->
      <template v-slot:paramDesc="scope">
        <b-input v-model="totalData[scope.index].paramDesc" size="small" @on-change="emitValue"></b-input>
      </template>
      <!--操作栏-->
      <template v-slot:action="scope">
        <b-button type="text" @click="handleModify(scope.row,scope.index)">编辑</b-button>
        <b-button type="text" @click="handleDelete(scope.row,scope.index)">删除</b-button>
      </template>
    </b-table>
    <!--编辑弹窗-->
    <b-modal v-model="dialogFormVisible" width="800" title="修改信息项" :mask-closable="false">
      <div style="padding-right: 20px;">
        <b-form :model="item" ref="form" :rules="ruleValidate" :label-width="80">
          <b-row>
            <b-col span="12">
              <b-form-item label="模板名称" prop="paramName" class="bin-form-item-required">
                <b-input v-model="item.paramName" placeholder="请输入模板名称" clearable></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="模板编码" prop="paramCode" class="bin-form-item-required">
                <b-input v-model="item.paramCode" placeholder="请输入模板编码" clearable></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="模板类型" prop="paramType">
                <b-select v-model="item.paramType" placeholder="请选择类型" clearable>
                  <b-option v-for="(value,key) in dataTypeMap" :value="key" :key="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="是否必填">
                <b-select v-model="item.isRequired">
                  <b-option v-for="(value,key) in tokenizerMap" :key="key" :value="key">{{ value }}</b-option>
                </b-select>
              </b-form-item>
            </b-col>
          </b-row>
          <b-form-item label="默认值" prop="defaultVal" class="bin-form-item-required">
            <b-input v-model="item.defaultVal" placeholder="请输入默认值" clearable></b-input>
          </b-form-item>
          <b-form-item label="参数说明" prop="paramDesc" class="bin-form-item-required">
            <b-input v-model="item.paramDesc" placeholder="请输入参数说明" clearable></b-input>
          </b-form-item>
        </b-form>
      </div>
      <div slot="footer">
        <b-button type="primary" @click="handleSubmit">确 定</b-button>
        <b-button @click="dialogFormVisible = false">取 消</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { deepCopy } from '../../../../common/utils/assist'
  import * as api from '../../../../api/data-analyze/da-inner-temp.api'
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
      },
      dataTypeMap: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        fieldsColumns: [
          { title: '参数名称', key: 'paramName' },
          { title: '参数编码', slot: 'paramCode' },
          { title: '参数类型', slot: 'paramType' },
          { title: '是否必填', slot: 'isRequired' },
          { title: '默认值', slot: 'defaultVal', width: 200 },
          { title: '参数描述', slot: 'paramDesc', width: 140, align: 'center' },
          { title: '操作', slot: 'action', width: 100, align: 'center' }
        ],
        totalData: [],
        item: null,
        ruleValidate: {
          paramName: [requiredRule],
          paramCode: [requiredRule],
          paramType: [{ required: true, message: '参数类型必选', trigger: 'change' }],
          isRequired: [{ required: true, message: '是否必填必选', trigger: 'change' }]
        },
        formLoading: false,
        dialogFormVisible: false, // 编辑页是否显示
        dialogStatus: '',
        currentIndex: -1,
        tokenizerMap: { N: '否', Y: '是' }
      }
    },
    created() {
      this.resetItem()
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
          if (item.isRequired) {
            // 如果设置了有效值则必须为Y
            if (item.validValue.length > 0) {
              item.isRequired = 'Y'
            }
          } else {
            // 如果类型为字符型
            if (item.dataType === 'string') {
              // 如果有效值存在
              item.isRequired = item.validValue.length > 0 ? 'Y' : 'N'
            } else {
              item.validValue = '' // 如果类型不是字符型，则有效值必须为空
              item.isRequired = '' // 是否分词也必须为空
            }
          }
          return item
        })
      },
      // 下拉选择填充有效值事件
      handleCommand(type, index) {
        this.currentIndex = index // 当前选中的行数
        if (type === 'DICT') {
          this.$refs.sysDictChoose && this.$refs.sysDictChoose.open()
        } else {
          const valid = this.totalData[this.currentIndex].validValue
          this.$refs.enumEdit && this.$refs.enumEdit.open(valid)
        }
      },
      // 清空有效值事件
      handleClearValidValue(index) {
        this.currentIndex = index // 当前清空有效值的行数
        this.totalData[this.currentIndex].validValue = ''
        // 清空当前修改行
        this.currentIndex = -1
        // emit-input
        this.emitValue()
      },
      // 点击校验配置事件
      handleClickValidate(index) {
        this.currentIndex = index // 当前选中的行数
        this.$refs.validateEdit && this.$refs.validateEdit.open(this.totalData[index].checkRules)
      },
      // 拖拽排序
      handleDragDrop(index1, index2) {
        // 复制两个索引位置的项
        let tmp = deepCopy(this.totalData[index1])
        // 交换
        this.totalData[index1] = deepCopy(this.totalData[index2])
        this.totalData[index2] = tmp
        // 重置操作
        this.resetHandle('拖动排序成功')
      },
      // 重置操作和更新model
      resetHandle(message) {
        // 清空当前修改行
        this.currentIndex = -1
        // 1.emit-input
        this.emitValue()
        // 2.关闭窗口
        this.dialogFormVisible = false
        // 3.打印操作
        this.$message(message)
      },
      // 修改信息项
      handleModify(row, index) {
        this.item = deepCopy(row)
        this.currentIndex = index // 当前选中的行数
        this.openDialog('modify')
      },
      handleDelete(row) {
        let theme = { ...row }
        this.$confirm({
          title: '警告',
          content: `确实要删除当前参数吗？`,
          loading: true,
          onOk: () => {
            api.removeParam(theme).then(res => {
              if (res.data.code === '0') {
                this.$message({ type: 'success', content: '操作成功' })
                this.$modal.remove()
                this.handleFilter()
              } else {
                this.$modal.remove()
                this.$message({ type: 'danger', content: res.data.message })
              }
            })
          }
        })
      },
      // 打开窗口
      openDialog(status) {
        this.$refs.form && this.$refs.form.resetFields()
        this.dialogFormVisible = true
        this.dialogStatus = status
      },
      // 表单提交,只需要缓存至数组即可
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.dialogStatus === 'modify') {
              this.totalData[this.currentIndex] = deepCopy(this.item)
            }
            this.resetHandle('修改成功')
          }
        })
      },
      // 更新model value
      emitValue() {
        this.$emit('input', this.totalData)
        this.$emit('on-change', this.totalData)
      },
      // 初始化信息项操作
      resetItem() {
        this.item = {
          paramName: '',
          paramCode: '',
          dataType: '',
          paramType: 'STRING', // 控件类型,默认文本框
          paramDesc: '', // 提示信息
          defaultVal: '', // 有效值
          isRequired: '', // 是否必填
          checkRules: '{"rules":["$required(obj, value, {\\"message\\":\\"${title}不可以为空\\"})"]}'
        }
      }
    }
  }
</script>

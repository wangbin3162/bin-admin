<template>
  <!--元信息项编辑 for Metadata.vue -->
  <div>
    <b-table disabled-hover :data="totalData"  :columns="fieldsColumns">
      <!--操作栏-->
      <template v-slot:action="scope">
        <template v-if="!scope.row.status">
          <b-button type="text" @click="handleModify(scope.row,scope.index)">
            修改
          </b-button>
          <b-divider type="vertical"></b-divider>
          <b-button type="text" text-color="danger" @click="handleRemove(scope.row,scope.index)">删除</b-button>
        </template>
      </template>
    </b-table>
    <b-button type="dashed"  icon="ios-add-circle-outline"
              style="width: 100%;margin-top: 16px;margin-bottom: 8px;"
              @click="handleCreateItem">添加参数
    </b-button>
    <!--新增修改弹窗-->
    <b-modal v-model="dialogFormVisible" width="800"
             :title="dialogTitle" :mask-closable="false">
      <div class="p10">
        <b-form :model="metaItem" ref="form" :rules="ruleValidate" :label-width="100">
          <b-row>
            <b-col span="12">
              <b-form-item label="中文释义" prop="fieldName">
                <b-input v-model="metaItem.fieldName" placeholder="请输入中文释义" clearable :maxlength="30"></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="字段编码" prop="name">
                <b-input v-model="metaItem.name" placeholder="请输入字段编码" clearable :maxlength="30"></b-input>
              </b-form-item>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="12">
              <b-form-item label="默认值" prop="defaultValue">
                <b-input v-model="metaItem.defaultValue" placeholder="请输入默认值" clearable :maxlength="30"></b-input>
              </b-form-item>
            </b-col>
            <b-col span="12">
              <b-form-item label="参数类型" prop="dataType">
                <b-select v-model="metaItem.dataType" placeholder="请选择类型"
                          clearable>
                  <b-option v-for="item in dataTypeOptions" :value="item.value" :key="item.value" :label="item.label">
                    <span>{{ item.label }}</span>
                    <span style="float:right;color:#ccc">{{ item.value }}</span>
                  </b-option>
                </b-select>
              </b-form-item>
            </b-col>
          </b-row>
          <b-form-item label="参数描述" prop="describe">
            <b-input v-model="metaItem.describe" placeholder="请输入参数描述" type="textarea"></b-input>
          </b-form-item>
        </b-form>
      </div>
      <div slot="footer">
        <b-button type="primary" @click="handleSubmit">提 交</b-button>
        <b-button @click="dialogFormVisible = false">取 消</b-button>
      </div>
    </b-modal>
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
    computed: {
      dialogTitle() {
        return this.dialogStatus === 'create' ? '添加信息项' : this.dialogStatus === 'modify' ? '修改信息项' : '标题'
      },
      showDataLength() {
        return ['string', 'number', 'money', 'text'].includes(this.metaItem.dataType)
      },
      showDataPrecision() {
        return ['number', 'money'].includes(this.metaItem.dataType)
      },
      // 系统信息项个数
      sysItemCount() {
        return this.totalData.filter(item => item.status).length
      }
    },
    data() {
      return {
        fieldsColumns: [
          { title: '中文释义', key: 'name' },
          { title: '字段编码', key: 'fieldName', align: 'center' },
          { title: '默认值', key: 'defaultValue', align: 'center' },
          { title: '参数类型', key: 'dataType', align: 'center' },
          { title: '参数描述', key: 'describe', align: 'center' },
          { title: '操作', slot: 'action', width: 150, align: 'center' }
        ],
        totalData: [
          {}
        ],
        metaItem: null,
        ruleValidate: {
          name: [{ required: true, message: '请输入中文释义', trigger: 'change' }],
          dataType: [{ required: true, message: '参数类型必选', trigger: 'change' }],
          fieldName: [{ required: true, message: '请输入参数字段名', trigger: 'change' }]
        },
        formLoading: false,
        dialogFormVisible: false, // 编辑页是否显示
        dialogStatus: '',
        currentIndex: -1
      }
    },
    created() {
      this.resetItem()
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (val) {
            this.totalData = [...val]
          }
        }
      }
    },
    methods: {
      // 添加信息项
      handleCreateItem() {
        this.resetItem()
        this.openDialog('create')
      },
      // 修改信息项
      handleModify(row, index) {
        this.metaItem = deepCopy(row)
        this.currentIndex = index // 当前选中的行数
        this.openDialog('modify')
      },
      // 删除信息项
      handleRemove(row, index) {
        this.$confirm({
          title: '确认删除此信息项吗？',
          content: '删除后不可恢复。',
          okType: 'danger',
          onOk: () => {
            this.totalData.splice(index, 1) // 清除一个未保存的项
            this.resetHandle('删除项成功')
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
            if (this.dialogStatus === 'create') { // 新增时需要push一个数据
              this.totalData.push(deepCopy(this.metaItem))
            } else if (this.dialogStatus === 'modify') {
              this.totalData[this.currentIndex] = deepCopy(this.metaItem)
            }
            this.resetHandle(`${this.dialogStatus === 'create' ? '新增' : '修改'}成功`)
          }
        })
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
        this.$message({ type: 'success', content: message })
      },
      // 更新model value
      emitValue() {
        this.$emit('input', this.totalData)
        this.$emit('on-change', this.totalData)
      },
      // 初始化信息项操作
      resetItem() {
        this.metaItem = {
          name: '',
          fieldName: '',
          dataType: '',
          defaultValue: '',
          describe: ''
        }
      }
    }
  }
</script>

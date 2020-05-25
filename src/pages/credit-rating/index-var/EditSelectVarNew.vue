<template>
  <div class="select-var">
    <b-modal v-model="showDialog" title="选择变量" :body-styles="{padding:0}"
             width="70%" @on-visible-change="handleVisibleChange">
      <v-table-wrap class="con">
        <v-filter-bar>
          <v-filter-item title="变量名" style="width: 35%">
            <b-input v-model="listQuery.varName" placeholder="请输入变量名"></b-input>
          </v-filter-item>
          <v-filter-item title="变量类型">
            <b-select v-model="listQuery.varType">
              <b-option v-for="item in varTypeOptions" :key="item.value"
                        :value="item.value">{{ item.label }}
              </b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <div class="table">
          <b-table :columns="columns" :data="list" :loading="listLoading" size="small"
                   @on-selection-change="handleSelectionChange"
                   :highlight-row="radio" @on-current-change="handleRadio">
            <template v-slot:varType="{ row }">
              {{ varTypeEnum[row.varType] }}
            </template>
            <template v-slot:dataType="{ row }">
              {{ dataTypeEnum[row.dataType] }}
            </template>
          </b-table>
        </div>
        <!-- 分页器 -->
        <div flex="main:justify cross:center">
          <div class="tip">{{ tip }}</div>
          <b-page :total="total" :current.sync="listQuery.page" @on-change="handleCurrentChange"/>
        </div>
      </v-table-wrap>

      <div slot="footer">
        <b-button v-if="!radio" type="primary" @click="handleOk">确定</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getEvalVarType, getEvalDataType, getEvalParamType } from '../../../api/enum.api'
  import { getIndexVarList, deleteIndexVar } from '../../../api/credit-rating/index-var.api'
  import { enumToOptions } from '../../../common/utils/util'

  export default {
    name: 'IndexVarEditSelectVar',
    props: {
      open: {
        type: Boolean
      },
      radio: {
        type: Boolean,
        default: false
      }
    },
    mixins: [commonMixin, permission],
    data() {
      return {
        tip: '', // 在指标管理新增组件中使用时提示
        varCodeList: [],
        listQuery: {
          varName: '',
          varType: ''
        },
        columns: [
          { type: 'selection', width: 50, align: 'center' },
          { title: '变量名称', key: 'varName' },
          { title: '变量编码', key: 'varCode' },
          { title: '变量类型', slot: 'varType' },
          { title: '数据类型', slot: 'dataType' },
          { title: '模板内容', key: 'tplContent', ellipsis: true, tooltip: true },
          { title: '描述', key: 'varDesc', ellipsis: true, tooltip: true }
        ],
        varTypeEnum: {},
        dataTypeEnum: {},
        varTypeOptions: [] // 变量类型下拉框
      }
    },
    computed: {
      showDialog: {
        get() {
          return this.open
        },
        set(val) {
          // 设置一个空的setter函数，用于处理弹框组件关闭时设置绑定的数据的行为
          this.$emit('close')
        }
      }
    },
    created() {
      this.init()
      this.getEnum()
    },
    methods: {
      handleVisibleChange(visible) {
        if (visible) {
          this.searchList()
        }
      },
      // 多选的回调
      handleSelectionChange(selection) {
        const list = []
        for (const item of selection) {
          list.push(item.varCode)
        }
        this.varCodeList = list
      },
      // 单选的回调
      handleRadio (curRow) {
        this.$emit('selected', curRow)
        this.showDialog = false
      },
      // 发送选中的数据
      handleOk() {
        this.$emit('selected', this.varCodeList)
        this.showDialog = false
      },
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          varName: '',
          varType: ''
        }
        this.searchList()
      },
      async searchList() {
        this.listLoading = true
        try {
          const res = await getIndexVarList(this.listQuery)
          this.setListData({
            list: res.rows,
            total: res.total
          })
        } catch (error) {
          console.log(error)
        }
        this.listLoading = false
      },
      // 或许所需的枚举值
      async getEnum() {
        try {
          const [varType, dataType] = await Promise.all([
            getEvalVarType(), getEvalDataType()
          ])
          this.varTypeEnum = varType
          this.dataTypeEnum = dataType
          // 构建所需枚举类型下拉框的option
          this.varTypeOptions = enumToOptions(this.varTypeEnum)
        } catch (error) {
          this.$log.pretty('searchList Error', error, 'danger')
        }
      },
      // 判断组件是单选还是多选，用于处理不同组件的不同行为
      init () {
        if (this.radio) { // 指标管理使用则是单选形式
          this.tip = '提示：点击表格行选择变量'
          this.columns = [
            { type: 'index', width: 50, align: 'center' },
            { title: '变量名称', key: 'varName' },
            { title: '变量编码', key: 'varCode' },
            { title: '变量类型', slot: 'varType' },
            { title: '数据类型', slot: 'dataType' },
            { title: '模板内容', key: 'tplContent', ellipsis: true, tooltip: true },
            { title: '描述', key: 'varDesc', ellipsis: true, tooltip: true }
          ]
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .select-var {
    .table {
      max-height: 400px;
      overflow-y: auto;
    }
    .tip {
      color: #909399;
    }
  }
</style>

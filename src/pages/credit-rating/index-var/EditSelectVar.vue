<template>
  <div class="select-var">
    <b-modal v-model="showDialog" title="选择变量"
      :width="width" footer-hide
      :body-styles="{ padding: 0 }"
      @on-visible-change="handleVisibleChange">
      <v-table-wrap>
        <b-row :gutter="15">
          <b-col :span="span">
            <v-filter-bar>
              <v-filter-item title="变量名">
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

            <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
              <template v-slot:varType="{ row }">
                {{ varTypeEnum[row.varType] }}
              </template>
              <template v-slot:dataType="{ row }">
                {{ dataTypeEnum[row.dataType] }}
              </template>
              <template v-slot:action="{ row }">
                <b-button v-if="!radio"
                  plain size="small"
                  :type="checkRowSelected(row) ? 'danger' : 'primary'"
                  @click="chooseOne(row)">
                  {{ checkRowSelected(row) ? '取消' : '选择' }}
                </b-button>
                <b-button v-else
                  type="primary" plain size="small"
                  @click="handleRadio(row)">
                  选择
                 </b-button>
              </template>
            </b-table>
          </b-col>

          <b-col v-if="!radio" span="8">
            <b-card class="box-card" head-tip
              header="已选变量">
              <b-tag
                :key="index"
                v-for="(tag,index) in selectedList"
                closable
                @on-close="handleCloseTag(index)">
                {{tag.varName}}
              </b-tag>
              <b-button type="dashed" style="width: 100%;margin: 10px 0;"
                v-if="selectedList.length"
                @click="postSelectedList">
                确定添加
              </b-button>
            </b-card>
          </b-col>
        </b-row>

        <!-- 分页器 -->
        <b-page :total="total" :current.sync="listQuery.page" size="small"
          @on-change="handleCurrentChange"/>
      </v-table-wrap>
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
        width: '80%',
        span: 16,
        varCodeList: [],
        listQuery: {
          varName: '',
          varType: ''
        },
        columns: [
          { title: '变量名称', key: 'varName' },
          { title: '变量编码', key: 'varCode' },
          { title: '变量类型', slot: 'varType' },
          { title: '数据类型', slot: 'dataType' },
          { title: '模板内容', key: 'tplContent', ellipsis: true, tooltip: true },
          { title: '描述', key: 'varDesc', ellipsis: true, tooltip: true },
          { title: '操作', slot: 'action', align: 'center' }
        ],
        varTypeEnum: {},
        dataTypeEnum: {},
        varTypeOptions: [], // 变量类型下拉框
        selectedList: [] // 已选择的数组
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
        } else {
          this.list = []
          this.varCodeList = []
          this.selectedList = []
        }
      },
      // 单选的回调
      handleRadio (curRow) {
        this.$emit('selected', curRow)
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
          this.span = 24
          this.width = '72%'
        } else {
          this.span = 16
          this.width = '80%'
        }
      },
       // 用于检查是否选中
      checkRowSelected(row) {
        const dept = this.selectedList.find(item => {
          return item.varCode === row.varCode
        })
        return !!dept
      },
      // 选择按钮的回调
      chooseOne(row) {
        let index = this.selectedList.findIndex(item => {
          return item.varCode === row.varCode
        })
        if (index === -1) {
          this.selectedList.push({
            varName: row.varName,
            varCode: row.varCode
          })
        } else {
          this.selectedList.splice(index, 1)
        }
      },
      // tag关闭回调
      handleCloseTag(index) {
        this.selectedList.splice(index, 1)
      },
      // 确认选择按钮回调，向外发送处理后的数据，多选
      postSelectedList () {
        for (const item of this.selectedList) {
          this.varCodeList.push(item.varCode)
        }
        this.$emit('choose-mul', this.varCodeList)
        this.showDialog = false // 关闭弹框
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .select-var {

  }
</style>

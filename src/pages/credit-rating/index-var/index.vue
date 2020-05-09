<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input v-model="listQuery.varName" placeholder="请输入名称"></b-input>
          </v-filter-item>
           <v-filter-item title="变量类型">
            <b-select v-model="listQuery.varType">
              <b-option v-for="item in varTypeOptions" :key="item.value"
                :value="item.value">{{ item.label }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!-- 操作栏 -->
        <v-table-tool-bar>
          <b-button type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:varName="{ row }">
            <b-button type="text" @click="handleCheck(row.id)">{{ row.varName }}</b-button>
          </template>

          <template v-slot:varType="{ row }">
            {{ varTypeEnum[row.varType] }}
          </template>

          <template v-slot:dataType="{ row }">
            {{ dataTypeEnum[row.dataType] }}
          </template>

          <template v-slot:action="scope">
            <b-button type="text" @click="handleModify(scope.row)">
              修改
            </b-button>
            <template>
              <b-divider type="vertical"></b-divider>
              <b-button type="text" text-color="danger" @click="handleRemove(scope.row)">
                删除
              </b-button>
            </template>
          </template>
        </b-table>
        <!-- 分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <!-- 编辑组件 -->
    <Edit v-if="isEdit" :title="editTitle"
      :varTypeOptions="varTypeOptions" :dataTypeOptions="dataTypeOptions"
      :paramTypeOptions="paramTypeOptions" @close="handleCancel"
      @success="searchList"></Edit>
    <!-- 详情组件 -->
    <Detail v-if="isCheck" @close="handleCancel"
      :title="editTitle" :id="id"
      :varTypeEnum="varTypeEnum" :dataTypeEnum="dataTypeEnum"
      :paramTypeEnum="paramTypeEnum"></Detail>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import Edit from './Edit'
  import Detail from '@/pages/credit-rating/index-var/Detail'
  import { getEvalVarType, getEvalDataType, getEvalParamType } from '../../../api/enum.api'
  import { getIndexVarList } from '../../../api/credit-rating/index-var.api'

  export default {
    name: 'IndexVar',
    mixins: [commonMixin, permission],
    components: {
      Edit,
      Detail
    },
    data () {
      return {
        moduleName: '变量',
        id: '', // 查看详情的id
        listQuery: {
          varName: '',
          varType: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '变量名称', slot: 'varName' },
          { title: '变量编码', key: 'varCode' },
          { title: '变量类型', slot: 'varType' },
          { title: '数据类型', slot: 'dataType' },
          { title: '模板内容', key: 'tplContent' },
          { title: '描述', key: 'varDesc', ellipsis: true, tooltip: true },
          { title: '操作', slot: 'action', width: 120 }
        ],
        varTypeEnum: {},
        dataTypeEnum: {},
        paramTypeEnum: {},
        varTypeOptions: [], // 变量类型下拉框 用于父子组件
        dataTypeOptions: [], // 数据类型下拉框 用于子组件
        paramTypeOptions: [] // 参数类型下拉框  用于子组件
      }
    },
    created () {
      this.getEnum()
      this.searchList()
    },
    methods: {
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          varName: '',
          varType: ''
        }
        this.searchList()
      },
      handleCreate () {
        this.openEditPage('create')
      },
      handleCheck (id) {
        this.id = id
        this.openEditPage('check')
      },
      handleModify () {
        this.openEditPage('modify')
      },
      handleRemove () {

      },
      async searchList () {
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
      async getEnum () {
        try {
          const [varType, dataType, paramType] = await Promise.all([
            getEvalVarType(), getEvalDataType(), getEvalParamType()
          ])
          this.varTypeEnum = varType
          this.dataTypeEnum = dataType
          this.paramTypeEnum = paramType
          this.initOptions()
        } catch (error) {
          console.log(error)
        }
      },
      // 构建所需枚举类型下拉框的option
      initOptions () {
        // 变量类型下拉框option使用的枚举值
          for (const key in this.varTypeEnum) {
            if (this.varTypeEnum.hasOwnProperty(key)) {
              const element = this.varTypeEnum[key]
              this.varTypeOptions.push({
                label: element,
                value: key
              })
            }
          }
        // 数据类型下拉框option使用的枚举值
        for (const key in this.dataTypeEnum) {
          if (this.dataTypeEnum.hasOwnProperty(key)) {
            const element = this.dataTypeEnum[key]
            this.dataTypeOptions.push({
              label: element,
              value: key
            })
          }
        }
        // 参数类型下拉框option使用的枚举值
        for (const key in this.paramTypeEnum) {
          if (this.paramTypeEnum.hasOwnProperty(key)) {
            const element = this.paramTypeEnum[key]
            this.paramTypeOptions.push({
              label: element,
              value: key
            })
          }
        }
      }
    }
  }
</script>

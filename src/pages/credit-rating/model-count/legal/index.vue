<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input v-model="listQuery.varName" placeholder="请输入名称"></b-input>
          </v-filter-item>
           <v-filter-item title="评价方案">
            <b-select v-model="listQuery.varType">
              <b-option v-for="item in varTypeOptions" :key="item.value"
                :value="item.value">{{ item.label }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="评级等级">
            <b-select v-model="listQuery.varType">
              <b-option v-for="item in varTypeOptions" :key="item.value"
                :value="item.value">{{ item.label }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!-- 操作栏 -->
        <v-table-tool-bar>
          <b-button type="primary" icon="ios-add-circle-outline"
            @click="handleCheck(1)">重新计算</b-button>
          <b-button plain icon="md-list">模板计算</b-button>
          <b-button plain icon="ios-arrow-round-down">下载模板</b-button>
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

          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleModify(row)">
              信用报告
            </b-button>
          </template>
        </b-table>
        <!-- 分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>

    <detail v-if="isCheck"
      @close="handleCancel"
      :title="editTitle"></detail>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import Detail from './Detail'
  import { getEvalVarType, getEvalDataType, getEvalParamType } from '../../../../api/enum.api'
  import { getIndexVarList, deleteIndexVar } from '../../../../api/credit-rating/index-var.api'

  export default {
    name: 'ModelCountLegal',
    mixins: [commonMixin, permission],
    components: {
      Detail
    },
    data () {
      return {
        id: '', // 查看详情的id
        editData: null, // 编辑操作使用的数据
        listQuery: {
          varName: '',
          varType: ''
        },
        columns: [
          { type: 'selection', width: 50, align: 'center' },
          { title: '名称', slot: 'varName' },
          {
            title: '统一社会信用码',
            key: 'varCode',
            width: 140,
            ellipsis: true,
            tooltip: true,
            align: 'center'
          },
          { title: '评价方案名称', slot: 'modelId', align: 'center' },
          { title: '等级标准', slot: 'dataType', align: 'center' },
          { title: '评价得分', key: 'tplContent', ellipsis: true, tooltip: true, align: 'center' },
          { title: '评价等级', key: 'varDesc', ellipsis: true, tooltip: true, align: 'center' },
          { title: '评价日期', key: 'varDesc', ellipsis: true, tooltip: true, align: 'center' },
          { title: '操作', slot: 'action', width: 120, align: 'center' }
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
      handleModify (row) {
        this.editData = row
        this.openEditPage('modify')
      },
      async searchList () {
        this.listLoading = true
        try {
          const res = await getIndexVarList(this.listQuery)
          // this.setListData({
          //   list: res.rows,
          //   total: res.total
          // })
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

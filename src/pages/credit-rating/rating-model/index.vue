<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input v-model="listQuery.modelName" placeholder="请输入"></b-input>
          </v-filter-item>
          <v-filter-item title="主体类型">
            <b-cascader :data="subjectType" v-model="listQuery.bizType"
              change-on-select></b-cascader>
          </v-filter-item>
          <v-filter-item title="状态">
            <b-select v-model="listQuery.modelStatus">
              <b-option v-for="(value, key) in statusEnum" :key="value" :value="key">
                {{ value }}
              </b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <v-table-tool-bar>
          <b-button type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>

        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:modelName="{ row }">
            <b-button type="text" @click="handleCheck(row)">{{ row.modelName }}</b-button>
          </template>
          <template v-slot:personClass="{ row }">
            {{ personClassEnum[row.personClass]}}
          </template>
          <template v-slot:ratingId>
            <b-button type="text">等级标准 ></b-button>
          </template>
          <template v-slot:modelIndex>
            <b-button type="text">模型指标 ></b-button>
          </template>
          <template v-slot:sysDefault="{ row }">
            {{ defaultEnum[row.sysDefault] }}
          </template>
          <template v-slot:modelStatus="{ row }">
            <b-switch true-value="Y" false-value="D"
              :value="row.modelStatus"></b-switch>
          </template>
          <!-- 操作栏 -->
          <template v-slot:action="scope">
            <b-button type="text" @click="handleModify(scope.row)">
              修改
            </b-button>
            <!-- 是否有删除键 -->
            <template>
              <b-divider type="vertical"></b-divider>
              <b-button type="text" text-color="danger" @click="handleRemove(scope.row.id)">删除</b-button>
            </template>
          </template>
        </b-table>

        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>

    <edit v-if="isEdit" @close="handleClose"
      :title="editTitle"></edit>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import Edit from './Edit'
  import { getEvalCommonStatus, getEvalSysDefault } from '../../../api/enum.api'
  import { getSubjectTypeTree, getRatingModelList } from '../../../api/credit-rating/rating-model.api'

  export default {
    name: 'RatingModel',
    mixins: [commonMixin, permission],
    components: {
      Edit
    },
    data () {
      return {
        personClassEnum: {}, // 主题类别枚举
        statusEnum: {}, // 状态枚举
        defaultEnum: {}, // 缺省模型枚举
        listQuery: {
          modelName: '',
          bizType: [],
          modelStatus: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', slot: 'modelName', align: 'center' },
          { title: '编码', key: 'modelCode', align: 'center' },
          { title: '主体类别', slot: 'personClass', align: 'center' },
          { title: '等级标准', slot: 'ratingId', align: 'center' },
          { title: '模型指标', slot: 'modelIndex', align: 'center' },
          { title: '缺省模型', slot: 'sysDefault', align: 'center' },
          { title: '状态', slot: 'modelStatus', align: 'center' },
          { title: '描述', key: 'modelDesc', ellipsis: true, tooltip: true },
          { title: '操作', slot: 'action', width: 120, align: 'center' }
        ]
      }
    },
    computed: {
      subjectType () {
        return this.$store.state.ratingModel.subjectType
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
          ratingName: ''
        }
        this.searchList()
      },
      handleCreate () {
        this.openEditPage('create')
      },
      handleCheck (row) {
        this.openEditPage('check')
      },
      handleModify (row) {
        this.openEditPage('modify')
      },
      handleClose () {
        this.handleCancel()
      },
      async getEnum() {
        // 主体类别树信息 code=A
        try {
          const [tree, statusEnum, defaultEnum] = await Promise.all([
            getSubjectTypeTree(), getEvalCommonStatus(), getEvalSysDefault()
          ])
          // 构建主体类别级联框使用数据
          this.$store.dispatch('buildSubjectType', [tree])
          // 返回的树形需要格式化成级联菜单的结构，并需要扁平化一次，用于table显示取值
          let personClasses = []
          let mapper = (node, parentCode) => {
            personClasses.push({ key: node.code, value: node.text })
            let parents = parentCode ? parentCode.split(',') : []
            parents.push(node.code)
            let child = []
            if (node.children) {
              node.children.forEach(item => {
                child.push(mapper(item, parents.join(',')))
              })
            }
            return {
              value: node.code,
              label: node.text,
              choose: parents, // 配合级联展开时使用
              children: child
            }
          }
          // 转换级联菜单格式
          let data = tree ? mapper(tree) : {}
          // 转换类型映射值（扁平化）
          const map = {}
          personClasses.forEach(item => {
            map[item.key] = item.value
          })
          this.personClassEnum = map // 主体类别枚举
          this.statusEnum = statusEnum // 状态枚举
          this.defaultEnum = defaultEnum // 缺省模型枚举
        } catch (error) {
          console.error(error)
        }
      },
      async searchList () {
        this.listLoading = true
        try {
          const res = await getRatingModelList(this.listQuery)
          this.setListData({
            list: res.rows,
            total: res.total
          })
        } catch (error) {
          console.error(error)
        }
        this.listLoading = false
      }
    }
  }
</script>

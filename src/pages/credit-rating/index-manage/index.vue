<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 树结构 -->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
          @on-select-change="handTreeCurrentChange"></b-tree>
        <!-- 查询条件 -->
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input v-model.trim="listQuery.name" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="指标性质">
            <b-select v-model="listQuery.nature" clearable>
              <b-option :value="1">优先指标</b-option>
              <b-option :value="2">普通指标</b-option>
              <b-option :value="3">降级指标</b-option>
              <b-option :value="4">关联降级指标</b-option>
            </b-select>
          </v-filter-item>
          <!-- 添加查询按钮位置 -->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!-- 操作栏 -->
        <v-table-tool-bar>
          <b-button v-if="canCreate" type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <!-- 中央表格 -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:name="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.name }}</b-button>
          </template>
          <!-- 操作栏 -->
          <template v-slot:action="scope">
            <b-button type="text" @click="handleModify(scope.row)">
              编辑
            </b-button>
            <b-divider type="vertical"></b-divider>
            <b-button type="text" text-color="danger" @click="handleRemove(scope.row)">删除
            </b-button>
          </template>
        </b-table>
        <!-- 下方分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <!-- 编辑 -->
    <Edit v-show="isEdit" :title="editTitle" @close="handleCancel"></Edit>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import Edit from '@/pages/credit-rating/index-manage/Edit'

  export default {
    name: 'IndexManage',
    mixins: [commonMixin, permission],
    components: {
      Edit
    },
    data () {
      return {
        moduleName: '指标',
        treeData: [],
        listQuery: {
          name: '',
          nature: ''
        },
        list: [
          {
            code: '编码',
            name: '名称',
            nature: '指标性质',
            scale: '标度',
            timeLimit: '有效期限'
          }
        ],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '编码', key: 'code' },
          { title: '名称', slot: 'name' },
          { title: '指标性质', key: 'nature' },
          { title: '标度', key: 'scale' },
          { title: '有效期限', key: 'timeLimit' },
          { title: '操作', slot: 'action', width: 120 }
        ]
      }
    },
    created () {

    },
    methods: {
      handTreeCurrentChange () {

      },
      resetQuery () {

      },
      handleCreate () {
        this.openEditPage('create')
      },
      handleCurrentChange () {

      },
      handleSizeChange () {

      },
      handleModify () {
        this.openEditPage('modify')
      },
      handleRemove () {

      }
    }
  }
</script>

<template>
  <div>
    <page-header-wrap>
      <v-table-wrap>
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input placeholder="请输入"></b-input>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <v-table-tool-bar>
            <b-button type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
          </v-table-tool-bar>

        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:levelDetails="scope">
              <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.name }}</b-button>
            </template>
            <!-- 操作栏 -->
            <template v-slot:action="scope">
              <b-button type="text" @click="handleModify(scope.row)">
                修改
              </b-button>
              <!-- 是否有删除键 -->
              <template>
                <b-divider type="vertical"></b-divider>
                <b-button type="text" text-color="danger" @click="handleRemove(scope.row)">删除</b-button>
              </template>
            </template>
        </b-table>

        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>

    <Edit :openEdit="openEdit" :title="editTitle" @close="closeHandler"></Edit>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import Edit from '@/pages/credit-rating/level-standard/Edit'

  export default {
    name: 'LevelStandard',
    mixins: [commonMixin, permission],
    components: {
      Edit
    },
    data () {
      return {
        moduleName: '等级标准',
        listQuery: {
          page: 1
        },
        list: [],
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', key: 'ratingName' },
          { title: '描述', key: 'ratingDesc' },
          { title: '编码', key: 'code' },
          { title: '等级明细', slot: 'levelDetails' },
          { title: '操作', slot: 'action', width: 120 }
        ],
        openEdit: false
      }
    },
    created () {

    },
    methods: {
      handleFilter () {

      },
      resetQuery () {

      },
      handleCreate () {
        this.openEditPage('create')
        this.openEdit = true
      },
      handleModify () {

      },
      handleRemove () {

      },
      closeHandler () {
        this.openEdit = false
      }
    }
  }
</script>

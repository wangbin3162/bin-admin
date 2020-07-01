<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar @keyup-enter="handleFilter">
           <v-filter-item title="主体名称">
            <b-input v-model="listQuery.name" placeholder="请输入主体名称"></b-input>
          </v-filter-item>
          <v-filter-item title="资源目录">
            <b-input v-model="listQuery.resourceName" placeholder="请输入资源目录"></b-input>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <!-- table -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:name="{ row }">
            <b-button type="text" t-ellipsis :title="row.name" @click="handleNameBtn(row)">
              {{ row.name }}
            </b-button>
          </template>

          <template v-slot:dealMode="{ row }">
            {{ dealModeEnum[row.dealMode] || '申请修复' }}
          </template>

          <template v-slot:status="{ row }">
            {{ statusEnum[row.status] }}
          </template>

          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleCheck(row)">
              查看
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
      @close="handleClose"
      :title="editTitle"
      :detail="curRow">
    </detail>

    <base-info v-if="dialogStatus === 'baseInfo'"
      @close="handleClose"
      :title="curRow.name"
      :personId="curRow.personId"
      :resourceKey="curRow.resourceKey">
    </base-info>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import { getFocusRosterList } from '../../../../api/credit-service/credit-repair.api'
  import Detail from './Detail'
  import BaseInfo from './BaseInfo'

  export default {
    name: 'FocusRoster',
    mixins: [commonMixin, permission],
    components: {
      Detail,
      BaseInfo
    },
    data () {
      return {
        moduleName: '信用修复申请',
        curRow: null, // 当前行数据
        listQuery: {
          resourceName: '',
          name: '',
          status: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '主体名称', slot: 'name' },
          { title: '录入类型', key: 'lrlx' },
          { title: '资源目录', key: 'resourceName' },
          { title: '关注时间', key: 'lrrq' },
          { title: '关注截止期', key: 'jzrq' },
          { title: '关注部门', key: 'departName' },
          { title: '状态', key: 'zt' },
          { title: '操作', slot: 'action', width: 120 }
        ]
      }
    },
    computed: {
      lrlxEnum () {
        return this.$store.state.creditRepair.lrlxEnum
      },
      ztEnum () {
        return this.$store.state.creditRepair.ztEnum
      }
    },
    created () {
      this.searchList()
    },
    methods: {
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          name: '',
          resourceName: ''
        }
        this.searchList()
      },
      /**
       * @author haodongdong
       * @description 主题名称按钮回调
       * @param {Object} row 当前行数据
       */
      handleNameBtn (row) {
        this.curRow = row
        // this.dialogStatus = 'baseInfo'
      },
      // 查看按钮回调
      handleCheck (row) {
        this.curRow = row
        this.openEditPage('check')
      },
      // 处理编辑框关闭事件
      handleClose () {
        // 清空可能存在的待编辑数据
        this.curRow = null
        this.handleCancel()
      },
      async searchList () {
        this.listLoading = true
        try {
          const res = await getFocusRosterList(this.listQuery)

          res.rows.forEach(item => {
            item.lrlx = this.lrlxEnum[item.lrlx]
            item.zt = this.ztEnum[item.zt]
          })

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

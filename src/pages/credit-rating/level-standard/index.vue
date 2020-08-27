<template>
  <div>
    <page-header-wrap v-show="isNormal || isEdit">
      <v-table-wrap>
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="名称">
            <b-input v-model="listQuery.ratingName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <v-table-tool-bar>
          <b-button type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>

        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:ratingName="scope">
            <b-button type="text" @click="handleCheck(scope.row)">{{ scope.row.ratingName }}</b-button>
          </template>
          <template v-slot:levelDetails="scope">
            <b-button type="text" @click="handleLevelStandard(scope.row.id)">设置评分标准</b-button>
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

    <set-score v-if="dialogStatus === 'setScore'" :ratingId="ratingId" @close="handleCancel"></set-score>

    <detail v-if="isCheck"
      @close="handleCancel"
      :title="editTitle"
      :ratingId="ratingId"
      :pointsTypeEnum="pointsTypeEnum"></detail>

    <edit :openEdit="openEdit"
      @close="handleClose"
      @closed="handleClosed"
      @success="searchList"
      :title="editTitle"
      :editData="editData"
      :pointsTypeEnum="pointsTypeEnum"></edit>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import Edit from './Edit'
  import Detail from './Detail'
  import SetScore from './SetScore'
  import { getLevelStandardList, deleteLevelStandard } from '@/api/credit-rating/level-standard.api'
  import { getPointsType } from '@/api/enum.api'

  export default {
    name: 'LevelStandard',
    mixins: [commonMixin, permission],
    components: {
      Edit,
      Detail,
      SetScore
    },
    data () {
      return {
        pointsTypeEnum: {}, // 分制枚举
        listQuery: {
          ratingName: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', slot: 'ratingName' },
          { title: '编码', key: 'ratingCode' },
          { title: '等级明细', slot: 'levelDetails' },
          { title: '描述', key: 'ratingDesc', ellipsis: true, tooltip: true },
          { title: '操作', slot: 'action', width: 120 }
        ],
        editData: null, // 需要编辑的数据，新增时设为null
        openEdit: false,
        ratingId: null
      }
    },
    created () {
      this.getPointsType()
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
        this.editData = null
        this.openEdit = true
      },
      handleCheck (row) {
        this.ratingId = row.id
        this.openEditPage('check')
      },
      handleLevelStandard (id) {
        this.ratingId = id
        this.dialogStatus = 'setScore'
      },
      handleModify (row) {
        this.openEditPage('modify')
        this.editData = row
        this.openEdit = true
      },
      async handleRemove (id) {
        this.$confirm({
          title: '删除',
          content: '确定要删除当前等级标准吗？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              const [success, errorMsg] = await deleteLevelStandard(id)
              if (success) {
                this.$message({ type: 'success', content: '操作成功' })
                this.searchList()
              } else {
                this.$notice.danger({ title: '操作错误', desc: errorMsg })
              }
            } catch (error) {
              this.$notice.danger({ title: '操作错误', desc: error })
            }
            this.$modal.remove()
          }
        })
      },
      // 弹框关闭的回调
      handleClose () {
        this.openEdit = false
      },
      // 弹框关闭动画结束后的回调
      handleClosed () {
        this.editData = null // 弹框关闭后编辑数据清空
      },
      // 获取等级分制类型枚举
      async getPointsType () {
        try {
          const res = await getPointsType()
          this.pointsTypeEnum = res
        } catch (error) {
          console.error(error)
        }
      },
      async searchList () {
        this.listLoading = true
        try {
          const res = await getLevelStandardList(this.listQuery)
          this.setListData({
            list: res.rows,
            total: res.total
          })
        } catch (error) {
          console.log(error)
        }
        this.listLoading = false
      }
    }
  }
</script>

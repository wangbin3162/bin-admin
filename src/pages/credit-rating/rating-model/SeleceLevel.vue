<template>
  <div>
    <b-modal v-model="showDialog" width="70%"
      title="选择等级标准" footer-hide
      :body-styles="{ padding: 0 }" :styles="{ top: '7%' }"
      @on-visible-change="handleVisibleChange">
      <v-table-wrap v-show="isNormal">
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input v-model="listQuery.ratingName" placeholder="请输入"></b-input>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
          <template v-slot:levelDetails="scope">
            <b-button type="text" @click="handleCheck(scope.row.id)">
              查看明细
            </b-button>
          </template>
          <!-- 操作栏 -->
          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleSelected(row)">
              选择
            </b-button>
          </template>
        </b-table>

        <b-page :total="total" size="small" :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getLevelStandardList, deleteLevelStandard } from '../../../api/credit-rating/level-standard.api'
  import { getPointsType } from '../../../api/enum.api'

  export default {
    name: 'LevelStandard',
    mixins: [commonMixin, permission],
    props: ['open'],
    components: {},
    data () {
      return {
        pointsTypeEnum: {}, // 分制枚举
        listQuery: {
          ratingName: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '名称', key: 'ratingName' },
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
    computed: {
      showDialog: {
        get () {
          return this.open
        },
        set (val) {
          // 通过setter hack 弹框的v-model
          this.$emit('close') // 发送关闭弹框的事件
        }
      }
    },
    created () {

    },
    methods: {
      handleVisibleChange (visible) {
        if (visible) {
          this.getPointsType()
          this.searchList()
        } else {

        }
      },
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          ratingName: ''
        }
        this.searchList()
      },
      handleCheck (row) {
        this.ratingId = row.id
        this.openEditPage('check')
      },
      handleSelected (row) {
        this.$emit('selected', row)
        this.showDialog = false
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

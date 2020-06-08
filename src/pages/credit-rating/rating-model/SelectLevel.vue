<template>
  <div>
    <b-modal v-model="showDialog" width="70%"
      title="选择等级标准" footer-hide
      :body-styles="{ padding: 0 }" :styles="{ top: '7%' }"
      @on-visible-change="handleVisibleChange">
      <v-table-wrap v-if="isNormal">
        <v-filter-bar>
          <v-filter-item title="名称">
            <b-input v-model="listQuery.ratingName" placeholder="请输入"></b-input>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
          <template v-slot:levelDetails="{ row }">
            <b-button type="text" @click="handleCheck(row.id)">
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

      <v-edit-wrap v-if="isCheck">
        <div slot="full" style="position: relative;">
          <!-- <v-title-bar label="评分标准 详情" class="mb-15"></v-title-bar> -->
          <b-table :columns="columnsLevel" :loading="levelLoading"
            :data="levelList" size="small"></b-table>
          <div flex="main:right" style="margin-top: 10px;">
            <b-button plain @click="handleCancel">返回</b-button>
          </div>
        </div>
      </v-edit-wrap>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getLevelStandardList, getDetailByRatingId } from '../../../api/credit-rating/level-standard.api'
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
        columnsLevel: [
          { type: 'index', width: 50, align: 'center' },
          { title: '等级', key: 'levelName' },
          { title: '下限值  (', key: 'dnScore' },
          { title: '上限值  ]', key: 'upScore' },
          { title: '描述', key: 'levelDesc', ellipsis: true, tooltip: true }
        ],
        levelLoading: false, // 等级列表载入效果
        levelList: [] // 等级标准
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
          this.handleCancel()
          this.resetQuery()
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
      async handleCheck (id) {
        this.openEditPage('check')
        try {
          this.levelLoading = true
          const res = await getDetailByRatingId(id)
          this.levelList = res.items
        } catch (error) {
          this.$notice.danger({
            title: '载入详情失败',
            desc: error
          })
        }
        this.levelLoading = false
      },
      handleSelected (row) {
        this.$emit('selected', row)
        this.showDialog = false
      },
      // 弹框关闭动画结束后的回调
      handleClosed () {

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

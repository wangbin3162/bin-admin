<template>
  <div class="focus-industry">
    <div class="header">
      <span>一共{{ total }}条数据</span>

      <b-button type="text" @click="open = true">
        + 添加监管
      </b-button>
    </div>

    <b-table :columns="columns" :data="list" class="m15" :loading="listLoading">
      <template v-slot:ratio="{ row }">
        <b-progress :percent="row.ratio">
        </b-progress>
      </template>

      <template v-slot:action="{ row }">
        <b-button type="text" @click="handleCancelSupervisionBtn(row.code, 'KI')">
          取消监管
        </b-button>
      </template>
    </b-table>

    <div flex="main:right" class="mb-20 pr-10">
      <b-page :total="total"
        :current.sync="query.page"
        :page-size="query.size"
        show-elevator
        @on-change="handlePageChange">
      </b-page>
    </div>

    <add-supervision v-model="open" @success="getList">
    </add-supervision>
  </div>
</template>

<script>
  import { getFocusIndustry, cancelSupervision } from '@/api/credit-supervision/my-supervision.api'
  import AddSupervision from './AddSupervision'

  export default {
    name: 'FocusIndustrSupervision',
    props: {

    },
    components: {
      AddSupervision
    },
    data () {
      return {
        open: false,
        total: 0,
        query: {
          size: 10,
          page: 1
        },
        columns: [
          { type: 'index', width: 50 },
          { title: '行业名称', key: 'name' },
          { title: '黑名单数量', key: 'count', align: 'center' },
          { title: '占比', slot: 'ratio', align: 'center' },
          { title: '操作', slot: 'action', width: 120, align: 'center' }
        ],
        listLoading: false,
        list: []
      }
    },
    created () {
      this.getList()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 获取市场主体监管列表
       */
      async getList () {
        this.listLoading = true
        try {
          const { total, rows } = await getFocusIndustry(this.query)
          rows.forEach(item => {
            if (item.ratio) {
              item.ratio = Number((item.ratio * 100).toFixed(2))
            } else {
              item.ratio = 0
            }
          })
          this.list = rows
          this.total = total
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '加载失败',
            desc: error
          })
        }
        this.listLoading = false
      },

      /**
       * @author haodongdong
       * @description 取消监管按钮回调
       * @param {string} code 当前记录的code
       * @param {string} jgType 监管类型
       */
      handleCancelSupervisionBtn (code, jgType) {
        this.$confirm({
          title: '提示',
          content: '确认要取消监管吗？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              await cancelSupervision(code, jgType)
              this.getList()
              this.$message({ type: 'success', content: '操作成功' })
            } catch (error) {
              console.error(error)
              this.$notice.danger({ title: '操作错误', desc: error })
            }
            this.$modal.remove()
          }
        })
      },

      /**
       * @author haodongdong
       * @description 分页组件页面切换回调
       * @param {number} page
       */
      handlePageChange (page) {
        this.query.page = page
        this.getList()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .focus-industry {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      height: 50px;
      border-bottom: 1px solid #d9d9d9;

      span {
        color: #8c8c8c;
      }
    }

  }
</style>

<template>
  <cre-sup-layout>
    <div class="market-players-wran">
      <cre-sup-header></cre-sup-header>

      <div class="search">
        <p>市场主体预警</p>
        <span>及时掌握信用变动信息</span>
      </div>

      <div class="main-con">
        <div class="left">
          <div class="header">
            <span>一共{{ total }}条数据</span>
          </div>

          <b-table :columns="columns" :data="list" :loading="listLoading" class="m15">
            <template v-slot:action="{ row }">
              <span v-if="row.supervise === '1'">已添加</span>
              <b-button v-else type="text" @click="handleAddSupervisionBtn(row)">
                添加监管
              </b-button>
            </template>
          </b-table>

          <div flex="main:right" class="pr-10">
            <b-page :total="total"
              :current.sync="query.page"
              :page-size="query.size"
              show-elevator
              @on-change="handlePageChange">
            </b-page>
          </div>
        </div>

        <div class="right">
          <!-- 右侧头部导航 -->
          <tip-my-supervision class="mb-10"></tip-my-supervision>
          <!-- 行业黑名单排行 -->
          <tip-industry-black-list></tip-industry-black-list>
        </div>
      </div>
    </div>
  </cre-sup-layout>
</template>

<script>
  import { getMarketWarnList } from '@/api/credit-supervision/market-players-warn.api'
  import { addSupervision } from '@/api/credit-supervision/my-supervision.api'
  import CreSupLayout from '@/pages/credit-supervision/components/CreSupLayout'
  import CreSupHeader from '@/pages/credit-supervision/components/CreSupHeader'
  import TipMySupervision from '@/pages/credit-supervision/components/TipMySupervision'
  import TipIndustryBlackList from '@/pages/credit-supervision/components/TipIndustryBlackList'

  export default {
    name: 'MarketPlayersWarn',
    components: {
      CreSupLayout,
      CreSupHeader,
      TipMySupervision,
      TipIndustryBlackList
    },
    data () {
      return {
        listLoading: false,
        total: 0,
        query: {
          size: 10,
          page: 1
        },
        list: [],
        columns: [
          { type: 'index', width: 50 },
          { title: '企业名称', key: 'compName', ellipsis: true, tooltip: true },
          { title: '预警原因', key: 'resourceName', ellipsis: true, tooltip: true },
          { title: '时间', key: 'createDate' },
          { title: '操作', slot: 'action', width: 120, align: 'center' }
        ]
      }
    },
    created () {
      this.getList()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 获取市场主体预警列表
       */
      async getList () {
        this.listLoading = true
        try {
          const { total, rows } = await getMarketWarnList(this.query)
          this.total = total
          this.list = rows
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
       * @description 添加监管按钮回调
       * @param {Object} row 当前行数据
       * @param {string} row.id 主体id
       * @param {string} row.compName 主体名称
       */
      async handleAddSupervisionBtn (row) {
        try {
          await addSupervision({
            objectId: row.id,
            objectName: row.compName,
            jgType: 'MS'
          })
          this.$message({
            type: 'success',
            content: '操作成功'
          })
          this.getList()
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '操作失败',
            desc: error
          })
        }
      },

      /**
       * @author haodongdong
       * @description 分页组件页面改变回调
       * @param {number} page 当前页
       */
      handlePageChange (page) {
        this.query.page = page
        this.getList()
      }
    }
  }
</script>

<style lang="stylus" scoped>
 .market-players-wran {
    height: 100%;
    background: url("../../../assets/images/credit-supervision/banner-bg0.png") no-repeat 0 0;
    background-size: 100% 310px;
    transition: background .3s;

    .search {
      padding-top: 50px;
      height: 230px;
      width: 1300px;
      margin: 0 auto;

      p {
        margin-bottom: 5px;
        font-size: 27px;
        color: #ffffff;
      }

     span {
       color: #ffffff;
     }
    }

    .main-con {
      display: flex;
      justify-content: space-between;
      width: 1300px
      margin: 25px auto 25px;

      .left {
        width: 69%;
        background: #ffffff;
        min-height: 400px;

        .header {
          display: flex;
          align-items: center;
          padding-left: 10px;
          height: 50px;
          border-bottom: 1px solid #d9d9d9;
          color: #8c8c8c;
        }
      }

      .right {
        width: 30%;
        // background: #ffffff;
        // min-height: 400px;
      }
    }
  }
</style>

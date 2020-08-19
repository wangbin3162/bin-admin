<template>
  <div class="market-supervision">
    <div class="header">
      <span>一共{{ total }}条数据</span>

      <b-button type="text" @click="open = true">
        + 添加监管
      </b-button>
    </div>

    <ul class="list">
      <li v-for="item in list" :key="item.id" class="list-item">
        <div class="title-con">
          <div class="icon">
            <b-icon name="ios-stats" color="#0d85ff" size="30">
            </b-icon>
          </div>

          <div class="text">
            <p>
              {{ item.objectName }}
            </p>
            <div>
              <span>法定代表人：{{ item.otherInfo | valueFilter }}</span>
              <span>监管日期：{{ item.createDate }}</span>
            </div>
          </div>
        </div>

        <div>
          <b-button type="text" @click="handleCancelSupervisionBtn(item.id)">
            取消监管
          </b-button>
          <b-divider type="vertical"></b-divider>
          <b-button type="text" @click="handleViewBtn(item)">
            查看
          </b-button>
        </div>
      </li>
      <no-data v-if="!listLoading && list.length === 0"></no-data>
      <b-loading fix v-if="listLoading" show-text="加载中...."></b-loading>
    </ul>

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
  import { jgUserConfigSearch, cancelSupervision } from '@/api/credit-supervision/my-supervision.api'
  import NoData from '@/components/NoData'
  import AddSupervision from './AddSupervision'

  export default {
    name: 'MarketSupervision',
    filters: {
      valueFilter(value) {
        if (!value) {
          return '-'
        }
        return value
      }
    },
    components: {
      NoData,
      AddSupervision
    },
    data () {
      return {
        open: false,
        total: 0,
        query: {
          jgType: 'MS',
          size: 10,
          page: 1
        },
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
          const { total, rows } = await jgUserConfigSearch(this.query)
          console.log(total)
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
       * @param {string} id 当前记录的id
       */
      handleCancelSupervisionBtn (id) {
        this.$confirm({
          title: '提示',
          content: '确认要取消监管吗？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              await cancelSupervision(id)
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
       * @description 查看按钮回调
       * @param {Object} row 当前行数据
       * @param {string} row.objectId 主体id
       */
      handleViewBtn (row) {
        this.$router.push({
          name: 'recentDynamic',
          query: {
            id: row.objectId,
            type: '1' // 法人
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
  .market-supervision {
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

    ul.list {
      position: relative;
      margin-bottom: 20px;
      padding: 0 10px 0;
      min-height: 90px;

      li {
        padding: 17px 0;
        border-bottom: 1px solid #d9d9d9;

        &.list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .title-con {
            display: flex;
            align-items: top;

            .icon {
              margin: 0 20px 0 10px;
            }

            .text {
              p {
                margin-bottom: 7px;
                color: rgba(0, 0, 0, 0.75);
                font-weight: 600;

                span {
                  font-weight: 600;
                  color: #0d85ff;
                }
              }

              span {
                &:first-child {
                  display: inline-block;
                  width: 150px;
                }
                color: #8c8c8c;
              }
            }
          }

          .button {
            cursor: pointer;
            padding: 5px 15px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #d9d9d9;
            color: rgba(0, 0, 0, 0.75)
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);
            transition: 0.3s;

            &:hover {
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.12);
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="market-supervision">
    <div class="header">
      <span>一共20条数据</span>

      <b-button type="text" @click="open = true">
        + 添加监管
      </b-button>
    </div>

    <ul>
      <li v-for="n in 7" :key="n" class="list-item">
        <div class="title-con">
          <div class="icon">
            <b-icon name="ios-stats" color="#0d85ff" size="30">
            </b-icon>
          </div>

          <div class="text">
            <p>
              江苏浮云网络科技有限公司
            </p>
            <div>
              <span>法定代表人：郭大宁</span>
              <span>监管日期：2020-07-27 15:30:20</span>
            </div>
          </div>
        </div>

        <div>
          <b-button type="text">
            取消监管
          </b-button>
          <b-divider type="vertical"></b-divider>
          <b-button type="text">
            查看
          </b-button>
        </div>
      </li>
    </ul>

    <div flex="main:right">
      <b-page :total="total"
        :current.sync="query.page"
        :page-size="query.size"
        @on-change="handlePageChange">
      </b-page>
    </div>

    <add-supervision v-model="open"></add-supervision>
  </div>
</template>

<script>
  import AddSupervision from '@/pages/credit-supervision/my-supervision/market/AddSupervision'

  export default {
    name: 'MarketSupervision',
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
        }
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description 分页组件页面切换回调
       */
      handlePageChange () {

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

    ul {
      margin-bottom: 20px;
      padding: 0 10px 0;

      li {
        padding: 17px 0;
        border-bottom: 1px solid #d9d9d9;

        &.list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .title-con {
            display: flex;
            align-items: center;

            .icon {
              margin-right: 10px;
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

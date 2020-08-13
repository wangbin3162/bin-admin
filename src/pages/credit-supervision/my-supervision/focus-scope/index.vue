<template>
  <div class="focus-scope">
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
            <b-icon name="ios-list-box" color="#0d85ff" size="30">
            </b-icon>
          </div>

          <div class="text">
            <p>
              法人行政处罚
            </p>
            <div>
              <span>添加时间：2020-07-27 15:30:20</span>
              <span>主体类别：2020-07-27 15:30:20</span>
            </div>
          </div>
        </div>

        <div>
          <b-button type="text">
            取消监管
          </b-button>
        </div>
      </li>
    </ul>

    <div flex="main:right">
      <b-page :total="total"
        :current.sync="query.page"
        :page-size="query.size"
        show-elevator
        @on-change="handlePageChange">
      </b-page>
    </div>

    <add-supervision v-model="open"></add-supervision>
  </div>
</template>

<script>
  import AddSupervision from './AddSupervision'

  export default {
    name: 'FocusCrowdSupervision',
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
  .focus-scope {
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
                  width: 240px;
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

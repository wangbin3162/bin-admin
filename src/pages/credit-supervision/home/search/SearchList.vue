<template>
  <div class="list-wrap">
    <div class="list">
      <div class="total">为您找到 <em>{{ total }}</em> 条记录</div>
      <template v-for="item in list">
        <div :key="item.id" class="item">
          <keywords :size="68">{{ item.keywords[0] }}</keywords>
          <template v-if="query.type === 1">
            <div class="center" flex-box="1">
              <div flex>
                <h2>
                  {{ item.comp_name }}
                </h2>

                <icon-btn :obj="item"></icon-btn>
              </div>
              <p flex="main:justify" style="width: 45%;">
                <span>{{ mapping.fddbr }}：{{ item.fddbr }}</span>
                <span>{{ mapping.clrq }}：{{ item.clrq }}</span>
              </p>
              <!-- <p>
                <span>查看到5条信息</span>
              </p> -->
            </div>
          </template>

          <template v-else>
            <div class="center" flex-box="1">
              <div flex>
                <h2>{{ item.name }}</h2>
                <icon-btn :obj="item"></icon-btn>
              </div>
              <p>
                <span>{{ mapping.id_sfz}}：{{ item.id_sfz }}</span>
              </p>
            </div>
          </template>
          <div class="ctrl">
            <span v-waves @click="handleCheck(item.id)">查看详情</span>
          </div>
        </div>
      </template>
      <b-loading fix v-show="loading" show-text="loading"></b-loading>
      <no-data v-show="!loading && list.length===0"></no-data>
    </div>

    <div flex="main:right" class="mt-15" v-if="total > 0">
      <b-page :total="total" :current.sync="query.page"
        show-total @on-change="handlePageChange">
      </b-page>
    </div>
  </div>
</template>

<script>
  import {
    getPersonClassList
  } from '@/api/credit-supervision/home.api'
  import NoData from '@/components/NoData'
  import Keywords from '@/components/Keywords'
  import IconBtn from '@/pages/credit-supervision/home/search/IconBtn'

  export default {
    name: 'SearchList',
    components: { Keywords, NoData, IconBtn },
    data () {
      return {
        loading: false,
        query: {
          q: '',
          type: 1,
          size: 10,
          page: 1
        },
        total: 0,
        list: [],
        mapping: {} // 映射的字段
      }
    },
    methods: {
      /**
       * @author haodongdong
       * @description 搜索功能使用的查询主题信息接口
       * @param {string} query.q 查询的关键字
       * @param {number} query.type 查询类型，1：自然人 2：法人
       * @param {number} query.size 分页大小
       * @param {number} query.page 当前页
       */
      async getPersonClassList (query) {
        this.loading = true
        try {
          const res = await getPersonClassList(query)
          console.log(res)
          this.mapping = res.mapping
          this.total = res.total
          this.list = res.rows
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },

      /**
       * @author haodongdong
       * @description 使外部组件调用的查询函数
       * @param {string} q 查询关键字
       * @param {number} 查询类型，1：自然人 2：法人
       */
      search (q, type) {
        this.query.q = q
        this.query.type = type
        this.getPersonClassList(this.query)
      },

      /**
       * @author haodongdong
       * @description 监管按钮的回调
       * @param {string} supervise 是否监管
       */
      handleSupervision (supervise) {

      },

      handleCheck(id) {
        this.$emit('on-check-detail', id)
      },

      /**
       * @author haodongdong
       * @description 分页组件页面改变回调
       * @param {number} page 当前页
       */
      handlePageChange (page) {
        this.query.page = page
        this.getPersonClassList(this.query)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .list-wrap {
    width: 1300px;
    margin: 0 auto;
  }

  .list {
    position: relative;
    width: 1300px;
    padding-bottom: 198px;
    min-height: 497px;
    margin: 0 auto;
    background: #fff url("../../../../assets/images/list-bg.png") no-repeat center bottom;
    border: 1px solid #eee;
    border-bottom: none;
    .total {
      padding: 10px 20px;
      border-bottom: 1px solid #eee;
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 20px 30px;
      background: #fff;
      transition: all .3s;
      border-bottom: 1px solid #eee;
      &:hover {
        box-shadow: 0 0 8px #eee;
        background: #fff url("../../../../assets/images/list-item-bg.png") no-repeat center center;
      }
      .center {
        padding: 0 40px;
        h2 {
          margin: 0;
          // font-weight: normal;
          font-size: 17px;
          color: #333333;
          margin-bottom: 6px;
        }
        p {
          margin: 0;
          line-height: 25px;
        }
      }
      .ctrl {
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          cursor: pointer;
          color: #1c8ee7;
          padding: 7px 15px;
          border-radius: 20px;
          border: 1px solid #eee;
          box-shadow: 0 0 5px #eeeeee;
          transition: .3s;
          &:hover {
            box-shadow: 0 2px 5px #bee1f5;
          }
        }
      }
    }
  }
</style>

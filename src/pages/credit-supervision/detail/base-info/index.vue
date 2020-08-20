<template>
  <div class="base-info">
    <div flex>
      <!-- 基本信息 -->
      <keywords cls="color-0" :size="68">
        {{ detail.keywords ? detail.keywords[0] : '' }}
      </keywords>

      <div class="info-con">
        <template v-if="isLeg">
          <div class="info-title">
            <span class="name">
              <!-- 主体名称 -->
              {{ detail.comp_name }}
            </span>

            <span  type="success" class="status-tag">
              {{ detail.djzt }}
            </span>

            <icon-btn :supervisionStatus="detail.supervise"
              :objectId="detail.id"
              :objectName="detail.comp_name"
              @success="handleSuccess">
            </icon-btn>
          </div>

          <div class="info-other">
            <span>{{ mapping.fddbr }}：{{ detail.fddbr | valueFilter }}</span>
            <span>{{ mapping.clrq }}：{{ detail.clrq }}</span>
          </div>
        </template>

        <template v-else>
          <div class="info-title">
            <span class="name">
              <!-- 主体名称 -->
              {{ detail.name }}
            </span>

            <icon-btn :supervisionStatus="detail.supervise"
              :objectId="detail.id"
              :objectName="detail.name"
              @success="handleSuccess">
            </icon-btn>
          </div>

          <div class="info-other">
            <span>{{ detail.id_type }}：{{ detail.id_code }}</span>
          </div>
        </template>

        <div class="info-tag">
          <!-- tag info -->
          <!-- <div v-for="n in 20" :key="n" class="tag t-ellipsis">
            <span class="dot" :class="{ red: n % 2 === 0}">
            </span>
            海关认证企业
          </div> -->
          <template v-for="item in redBlackList" >
            <b-tooltip :key="item.resourceKey"
              :content="item.nameListType === '1' ? '红名单' : '黑名单'"
              placement="top-start">
              <div class="tag t-ellipsis">
                <span class="dot" :class="{ red: item.nameListType === '1'}">
                </span>
                {{ item.resourceName }}
              </div>
            </b-tooltip>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  import { getDetail } from '@/api/credit-supervision/detail.api'
  import Keywords from '@/components/Keywords/index'
  import IconBtn from '@/pages/credit-supervision/components/IconBtn'

  export default {
    name: 'CreditSupervisionDetailBaseInfo',
    filters: {
      valueFilter (value) {
        let res = value
        if (!value) {
          res = '-'
        }
        return res
      }
    },
    components: {
      Keywords,
      IconBtn
    },
    data () {
      return {
        routeQuery: {} // 路由参数
      }
    },
    computed: {
      ...mapState({
        mapping: state => state.creSupDetail.detailRes.mapping || {}, // 用于映射的字段名
        detail: state => state.creSupDetail.detailRes.data || {}, // 详情信息
        redBlackList: state => state.creSupDetail.redBlackListInfo // 红黑名单
      }),
      isLeg () { // 根据路由参数判断主体类型是法人还是自然人
        let res = true
        if (this.routeQuery.type === '2') res = false
        return res
      }
    },
    created () {
      this.routeQuery = this.$route.query
    },
    methods: {
      ...mapMutations({
        setDetailRes: 'SET_DETAIL_RES'
      }),

      /**
       * @author haodongdong
       * @descriptoin 获取主体详情
       * @param {Object} query 查询参数对象
       * @param {string} query.id 主体id
       * @param {number} query.type 主体类型 1 法人 2 自然人
       */
      async getDetail (query) {
        try {
          const res = await getDetail(query)
          this.setDetailRes(res)
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '加载失败',
            desc: error
          })
        }
      },

      /**
       * @author haodongdong
       * @description icon-btn组件success事件回调
       */
      handleSuccess () {
        const { id, type } = this.$route.query
        this.getDetail({ id, type })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .base-info {
    width: 100%;
    background: #fff url(/static/img/ziranren-bg.6e8713f0.png) no-repeat 0 0;
    border-radius: 10px;
    padding: 30px 42px;

    .info-con {
      flex: 1;
      padding: 0 40px;

      .info-title {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        .name {
          margin-right: 20px;
          font-size: 19px;
          font-weight: 600;
        }

        .status-tag {
          display: inline-block;
          padding: 2px 5px;
          background-color: rgba(24, 144, 255, 0.05);
          border: 1px solid #36d8da;
          border-radius: 4px;
          color: #36d8da;
        }
      }

      .info-other {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.75);

      }

      .info-tag {
        display: flex;
        flex-wrap: wrap;

        .tag {
          margin-bottom: 10px;
          padding: 10px 15px;
          width: 130px;
          background: #f9fafc;
          margin-right: 10px;
          color: rgba(0, 0, 0, 0.7);
          font-size: 12px;

          .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            margin-right: 5px;
            border-radius: 50%;
            background: #d9d9d9;

            &.red {
              background: #eb7d7d;
            }
          }
        }
      }
    }
  }
</style>

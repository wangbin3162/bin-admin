<template>
  <transition name="fade-scale-move">
    <div v-show="visible" class="base-info">
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

              <icon-btn :supervisionStatus="detail.supervise"></icon-btn>
            </div>

            <div class="info-other">
              <span>{{ mapping.fddbr }}：{{ detail.fddbr }}</span>
              <span>{{ mapping.clrq }}：{{ detail.clrq }}</span>
            </div>
          </template>

          <template v-else>
            <div class="info-title">
              <span class="name">
                <!-- 主体名称 -->
                {{ detail.name }}
              </span>

              <icon-btn :supervisionStatus="detail.supervise"></icon-btn>
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
  </transition>
</template>

<script>
  import { getDetail, getRedBlackOrFocusScope } from '@/api/credit-supervision/detail.api'
  import Keywords from '@/components/Keywords/index'
  import IconBtn from './IconBtn'

  export default {
    name: 'CreditSupervisionDetailBaseInfo',
    components: {
      Keywords,
      IconBtn
    },
    data () {
      return {
        visible: false, // 是否显示
        routeQuery: {}, // 路由参数
        redBlackList: [], // 红黑名单
        detail: {}, // 详情信息
        mapping: {} // 用于映射的字段名
      }
    },
    computed: {
      isLeg () { // 根据路由参数判断主体类型是法人还是自然人
        let res = true
        if (this.routeQuery.type === '2') res = false
        return res
      }
    },
    created () {
      this.init()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 一些初始化处理
       */
      init () {
        const query = this.$route.query
        this.routeQuery = query
        this.getDetail(query)
        this.getRedBlackOrFocusScope({
          personId: query.id,
          size: 1000,
          page: 1
        })
      },

      /**
       * @author haodongdong
       * @descriptoin 获取主体详情
       * @param {Object} query 查询参数对象
       * @param {string} query.id 主体id
       * @param {number} query.type 主体类型 1 法人 2 自然人
       */
      async getDetail (query) {
        try {
          const { mapping, data } = await getDetail(query)
          this.mapping = mapping
          this.detail = data
          this.visible = true
          this.$emit('loaded')
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
       * @description 获取红黑名单信息
       * @param {Object} query 查询参数对象
       * @param {string} query.personId 主体id
       * @param {number} query.size 分页大小
       * @param {number} query.page 当前页
       */
      async getRedBlackOrFocusScope (query) {
        try {
          const { rows } = await getRedBlackOrFocusScope(query)
          this.redBlackList = rows
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '加载失败',
            desc: error
          })
        }
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

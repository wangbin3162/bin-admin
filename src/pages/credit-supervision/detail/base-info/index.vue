<template>
  <div class="base-info">
    <div flex>
      <!-- 基本信息 -->
      <keywords cls="color-0" :size="68">
        浮云
      </keywords>

      <div class="info-con">
        <div class="info-title">
          <span class="name">
            江苏浮云网络科技有限公司
          </span>

          <span  type="success" class="status-tag">
            续存（在营、开业、在册）
          </span>

          <icon-btn supervisionStatus="1"></icon-btn>
        </div>

        <div class="info-other">
          <span>法定代表人：黎环乐</span>
          <span>成立日期：2020-07-07</span>
        </div>

        <div class="info-tag">
          <!-- tag info -->
          <div v-for="n in 7" :key="n" class="tag">
            海关认证企业
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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

      }
    },
    created () {

    },
    methods: {

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

        .tag {
          padding: 10px 15px;
          background: #f9fafc;
          margin-right: 10px;
          color: rgba(0, 0, 0, 0.7);
          font-size: 12px;
        }
      }
    }
  }
</style>

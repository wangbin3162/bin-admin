<template>
  <div class="tip-my-supervision">
    <b-card header="我的监管" head-tip
      shadow="never" divider="no"
      :body-style="{ padding: 0 }">
      <div v-for="item in tips" :key="item.icon" class="tip-block"
        @click="handleClick(item.link)">
        <div class="con">
          <svg-icon :icon-class="item.icon" class="icon">
          </svg-icon>
          <p>{{ item.title }}</p>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
  export default {
    name: 'TipMySupervision',
    data () {
      return {
        tips: [
          { icon: 'verified_user', title: '市场主体监管', link: '' },
          { icon: 'assignment-ind', title: '重点人群监管', link: '' },
          { icon: 'reorder', title: '重点领域监管', link: '' },
          { icon: 'view_carousel', title: '重点行业监管', link: '' }
        ]
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description 点击事件回调
       * @param {string} link 需要跳转的连接
       */
      handleClick (link) {
        this.$router.push(link)
      }
    }
  }
</script>

<style lang="stylus" scoped>
 .tip-my-supervision {
   .tip-block {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 85px;
      background: #ffffff;
      cursor: pointer;
      border-top: 1px solid #f0f0f0;
      transition: 0.3s;

      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.12);
        background: #f4fbfd;
      }

      .con {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 30px;
          height: 32px;
          width: 32px;
          color: #2bcfcf;
        }

        p {
          font-size: 16px;
        }
      }
    }
 }
</style>

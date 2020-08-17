<template>
  <div class="tip-nav">
    <div v-for="item in tips" :key="item.icon" class="tip-block"
      @click="handleClick(item.link)">
      <div class="con">
        <svg-icon :icon-class="item.icon" class="icon">
        </svg-icon>
        <p>{{ item.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TipNav',
    data () {
      return {
        tips: [
          {
            icon: 'verified_user',
            title: '市场主体',
            link: '/creditSupervision/mySupervision/MS'
          },
          {
            icon: 'assignment-ind',
            title: '重点人群',
            link: '/creditSupervision/mySupervision/KP'
          },
          {
            icon: 'reorder',
            title: '重点领域',
            link: '/creditSupervision/mySupervision/IA'
          },
          {
            icon: 'view_carousel',
            title: '重点行业',
            link: '/creditSupervision/mySupervision/KI'
          }
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
  .tip-nav {
    display: flex;
    justify-content: space-between;

    .tip-block {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ffffff;
      height: 100px;
      width: 92px;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.12);
      }

      .con {
        text-align: center;

        .icon {
          height: 26px;
          width: 26px;
          color: #2bcfcf;
          margin-bottom: 10px;
        }

        i {
          font-size: 14px;
        }
      }
    }
  }
</style>

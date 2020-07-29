<template>
   <div class="notice" :title="`您有${unreadNum}条未读通知`" @click="handleClick">
      <b-badge :value="unreadNum" class="item">
        <b-icon name="ios-notifications-outline"
          size="29" color="#ffffff">
        </b-icon>
      </b-badge>
    </div>
</template>

<script>
  import { getUnreadNum, updateUserReadNotice } from '../../api/cms/notice.api'

  export default {
    name: 'NoticeTips',
    data () {
      return {
        unreadNum: 0
      }
    },
    created () {
      this.getUnreadNum()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 获取未读消息数
       */
      async getUnreadNum () {
        try {
          const res = await getUnreadNum()
          this.unreadNum = res
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description 点击事件回调，调用更新未读通知接口成功后跳转通知列表页面
       */
      async handleClick () {
        try {
          await updateUserReadNotice()
          this.$router.push('/notice')
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .notice {
    cursor: pointer;
  }
</style>

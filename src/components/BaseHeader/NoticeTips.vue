<template>
   <div class="notice" :title="`您有${unreadNum}条未读通知`">
      <b-badge :value="unreadNum" class="item">
        <b-icon name="ios-notifications-outline"
          size="29" color="#ffffff">
        </b-icon>
      </b-badge>
    </div>
</template>

<script>
  import { getUnreadNum } from '../../api/content.api'

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
      async getUnreadNum () {
        try {
          const res = await getUnreadNum()
          this.unreadNum = res
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

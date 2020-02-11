<template>
  <div class="global-header">
    <!--toggle-btn-->
    <div class="toggle-btn">
      <b-icon :name="sidebar?'outdent':'indent'" @click.native="toggleSideBar"></b-icon>
    </div>
    <div class="header-box">
      <div class="left-box">
        <slot>
        </slot>
      </div>
      <div class="right-ctrl" flex="cross:center">
        <!--外部链接-->
        <a href="#" target="_blank" class="btn">
        <span class="action">
          <b-icon name="ios-help-circle"></b-icon>
        </span>
        </a>
        <div class="btn">
          <b-icon name="ios-notifications-outline"></b-icon>
        </div>
        <div class="btn">
          <b-icon name="ios-bug"></b-icon>
        </div>
        <div class="btn">
          <theme-setting></theme-setting>
        </div>
        <!--用户信息-->
        <user-avatar></user-avatar>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ThemeSetting from './ThemeSetting'
  import UserAvatar from './UserAvatar'

  export default {
    name: 'GlobalHeader',
    components: { UserAvatar, ThemeSetting },
    computed: {
      ...mapGetters(['sidebar'])
    },
    methods: {
      toggleSideBar () {
        this.$store.dispatch('toggleSideBar')
      }
    }
  }
</script>

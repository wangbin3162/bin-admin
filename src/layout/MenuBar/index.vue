<template>
  <div class="menu-wrapper">
    <b-scrollbar style="height: 100%;">
      <el-menu mode="vertical" :collapse="isCollapse" :class="theme"
               :default-active="$route.path"
               :unique-opened="unique">
      </el-menu>
    </b-scrollbar>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      theme: String,
      unique: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      ...mapGetters(['sidebar', 'addRouters']),
      isCollapse () {
        return !this.sidebar
      }
    }
  }
</script>

<style lang="stylus">
  .menu-wrapper {
    padding: 12px 0;
    height: calc(100% - 88px);
    .el-menu {
      border-right: none;
      &.light {

      }
      &.dark {
        background-color: #001529;
        color: #fff;
      }
    }
  }
</style>

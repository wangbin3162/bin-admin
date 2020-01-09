<template>
  <span @click="themeModal=true">
    <b-tooltip content="主题" theme="dark">
      <b-icon name="ios-color-palette"></b-icon>
    </b-tooltip>
    <b-modal v-model="themeModal" title="整体风格设置" append-to-body footer-hide>
      <div class="setting-panel" style="height:200px;">
        <!--菜单位置-->
        <p style="font-size: 16px;margin: 0;line-height: 30px;">菜单位置:</p>
        <div class="theme-tab">
          <b-tooltip content="侧边导航" theme="dark">
            <span @click="menuTypeChange('aside')">
              <img src="../../assets/images/dark.svg" alt="">
              <i v-if="menuType === 'aside'" class="iconfont icon-ios-checkmark"></i>
            </span>
          </b-tooltip>
          <b-tooltip content="顶部导航" theme="dark">
            <span @click="menuTypeChange('header')">
              <img src="../../assets/images/header.svg" alt="">
              <i v-if="menuType === 'header'" class="iconfont icon-ios-checkmark"></i>
            </span>
          </b-tooltip>
        </div>
        <!--侧边栏风格-->
        <p style="font-size: 16px;margin: 0;line-height: 30px;">侧边栏风格:</p>
        <div class="theme-tab">
          <b-tooltip content="暗色主题风格" theme="dark">
            <span @click="themChange('dark')">
              <img src="../../assets/images/dark.svg" alt="">
              <i v-if="theme === 'dark'" class="iconfont icon-ios-checkmark"></i>
            </span>
          </b-tooltip>
          <b-tooltip content="亮色主题风格" theme="dark">
            <span @click="themChange('light')">
              <img src="../../assets/images/light.svg" alt="">
              <i v-if="theme === 'light'" class="iconfont icon-ios-checkmark"></i>
            </span>
          </b-tooltip>
        </div>
      </div>
    </b-modal>
  </span>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'theme-setting',
    data () {
      return {
        themeModal: false
      }
    },
    computed: {
      ...mapGetters(['theme', 'menuType'])
    },
    methods: {
      themChange (val) {
        this.$store.dispatch('setThemeMode', val)
      },
      menuTypeChange (type) {
        this.$store.dispatch('setMenuType', type)
      }
    }
  }
</script>

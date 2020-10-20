<template>
  <div class="dropdown-trigger" @click="themeModal=true">
    <b-icon name="ios-color-palette" size="20"></b-icon>
    <!--设置抽屉-->
    <b-drawer v-model="themeModal" append-to-body :closable="false">
      <div class="setting-panel">
        <h3 class="setting-theme-title">整体风格设置:</h3>
        <div class="mb-20">
          <div class="theme-tab">
            <b-tooltip content="亮色主题风格" theme="dark">
            <span @click="themChange('light')">
              <img src="../../../assets/images/light.svg" alt="">
              <i v-if="theme === 'light'" class="iconfont icon-ios-checkmark"></i>
            </span>
            </b-tooltip>
          </div>
          <div class="theme-tab">
            <b-tooltip content="暗色主题风格" theme="dark">
            <span @click="themChange('dark')">
              <img src="../../../assets/images/dark.svg" alt="">
              <i v-if="theme === 'dark'" class="iconfont icon-ios-checkmark"></i>
            </span>
            </b-tooltip>
          </div>
        </div>
        <b-divider></b-divider>
        <h3 class="setting-theme-title">导航栏模式:</h3>
        <div class="mb-20">
          <div class="theme-tab">
            <b-tooltip content="侧边导航" theme="dark">
            <span @click="menuTypeChange('aside')">
              <img src="../../../assets/images/dark.svg" alt="">
              <i v-if="menuType === 'aside'" class="iconfont icon-ios-checkmark"></i>
            </span>
            </b-tooltip>
          </div>
          <div class="theme-tab">
            <b-tooltip content="顶部导航" theme="dark">
            <span @click="menuTypeChange('header')">
              <img src="../../../assets/images/header.svg" alt="">
              <i v-if="menuType === 'header'" class="iconfont icon-ios-checkmark"></i>
            </span>
            </b-tooltip>
          </div>
        </div>
        <b-divider></b-divider>
        <div class="setting-list-item">
          <span>内容区域宽度</span>
          <b-select size="mini" style="width:100px;" :value="wideType" @change="changeWideType">
            <b-option value="wide" v-if="menuType==='header'">固定</b-option>
            <b-option value="flow">流式</b-option>
          </b-select>
        </div>
        <div class="setting-list-item">
          <span>是否开启多页签</span>
          <b-switch size="small" :disabled="menuType==='header'" :value="tagsView"
                    @change="toggleTagsView"></b-switch>
        </div>
        <div class="setting-list-item">
          <span>固定Header</span>
          <b-switch size="small" :value="fixedHeader" @change="changeFixedHeader"></b-switch>
        </div>
        <div class="setting-list-item">
          <span>固定侧边栏</span>
          <b-switch size="small" :disabled="menuType==='header'" :value="fixedAside"
                    @change="changeFixedAside"></b-switch>
        </div>
      </div>
    </b-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Setting',
  data() {
    return {
      themeModal: false
    }
  },
  computed: {
    ...mapGetters(['theme', 'menuType', 'fixedHeader', 'fixedAside', 'tagsView', 'wideType']),
    isAside() {
      return this.menuType === 'aside'
    }
  },
  methods: {
    themChange(val) {
      this.$store.dispatch('setThemeMode', val)
    },
    menuTypeChange(type) {
      this.$store.dispatch('setMenuType', type)
      // 如果是侧边栏模式,则设置宽度类型为流式flow
      this.changeWideType(this.isAside ? 'flow' : 'wide')
      if (type === 'header') {
        // 如果设置为顶部导航，则需要清除所有缓存
        this.$store.dispatch('tagsView/delAllViews')
      }
    },
    toggleTagsView(val) {
      this.$store.dispatch('toggleTagsView')
      if (!val) {
        // 如果关闭tags，则需要关闭所有缓存
        this.$store.dispatch('tagsView/delAllViews')
      }
    },
    changeWideType(type) {
      this.$store.dispatch('setWideType', type)
    },
    changeFixedHeader(val) {
      this.$store.dispatch('toggleFixedHeader', val)
    },
    changeFixedAside(val) {
      this.$store.dispatch('toggleFixedAside', val)
    }
  }
}
</script>

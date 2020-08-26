<template>
  <b-breadcrumb class="app-breadcrumb" separator="/" v-if="$route.name!=='index'">
    <b-breadcrumb-item v-for="(item,index) in levelList" :key="item.name">
      <router-link v-if="index===0" :to="{name:item.name}" class="redirect">
        {{ item.title }}
      </router-link>
      <span v-else class="no-redirect">{{ item.title }}</span>
    </b-breadcrumb-item>
  </b-breadcrumb>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'VBreadcrumb',
  data() {
    return {
      levelList: []
    }
  },
  computed: {
    ...mapGetters(['navMenu']),
    menuItems() {
      let functions = this.navMenu
      let all = []
      const mapper = (route) => {
        if (route.name) {
          all.push({ ...route })
        }
        if (route.children) {
          route.children.forEach(item => {
            mapper(item)
          })
        }
      }
      functions.forEach(item => {
        mapper(item)
      })
      return all
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      this.levelList = []
      const { name } = this.$route
      if (name === 'index') return []
      let names = this.getMenuItemNamePath(name)
      this.levelList.push({ name: 'index', title: '首页' })
      names.forEach(name => {
        let route = this.menuItems.find(item => item.name === name)
        if (route) {
          this.levelList.push({ name: route.name, title: route.title })
        }
      })
    },
    // 获取菜单项名称路径
    getMenuItemNamePath(name) {
      let activeRoute = this.menuItems.find(item => item.name === name)
      if (activeRoute) {
        return activeRoute.parents
      }
      return []
    }
  }
}
</script>

<style lang="stylus">
.app-breadcrumb.bin-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(0, 0, 0, .45);
  .redirect {
    font-weight: normal;
    color: rgba(0, 0, 0, .65);
    &:hover {
      color: #1890ff;
    }
  }
  .no-redirect {
    font-weight: normal;
    color: rgba(0, 0, 0, .45);
    cursor: text;
  }
  .bin-separator {
    margin: 0 8px;
    color: rgba(0, 0, 0, .45);
    font-weight: normal;
  }
}
</style>

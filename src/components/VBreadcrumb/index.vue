<template>
  <b-breadcrumb class="app-breadcrumb" separator="/">
    <b-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
      <router-link v-if="index===0" :to="item.redirect||item.path" class="redirect">
        {{ item.meta.title }}
      </router-link>
      <span v-else class="no-redirect">{{ item.meta.title }}</span>
    </b-breadcrumb-item>
  </b-breadcrumb>
</template>

<script>
  export default {
    name: 'VBreadcrumb',
    data() {
      return {
        levelList: []
      }
    },
    created() {
      this.getBreadcrumb()
    },
    methods: {
      getBreadcrumb() {
        let matched = this.$route.matched.filter(item => {
          return !!item.name
        })
        const first = matched[0]
        this.levelList = []
        if (first && first.name !== 'index') {
          this.levelList.push({ path: '/index', meta: { title: '首页' } })
        }
        let parent = this.getParent(first)
        if (parent) {
          let parentP = this.getParent(parent)
          if (parentP) {
            this.levelList.push(parentP)
          }
          this.levelList.push(parent)
        }
        this.levelList.push(first)
      },
      getParent(route) {
        if (route.parent && route.parent.meta && route.parent.redirect.name !== 'index') {
          return route.parent
        }
        return null
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

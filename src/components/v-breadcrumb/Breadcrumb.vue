<template>
  <b-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <b-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <router-link v-if="index===0" :to="item.redirect||item.path" class="redirect">{{ item.meta.title }}</router-link>
        <span v-else class="no-redirect">{{ item.meta.title }}</span>
      </b-breadcrumb-item>
    </transition-group>
  </b-breadcrumb>
</template>

<script>
  export default {
    name: 'VBreadcrumb',
    data () {
      return {
        levelList: []
      }
    },
    created () {
      this.getBreadcrumb()
    },
    watch: {
      $route () {
        this.getBreadcrumb()
      }
    },
    methods: {
      getBreadcrumb () {
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
          this.levelList.push(parent)
          let parentP = this.getParent(parent)
          if (parentP) {
            this.levelList.push(parentP)
          }
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

<style lang="stylus" scoped>
  .app-breadcrumb.bin-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    .redirect {
      font-weight: 100;
    }
    .no-redirect {
      font-weight: 100;
      color: #97a8be;
      cursor: text;
    }
  }
  .breadcrumb-enter-active, .breadcrumb-leave-active {
    transition: all .3s;
  }
  .breadcrumb-enter, .breadcrumb-leave-to {
    opacity: 0;
    transform: translateX(20px);
  }
  .breadcrumb-leave-active {
    position: absolute;
  }
</style>

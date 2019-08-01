<template>
  <b-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <b-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if='item.redirect==="noRedirect"||index===levelList.length-1' class="no-redirect">
          {{item.meta.title}}
        </span>
        <router-link v-else :to="item.redirect||item.path" class="redirect">{{item.meta.title}}</router-link>
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
        if (first.parent && first.parent.meta && first.parent.redirect.name !== 'index') {
          this.levelList.push(first.parent)
        }
        this.levelList.push(first)
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

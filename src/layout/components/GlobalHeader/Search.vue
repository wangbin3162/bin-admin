<template>
  <div class="header-top-search" :class="{show:showInput}" v-click-out-side="clickOutSide">
    <b-icon name="md-search" size="20" @click.native="showInput=!showInput"></b-icon>
    <div class="header-top-search-input" v-if="showInput">
      <b-select v-model="search" filterable placeholder="search" @on-change="handleGoto">
        <b-option v-for="item in menuItems" :value="item.name" :key="item.name">{{ item.title }}</b-option>
      </b-select>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Search',
  data() {
    return {
      showInput: false,
      search: 'index'
    }
  },
  computed: {
    ...mapGetters(['addRouters', 'navMenu', 'visitedViews']),
    // 所有存在的菜单项
    menuItems() {
      let functions = this.navMenu
      let all = []
      const mapper = (route) => {
        if (route.name && !route.children) {
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
  watch: {
    $route: {
      handler() {
        this.$nextTick(_ => {
          this.search = ''
        })
      },
      immediate: true
    }
  },
  methods: {
    handleGoto(val) {
      this.$router.push({ name: val })
      this.showInput = false
    },
    // 键盘开启搜索
    keypadSearch(e) {
      if (e.keyCode === 70 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault()
        this.showInput = !this.showInput
      }
    },
    clickOutSide() {
      if (this.showInput) {
        this.search = ''
        this.showInput = false
      }
    }
  },
  mounted() {
    document.addEventListener('keydown', this.keypadSearch)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keypadSearch)
  }
}
</script>

<style lang="stylus">
.header-top-search {
  display: inline-block;
  height: 100%;
  padding: 0 12px;
  transition: width .25s;
  width: 44px;
  white-space: nowrap;
  .icon-md-search {
    cursor: pointer;
  }
  &.show {
    width: 264px;
  }
  .header-top-search-input {
    display: inline-block;
    width: calc(100% - 20px);
    padding: 0 12px;
    .bin-select-selection {
      border-radius: 0;
      border: none;
      border-bottom: 1px solid #d9d9d9;
    }
    .bin-select-visible .bin-select-selection {
      box-shadow: none;
    }
  }
}
</style>

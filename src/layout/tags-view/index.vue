<template>
  <div class="tags-view-container">
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
      <router-link
        v-for="tag in visitedViews" :key="tag.path"
        ref='tag' class="tags-view-item" tag="a"
        :class="isActive(tag)?'active':''"
        :to="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">
        {{ tag.title }}
        <i v-if="!tag.meta.affix" class='iconfont icon-ios-close' @click.prevent.stop="closeSelectedTag(tag)"></i>
      </router-link>
    </scroll-pane>
    <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script>
  import ScrollPane from './scroll-pane'
  import { mapGetters } from 'vuex'
  import path from 'path'

  export default {
    name: 'TagsView',
    data () {
      return {
        visible: false, // 选中面板弹出
        top: 0, // 选中面板top
        left: 0, // 选中面板left
        selectedTag: {} // 选中的tag
      }
    },
    computed: {
      ...mapGetters(['visitedViews', 'routers'])
    },
    watch: {
      $route () {
        this.addTags()
        this.moveToCurrentTag()
      },
      visible (value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    mounted () {
      this.initTags()
      this.addTags()
    },
    methods: {
      // 过滤固定的tags（即过滤meta中设置affix固定的菜单路由）
      filterAffixTags (routes, basePath = '/') {
        let tags = []
        routes.forEach(route => {
          if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basePath, route.path)
            tags.push({
              fullPath: tagPath,
              path: tagPath,
              name: route.name,
              meta: { ...route.meta }
            })
          }
          if (route.children) {
            const tempTags = this.filterAffixTags(route.children, route.path)
            if (tempTags.length >= 1) {
              tags = [...tags, ...tempTags]
            }
          }
        })
        return tags
      },
      isActive (route) {
        return route.path === this.$route.path || route.name === this.$route.name
      },
      // 初始化tags 先增加默认固定的tag
      initTags () {
        const affixTags = this.affixTags = this.filterAffixTags(this.routers)
        for (const tag of affixTags) {
          // 循环遍历固定Tags
          // Must have tag name
          if (tag.name) {
            this.$store.dispatch('addVisitedView', tag)
          }
        }
      },
      // 增加tags，根据路由名称增加view
      addTags () {
        const { name } = this.$route
        // 如果存在name切并不是刷新操作则添加一个view
        if (name && name !== 'refresh') {
          this.$store.dispatch('addView', this.$route)
        }
        return false
      },
      // 移动到当前的tag
      moveToCurrentTag () {
        const tags = this.$refs.tag
        this.$nextTick(() => {
          for (const tag of tags) {
            // 找到切换到的目标path和路由匹配的
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag)
              // 当切换不同的路径，则更新当前路径
              if (tag.to.fullPath !== this.$route.fullPath) {
                this.$store.dispatch('updateVisitedView', this.$route)
              }
              break
            }
          }
        })
      },
      // 刷新当前view
      refreshSelectedTag (view) {
        this.$store.dispatch('delCachedView', view).then(() => {
          this.$nextTick(() => {
            this.$router.replace('/refresh')
          })
        })
      },
      // 关闭当前的tab页签
      closeSelectedTag (view) {
        this.$store.dispatch('delView', view).then(({ visitedViews }) => {
          // 如果关闭的是当前开启的view则移动焦点到上一个view
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view)
          }
        })
      },
      // 移动焦点至最后一个view
      toLastView (visitedViews) {
        const latestView = visitedViews.slice(-1)[0]
        if (latestView) {
          this.$router.push(latestView)
        } else {
          // 如果没有标签视图，默认是重定向到主页，您可以根据需要调整
          this.$router.push('/')
        }
      },
      // 关闭其他tags
      closeOthersTags () {
        this.$router.push(this.selectedTag)
        this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
          this.moveToCurrentTag()
        })
      },
      // 关闭所有
      closeAllTags (view) {
        this.$store.dispatch('delAllViews').then(({ visitedViews }) => {
          if (this.affixTags.some(tag => tag.path === view.path)) {
            return
          }
          this.toLastView(visitedViews, view)
        })
      },
      // 打开右键菜单选择
      openMenu (tag, e) {
        this.visible = true
        this.selectedTag = tag
        this.left = e.clientX
        this.top = e.clientY
      },
      closeMenu () {
        this.visible = false
      }
    },
    components: {
      ScrollPane
    }
  }
</script>

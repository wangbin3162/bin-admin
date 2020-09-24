<template>
  <div class="tags-view-container">
    <b-tabs v-model="activeTag" :data="viewTags" type="tag" closable context-menu ref="tabs"
            @on-change="handleSelect" @on-tab-select="handleRightClick" @on-tab-close="handleCloseTag">
      <template v-slot:menu>
        <li @click="refreshSelected">刷新</li>
        <li @click="closeSelected">关闭</li>
        <li @click="closeOthers">关闭其他</li>
        <li @click="closeAll">关闭所有</li>
      </template>
    </b-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TagsView',
  data() {
    return {
      selectedTag: {},
      activeTag: ''
    }
  },
  mounted() {
    this.addTags()
    this.moveToCurrentTag()
  },
  computed: {
    ...mapGetters(['addRouters', 'navMenuItems', 'visitedViews']),
    viewTags() {
      return [{ key: 'index', title: '首页', noClose: true }]
        .concat(this.visitedViews.map(i => ({ key: i.name, title: i.title })))
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    }
  },
  methods: {
    addTags() {
      const { path } = this.$route
      if (!path || path === '/index') return
      let current = this.navMenuItems.find(item => `/${item.name}` === path)
      if (current) {
        this.$store.dispatch('tagsView/addView', { name: current.name, title: current.title })
      }
      return false
    },
    moveToCurrentTag() {
      const { path } = this.$route
      this.$nextTick(_ => {
        this.activeTag = path.slice(1)
      })
    },
    // 选中一个tag
    handleSelect(tag) {
      this.$router.push({ path: `/${tag.key}` })
    },
    handleRightClick(tag) {
      this.selectedTag = { ...tag }
    },
    handleCloseTag(tag) {
      this.$store.dispatch('tagsView/delView', { name: tag.key, title: tag.title })
    },
    // 刷新当前view
    refreshSelected() {
      let view = { name: this.selectedTag.key, title: this.selectedTag.title }
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        this.$router.push('/refresh')
      })
    },
    closeSelected() {
      if (this.selectedTag.key === 'index') return
      // 这里需要调用组件的关闭选择的tag
      this.$refs.tabs.closeSelectedTab(this.selectedTag)
    },
    // 关闭其他tags
    closeOthers() {
      this.$router.push({ name: this.selectedTag.key })
      this.$store.dispatch('tagsView/delOthersViews', { name: this.selectedTag.key, title: this.selectedTag.title })
      this.$refs.tabs.moveToCurrentTab()
    },
    // 关闭所有
    closeAll() {
      this.$router.push({ name: 'index' })
      this.$store.dispatch('tagsView/delAllViews')
      this.$refs.tabs.moveToCurrentTab()
    }
  }
}
</script>

<template>
  <b-dropdown ref="dropdown" @click="handleClick" :placement="placement" :append-to-body="hideTitle"
              :class="hideTitle ? '' : 'collased-menu-dropdown'"
              transfer-class-name="menu-dropdown">
    <a class="drop-menu-a" type="text">
      <b-icon :name="menu.icon" size="20" style="position: relative;top:-1px;" v-if="menu.icon"></b-icon>
      <span class="menu-title" v-if="!hideTitle">{{ menu.title }}</span>
      <b-icon name="ios-arrow-forward" size="14" v-if="!hideTitle"></b-icon>
    </a>
    <b-dropdown-menu ref="dropdown" slot="list" style="width: 150px;">
      <template v-for="child in menu.children">
        <b-dropdown-item v-if="!child.children" :key="`drop-menu-${child.name}`"
                         :name="child.name" :selected="$route.path===`/${child.name}`">
          <b-icon :name="child.icon" size="14" style="position: relative;top:-1px;" v-if="child.icon"></b-icon>
          {{ child.title }}
        </b-dropdown-item>
        <collapsed-menu v-else :menu="child" :key="`drop-menu-${child.name}`"></collapsed-menu>
      </template>
    </b-dropdown-menu>
  </b-dropdown>
</template>

<script>
export default {
  name: 'CollapsedMenu',
  props: {
    menu: {
      type: Object,
      required: false,
      default: () => {
      }
    },
    hideTitle: Boolean,
    theme: String
  },
  data() {
    return {
      placement: 'right-start'
    }
  },
  methods: {
    handleClick(name) {
      this.$emit('click', name)
    },
    findNodeUpperByClasses(ele, classes) {
      let parentNode = ele.parentNode
      if (parentNode) {
        let classList = parentNode.classList
        if (classList && classes.every(className => classList.contains(className))) {
          return parentNode
        } else {
          return this.findNodeUpperByClasses(parentNode, classes)
        }
      }
    }
  },
  mounted() {
    let dropdown = this.findNodeUpperByClasses(this.$refs.dropdown.$el, ['bin-select-dropdown', 'bin-dropdown-transfer'])
    if (dropdown) dropdown.style.overflow = 'visible'
  }
}
</script>

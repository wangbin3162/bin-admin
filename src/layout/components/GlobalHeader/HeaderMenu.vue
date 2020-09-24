<template>
  <div class="header-menu">
    <b-tabs :value="activeMenu" :data="menuList" type="card" ref="menu" @on-change="handleMenuSelect"/>
    <b-drawer v-model="menuModal" append-to-body :closable="false" placement="left" :styles="{padding:0}">
      <div class="menu-panel">
        <div v-for="menu in leftMenu" class="group-container" :key="menu.key">
          <p class="side-nav-title">
            <b-icon :name="menu.icon" v-if="menu.icon"></b-icon>
            {{ menu.title }}
          </p>
          <!--二级菜单-->
          <template v-if="menu.children">
            <div class="side-nav-items" v-for="(secondMenu,index) in menu.children" :key="secondMenu.name||index">
              <!--遍历第三极菜单-->
              <template v-if="secondMenu.children">
                <p class="side-nav-group">
                  <b-icon :name="secondMenu.icon" v-if="secondMenu.icon"></b-icon>
                  {{ secondMenu.title }}
                </p>
                <p v-for="(item,index) in secondMenu.children" :key="item.name||index"
                   class="side-nav-menu"
                   :class="{'active':$route.path==='/'+item.name}"
                   @click="menuTo(item.name)">
                  <b-icon :name="item.icon" v-if="item.icon"></b-icon>
                  {{ item.title }}
                </p>
              </template>
              <!--第二级菜单没有第三级菜单-->
              <p v-else
                 class="side-nav-menu not-group"
                 :class="{'active':$route.path==='/'+secondMenu.name}"
                 @click="menuTo(secondMenu.name)">
                <b-icon :name="secondMenu.icon" v-if="secondMenu.icon"></b-icon>
                {{ secondMenu.title }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </b-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepCopy } from '@/common/utils/assist'

export default {
  name: 'HeaderMenu',
  data() {
    return {
      activeMenu: '',
      menuModal: false,
      leftMenu: []
    }
  },
  watch: {
    $route: {
      handler: function (val) {
        let openNames = this.getMenuItemNamePath(val.path)
        console.log(openNames)
        this.activeMenu = openNames[0] || ''
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['navMenu', 'theme', 'navMenuItems']),
    menuList() {
      return this.navMenu.map(menu => {
        return {
          key: menu.name,
          title: menu.title,
          icon: menu.icon,
          children: menu.children || null
        }
      })
    }
  },
  methods: {
    // 获取菜单项名称路径
    getMenuItemNamePath(name) {
      let activeRoute = this.navMenuItems.find(item => `/${item.name}` === name)
      if (activeRoute) {
        return activeRoute.parents
      }
      return []
    },
    handleMenuSelect(tab) {
      if (tab.children) {
        this.openMenu(tab)
      } else {
        let path = `/${name}`
        if (this.$route.path !== tab.key) {
          this.$router.push({ path })
        }
      }
    },
    openMenu(menu) {
      this.menuModal = true
      this.leftMenu = deepCopy([menu])
    },
    menuTo(name) {
      let path = `/${name}`
      if (this.$route.path !== path) {
        this.menuModal = false
        this.$router.push({ path })
      }
    }
  }
}
</script>

import store from '../../store'

export default {
  computed: {
    currentPermission() {
      const permissions = store.getters.userInfo.permissions || null
      if (permissions) {
        return permissions[this.$route.fullPath]
      }
      return null
    },
    canCreate() {
      return this.havePermission('create')
    },
    canRemove() {
      return this.havePermission('remove')
    },
    canModify() {
      return this.havePermission('modify')
    }
  },
  methods: {
    havePermission(perm) {
      return this.currentPermission ? this.currentPermission.indexOf(perm) > -1 : false
    }
  }
}

import store from '../../store'

export default {
  computed: {
    isAdmin() {
      return store.getters.userInfo.roleCodes === 'ROLE_ADMIN'
    },
    currentPermission() {
      const permissions = store.getters.userInfo.permissions || null
      if (permissions) {
        return permissions[this.$route.name]
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
      return this.isAdmin ? true : (this.currentPermission ? this.currentPermission.indexOf(perm) > -1 : false)
    }
  }
}

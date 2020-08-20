import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import creSupDetail from './modules/credit-supervision/detail'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules: {
    user,
    creSupDetail
  }
})

import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import search from './modules/search'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules: {
    user, search
  }
})

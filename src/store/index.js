import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules
})

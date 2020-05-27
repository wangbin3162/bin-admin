import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import ratingModel from './modules/credit-rating/rating-model'
import creditReportConfig from './modules/sys/credit-report-config'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules: {
    app,
    user,
    permission,
    ratingModel,
    creditReportConfig
  }
})

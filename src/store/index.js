import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import ratingModel from './modules/credit-rating/rating-model'
import creditReportConfig from './modules/credit-rating/credit-report-config'
import modelCount from './modules/credit-rating/model-count'
import creditDiff from './modules/credit-service/credit-diff'
import creditRepair from './modules/credit-service/credit-repair'
import newsMgmt from './modules/cms/news-mgmt'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules: {
    app,
    user,
    permission,
    ratingModel,
    creditReportConfig,
    modelCount,
    creditDiff,
    creditRepair,
    newsMgmt
  }
})

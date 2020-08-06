import Vue from 'vue'
import Vuex from 'vuex'
import getters from '@/store/getters'
import app from '@/store/modules/app'
import user from '@/store/modules/user'
import permission from '@/store/modules/permission'
import ratingModel from '@/store/modules/credit-rating/rating-model'
import creditReportConfig from '@/store/modules/credit-rating/credit-report-config'
import modelCount from '@/store/modules/credit-rating/model-count'
import creditDiff from '@/store/modules/credit-service/credit-diff'
import creditRepair from '@/store/modules/credit-service/credit-repair'
import newsMgmt from '@/store/modules/cms/news-mgmt'
import noticeMgmt from '@/store/modules/cms/notice-mgmt'
import esExchange from '@/store/modules/data-manage/es-exchange'

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
    newsMgmt,
    noticeMgmt,
    esExchange
  }
})

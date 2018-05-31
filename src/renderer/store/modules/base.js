/**
 * Created by Administrator on 2018/5/16.
 */
import * as types from '../mutation-types'
const state = {
  newCataLogParam: {},
  currentSelectCatalogItem: {},
  searchInfo: {}
}

const mutations = {
  [types.CHANG_NEWORUPDATECATALOG_DIALOG_STATE] (state, val) {
    state.newCataLogParam = val
  },
  [types.CHANGE_CURRENTSELECT_CATLOGITEM] (state, val) {
    state.currentSelectCatalogItem = val
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  mutations,
  actions
}

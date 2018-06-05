import * as types from './mutation-types'

const matutaions = {
  [types.SET_TOKEN](state, token) {
    state.token = token
  },
  [types.SET_CURRENT_PERSONAL_ACCOUNT_INFO](state, info) {
    state.personalInfo = info
  },
  [types.SET_MESYSTEM_DATA](state, mesystemData) {
    state.mesystemData = mesystemData
  }
}

export default matutaions

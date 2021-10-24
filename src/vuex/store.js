import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 先声明一个状态
const state = {
  route: [],
  token: '',
  basedataUrl: 'http://113.108.95.247:10010/emc-admin',
  // basedataUrl: 'http://192.168.14.143:8000',

  // 实时位置vin值
  vin: '',
  // 车辆预警的id值
  id: '',
  // 面包屑
  smallPage: true,
  breadcrumbIndex: [{
    path: '/statisticalAnalysis/vehicleOperationStatistics',
    name: '首页',
    icon: ''
  }], // 面包屑的首页
  breadcrumb: [],
  // 车辆类型、品牌
  vehicleTypes: [],
  vehicleBrand: [],
  vehicleModel: []
}

// 然后给 actions 注册事件处理函数，当这个函数被触发时，将状态提交到 mutaions中处理
const actions = {
  // 提交至mutations
  setMergeRoutes: ({
    commit
  }, route) => commit('setMergeRoutes', route),
  setRoute: ({
    commit
  }, routes) => commit('SET_ROUTERS', routes),
  // 面包屑
  changeBreadcumb: ({
    commit
  }, value) => commit('changeBreadcumb', value),
  // 权限
  setToken: ({
    commit
  }, token) => commit('setToken', token),
  setVin: ({
    commit
  }, vin) => commit('setVin', vin),
  setId: ({
    commit
  }, id) => commit('setId', id),
  setVehicleTypes: ({
    commit
  }, typesValue) => commit('setVehicleTypes', typesValue),
  setVehicleBrand: ({
    commit
  }, brandValue) => commit('setVehicleBrand', brandValue),
  setVehicleModel: ({
    commit
  }, ModelValue) => commit('setVehicleModel', ModelValue)
}

const mutations = {
  // 面包屑
  changeSmallPage (state, value) {
    state.smallPage = value
  },
  changeBreadcumb (state, value) {
    state.breadcrumb = state.breadcrumbIndex.concat(value)
    // state.breadcrumb = value
  },
  SET_ROUTERS: (state, routes) => {
    state.addRouters = routes
  },
  setMergeRoutes (state, route) {
    state.route = route
  },
  setToken (state, token) {
    state.token = token
  },
  setVin (state, vin) {
    state.vin = vin
  },
  setId (state, id) {
    state.id = id
  },
  setVehicleTypes (state, typesValue) {
    state.vehicleTypes = typesValue
  },
  setVehicleBrand (state, brandValue) {
    state.vehicleBrand = brandValue
  },
  setVehicleModel (state, ModelValue) {
    state.vehicleModel = ModelValue
  }
}

const getters = {
  addRouters: state => state.addRouters,
  getMergeRoutes: state => state.route,
  getToken: state => state.token,
  getVin: state => state.vin,
  getId: state => state.id
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

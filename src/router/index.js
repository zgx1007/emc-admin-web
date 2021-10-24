import Vue from 'vue'
import Router from 'vue-router'

// 引入组件
import login from '@/pages/login.vue'
import notFound from '@/pages/404.vue'
import vehicleWarningDetails from '@/pages/vehicleData/vehicleWarningDetails.vue'
import vehicleDetails from '@/pages/vehicleData/vehicleDetails.vue'
import home from '@/pages/common/home.vue'
import welcome from '@/pages/statisticalAnalysis/welcome'
import vehicleOperationDetails from '@/pages/statisticalAnalysis/vehicleOperationDetails'
import vehicleChargingStatistics from '@/pages/statisticalAnalysis/vehicleChargingStatistics'
// // 个人信息管理
import personalSet from '@/pages/personalSet/passwordReset.vue'
import personManagement from '@/pages/personalSet/personManagement.vue'
import organization from '@/pages/systemManagement/organization'
import vehicleWarningEditing from '@/pages/protocolDataStandard/vehicleWarningEditing.vue'

Vue.use(Router)
export const routes = [{
  path: '/login',
  component: login,
  name: '登录页面',
  hidden: true
},
{
  path: '/home',
  component: home,
  children: [{path: '/statisticalAnalysis/welcome', component: welcome, name: '数据看板', hidden: true}],
  hidden: true
},
{
  path: '/home',
  component: home,
  hidden: true,
  children: [{
    path: '/vehicleData/vehicleWarningDetails',
    component: vehicleWarningDetails,
    name: '预警信息详情',
    hidden: true
  },

  {
    path: '/vehicleData/vehicleDetails',
    component: vehicleDetails,
    name: '车辆详情',
    hidden: true
  },
  {
    path: '/protocolDataStandard/vehicleWarningEditing',
    component: vehicleWarningEditing,
    name: '编辑预警项',
    hidden: true
  },
  {
    path: '/systemManagement/organization',
    component: organization,
    name: '组织架构',
    hidden: true
  },
  {
    path: '/statisticalAnalysis/vehicleOperationDetails',
    component: vehicleOperationDetails,
    name: '车辆运行统计详情',
    hidden: true
  },
  {
    path: '/statisticalAnalysis/vehicleChargingStatistics',
    component: vehicleChargingStatistics,
    name: '车辆车辆充电',
    hidden: true
  }
  ]
},
{
  path: '/',
  component: home,
  name: '个人信息管理',
  hidden: true,
  children: [{
    path: '/personalSet/passwordReset',
    component: personalSet,
    name: '修改密码',
    hidden: true
  },
  {
    path: '/personalSet/personManagement',
    component: personManagement,
    name: '修改密码',
    hidden: true
  }
  ]
},
{
  path: '/404',
  component: notFound,
  name: 'notFound',
  hidden: true
}
]
export default new Router({
  routes: routes,
  /**
     * 合并远程路由到本地路由
     * @param: list [Array] 后台路由列表
     * @param: routes [Array] 本地路由列表
     * */
  mergeRoutes (list) {
    console.log(list)
    let temp
    if (list) {
      for (let i = 0; i < list.length; i++) {
        temp = {
          path: '/',
          component: home,
          name: list[i].name,
          iconCls: list[i].icon,
          children: []
        }
        for (let j = 0; j < list[i].children.length; j++) {
          let tempChildren = {
            // path: list[i].children[j].path,
            path: list[i].children[j].path,
            component: (resolve) => require([`@/pages${list[i].children[j].path}.vue`], resolve),
            name: list[i].children[j].name
          }
          temp.children.push(tempChildren)
        }
        routes.push(temp)
      }
      let notFfound = {
        path: '*',
        redirect: '/404',
        hidden: true
      }
      routes.push(notFfound)
    }
    console.log('合并路由:', routes)
    return routes
  }
})

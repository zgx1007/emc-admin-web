<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import router from '@/router/index'
import store from '@/vuex/store'
import { mapGetters, mapMutations } from 'vuex'
export default {
  watch: {
    $route: {
      handler(val) {
        if (val.path === '/login') {
          location.reload()
        } else {
          this.showAllVehicleType()
        }
      }
      // 深度观察监听
      // deep: true
    }
  },
  created() {
    let token = sessionStorage.getItem('token')
    if (!token) {
      return this.$router.push('/login')
    } else {
      this.showAllVehicleType()
      if (
        this.$router.options.routes.length &&
        sessionStorage.getItem('list')
      ) {
        let list = sessionStorage.getItem('list')
        let routes = this.$router.options.mergeRoutes(JSON.parse(list))
        this.$store.dispatch('setRoute', routes)
        this.$router.addRoutes(this.$store.getters.addRouters)
      }
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  //注册provide方法
  provide() {
    return {
      reload: this.reload(),
      // 下拉框
      vehicleTypes: [],
      vehicleBrand: [],
      vehicleModel: []
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    },
    // 查询车类型
    showAllVehicleType() {
      const vm = this
      vm.vehicleTypes = []
      vm.$post(
        `${vm.$store.state.basedataUrl}/vehicleTypeInfo/getAllVehicleType`
      ).then(data => {
        if (data.code === 200) {
          vm.vehicleTypes = data.data
          let returnData = data.data
          let temp1 = []
          let temp2 = []
          let temp3 = []
          let tempVehicle1 = []
          let tempVehicle2 = []
          let tempBrand1 = []
          let tempBrand2 = []
          let tempModel1 = []
          let tempModel2 = []
          // 类型去重
          for (let i = 0; i < returnData.length; i++) {
            tempVehicle1.push(returnData[i].vehicleType)
          }
          for (let i = 0; i < tempVehicle1.length; i++) {
            if (temp1.indexOf(tempVehicle1[i]) === -1) {
              temp1.push(tempVehicle1[i])
            }
          }
          for (let i = 0; i < temp1.length; i++) {
            let t = {
              vehicleType: temp1[i]
            }
            tempVehicle2.push(t)
          }
          vm.vehicleTypes = tempVehicle2
          vm.$store.dispatch('setVehicleTypes', tempVehicle2)
          // 品牌去重
          for (let i = 0; i < returnData.length; i++) {
            tempBrand1.push(returnData[i].vehicleBrand)
          }
          for (let i = 0; i < tempBrand1.length; i++) {
            if (temp2.indexOf(tempBrand1[i]) === -1) {
              temp2.push(tempBrand1[i])
            }
          }
          for (let i = 0; i < temp1.length; i++) {
            let t = {
              vehicleBrand: temp2[i]
            }
            tempBrand2.push(t)
          }
          vm.vehicleBrand = tempBrand2
          vm.$store.dispatch('setVehicleBrand', tempBrand2)
          // 型号去重
          for (let i = 0; i < returnData.length; i++) {
            tempModel1.push(returnData[i].vehicleModel)
          }
          for (let i = 0; i < tempModel1.length; i++) {
            if (temp3.indexOf(tempModel1[i]) === -1) {
              temp3.push(tempModel1[i])
            }
          }
          for (let i = 0; i < temp3.length; i++) {
            let t = {
              vehicleModel: temp3[i]
            }
            tempModel2.push(t)
          }
          vm.vehicleModel = tempModel2
          vm.$store.dispatch('setVehicleModel', tempModel2)
        } else {
        }
      })
    }
  }
}
</script>

<style>
@import url('//unpkg.com/element-ui@2.4.9/lib/theme-chalk/index.css');
@import './assets/font/font.css';
body {
  margin: 0;
  padding: 0;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  /* overflow: scroll; */
}

#app {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.toolbar {
  background: #f2f2f2;
  padding: 10px;
  margin: 10px 0;
}
/* ::-webkit-scrollbar{
  display:none;
} */
</style>

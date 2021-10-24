<template>
  <el-container>
    <el-main style="padding: -10px;">
      <div class="panel" ref="panel">
        <el-form :model="editForm" ref="editForm" :rules="rules">
          <el-form-item prop="input" class="input-form">
            <el-input
              size="small"
              type="text"
              v-model="editForm.input"
              clearable
              placeholder="输入vin码\车牌号"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="small" @click="showVisible" class="button1">查询</el-button>
        <el-button type="small" class="button2" @click="init">查询所有</el-button>
        <!-- 查询车辆实时位置 -->
        <div class="resultPanel" ref="resultPanel" style="display: none">
          <p>查询结果</p>
          <img src="../../assets/img/close2.png" class="resultPanel-closeImg" @click="unVisible" />
          <p>车 牌：{{data.vehicleNo}}</p>
          <p>vin 码：{{data.vin}}</p>
          <p>经 纬 度：{{data.longitude}}，{{data.latitude}}</p>
          <p>总 里 程：{{data.totalMileage}}</p>
          <p v-if="data.level !== 0">报警级别：{{data.level}}级</p>
          <p v-if="data.level === 0">报警级别：正常</p>
          <p>报警时间：{{data.alarmTime}}</p>
          <el-button type="primary" @click="vehicleDetails" class="details-button1">查看整车详情>>></el-button>
          <el-button @click="isLine" class="trajectory-button">轨迹回放</el-button>
        </div>
        <!-- 轨迹回放弹框 -->
        <div class="resultPanel" ref="resultPanel2" style="display: none">
          <p>轨迹回放</p>
          <img src="../../assets/img/close2.png" class="resultPanel-closeImg" @click="unVisible2" />
          <p>{{data.vehicleNo}}</p>
          <div class="block">
            <el-date-picker
              :validate-event="true"
              v-model="date"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <el-time-picker
            value-format="HH"
            is-range
            v-model="time"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
          <el-button type="primary" size="small" class="lineButton" @click="drawLine()">确认</el-button>
          <!-- <span class="demonstration">轨迹回放速度</span> -->
          <!-- <el-slider v-model="speed" :step="100" :max="1000" class="speedSlider"></el-slider> -->
          <el-button type="primary" plain @click="backSelect()" class="details-button">返回搜索结果>>></el-button>
          <el-button type="primary" plain @click="vehicleDetails()" class="details-button">查看整车详情>>></el-button>
          <el-button type="primary" plain class="details-button">设置电子围栏>>></el-button>
        </div>
      </div>
      <div class="tl-img">
        <img src="../../assets/img/tuli2.png" class="img2" />
        <img src="../../assets/img/tuli.png" class="img1" />
      </div>
      <ul id="my-list" style="display:none"></ul>
      <div id="map-container" class="map"></div>
    </el-main>
  </el-container>
</template>
<script>
import zHeader from '@/pages/common/header.vue'
import zAside from '@/pages/common/aside.vue'
import AMap from 'AMap'
import AMapUI from 'AMapUI'
import Axios from 'axios'
import Vue from 'vue'
import runBus1 from '../../assets/img/runBus1.png'
import runBus2 from '../../assets/img/runBus2.png'
import iconCar1 from '../../assets/img/normal.png'
import iconCar2 from '../../assets/img/level1.png'
import iconCar3 from '../../assets/img/level2.png'
import iconCar4 from '../../assets/img/level3.png'
export default {
  components: {
    zHeader,
    zAside
  },
  data() {
    return {
      // date:new Date().getFullYear() +"-" +(new Date().getMonth() + 1) +"-" +(new Date().getDate() - 1),
      // 级别默认显示状态
      levelStatus: 0,
      date:'2019-05-20',
      time: ["08", "23"],
      visible: false,
      lineShow: false,
      speed: 300,
      l1: '1',
      l2: '2',
      amap: '',
      maker1: '',
      maker2: '',
      editForm: {
        input: ''
      },
      data: {
        vehicleNo: '',
        vin: '',
        longitude: '',
        latitude: '',
        level: '',
        alarmTime: '',
        totalMileage: 0
      },
      // breadcrumb: [], // 面包屑
      enclosure: [
        [114.040409, 22.505656],
        [114.042544, 22.509185],
        [114.04389, 22.508917],
        [114.046562, 22.508312],
        [114.048021, 22.507975],
        [114.049502, 22.507792],
        [114.053841, 22.507767],
        [114.056583, 22.50807],
        [114.056813, 22.507182],
        [114.057023, 22.507202],
        [114.057334, 22.505805],
        [114.058213, 22.501543],
        [114.054351, 22.501364],
        [114.052801, 22.501983],
        [114.050612, 22.502717],
        [114.048879, 22.503015],
        [114.044856, 22.504219],
        [114.040409, 22.505656]
      ],
      rules: {
        input: [
          { required: true, message: '查询条件不允许为空！', trigger: 'change' }
        ]
      },
      temp: {
        id: 1,
        vin: 'LEWTEB141HF166875',
        vehicleNo: '粤BAJ001',
        longitude: 114.051784,
        latitude: 22.502706
      }
    }
  },
  created() {
    this.$store.commit('changeBreadcumb', [])
  },
  mounted() {
    this.init()
  },
  watch: {
    // showLine(val, Oldval){
    //   if(!val){
    //     this.showLine()
    //   }
    // }
  },
  methods: {
    // 轨迹回放弹框中返回搜索结果
    backSelect() {
      this.$refs.resultPanel.style.display = ''
      this.$refs.resultPanel2.style.display = 'none'
    },
    // 根据条件查询
    showVisible() {
      const vm = this
      vm.$refs.editForm.validate(valid => {
        if (valid) {
          vm.$post(
            `${
              vm.$store.state.basedataUrl
            }/vehicleRealTime/getVehicleRealTimeLocationVinOrNo?vehicleVinOrNo=${
              vm.editForm.input
            }`
          ).then(data => {
            if (data.code === 200) {
              if (!vm.visible && data.data) {
                vm.data = data.data
                console.log(data.level)
                vm.$refs.resultPanel.style.display = ''
              } else if (!data.data) {
                vm.$refs.resultPanel.style.display = 'none'
                vm.$message.error('暂无数据！')
              }
            } else {
              //('失败')
            }
          })
        } else {
          vm.$message.error('表单填写不完整')
        }
      })
    },
    // 查看整车详情
    vehicleDetails() {
      this.$store.dispatch('setVin', this.data.vin)
      let vehicleVinOrNo = this.data.vin
      //路由传参
      this.$router.push({
        name: '车辆详情',
        params: {
          vin: vehicleVinOrNo,
          status: 0
        }
      })
    },
    // 点击X将弹框隐藏
    unVisible() {
      this.$refs.resultPanel.style.display = 'none'
      // this.editForm.input = ''
    },
    unVisible2() {
      this.$refs.resultPanel2.style.display = 'none'
      // this.editForm.input = ''
    },
    // 确认轨迹回放
    drawLine() {
      // let l = this.data.vehicleNo
      // this.maker1.show()
      this.showLine1()
    },
    // 点击轨迹回放
    isLine() {
      this.$refs.resultPanel.style.display = 'none'
      this.$refs.resultPanel2.style.display = ''
    },
    showLine1() {
      let vm = this
      let vin = vm.vin
      //(vm.time)
      let dateTime = {
        vin: vm.data.vin,
        // vin: 'LC06S64MXH1993359',
        date: vm.date,
        beginTime: vm.time[0],
        endTime: vm.time[1]
      }
      //(dateTime)
      vm.$post(
        `${vm.$store.state.basedataUrl}/statistics/getOrbitByDate`,
        dateTime
      ).then(data => {
        var arr = []
        for (var i = 0; i < data.data.length; i++) {
          //循环LIST
          let longitude = data.data[i].longitude
          let latitude = data.data[i].latitude
          var arr1 = []
          arr1.push(longitude)
          arr1.push(latitude)
          arr.push(arr1)
        }
        let data1 = this.data.vehicleNo
        var marker = this.maker1
        if (!this.lineShow && data.data.length != 0) {
          // if (data1 === "粤BAN002") {
          //(arr)
          this.maker1.show()
          // 绘制轨迹
          var polyline = new AMap.Polyline({
            map: this.amap,
            path: arr,
            showDir: true,
            strokeColor: '#ec808d', //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 6, //线宽
            strokeStyle: 'solid' //线样式
          })
          // 轨迹运动走过线设置
          var passedPolyline = new AMap.Polyline({
            map: this.amap,
            // path: lineArr,
            strokeColor: '#AF5', //线颜色
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 6 //线宽
            // strokeStyle: "solid"  //线样式
          })
          marker.on('moving', function(e) {
            passedPolyline.setPath(e.passedPath)
          })
          this.amap.setFitView()
          marker.moveAlong(arr, this.speed)
          // }
        } else {
          this.$message.error('暂无车辆历史轨迹！')
        }
        this.showLine = false
      })
    },
    init() {
      this.$refs.resultPanel.style.display = 'none'
      // this.editForm.input = ''
      let positionData = []
      let map = new AMap.Map('map-container', {
        center: [114.0542132116, 22.5082421313],
        zoom: 15,
        mapStyle: 'amap://styles/dark'
      })
      this.amap = map
      // 绘制电子围栏轨迹
      var polyline = new AMap.Polyline({
        map: map,
        path: this.enclosure,
        strokeColor: '#10E0AA', //线颜色
        strokeWeight: 3 //线宽
      })
      this.maker1 = new AMap.Marker({
        map: this.amap,
        position: [114.046029, 22.505966],
        icon: runBus2,
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90
      })
      this.maker1.hide()
      this.maker2 = new AMap.Marker({
        map: this.amap,
        position: [114.046029, 22.505966],
        icon: runBus1,
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90
      })
      this.maker2.hide()
      AMapUI.loadUI(
        ['misc/MarkerList', 'overlay/SimpleMarker', 'overlay/SimpleInfoWindow'],
        function(MarkerList, SimpleMarker, SimpleInfoWindow) {
          Vue.axios
            .post(
              `http://113.108.95.247:10010/emc-admin/vehicleRealTime/getVehicleRealTimeLocation?vehicleVinOrNo=`
            )
            .then(data => {
              // Vue.axios.post(`http://192.168.14.143:9993/vehicleRealTime/getVehicleRealTimeLocation?vehicleVinOrNo=`).then(data => {
              if (data.code === 200) {
                let vdata = data.data
                // 动态获取后台数据
                for (let i = 0; i < vdata.length; i++) {
                  let temp = {
                    id: i + 1,
                    vin: vdata[i].vin,
                    title: '车牌号',
                    vehicleNo: vdata[i].vehicleNo,
                    level: vdata[i].level,
                    alarmTime: vdata[i].alarmTime,
                    longitude: parseFloat(vdata[i].longitude),
                    latitude: parseFloat(vdata[i].latitude)
                  }
                  positionData.push(temp)
                }
                markerList.render(positionData)
                //(positionData)
              }
            })
          var markerList = new MarkerList({
            //关联的map对象
            map: map,
            //列表的dom容器的id
            listContainer: 'my-list',

            //返回数据项的Id
            getDataId: function(dataItem, index) {
              //index表示该数据项在数组中的索引位置，从0开始，如果确实没有id，可以返回index代替
              return dataItem.id
            },
            //返回数据项的位置信息，需要是AMap.LngLat实例，或者是经纬度数组，比如[116.789806, 39.904989]
            getPosition: function(dataItem) {
              // //(dataItem.longitude)
              return [dataItem.longitude, dataItem.latitude]
            },
            //返回数据项对应的Marker
            getMarker: function(dataItem, context, recycledMarker) {
              //存在可回收利用的marker
              if (recycledMarker) {
                //直接更新内容返回
                recycledMarker.setIconLabel(context.id)
                recycledMarker.setIconStyle(dataItem.iconStyle)
                return recycledMarker
              }
              if (dataItem.level === '1') {
                return new SimpleMarker({
                  containerClassNames: 'my-marker',
                  iconStyle: iconCar2
                  // iconLabel: context.id
                })
              } else if (dataItem.level === '2') {
                return new SimpleMarker({
                  containerClassNames: 'my-marker',
                  iconStyle: iconCar3
                  // iconLabel: context.id
                })
              } else if (dataItem.level === '3') {
                return new SimpleMarker({
                  containerClassNames: 'my-marker',
                  iconStyle: iconCar4
                  // iconLabel: context.id
                })
              } else {
                return new SimpleMarker({
                  containerClassNames: 'my-marker',
                  iconStyle: iconCar1
                  // iconLabel: context.id
                })
              }
            },
            //返回数据项对应的infoWindow
            getInfoWindow: function(dataItem, context, recycledInfoWindow) {
              // //(dataItem)
              if (recycledInfoWindow) {
                //存在可回收利用的infoWindow, 直接更新内容返回
                recycledInfoWindow.setInfoTitle(dataItem.title)
                recycledInfoWindow.setInfoBody(dataItem.vehicleNo)
                recycledInfoWindow.setInfoBody([
                  dataItem.longitude,
                  dataItem.latitude
                ])
                // recycledInfoWindow.setInfoBody(dataItem.vin);
                return recycledInfoWindow
              }

              //返回一个新的InfoWindow
              return new SimpleInfoWindow({
                offset: new AMap.Pixel(0, -37),
                infoTitle: dataItem.title,
                infoBody: [dataItem.longitude, dataItem.latitude]
                // infoBody: dataItem.vehicleNo
              })
            },
            getListElement: function(dataItem, context, recycledListElement) {
              // var tpl = '<button style="background-color:<%= dataItem.iconStyle %>">' +
              //   '<%- dataId %></button> <%- dataItem.title %>';
              var tpl = '<%- dataItem.vehicleNo %>'
              // var tpl = '<%- dataItem.vin %>'

              var content = MarkerList.utils.template(tpl, {
                dataItem: dataItem,
                dataId: context.id
              })

              if (recycledListElement) {
                //存在可回收利用的listElement, 直接更新内容返回
                recycledListElement.innerHTML = content
                return recycledListElement
              }

              //返回一个新的Marker
              return new SimpleMarker({
                containerClassNames: 'my-marker',
                // iconStyle: dataItem.iconStyle,
                iconStyle: iconCar,
                iconLabel: context.id
              })
            },
            //返回数据项对应的infoWindow
            getInfoWindow: function(dataItem, context, recycledInfoWindow) {
              // //(dataItem)
              if (recycledInfoWindow) {
                //存在可回收利用的infoWindow, 直接更新内容返回
                recycledInfoWindow.setInfoTitle(dataItem.title)
                recycledInfoWindow.setInfoBody([
                  dataItem.longitude,
                  dataItem.latitude
                ])
                recycledInfoWindow.setInfoBody(dataItem.vehicleNo)
                return recycledInfoWindow
              }

              //返回一个新的InfoWindow
              return new SimpleInfoWindow({
                offset: new AMap.Pixel(0, -37),
                infoTitle: dataItem.title,
                infoBody: [dataItem.longitude, dataItem.latitude],
                infoBody: dataItem.vehicleNo
              })
            },
            getListElement: function(dataItem, context, recycledListElement) {
              // var tpl = '<button style="background-color:<%= dataItem.iconStyle %>">' +
              //   '<%- dataId %></button> <%- dataItem.title %>';
              var tpl = '<%- dataItem.vehicleNo %>'

              var content = MarkerList.utils.template(tpl, {
                dataItem: dataItem,
                dataId: context.id
              })

              if (recycledListElement) {
                //存在可回收利用的listElement, 直接更新内容返回
                recycledListElement.innerHTML = content
                return recycledListElement
              }

              //返回一段html，MarkerList将利用此html构建一个新的dom节点
              return '<li>' + content + '</li>'
            }
          })
          //构建一个数据项数组
          let d = [
            {
              id: 1,
              latitude: 22.506433,
              longitude: 114.041379,
              level: 1,
              title: '车牌号',
              vin: 'LGXB16DF7F0178773',
              vehicleNo: '粤BAJ001'
            },
            {
              id: 2,
              latitude: 22.504729,
              longitude: 114.055779,
              level: 1,
              title: '车牌号',
              vin: 'LGXB16DF7F0178774',
              vehicleNo: '粤BK6016'
            },
            {
              id: 3,
              latitude: 22.502706,
              longitude: 114.051784,
              // iconStyle: 'purple',
              level: 2,
              title: '车牌号',
              vin: 'LGXB16DF7F0178772',
              vehicleNo: '粤BAN001'
            },
            {
              id: 4,
              latitude: 22.505501,
              longitude: 114.044258,
              // iconStyle: 'purple',
              level: 4,
              title: '车牌号',
              vin: 'LEWTEB140JN100217',
              vehicleNo: '粤B0Z0G3'
            },
            {
              id: 5,
              latitude: 22.506084,
              longitude: 114.041848,
              // iconStyle: 'purple',
              level: 3,
              title: '车牌号',
              vin: 'LGXB16DF7F0178781',
              vehicleNo: '粤BK6019'
            },
            {
              id: 6,
              latitude: 22.507338,
              longitude: 114.046495,
              // iconStyle: 'purple',
              level: 1,
              title: '车牌号',
              vin: 'LGXB16DF7F0178780',
              vehicleNo: '粤BK6011'
            }
            // {
            //   id: 7,
            //   latitude: 22.506774,
            //   longitude: 114.054504,
            //   // iconStyle: 'purple',
            //   level: 1,
            //   title: "车牌号",
            //   vin: "LGXB16DF7F0178769",
            //   vehicleNo: "粤BK6005"
            // },
            // {
            //   id: 8,
            //   latitude: 22.503847,
            //   longitude: 114.050918,
            //   // iconStyle: 'purple',
            //   level: 1,
            //   title: "车牌号",
            //   vin: "LGXB16DF7F0178768",
            //   vehicleNo: "粤BAN002"
            // }
          ]
          //展示该数据
          // markerList.render(d);
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
// 日期时间选择和轨迹回放确认按钮
.el-date-editor--timerange.el-input__inner,
.el-date-editor.el-input,
.lineButton {
  width: 88%;
  margin-left: 1.5em;
  margin-top: 10px;
  margin-bottom: 4px;
}

// 地图样式
.map {
  position: absolute;
  height: 100%;
  width: 100%;
}
.panel {
  position: absolute;
  width: 600px;
  top: 96px;
  left: 239px;
  z-index: 1;
  .button1 {
    position: absolute;
    top: 4px;
    right: 331px;
  }
  .button2 {
    position: absolute;
    top: 4px;
    right: 239px;
  }
}
.resultPanel {
  position: absolute;
  background-color: white;
  width: 50%;
  height: 510px;
  top: 40px;
  left: 0px;
  z-index: 1;
  p {
    padding: 5px;
  }
  .trajectory-button {
    position: absolute;
    left: 79px;
    bottom: 85px;
  }
  .details-button {
    position: relative;
    left: 65px;
    top: 45px;
    padding: 10px 20px;
    margin: 8px;
  }
  .details-button1 {
    position: relative;
    left: 65px;
    top: 100px;
    padding: 10px 20px;
    margin-top: 16px;
  }
  .speedSlider {
    margin-left: 18px;
    margin-right: 22px;
  }
  .details-button:hover {
    cursor: pointer;
  }
  .resultPanel-closeImg {
    position: absolute;
    top: 14px;
    right: 2px;
    width: 25px;
    height: 25px;
  }
}
.tl-img {
  position: absolute;
  bottom: -4px;
  right: -4px;
  z-index: 1;
}

.el-main {
  // padding-top: 0%;
  padding: 0px;
  // padding-right: 100px;
}

.select {
  height: 500px;
  width: 200px;
}

.esriPopup .titlePane {
  color: #0f8ee7;
}
</style>
<style lang='scss'>
.input-form {
  .el-form-item__content {
    // line-height: 40px;
    // font-size: 14px;
    position: absolute;
    top: 0px;
  }
}
#map-container .amap-ui-smp-ifwn-content-body {
  color: #000;
  background: #e1e1e1;
  // opacity: 0.8;
}
#map-container .amap-ui-smp-ifwn-info-content {
  color: #000;
}
</style>


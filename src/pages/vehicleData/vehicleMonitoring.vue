<template>
  <div class="main-div">
    <el-container>
      <el-aside width="20%" class="form-aside">
        <el-form
          :label-position="labelPosition"
          label-width="60px"
          style="width: 329px"
          :model="vehicleLocation"
        >
          <el-form-item label="车牌号">
            <el-input v-model="vehicleLocation.licensePlate" style="width: 200px"></el-input>
            <el-button size="small">查询</el-button>
          </el-form-item>
          <el-form-item label="VIN">
            <el-input v-model="vehicleLocation.licensePlate" style="width: 200px"></el-input>
            <el-button size="small">查询</el-button>
          </el-form-item>
          <!-- <el-upload action="http://192.168.1.107:9993/vehicle/upload" :on-change="handleChange" :on-success="uploadSuccess" :file-list="fileList3">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>-->
        </el-form>
      </el-aside>
      <el-main>
        <div id="map-container" class="map"></div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import zHeader from '@/pages/common/header.vue'
import zAside from '@/pages/common/aside.vue'
import AMap from 'AMap'
import AMapUI from 'AMapUI'
import sharp1 from '../../assets/img/sharp.png'
export default {
  components: {
    zHeader,
    zAside
  },
  data() {
    return {
      nowTimes: '',
      loading: null,
      uploadActionUrl: 'https://192.168.1.107:9993/vehicle/upload',
      fileList3: [],

      labelPosition: 'right',
      vehicleLocation: {
        licensePlate: '',
        vin: ''
      }
    }
  },
  created() {
    //   this.nowTimes()
  },
  mounted() {
    this.init()
    //   this.nowTimes()
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList3 = fileList.slice(-3)
    },
    // 上传成功
    uploadSuccess(response, file, fileList) {
      const vm = this
      if (response.code === 200) {
        vm.$message.success(`文件【${file.name}】上传成功`)
        vm.editForm.latestDownloadUrl = response.data.url
        vm.fileList.push({
          url: response.data.url,
          name: file.name
        })
      } else {
        vm.$message.error(`文件【${file.name}】上传失败`)
      }
      // vm.loading.close();
    },
    init() {
      let map = new AMap.Map('map-container', {
        center: [114.0542132116, 22.5082421313],
        zoom: 15,
        mapStyle: 'amap://styles/dark'
      })
      map.plugin(['AMap.ToolBar', 'AMap.MapType'], function() {
        map.addControl(new AMap.ToolBar())
        //   map.addControl(new AMap.MapType({
        //     showTraffic: false,
        //     showRoad: false
        //   }))
      })
      // 后台取到的点，新建LngLat对象
      // let lngLat = [114.054268, 22.502764];
      // 实例化信息窗体
      let title = '车辆位置显示',
        content = []
      content.push('地址：福田保税区')
      content.push('车牌号：粤BAH004')
      content.push(`<a @click="">详细信息</a>`)
      let infoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        content: this.createInfoWindow(title, content.join('<br/>')),
        offset: new AMap.Pixel(20, -45)
      })
      // 转高德坐标系
      // AMap.convertFrom(lngLat, 'gps', function (info, result) {
      //   lngLat = result.locations[0] // 转换后的坐标位置
      var markers = []
      var positions = [
        [114.054268, 22.502714],
        [114.053923, 22.506632],
        [114.043773, 22.508317],
        [114.048304, 22.509349],
        [114.050916, 22.509656],
        [114.0534532532, 22.50151423412],
        [114.0535123214, 22.5029150343242],
        [114.05232416, 22.51921312421],
        [114.0543123136, 22.539343234243],
        [114.053213216, 22.502123421123],
        [114.0523213116, 22.50323412231],
        [114.0542313316, 22.5061234321231],
        [114.05200116, 22.5030034432]
        // [114.0542132116, 22.5082421313],
        // [114.052314216, 22.10143213131],
      ]
      var name = ['1', '2', '3', '4']
      // var marker1 = new AMap.Marker({
      //   map: map,
      //   position: [114.0542132116, 22.5082421313],
      //   icon: iconCar
      // });
      // AMap.event.addListener(marker1, 'click', function () {
      //   // let zdyPosition = [114.0542132116, 22.5082421313]
      //   infoWindow.open(map, marker1.getPosition());
      // });
      //创建右键菜单
      var contextMenu = new AMap.ContextMenu()

      for (var i = 0, marker; i < positions.length; i++) {
        marker = new AMap.Marker({
          map: map,
          position: positions[i],
          icon: iconCar
        })
        markers.push(marker)
      }

      // AMap.event.addListener(marker, "click", e => {
      //   AMapUI.loadUI(["overlay/SimpleInfoWindow"], function (SimpleInfoWindow) {
      //     var infoWindow = new SimpleInfoWindow({
      //       infoTitle: "<strong>这是标题</strong>",
      //       infoBody: "<p>这是信息</p>",
      //       offset: new AMap.Pixel(0, -20),
      //       autoMove: true
      //     });
      //   });
      // });
    },
    // 构建自定义信息窗体
    createInfoWindow(title, content) {
      var info = document.createElement('div')
      info.className = 'custom-info input-card content-window-card'

      //可以通过下面的方式修改自定义窗体的宽高
      info.style.width = '210px'
      info.style.height = '200px'
      // 定义顶部标题
      var top = document.createElement('div')
      var titleD = document.createElement('div')
      var closeX = document.createElement('img')
      top.style.backgroundColor = 'white'
      top.className = 'info-top'
      titleD.innerHTML = title
      closeX.src = close2
      // closeX.onclick = map.clearInfoWindow();

      top.appendChild(titleD)
      // top.appendChild(closeX);
      info.appendChild(top)

      // 定义中部内容
      var middle = document.createElement('div')
      middle.className = 'info-middle'
      middle.style.backgroundColor = 'white'
      middle.innerHTML = content
      info.appendChild(middle)

      // 定义底部内容
      var bottom = document.createElement('div')
      bottom.className = 'info-bottom'
      bottom.style.position = 'relative'
      bottom.style.top = '0px'
      bottom.style.margin = '0 auto'
      var sharp = document.createElement('img')
      sharp.src = sharp1
      bottom.appendChild(sharp)
      info.appendChild(bottom)
      return info
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
  position: absolute;
  height: 100%;
  width: 100%;
}

.form-aside {
  .el-form-item__label {
    text-align: left;
    padding: 0px;
    width: 35px;
  }

  .el-input__inner {
    padding-left: 0;
  }
}

.el-main {
  padding-top: 0%;
  padding-left: 1px;
}
</style>

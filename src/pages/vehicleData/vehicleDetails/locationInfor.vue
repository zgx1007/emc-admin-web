<template>
  <div class="mapRWrap">
    <el-container style="height: 600px;">
      <div v-show="!showMap" id="map-container" class="map"></div>
      <div v-show="showMap">暂无位置数据</div>
    </el-container>
  </div>
</template>
<script>
import iconCar from "../../../assets/realLocation.png";
import AMap from "AMap";
export default {
  props: {
    realData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    realData(val) {
      this.realData = val;
      if (val.longitude && val.latitude) {
        this.showMap = false;
        this.init(val);
      } else {
        this.showMap = true;
      }
    }
  },
  data() {
    return {
      longitude: this.realData.longitude, //"经度"
      latitude: this.realData.latitude, //纬度
      showMap: true
    };
  },
  methods: {
    init(val) {
      let map = new AMap.Map("map-container", {
        center: [val.longitude, val.latitude],
        zoom: 15
        // mapStyle: "amap://styles/dark"
      });

      let marker = new AMap.Marker({
        icon: iconCar,
        position: [val.longitude, val.latitude],
        offset: new AMap.Pixel(-13, -30)
      });
      marker.setMap(map);
    }
  }
};
</script>
<style lang="scss" scoped>
.map {
  position: absolute;
  height: 100%;
  width: 100%;
}

.el-main {
  padding: 0px;
  padding-right: 100px;
}
.amap-icon img {
  width: 24px;
}
</style>

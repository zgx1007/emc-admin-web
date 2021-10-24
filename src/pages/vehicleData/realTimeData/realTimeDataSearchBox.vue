<template>
  <div class="realTimeStatusOne">
    <!-- 搜索vin输入框 -->
    <el-input clearable placeholder="请输入vin码、车牌号" class="input-with-select" v-model="inputVin"></el-input>
    <!-- 搜索省会城市 -->
    <!-- <cityCascader @cityCode="cityCodeChange($event)" ref="cityCascader"></cityCascader> -->
    <!-- 搜索运营公司 -->
    <companyCascader @companyId="companyIdChange($event)" ref="companyCascader"></companyCascader>
    <el-button type="primary" @click.stop="search()" style="margin-left:10px">查询</el-button>
    <!-- <div class="city">当前区域：{{currentCity}}</div> -->
  </div>
</template>
<script>
import companyCascader from "@/pages/common/companyCascader.vue";
import cityCascader from "@/pages/common/cityCascader.vue";
export default {
  components: {
    companyCascader,
    cityCascader
  },
  mounted() {
    // this.$refs.companyCascader.allowFather = false; //设置选择器只能选择最后一级
  },
  created() {
    this.currentCity = window.sessionStorage.getItem("city");
    this.cityCode = window.sessionStorage.getItem("cityCode");
  },
  methods: {
    //公司改变
    companyIdChange(id) {
      this.operatingCompany = id;
    },
    //城市编码改变
    cityCodeChange(value) {
      this.cityCode = value[1];
      if (value.length == 0) {
        this.currentCity = "全国";
      } else {
        this.currentCity = value[2];
      }
    },
    // 查询
    search() {
      let vin = window._format.trim(this.inputVin);
      this.$emit("search_tableData", vin, this.cityCode, this.operatingCompany);
    }
  },
  data() {
    return {
      inputVin: "", //输入框值
      currentCity: "",
      allCity: "", // 存储所有城市
      cityCode: "",
      operatingCompany: "" //选择运营公司
    };
  }
};
</script>
<style scoped>
.input-with-select {
  width: 15%;
}
.block {
  display: inline-block;
  margin-left: 20px;
}
.realTimeStatusOne {
  display: inline-block;
  width: 100%;
}
.city {
  float: right;
  height: 40px;
  line-height: 40px;
  color: #409eff;
}
</style>

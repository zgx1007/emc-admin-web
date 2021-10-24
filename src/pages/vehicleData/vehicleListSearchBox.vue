<template>
  <div>
    <!-- 搜索省会城市 -->
    <!-- <cityCascader @cityCode="cityCodeChange($event)" ref="cityCascader"></cityCascader> -->
    <!-- 搜索运营公司 -->
    <companyCascader @companyId="companyIdChange($event)" ref="companyCascader"></companyCascader>
    <!-- 车辆类别-->
    <el-select v-model="vehicleType" clearable placeholder="车辆类别">
      <el-option
        v-for="item in vehicleTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <!-- 车辆品牌 -->
    <el-select v-model="vehicleBrand" clearable placeholder="车辆品牌">
      <el-option
        v-for="item in vehicleBrandOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <!-- 车辆型号 -->
    <el-select v-model="vehicleModel" clearable placeholder="车辆型号">
      <el-option
        v-for="item in vehicleModelOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <!-- 搜索vin输入框 -->
    <el-input clearable placeholder="请输入vin码、车牌号" class="input-with-select" v-model="inputVin"></el-input>
    <el-button type="primary" @click.stop="allSearch()" style="margin-left:10px">查询</el-button>
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
  created() {
    this.getAllVehicleCategoryBrandModels(); //获取所有车辆类别品牌型号
  },
  methods: {
    //城市编码改变
    cityCodeChange(value) {
      this.cityCode = value[1];
    },
    //公司改变
    companyIdChange(id) {
      this.companyId = id;
    },
    //所有查询(vin码和省会)
    allSearch() {
      let vin = window._format.trim(this.inputVin);
      this.$emit(
        "search_box",
        vin,
        this.companyId,
        this.cityCode,
        this.vehicleType,
        this.vehicleBrand,
        this.vehicleModel
      );
    },
    // 获取所有车辆类别品牌型号
    getAllVehicleCategoryBrandModels() {
      this.$post(
        `${this.$store.state.basedataUrl}/vehicleTypeInfo/getAllVehicleType`
      ).then(data => {
        if (data.code === 200) {
          this.processingClassification(
            data.data,
            "vehicleType",
            "vehicleTypeOptions"
          ); //分类处理
          this.processingClassification(
            data.data,
            "vehicleModel",
            "vehicleModelOptions"
          ); //分类处理
          this.processingClassification(
            data.data,
            "vehicleBrand",
            "vehicleBrandOptions"
          ); //分类处理
          this.$emit("vehicle_type", data.data);
        }
      });
    },
    //分类处理
    processingClassification(data, itemType, itemName) {
      let vehicleType = [];
      for (let item of data) {
        vehicleType.push(item[itemType]);
      }
      vehicleType = window._format.arrRemoveDuplicates(vehicleType); //数组去重
      // 写入下拉选择器
      for (let item of vehicleType) {
        this[itemName].push({
          value: item,
          label: item
        });
      }
    }
  },
  data() {
    return {
      vehicleTypeOptions: [], //车辆类别
      vehicleType: "",
      vehicleBrandOptions: [], //车辆品牌
      vehicleBrand: "",
      vehicleModelOptions: [], //车辆型号
      vehicleModel: "",
      cityCode: "",
      inputVin: "", //输入框值
      companyId: "" //选择运营公司
    };
  }
};
</script>
<style scoped>
.block {
  display: inline-block;
}
.input-with-select {
  width: 200px;
  margin-left: 10px;
}
#vehicleBasicInfoTable .el-select {
  width: 130px;
  margin-left: 10px;
}
</style>


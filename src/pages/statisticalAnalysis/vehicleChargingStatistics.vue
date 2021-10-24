<template>
  <div>
    <!-- 引入公司机构选择 -->
    <companyAndTime></companyAndTime>
    <div style="margin: 15px 0 33px 23px;">
      <span class="power" style="border-right: 1px solid;padding-right: 10px;"  @click="Power()" ref="Power">车辆耗电分析</span>
      <span class="charging" @click="Charging()" ref="Charging">车辆充电分析</span>
    </div>
    <div>
      <el-checkbox
        class="block"
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >全选</el-checkbox>
      <el-checkbox-group class="block" v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <!-- 车辆充电数量分析echarts -->
    <el-row>
      <div  id="vehicleChargingStatistics" style="width:100%;height:450px"></div>
    </el-row>
  </div>
</template>
<script>
// 导入组件
import companyAndTime from "@/pages/statisticalAnalysis/companyAndTime.vue";
//  导出xlsx表
import FileSaver from "file-saver";
import XLSX from "xlsx";
// 引入 ECharts 主模块
var echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/bar");
require("echarts/lib/chart/line");
// 引入提示框标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
const cityOptions = ["K8", "K8S", "C8B"];
export default {
  data() {
    return {
      radio: "1",
      // 多选框
      checkAll: false,
      checkedCities: ["K8", "K8S", "C8B"],
      cities: cityOptions,
      isIndeterminate: true
      //  车辆耗电数据表格
    };
  },
  // 导入组件
  components: {
    companyAndTime
  },
  mounted() {
    this.vehicleChargingStatistics();
  },
  methods: {
    // 多选框的选择
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    // 车辆充电跳转
    Power() {
      this.$router.push({
        path: "/statisticalAnalysis/vehiclePowerStatistics"
      });
    },
    // 在线车辆分析
    vehicleChargingStatistics() {
      let myEcharts = echarts.init(
        document.getElementById("vehicleChargingStatistics")
      );
      myEcharts.setOption({
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            toolbox: {
              feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            legend: {
              data: ['电池总电量', '单次充电前电量', '单次充电后电量']
            },
            grid: {
              left: '2%',
              right: '2%',
              bottom: '4%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: ["1", "2","3","4","5","6","7"],
              max:15
            },
            yAxis: [
              {
                show: true,
                type: 'value',
                name: '电量（kwh）',
                axisLabel: {
                  formatter: '{value} 辆'
                }
              },
            ],
            series: [
            {
                name: '电池总电量',
                type: 'bar',
                barWidth: "24", //柱形图宽度
                data: [300, 300, 300,300,300,300,300],
                barGap: '-100%', //间距
                itemStyle: {
                  normal: {color: '#ececec'}
               }
            },
            {
                name: '单次充电后电量',
                type: 'bar',
                barWidth: "24", //柱形图宽度
                data: [220, 199, 230,255,180,244,190],
                // barGap: '-100%',
                itemStyle: {
                  normal: {color: '#95f204'}
               }
            },
            {
                name: '单次充电前电量',
                type: 'bar',
                barWidth: "24", //柱形图宽度
                data: [60, 102, 160,150,80,100,120],
                // barGap: '-100%',
                itemStyle: {
                  normal: {color: '#f59a23'}
                }
            },          
            ]
          })
      window.addEventListener("resize", function() {
        myEcharts.resize()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.block {
  display: inline-block;
  margin-left: 12px;
  margin-bottom: 10px;
}
.power{
  cursor: pointer
}
.charging{
  color: blue
}
</style>


<template>
  <div>  <!-- 引入公司机构选择 -->
  <companyAndTime></companyAndTime>
  <div style="margin: 15px 0 33px 23px;">
    <span class="power" @click="Power()" ref="Power">车辆耗电分析</span>
    <span class="charging" @click="Charging()" ref="Charging">车辆充电分析</span>
  </div>
  <div>
  <el-checkbox class="block" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
  <el-checkbox-group class="block"  v-model="checkedCities" @change="handleCheckedCitiesChange">
    <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
  </el-checkbox-group>
  </div>
  <!-- 车辆预警数量分析echarts -->
  <el-row>
     <div class="WarningStatistics" id="WarningStatistics" style="width:100%;height:450px"></div>
 </el-row>
  <!-- 表格信息 -->
 <el-row>
    <el-col :span="2">车辆耗电排行</el-col>
    <el-col :span="20">  
      <el-radio v-model="radio" label="1">按每公里耗电量</el-radio>
      <el-radio v-model="radio" label="2">按日均耗电量</el-radio></el-col>
    <el-col :span="2"><el-button type="primary" size="mini" @click="exportExcel">导出表格</el-button></el-col>
  </el-row>
<el-row>
        <div id="app">
        <el-table :data="tableData" border style="width:100%" align="center" id="out-table">
          <el-table-column prop="powerData" label="日期" align="center"></el-table-column>
          <el-table-column  type="index"  width="100" label="排序" align="center"></el-table-column>
          <el-table-column prop="powerCarnumber" label="车牌" align="center"></el-table-column>
          <el-table-column prop="powerVin" label="Vin码" align="center"></el-table-column>
          <el-table-column prop="powerType" label="车型" align="center"></el-table-column>
          <el-table-column prop="powerCompany" label="所属机构" align="center"></el-table-column>
          <el-table-column prop="PowerConsumption" label="近百公里耗电量kwh" align="center"></el-table-column>
          <el-table-column prop="dailyPowerConsumption" label="日耗电量kwh" align="center"></el-table-column>
          <el-table-column prop="dailyMileage" label="日行驶里程km" align="center"></el-table-column>
          <el-table-column prop="dailyDrivingTime" label="日行驶时长h" align="center"></el-table-column>
        </el-table>
       </div>
</el-row>
  </div>
</template>
<script>
// 导入组件
import companyAndTime from '@/pages/statisticalAnalysis/companyAndTime.vue'
//  导出xlsx表
 import FileSaver from 'file-saver'
 import XLSX from 'xlsx'
 // 引入 ECharts 主模块
var echarts = require("echarts/lib/echarts")
// 引入柱状图
require("echarts/lib/chart/bar")
require("echarts/lib/chart/line")
// 引入提示框标题组件
require("echarts/lib/component/tooltip")
require("echarts/lib/component/title")
const cityOptions = ['K8', 'K8S', 'C8B']
export default {
    data() {
      return {  
        radio: '1', 
        // 多选框
        checkAll: false,
        checkedCities:['K8', 'K8S', 'C8B'],
        cities: cityOptions,
        isIndeterminate: true,
        //  车辆耗电数据表格     
         tableData:[	
          {powerData:"2019-07-09",powerCarnumber:"粤B37523D",powerVin:"LC06S64MXH1993359",powerType:"C8B",powerCompany:"深圳巴士",PowerConsumption:"122",dailyPowerConsumption:"34",dailyMileage:"23",dailyDrivingTime:"12"},
          {powerData:"2019-07-10",powerCarnumber:"粤B27523D",powerVin:"LC06S64MXH1993339",powerType:"K8",powerCompany:"深圳巴士",PowerConsumption:"82",dailyPowerConsumption:"31",dailyMileage:"13",dailyDrivingTime:"12"}

				]}
    },
    // 导入组件
    components: {
      companyAndTime,
    },
    mounted() {
    this.WarningStatistics()
    },
    methods:{
      // 多选框的选择
       handleCheckAllChange(val) {
        this.checkedCities = val ? cityOptions : []
        this.isIndeterminate = false
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.cities.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
      },
      // 车辆充电跳转
      Charging() {
      this.$refs.Charging.style.color ='blue'
      this.$router.push({
        path: '/statisticalAnalysis/vehicleChargingStatistics',
      })
    },
      // 在线车辆分析
     WarningStatistics() {
      let myEcharts = echarts.init(document.getElementById("WarningStatistics"))
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
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    legend: {
        data:['每公里耗电','日均耗电量']
    },
    grid: {
    left: '2%',
    right: '2%',
    bottom: '4%',
    containLabel: true
    },
    xAxis:{
       axisLine: { onZero: false },
        type: 'category',
        data: ["1", "2","3","4","5","6","7", "8","9","10","11","12","13", "14","15","16","17", "18","19","20","22","23", "24","25","26","27","28","29","30"]
    },
    yAxis: [ 
      {   
        type: 'value',
        name:'车辆耗电分析(kwh)',
      }
    ],
    series: [
         {
      data: [25,39,27,60,45,28,33,35,46,33,36,68,45,23,34,21,33,55,31,47,28,33,40,26,20,42,42,28,23],
      barWidth: "24", //柱形图宽度
      stack: '总量',//堆叠数据
      type: 'line',
      smooth: true,
      name:"日均耗电量",
      areaStyle: {}, 
     // 修改区域颜色
      itemStyle: {
            normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0.3, color: "#f6a84a" },
              { offset: 0.7, color: "#e8d9c0" },
              { offset: 1, color: "#ffffff" }
            ])
          }
        },
      },
      {
      data: [90,139,73,165,87,138,66,150,83,173,56,122,69,130,78,180,67,179,78,127,68,196,97,156,81,164,32,129,43],
      type: 'line',
      smooth: true,
      stack: '总量',//堆叠数据
      name:"每公里耗电",
      areaStyle: {},
     // 修改区域颜色
      itemStyle: {
            normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0.3, color: "#46a6fe" },
              { offset: 0.7, color: "#9dd0fe" },
              { offset: 1, color: "#ffffff" }
            ])
          }
        },
      },
     
     ]
      })
      window.addEventListener("resize", function() {
        myEcharts.resize()
      })
    },
     //  导出xlsx表
     exportExcel () {
        /* generate workbook object from table */
        var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
        /* get binary string as output */
        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '车辆耗电排行表.xlsx')
        } catch (e) { if (typeof console !== 'undefined') {console.log(e, wbout) }
        return wbout
        }
    },
    }
}
</script>
<style lang="scss" scoped>
.Operationtable {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    margin-top:1%
}
.Operationtable th,td {
    border: 1px solid #333333;
    height: 30px;
    color: #333333
}
.block {
  display: inline-block;
  margin-left: 12px;
  margin-bottom: 10px;
}
.text{
  cursor: pointer;
}
.power{
  border-right: 1px solid;padding-right: 10px;
  color: blue
}
.charging{
  cursor: pointer
}
</style>


<template>
  <div class="completeVehicleData">
    <!-- 第一行(车速，SOC) -->
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="2" style="justify-content: center;display: flex;">
        <div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :span="4" style="justify-content: center;display: flex;">
        <div class="grid-content bg-purple">
          <!-- 车速仪表盘 -->
          <div id="speed" style="width: 300px;height:300px;" class="wrap_flex"></div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-content bg-purple-light">
          <div
            style="display: flex;flex-grow: 1;height: 100%;margin-top: 1%;justify-content: center;"
            class="wrap_flex"
          >
            <div class="warp_div" style="flex-direction: column;text-align: center;height:50px">
              <h1 style="color: #7f7f7f;fontSize:2em">累计里程(km)</h1>
              <h1 style="color: #2397F0;fontSize:4em;margin:0">{{realData.totalMileage}}</h1>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <!-- soc仪表盘 -->
          <!-- :percentage="Number(realData.soc)" -->
          <div class="wrap_flex" style="margin-top: 25px;text-align: center;">
            <el-progress type="circle" :width="150" :percentage="soc" color="#80C269"></el-progress>
            <h1 style="color:#666;fontSize:1.8em;text-align: center;margin-top: -60px;">soc</h1>
          </div>
        </div>
      </el-col>
      <el-col :span="2" style="justify-content: center;display: flex;">
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>
    <!-- 第一行(车速，SOC) -->
    <!-- 中间行(小图标) -->
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <div class="grid-content bg-purple">
          <div class="warp_div" style="display: flex;justify-content: center;margin-top: -120px;">
            <div class="div_logo">
              <img
                src="../../../assets/activationBus.png"
                alt="车辆图标"
                class="logo"
                title="车辆图标"
                v-show="this.pageData.vehicleStatus == 1"
              >
              <img
                src="../../../assets/grayBus.png"
                alt="小车图标"
                class="logo"
                title="车辆图标"
                v-show="this.pageData.vehicleStatus != 1"
              >
              <h4>{{this.pageData.vehicleStatus | formatVehicleStatus}}</h4>
            </div>
            <div class="div_logo">
              <img
                src="../../../assets/grayChargingPile.png"
                alt="发动机图标"
                class="logo"
                title="发动机图标"
                v-show="this.pageData.vehicleStatus != 1"
              >
              <img
                src="../../../assets/activateChargingPile.png"
                alt="发动机图标"
                class="logo"
                title="发动机图标"
                v-show="this.pageData.vehicleStatus == 1"
              >
              <h4>{{this.pageData.engineStatus | formatEngineStatus}}</h4>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 中间行(小图标) -->
    <!-- 下方行 -->
    <el-row :gutter="20">
      <el-col :span="5" class="pic_centen">
        <div class="grid-content bg-purple">
          <!-- 总电压  -->
          <div id="totalVoltage" style="width: 300px;height:300px"></div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <!-- 总电流  -->
          <div id="totalCurrent" style="width: 300px;height:300px"></div>
        </div>
      </el-col>
      <el-col :span="4" style="margin-top: 58px;">
        <div class="grid-content bg-purple">
          <div class="warp_div" style="flex-direction: column;text-align: center;height:50px">
            <h1 style="color: #7f7f7f;fontSize:1.4em">绝缘电阻</h1>
            <h1 style="color: #2397F0;fontSize:2em;margin:0">{{realData.insulationResistance}} KΩ</h1>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <!-- 电机转速仪表盘  -->
          <div id="engineSpeed" style="width: 300px;height:300px"></div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <!-- 最近百公里能耗仪表盘  -->
          <div id="engineFuelConsumption" style="width: 300px;height:300px"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 引入 ECharts 主模块
var echarts = require("echarts/lib/echarts");
// 引入提示框标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");

var _this;
export default {
  beforeCreate() {
    _this = this;
  },
  updated() {
    this.speedDashBoard(); //车速仪表盘
    this.totalVoltageDashBoard(); //总电压仪表盘
    this.totalCurrentDashBoard(); //总电流仪表盘
    this.engineSpeedDashBoard(); //电机转速仪表盘
    this.engineFuelConsumptionDashBoard(); //最近百公里能耗仪表盘
  },
  mounted() {
    this.speedDashBoard(); //车速仪表盘
    this.totalVoltageDashBoard(); //总电压仪表盘
    this.totalCurrentDashBoard(); //总电流仪表盘
    this.engineSpeedDashBoard(); //电机转速仪表盘
    this.engineFuelConsumptionDashBoard(); //最近百公里能耗仪表盘
  },
  filters: {
    formatVehicleStatus: function(value) {
      return value == 1 ? "车辆启动" : value == 2 ? "车辆熄火" : "其他状态";
    },
    formatEngineStatus: function(value) {
      return value == 1 ? "启动状态" : value == 2 ? "关闭状态" : "--";
    }
  },
  methods: {
    //车速仪表盘
    speedDashBoard() {
      let value;
      if (this.pageData.vehicleSpeed) {
        value = this.pageData.vehicleSpeed;
      } else {
        value = "0";
      }
      let optionData = {
        id: "speed",
        name: "车速",
        value: value, //当前值
        unit: " km/h", //单位
        endAngle: "0", //结束角度
        min: 0,
        max: 120 //最大值
      };
      this.dashBoard(optionData);
    },
    //总电压仪表盘
    totalVoltageDashBoard() {
      let value;
      if (this.pageData.totalVoltage) {
        value = this.pageData.totalVoltage;
      } else {
        value = "0";
      }
      let optionData = {
        id: "totalVoltage",
        name: "总电压",
        value: value, //当前值
        unit: " V", //单位
        endAngle: "0", //结束角度
        min: 0,
        max: 800 //最大值
      };
      this.dashBoard(optionData);
    },
    //总电流仪表盘
    totalCurrentDashBoard() {
      let value;
      if (this.pageData.totalCurrent) {
        value = this.pageData.totalCurrent;
      } else {
        value = "0";
      }
      let optionData = {
        id: "totalCurrent",
        name: "总电流",
        value: value, //当前值
        unit: " A", //单位
        endAngle: "0", //结束角度
        min: -400,
        max: 400 //最大值
      };
      this.dashBoard(optionData);
    },
    //电机转速仪表盘
    engineSpeedDashBoard() {
      let value;
      if (this.pageData.crankshaftSpeed) {
        value = this.pageData.crankshaftSpeed;
      } else {
        value = "0";
      }
      let optionData = {
        id: "engineSpeed",
        name: "电机转速",
        value: value, //当前值
        unit: " r/min", //单位
        endAngle: "0", //结束角度
        min: -4000,
        max: 4000 //最大值
      };
      this.dashBoard(optionData);
    },
    //最近百公里能耗仪表盘
    engineFuelConsumptionDashBoard() {
      let value;
      if (this.pageData.engineConsumeRate) {
        value = this.pageData.engineConsumeRate;
      } else {
        value = "0";
      }
      let optionData = {
        id: "engineFuelConsumption",
        name: "最近百公里能耗",
        value: value,
        unit: " kWh/100km", //单位
        endAngle: "0", //结束角度
        min: 0,
        max: 200 //最大值
      };
      this.dashBoard(optionData);
    },
    //仪表盘参数
    dashBoard(optionData) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(optionData.id));
      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          formatter: function(params) {
            return `${params.data.name} : ${params.data.value}${
              optionData.unit
            }`;
          }
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true }
          }
        },
        series: [
          {
            name: "业务指标",
            type: "gauge",
            splitNumber: 5, // 分割段数，默认为5（把最大值分成几段）
            // radius: "%", //大小
            center: ["50%", "50%"], //位置(默认居中50%)
            startAngle: 180, //开始角度
            endAngle: optionData.endAngle, //结束角度
            min: optionData.min,
            max: optionData.max, //最大值
            // 坐标轴线
            axisLine: {
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[0.2, "#228b22"], [0.8, "#48b"], [1, "#ff4500"]],
                width: 5
              }
            },
            // 坐标轴小标记
            axisTick: {
              splitNumber: 1, // 每份split细分多少段
              length: 12, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "auto"
              }
            },
            // 坐标轴文本标签
            axisLabel: {
              textStyle: {
                color: "auto"
              }
            },
            // 分隔线
            splitLine: {
              show: true, // 默认显示，属性show控制显示与否
              length: 25, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: "auto"
              }
            },
            pointer: {
              width: 3 //指针粗细
            },
            title: {
              show: true,
              offsetCenter: [0, "30%"], // x, y，单位px
              textStyle: {
                fontWeight: "bolder",
                fontSize: 24
              }
            },
            detail: {
              formatter: `{value}${optionData.unit}`,
              offsetCenter: [0, "60%"], // x, y，单位px
              textStyle: {
                color: "auto",
                fontWeight: "bolder",
                fontSize: 24
              }
            },
            data: [{ value: optionData.value, name: optionData.name }]
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, true);
    }
  },
  data() {
    return {
      pageData: this.realData,
      soc: 0
    };
  },
  props: {
    realData: {
      type: Object,
      required: true
    }
  },
  watch: {
    realData: {
      handler: function(val, oldval) {
        // this.soc = Number(val.soc * 100);
        this.soc = Number(val.soc);
        this.pageData = val;
        this.speedDashBoard(); //车速仪表盘
        this.totalVoltageDashBoard(); //总电压仪表盘
        this.totalCurrentDashBoard(); //总电流仪表盘
        this.engineSpeedDashBoard(); //电机转速仪表盘
        this.engineFuelConsumptionDashBoard(); //最近百公里能耗仪表盘
      },
      deep: true //对象内部的属性监听，也叫深度监听
    }
  }
};
</script>
<style lang="scss" scoped>
.completeVehicleData {
  border: 1px solid #9fddf9;
  border-radius: 88px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.wrap {
  display: flex;
  padding: 0px 20px;
}
.value {
  color: #0f8ee7;
  font-size: 1.4em;
  text-align: center;
}
.borderR {
  border-right: 1px solid #d4d4d4;
  color: #7f7f7f;
  font-size: 1.2em;
  height: 115px;
  padding: 10px 30px;
}

.logo {
  width: 36px;
  height: 35px;
}
.div_logo {
  padding: 0;
  flex-grow: 0.1;
  height: 50px;
  text-align: center;
}
/* 布局样式 */
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
}

.pic_centen {
  justify-content: center;
  display: flex;
}
</style>

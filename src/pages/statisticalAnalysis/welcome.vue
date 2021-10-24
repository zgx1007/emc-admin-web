<template>
  <div class="index">
    <div class="flex-container">
      <div class="flex-item flex-container1">
        <div class="mouth">
          <div class="distance flex-container1">
            <div class="distance borderLeft buttom">
              <p>
                <span>{{ monthData}}</span>
              </p>
              <p>近30天平均里程(万公里)</p>
            </div>
            <div class="distance buttom">
              <p>
                <span>{{ dayData}}</span>
              </p>
              <p>昨日平均里程(公里)</p>
            </div>
          </div>
          <div class="distance flex-container1">
            <div class="distance borderLeft">
              <p>
                <span class="green">{{ onlineData}}%</span>
              </p>
              <p class="online">在线率</p>
            </div>
            <div class="distance borderLeft">
              <p>
                <span class="green">{{ lineData}}</span>
              </p>
              <p class="online">在线</p>
            </div>
            <div class="distance borderLeft">
              <p>
                <span>{{ activate}}</span>
              </p>
              <p>未激活</p>
            </div>
            <div class="distance">
              <p>
                <span>{{ onlineCar}}</span>
              </p>
              <p>共计(辆)</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-item" id="e3">
        <p>
          <i>车总数：</i>
          <el-progress :percentage="40" :stroke-width="20" class="progress" :text-inside="true"></el-progress>
        </p>
        <div class="staut" style=" width:86%;height:250px">
          <div class="circle circle1">{{staut1}}</div>
          <div class="circle circle2">{{staut2}}</div>
          <div class="circle circle3">{{staut3}}</div>
          <div class="staut4">已处理</div>
          <div class="staut4">处理中</div>
          <div class="staut4">未处理</div>
        </div>
      </div>
    </div>
    <div class="flex-container">
      <!-- 近一个月的里程计算 -->
      <div class="flex-item" id="one"></div>
      <div class="flex-item" id="tow"></div>
    </div>
    <div class="flex-container">
      <div class="flex-item" id="three"></div>
      <div class="flex-item" id="four"></div>
    </div>
  </div>
</template>
<script>
// 引入 ECharts 主模块
var echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/bar");
require("echarts/lib/chart/line");

// 引入提示框标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  data() {
    return {
      monthData: 42.34,
      dayData: 25.9,
      onlineData: 30,
      lineData: 67,
      activate: 1035,
      onlineCar: 4545,
      //  tableData:[],
      // 处理状态值
      staut1: 26,
      staut2: 23,
      staut3: 18,
    }
  },
  created(){this.$store.commit('changeBreadcumb',[])},
  mounted() {
    this.showLineLevel();
    this.showLineTime();
    this.showLineCarNember();
    this.showLinemileage();
  },
  methods: {
    //全局设置Echrts - 根据窗口的大小变动图
    showLineLevel() {
      let myEcharts = echarts.init(document.getElementById("one"));
      myEcharts.setOption({
        title: {
          text: "报警级别",
          textStyle: {
            //标题颜色
            color: "white",
            fontSize: 13
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["三级报警", "二级报警", "一级报警"],
          textStyle: {
            //图例文字的样式
            color: "#ccc",
            fontSize: 13
          }
        },
        xAxis: {
          type: "value",
          //设置坐标轴字体颜色和宽度
          splitLine: {
            show: false
          },
          // max:17,
          axisLine: {
            lineStyle: {
              color: "white",
              width: 1
            }
          }
        },
        yAxis: {
          type: "category",
          data: ["2", "6", "10", "14", "18", "22", "26"],
          //设置坐标轴字体颜色和宽度
          splitLine: {
            show: false
          },
          // max:17,
          axisLine: {
            lineStyle: {
              color: "white",
              width: 1
            }
          }
        },
        series: [
          {
            name: "一级报警",
            type: "bar",
            stack: "总量",
            data: ["18", "16", "14", "11", "14", "16", "18"],
            itemStyle: { normal: { color: "#0cffe9" } },
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            }
          },
          {
            name: "二级报警",
            type: "bar",
            stack: "总量",
            data: ["18", "16", "14", "11", "14", "16", "18"],
            itemStyle: { normal: { color: " #fc7293" } },
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            }
          },
          {
            name: "三级报警",
            type: "bar",
            stack: "总量",
            data: ["18", "16", "14", "11", "14", "16", "18"],
            itemStyle: { normal: { color: "  #8c80ff" } },
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            }
          }
        ]
      });
      window.addEventListener("resize", function() {
        myEcharts.resize();
      });
    },
    showLineTime() {
      let myEcharts = echarts.init(document.getElementById("tow"));
      myEcharts.setOption({
        title: {
          text: "日均时长",
          textStyle: {
            //标题颜色
            color: "white",
            fontSize: 13
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["公交车", "出租车"],
          textStyle: {
            //图例文字的样式
            color: "#ccc",
            fontSize: 13
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["2", "6", "10", "14", "18", "22", "26", "30"],
            // data : ['周一','周二','周三','周四','周五','周六','周日'],
            axisLine: {
              lineStyle: {
                color: "white",
                width: 1
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "white",
                width: 1
              }
            },
            // 除去横向网格
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "公交车",
            type: "line",
            stack: "总量",
            areaStyle: {},
            smooth: true,
            data: ["10", "12", "11", "13", "15", "12", "14", "10"],
            // 修改区域颜色
            itemStyle: { normal: { color: " #fc7293" } }
          },
          {
            name: "出租车",
            type: "line",
            stack: "总量",
            areaStyle: {},
            smooth: true,
            data: ["10", "9", "11", "12", "14", "12", "11", "8"],
            // 修改区域颜色
            itemStyle: { normal: { color: "#8c80ff" } }
          }
          // 区间 颜色 设置
        ]
      });
      window.addEventListener("resize", function() {
        myEcharts.resize();
      });
    },
    showLineCarNember() {
      let myEcharts = echarts.init(document.getElementById("three"));
      myEcharts.setOption({
        //根据窗口的大小变动图表 --- 重点
        title: {
          text: "车运行/车总数",
          textStyle: {
            //标题颜色
            color: "white",
            fontSize: 13
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        xAxis: {
          //设置坐标轴字体颜色和宽度
          splitLine: {
            show: false
          },
          // max:17,
          axisLine: {
            lineStyle: {
              color: "white",
              width: 1
            }
          },
          data: [ "2","4","6", "8","10","12", "14","16", "18","22","24", "26","28","30"]
        },
        yAxis: {
          // 除去横向网格
          splitLine: {
            show: false
          },
          //设置坐标轴字体颜色和宽度
          axisLine: {
            lineStyle: {
              color: "white",
              width: 1
            }
          }
        },
        series: [
          {
            type: "bar",
            barWidth: "29", //柱形图宽度
            // 修柱形图颜色
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#9effba" },
                  { offset: 0.5, color: "#13fff1" },
                  { offset: 1, color: "#13fff1" }
                ])
              }
            },
            data: [500,700,640,800,520,1000,700,800,940,780,1100,703,833,900]
          }
        ]
      });
      window.addEventListener("resize", function() {
        myEcharts.resize();
      });
    },
    showLinemileage() {
      let myEcharts = echarts.init(document.getElementById("four"));
      myEcharts.setOption({
        title: {
          text: "车里程数",
          textStyle: {
            //标题颜色
            color: "white",
            fontSize: 13
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        xAxis: {
          type: "category",
          data: ["2", "4", "6", "8", "10", "12", "14", "16", "18", "22"],
          //设置坐标轴字体颜色和宽度
          axisLine: {
            lineStyle: {
              color: "white",
              width: 1
            }
          }
        },
        yAxis: {
          type: "value",
          // 除去横向网格
          splitLine: {
            show: false
          },
          //设置坐标轴字体颜色和宽度
          axisLine: {
            lineStyle: {
              color: "white",
              width: 1
            }
          }
        },
        series: [
          {
            type: "line",
            smooth: true,
            // 修改折线颜色
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#9effba" },
                  { offset: 0.5, color: "#13fff1" },
                  { offset: 1, color: "#13fff1" }
                ])
              }
            },
            data: [700, 600, 940, 500, 980, 453, 833, 430, 800, 500]
          }
        ]
      });
      window.addEventListener("resize", function() {
        myEcharts.resize();
      });
    }
  }
};
</script>
 <style scoped>
.index {
  background: url('../../assets/img/welcom2.jpg') no-repeat fixed center;
  background-size:100% 100%;
  /* margin-left: -40px; */
  width: 102%;
  margin: -20px;
  height: 1200px;
  margin-top: -30px;
}
.flex-container {
  display: -webkit-flex;
  display: flex;
  width: 100%;
  height: 33%;
}
.flex-container1 {
  display: -webkit-flex;
  /* flex-direction: row; */
  display: flex;
  width: 100%;
  height: 33%
}
.flex-item {
  /* background: pink; */
  width: 49%;
  height: 85%;
  margin: 3px;
}
.distance {
  /* background: pink ; */
  margin-top: 30px;
  width: 190%;
  height: 37%;
}
.borderLeft {
  border-right: 1px solid #9ca3a375;
}
.buttom {
  border-bottom: 1px solid #9ca3a375;
}
p {
  text-align: center;
  font-size: 16px;
  color: #d8e0e1;
  margin-top: 8px;
}
.green,
.online {
  color: #00cc44;
}
p span {
  font-size: 30px;
  font-family: Consolas;
}
.el-main {
  padding: 0px;
}
/* 进度条 */
.progress {
  margin: 40px 0px 0px 151px;
  width: 57%;
}
/* 车实时总数： */
i {
  font-style: normal;
  position: relative;
  top: 3.7em;
  right:39%;
  font-size: 1em;
}
.circle {
  float: left;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-left: 10%;
  margin-top: 40px;
  background: white;
  font-size: 32px;
  text-align: center;
  line-height: 100px;
}
.staut4 {
  width: 100px;
  float: left;
  margin-left: 12%;
  margin-right: 2.5%;
  margin-top: 20px;
  font-size: 18px;
  text-align: center;
  color: white;
}
.circle1 {
  border: 15px solid #f59a23;
}
.circle2 {
  border: 15px solid #ec808d;
}
.circle3 {
  border: 15px solid #d9001b;
}
</style>

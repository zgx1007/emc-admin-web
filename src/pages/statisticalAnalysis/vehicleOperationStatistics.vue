
<template>
  <div class="realTimeStatusOne">
    <!-- 引入公司机构选择 -->
    <companyAndTime v-on:listen="showAllOperation"></companyAndTime>
    <!-- 查询按钮 -->
    <el-row type="flex" justify="space-around">
      <el-col :span="4">
        <div class="grid-content bg-green">
          <p>在线车辆</p>
          <p>{{vehicleOnlineNum}}</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-green">
          <p>车辆总数</p>
          <p>{{vehicleTotalNum}}</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-green">
          <p>在线率</p>
          <p>{{vehicleOnlineRate*100}}%</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-blue">
          <p>近30天平均里程(km)</p>
          <p>{{averageMileage}}</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-blue">
          <p>近30天日均时长(h)</p>
          <p>{{averageData}}</p>
        </div>
      </el-col>
    </el-row>
    <!-- 在线车辆分析echarts表 -->
    <el-row>
      <div class="onlineAnalysis" id="onlineAnalysis" style="width:100%;height:450px"></div>
    </el-row>
    <!-- 里程时长分析echarts表 -->
    <el-row>
      <div class="distanceAnalysis" id="distanceAnalysis" style="width:100%;height:450px"></div>
    </el-row>
    <!-- 表格信息 -->
    <el-row>
      <el-col :span="22">车辆明细表：</el-col>
      <el-col :span="2">
        <el-button type="primary" size="mini" @click="exportExcel">导出表格</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div id="out-table">
        <el-table
          :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          border
          style="width:100%"
          align="center"
          id="out-table"
        >
          <el-table-column prop="date" label="日期" align="center"></el-table-column>
          <el-table-column prop="vehicleSum" label="车辆总数" align="center"></el-table-column>
          <el-table-column prop="vehicleOnlineNumber" label="在线数" align="center"></el-table-column>
          <el-table-column prop="proportion" label="在线率" align="center" :formatter="formatter"></el-table-column>
          <el-table-column prop="svgTime" label="在线平均时长(h)" align="center"></el-table-column>
          <el-table-column prop="svgMileage" label="日平均里程(km)" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span @click="vehicleDetails(scope.row.date)" class="vehicleDetails">车辆明细</span>
              <!-- <router-link :to="{path:'/statisticalAnalysis/vehicleOperationDetails',query: {operationDate: scope.row.date,operationPath: scope.row.date,}}" tag="div" style="color:blue">车辆明细</router-link> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <!-- 分页显示 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10,20, 30,40,50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      prev-text="上一页"
      next-text="下一页"
      :total="tableData.length"
      background
    ></el-pagination>
    <!-- 分页显示 -->
  </div>
</template>
<script>
// 导入组件
import companyAndTime from '@/pages/statisticalAnalysis/companyAndTime.vue'
import companyCascader from '@/pages/common/companyCascader.vue'
//  导出xlsx表
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
// 引入提示框标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data() {
    return {
      date: [],
      vehicleOnlineNum: '',
      vehicleTotalNum: '',
      vehicleOnlineRate: '',
      averageMileage: '',
      averageData: '',
      value7: '',
      tableData: [],
      path: '',
      // 分页默认
      currentPage: 1,
      pagesize: 10
    }
  },
  components: {
    companyAndTime,
    companyCascader
  },
  created() {
    // 面包屑设置为空
    this.$store.commit('changeBreadcumb', [])
    this.showVehicleOnline()
  },
  mounted() {},
  methods: {
    // 车辆明细查看
    vehicleDetails(date) {
      let operationPath = this.path.lastPath
      this.$router.push({
        path: '/statisticalAnalysis/vehicleOperationDetails',
        query: { operationDate: date, operationPath: operationPath } //参数
      })
    },
    // 实时车辆数据
    showVehicleOnline() {
      let vm = this
      vm.$post(
        `${
          vm.$store.state.basedataUrl
        }/vehicleInfoAnalysis/getVehicleInfoAnalysis`
      ).then(data => {
        if (data.code === 200) {
          let vm = this
          vm.vehicleOnlineNum = data.data.vehicleOnlineNum
          vm.vehicleTotalNum = data.data.vehicleTotalNum
          vm.vehicleOnlineRate = data.data.vehicleOnlineRate
        } else {
          //('查询showVehicleOnline失败')
        }
      })
    },
    showAllOperation(e) {
      //(e, '父组件获取子组件参数')
      this.path = e
      let param = e
      let vm = this
      vm.$post(
        `${vm.$store.state.basedataUrl}/statistics/dailyAverage`,
        param
      ).then(data => {
        if (data.code === 200) {
          //(data.data)
          let vm = this
          // 近30平均里程和时长
          vm.averageData = data.data.averageData
          vm.averageMileage = data.data.averageMileage
          // 车辆明细表
          vm.tableData = data.data.vehicleSubsidiaryDtoList
          // 在线车辆分析
          let mouthDateArr = []
          let mouthSumArr = []
          let mouthOnlineArr = []
          let mouthProportionArr = []
          for (let i = 0; i < data.data.onlineRateDtoList.length; i++) {
            //  遍历车辆日期date
            let mouthDate = data.data.onlineRateDtoList[i].date
            mouthDateArr.push(mouthDate)
            //  遍历车辆总车辆sum
            let mouthSum = data.data.onlineRateDtoList[i].sum
            mouthSumArr.push(mouthSum)
            //  遍历车辆在线车辆online
            let mouthOnline = data.data.onlineRateDtoList[i].online
            mouthOnlineArr.push(mouthOnline)
            //  遍历车辆在线比例proportion
            let mouthProportion =
              data.data.onlineRateDtoList[i].proportion * 100
            mouthProportionArr.push(mouthProportion)
          }
          // //(mouthDateArr,mouthSumArr,mouthOnlineArr,mouthProportionArr,'---在线车辆分析')
          // 在线车辆分析echarts图结束
          let myEcharts = echarts.init(
            document.getElementById('onlineAnalysis')
          )
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
              data: ['总车数(辆)', '在线车辆数(辆)', '在线率(%)']
            },
            grid: {
              left: '2%',
              right: '2%',
              bottom: '4%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: mouthDateArr
              // data: ["1", "2","3","4","5","6","7", "8","9","10","11","12","13", "14","15","16","17", "18","19","20","22","23", "24","25","26","27","28","29","30"]
            },
            yAxis: [
              {
                show: true,
                type: 'value',
                name: '在线车辆分析',
                interval: 1,
                axisLabel: {
                  formatter: '{value} 辆'
                }
              },
              {
                show: true,
                type: 'value',
                min: 0,
                max: 100,
                interval: 25,
                axisLabel: {
                  formatter: '{value} %'
                }
              }
            ],
            series: [
              {
                //折线的数据和样式
                data: mouthProportionArr,
                yAxisIndex: 1,
                type: 'line',
                smooth: true,
                name: '在线率(%)',
                areaStyle: {},
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: '#d46473' },
                      { offset: 0.3, color: '#f6c4ca' },
                      { offset: 0, color: '#ffffff' }
                    ])
                  }
                }
              },
              // 长的柱形得放在前面不然被覆盖
              {
                data: mouthSumArr,
                yAxisIndex: 0,
                // data: [80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
                barWidth: '24', //柱形图宽度
                type: 'bar',
                barGap: '-100%',
                // stack: '总量',//堆叠数据
                name: '总车数(辆)',
                // 修改区域颜色
                itemStyle: {
                  normal: {
                    color: '#369dfe'
                  }
                }
              },
              {
                data: mouthOnlineArr,
                yAxisIndex: 0,
                // data: [30,40,33,50,37,48,36,45,40,53,46,52,55,42,49,33,39,30,41,37,48,53,40,46,50,44,52,38,43],
                barWidth: '24', //柱形图宽度
                //  stack: '总量',//堆叠数据
                type: 'bar',
                name: '在线车辆数(辆)',
                // 修改区域颜色
                itemStyle: { normal: { color: '#f6a84a' } }
              }
            ]
          })
          window.addEventListener('resize', function() {
            myEcharts.resize()
          })
          //1 在线车辆分析echarts图结束
          //2 里程时长分析
          let mileageTimeDateArr = []
          let mileageTimeMileageArr = []
          let mileageTimeOnlineTimeArr = []
          for (
            let i = 0;
            i < data.data.mileageTimeAnalysisDtoList.length;
            i++
          ) {
            // 里程分析时间date
            let mileageTimeDate = data.data.mileageTimeAnalysisDtoList[i].date
            mileageTimeDateArr.push(mileageTimeDate)
            // 里程分析行驶里程
            let mileageMileageDate =
              data.data.mileageTimeAnalysisDtoList[i].mileage
            mileageTimeMileageArr.push(mileageMileageDate)
            // 里程分析在线时长
            let mileageTimeOnlineTime =
              data.data.mileageTimeAnalysisDtoList[i].onlineTime
            mileageTimeOnlineTimeArr.push(mileageTimeOnlineTime)
          }
          // //(mileageTimeDateArr,mileageTimeMileageArr,mileageTimeOnlineTimeArr,'里程分析数据')
          let myEcharts2 = echarts.init(
            document.getElementById('distanceAnalysis')
          )
          myEcharts2.setOption({
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
              data: ['行驶里程', '在线时长']
            },
            grid: {
              left: '2%',
              right: '2%',
              bottom: '4%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: mileageTimeDateArr,
              yAxisIndex: 0
              // data: ["1", "2","3","4","5","6","7", "8","9","10","11","12","13", "14","15","16","17", "18","19","20","22","23", "24","25","26","27","28","29","30"]
            },
            yAxis: [
              {
                type: 'value',
                name: '里程时长分析',
                axisLabel: {
                  formatter: '{value} km'
                }
              },
              {
                type: 'value',
                min: 0,
                max: 24,
                interval: 6,
                axisLabel: {
                  formatter: '{value} h'
                }
              }
            ],
            series: [
              {
                data: mileageTimeOnlineTimeArr,
                yAxisIndex: 1,
                // data: [45,65,53,74,49,74,66,79,46,68,50,80,71,75,63,76,65,79,73,79,60,67,79,63,72,56,70,80,67],
                type: 'line',
                smooth: true,
                name: '在线时长',
                areaStyle: {},
                // echarts渐变色
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: '#f6c6cc' },
                      { offset: 0.3, color: '#f6c4ca' },
                      { offset: 0, color: '#ffffff' }
                    ])
                  }
                }
              },
              {
                data: mileageTimeMileageArr,
                // data: [40,50,46,56,46,68,58,65,47,63,49,58,35,62,49,53,59,45,65,62,54,63,70,58,67,49,60,70,57],
                barWidth: '24', //柱形图宽度
                type: 'bar',
                name: '行驶里程',
                // 修改区域颜色
                itemStyle: { normal: { color: '#369dfe' } }
              }
            ]
          })
          window.addEventListener('resize', function() {
            myEcharts2.resize()
          })
          // 车辆里程时长分析结束
        } else {
          //('查询showVehicleOnline失败')
        }
      })
    },
    // 分页方法
    handleSizeChange: function(size) {
      this.currentPage = 1
      this.pagesize = size
      //('一页多少条' + size)
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      //('当前页第' + currentPage)
    },
    //  导出xlsx表
    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          '车辆运行明细表.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') {
          //(e, wbout)
        }
      }
      return wbout
    },
    //转换格式(百分比)
    formatter(row, column) {
      var type = row[column.property]
      return (type = `${type * 100}%`)
    }
  }
}
</script>
<style lang="scss" scoped>
.bg-green {
  background: #70b603;
}
.bg-blue {
  background: #36a0fe;
}
.grid-content {
  border-radius: 4px;
  height: 7rem;
  color: white;
  font-size: 24px;
  text-align: center;
  line-height: 2.5rem;
}
/* 车辆运行统计表格样式 */
.vehicleDetails {
  color: blue;
  cursor: pointer;
}
/* 分页 */
.el-pagination {
display: flex;
justify-content: flex-end;
}
</style>

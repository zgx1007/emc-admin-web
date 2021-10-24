<template>
  <div>
    <companyAndTime v-on:listen="showAllWarning"></companyAndTime>
    <!-- 车辆预警数量分析echarts -->
    <el-row>
      <div class="WarningStatistics" id="WarningStatistics" style="width:100%;height:450px"></div>
    </el-row>
    <!-- 表格信息 -->
    <el-row>
      <el-col :span="22">预警明细：</el-col>
      <el-col :span="2">
        <el-button type="primary" size="mini" @click="exportExcel">导出表格</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div id="app">
        <el-table
          :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          border
          style="width:100%"
          align="center"
          id="out-table"
        >
          <el-table-column prop="date" label="日期" align="center"></el-table-column>
          <el-table-column prop="sum" label="总计" align="center"></el-table-column>
          <el-table-column prop="oneSum" label="一级预警总数" align="center"></el-table-column>
          <el-table-column prop="twoSum" label="二级预警总数" align="center"></el-table-column>
          <el-table-column prop="threeSum" label="三级预警总数" align="center"></el-table-column>
          <el-table-column label="一级预警总数" align="center">
            <el-table-column prop="oneEndProcessed" label="未处理" align="center"></el-table-column>
            <el-table-column prop="oneUnProcessed" label="已处理" align="center"></el-table-column>
          </el-table-column>
          <el-table-column label="二级级预警总数" align="center">
            <el-table-column prop="twoEndProcessed" label="未处理" align="center"></el-table-column>
            <el-table-column prop="twoUnProcessed" label="已处理" align="center"></el-table-column>
          </el-table-column>
          <el-table-column label="三级预警总数" align="center">
            <el-table-column prop="threeEndProcessed" label="未处理" align="center"></el-table-column>
            <el-table-column prop="threeUnProcessed" label="已处理" align="center"></el-table-column>
          </el-table-column>
        </el-table>
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
      tableData: [],
      // 分页默认
      currentPage: 1,
      pagesize: 10
    }
  },
  components: {
    companyAndTime
  },
  mounted() {
    // this.WarningStatistics()
  },
  methods: {
    showAllWarning(e) {
      let param = e
      let vm = this
      vm.$post(
        `${vm.$store.state.basedataUrl}/statistics/getBusWarning`,
        param
      ).then(data => {
        if (data.code === 200) {
          // 预警明细表
          this.tableData = data.data.warningTableDtoList
          // 车辆预警分析
          let mouthDateArr = []
          let oneLevelArr = []
          let towLevelArr = []
          let threeLevelArr = []
          for (let i = 0; i < data.data.warningListDtoList.length; i++) {
            //  遍历车辆日期date
            let mouthDate = data.data.warningListDtoList[i].date
            mouthDateArr.push(mouthDate)
            //  遍历车辆总车辆sum
            let mouthOneLevel = data.data.warningListDtoList[i].oneLevel
            oneLevelArr.push(mouthOneLevel)
            //  遍历车辆在线车辆online
            let mouthTowLevel = data.data.warningListDtoList[i].twoLevel
            towLevelArr.push(mouthTowLevel)
            //  遍历车辆在线比例proportion
            let mouthThreeLevel = data.data.warningListDtoList[i].threeLevel
            threeLevelArr.push(mouthThreeLevel)
          }

          let myEcharts = echarts.init(
            document.getElementById('WarningStatistics')
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
              data: ['一级预警', '二级预警', '三级预警']
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
                type: 'value',
                name: '车辆预警信息分析',
                interval: 1
              }
            ],
            series: [
              {
                data: threeLevelArr,
                // data: [130,139,73,165,87,138,66,150,123,173,56,122,69,130,78,180,67,179,78,127,68,196,97,156,81,164,32,129,43],
                type: 'line',
                smooth: true,
                stack: '总量', //堆叠数据
                name: '三级预警',
                areaStyle: {},
                // 修改区域颜色
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: '#e9ada4' },
                      { offset: 0.3, color: '#e9ada4' },
                      { offset: 1, color: '#ffffff' }
                    ])
                  }
                }
              },
              {
                data: towLevelArr,
                // data: [90,139,73,165,87,138,66,150,83,173,56,122,69,130,78,180,67,179,78,127,68,196,97,156,81,164,32,129,43],
                type: 'line',
                smooth: true,
                stack: '总量', //堆叠数据
                name: '二级预警',
                areaStyle: {},
                // 修改区域颜色
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0.3, color: '#f6a84a' },
                      { offset: 0.7, color: '#e8d9c0' },
                      { offset: 0, color: '#ffffff' }
                    ])
                  }
                }
              },
              {
                data: oneLevelArr,
                // data: [80,109,73,135,87,138,66,150,83,173,56,122,69,130,78,180,67,179,78,127,68,196,97,156,81,164,32,129,43],
                barWidth: '24', //柱形图宽度
                stack: '总量', //堆叠数据
                type: 'line',
                smooth: true,
                name: '一级预警',
                areaStyle: {},
                // 修改区域颜色 #e0a95b
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0.3, color: '#46a6fe' },
                      { offset: 0.7, color: '#9dd0fe' },
                      { offset: 1, color: '#ffffff' }
                    ])
                  }
                }
              }
            ]
          })
          window.addEventListener('resize', function() {
            myEcharts.resize()
          })
        } else {
        }
      })
    },
    // 分页方法
    handleSizeChange: function(size) {
      this.currentPage = 1
      this.pagesize = size
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
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
          '预警明细表.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') {
        }
      }
      return wbout
    }
  }
}
</script>
<style lang="scss" scoped>
/* 分页 */
.el-pagination {
display: flex;
justify-content: flex-end;
}
</style>
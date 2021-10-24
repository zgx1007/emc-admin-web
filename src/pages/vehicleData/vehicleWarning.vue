<template>
  <div class="center">
    <div>
      <el-row>
        <el-col :span="3">
          <!-- 下拉框等级查询 -->
          <el-select v-model="radio1" placeholder="等级选择" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <!-- 下拉框状态查询 -->
          <el-select v-model="radio2" placeholder="状态选择" clearable>
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <!-- 时间段范围查询-->
          <el-date-picker
            v-model="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00', '08:00:00']"
          ></el-date-picker>
        </el-col>
        <el-col :span="12" style="position: relative;top: 0px;">
          <!-- 查询条件 -->
          <el-form :model="editForm" ref="editForm">
            <el-form-item prop="vin2">
              <el-input
                v-model="editForm.vin2"
                prefix-icon="el-icon-search"
                placeholder="请输入vin码、车牌查询"
                autocomplete="off"
              ></el-input>
              <el-button type="primary" @click="selectVin">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <!-- 表格信息 -->
    <div class="waring-table">
      <el-table
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border
        style="width:100%"
        :header-cell-style="{background:'#d4d4d4'}"
      >
        <el-table-column prop="vin" label="VIN码" width="200" align="center" fixed></el-table-column>
        <el-table-column prop="vehicleNo" label="车牌号" width="140" align="center"></el-table-column>
        <el-table-column prop="alarmStartTime" label="报警开始时间" width="200" align="center"></el-table-column>
        <el-table-column prop="alarmLatestTime" label="最近报警时间" width="200" align="center"></el-table-column>
        <el-table-column prop="alarmLevel" label="报警级别" width="120" align="center" id="alarmLevel">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.alarmLevel=== '1' "
              size="mini"
              type="warning"
            >{{getStatus2(scope.row.alarmLevel)}}</el-button>
            <el-button
              v-else-if="scope.row.alarmLevel=== '2' "
              size="mini"
              type="danger"
            >{{getStatus2(scope.row.alarmLevel)}}</el-button>
            <el-button
              v-else-if="scope.row.alarmLevel=== '3' "
              size="mini"
              style="background:#d9001b;color:white"
            >{{ getStatus2(scope.row.alarmLevel) }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" label=" 报警地址" width="320" align="center"></el-table-column>
        <el-table-column prop="alarmCount" label="次数" width="180" align="center"></el-table-column>
        <el-table-column prop="cityCode" label=" 城市编码" width="140" align="center"></el-table-column>
        <el-table-column prop="alarmName" label="报警名称" width="250" align="center"></el-table-column>
        <el-table-column prop="processStatus" label="处理状态" width="180" align="center">
          <template slot-scope="scope">
            <span>{{getStatus1(scope.row.processStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <router-link
              :to="{path:'/vehicleData/vehicleWarningDetails',query: {name: scope.row.id}}"
              tag="div"
              style="color:blue"
            >查看</router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页显示 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10,20, 30, 40,50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      prev-text="上一页"
      next-text="下一页"
      :total="tableData.length"
      background
    ></el-pagination>
  </div>
</template>
<script>
import vehicleWarningDetails from '@/pages/vehicleData/vehicleWarningDetails'
export default {
  components: {
    vehicleWarningDetails
  },
  data() {
    return {
      editForm: {
        vin2: ''
      },
      options: [
        { value: '1', label: '一级' },
        { value: '2', label: '二级' },
        { value: '3', label: '三级' }
      ],
      options2: [
        { value: '0', label: '已处理' },
        { value: '1', label: '未处理' }
      ],
      value: '',
      radio1: '',
      radio2: '',
      date:[],
      tableData: [],
      vdata: [],
      // 分页默认
      currentPage: 1,
      pagesize: 10,
      name: '',
      id: '',
      // // 面包屑
      breadcrumb: [
        { name: '车辆管理', path: '' },
        { name: '车辆预警', path: '' }
      ]
    }
  },
  created() {
    this.$store.commit('changeBreadcumb', [])
    this.showAllAppInfo()
  },
  methods: {
    //循环遍历数据,函数封装
    forLonlat(vdata) {
      for (var i = 0; i < vdata.length; i++) {
        let Longitude = vdata[i].alarmLongitude
        let Latitude = vdata[i].alarmLatitude
        let address = Longitude + ',' + Latitude
        let temp = {
          alarmCount: vdata[i].alarmCount,
          alarmLatestTime: vdata[i].alarmLatestTime,
          alarmLevel: vdata[i].alarmLevel,
          alarmName: vdata[i].alarmName,
          alarmStartTime: vdata[i].alarmStartTime,
          cityCode: vdata[i].cityCode,
          id: vdata[i].id,
          processStatus: vdata[i].processStatus,
          vehicleNo: vdata[i].vehicleNo,
          vin: vdata[i].vin,
          address: address
        }
        this.tableData.push(temp)
      }
    },
    // 初始化查询所有
    showAllAppInfo() {
      const vm = this
      vm.tableData = []
      let data = {}
      vm.$post(
        `${vm.$store.state.basedataUrl}/vehicleFault/getAllVehicleFault`,
        data
      ).then(data => {
        if (data.code === 200) {
          let vdata = data.data
          this.forLonlat(vdata)
        } else {
        }
      })
    },
    // 查询等级和查询状态
    selectVin() {
      const vm = this
      vm.tableData = []
      let level = vm.radio1
      let status2 = vm.radio2
      let status = parseInt(status2)
      let Vin = vm.editForm.vin2.replace(/ /g,'')
      let startTime = vm.date[0]
      let endTime = vm.date[1]
      console.log(typeof(vm.date[0]), vm.date[0] )
      let data = {
        alarmLevel: level,
        processStatus: status,
        vinOrNo:  Vin,
        from: startTime,
        to: endTime
      }
      console.log(data)
      if (data === '') {
        this.showAllAppInfo()
      }
      // 查全部
      vm.$post(
        `${vm.$store.state.basedataUrl}/vehicleFault/getAllVehicleFault`,
        data
      ).then(data => {
        if (data.code === 200) {
          let vdata = data.data
          this.forLonlat(vdata)
        } else {
        }
      })
    },
    // 将处理状态转化为中文“未处理”
    getStatus1(processStatus) {
      if (processStatus === 1) {
        let statusName = '未处理'
        return statusName
      }
      if (processStatus === 0) {
        let statusName = '已处理'
        return statusName
      }
    },
    getStatus2(alarmLevel) {
      if (alarmLevel === '1') {
        let LevelName = '一级'
        return LevelName
      }
      if (alarmLevel === '2') {
        let LevelName = '二级'
        return LevelName
      }
      if (alarmLevel === '3') {
        let LevelName = '三级'
        return LevelName
      }
    },
    // 分页方法
    handleSizeChange: function(size) {
      this.currentPage = 1
      this.pagesize = size
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    }
  }
}
</script>
<style lang="scss" scoped>
/* 表格样式 */
.el-table {
  color: #495060;
  font-size: 13px;
}
/* 分页 */
.el-pagination {
  display: flex;
  justify-content:flex-end;
}
/* 单选按钮 */
.el-radio-group {
  margin-bottom: 19px;
}
.el-input {
  width: 300px;
}
.radio {
  margin-left: 225px;
}
</style>
<style >
.waring-table .el-table th div {
  color: rgb(51, 51, 51);
}
</style>





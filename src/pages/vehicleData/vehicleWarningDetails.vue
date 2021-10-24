<template>
  <div>
    <el-row class="table">
      <el-col :span="12">
        <el-table
          :data="tableData"
          style="width: 50rem"
          border
          :header-cell-style="{background:'#d4d4d4'}"
        >
          <el-table-column prop="vin" label="VIN码"  width="250" align="center" fixed></el-table-column>
          <el-table-column prop="vehicleNo" label="车牌号" width="100" align="center"></el-table-column>
          <el-table-column prop="alarmStartTime" label="报警开始时间" width="200" align="center"></el-table-column>
          <el-table-column prop="alarmCount" label="次数" align="center"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-table
          :data="tableData"
          style="width: 50rem"
          border
          :header-cell-style="{background:'#d4d4d4'}"
        >
          <el-table-column prop="alarmLevel" label=" 报警级别" width="100" align="center">
            <template slot-scope="scope">
              <span>{{getStatus2(scope.row.alarmLevel)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="预警位置"  width="200" align="center"></el-table-column>
          <el-table-column prop="alarmName" label="报警名称" width="250" align="center"></el-table-column>
          <el-table-column prop="processStatus" label="处理状态" align="center">
            <template slot-scope="scope">
              <span>{{getStatus(scope.row.processStatus)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <h2 class="addreess">预警的设备位置</h2>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <img src="../../assets/img/warning.jpg" alt srcset />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      //面包屑
      breadcrumb: [
        { name: '车辆管理', path: '' },
        { name: '车辆预警', path: '/vehicleData/vehicleWarning' },
        { name: '车辆预警详情', path: '' }
      ]
    }
  },
  created() {
    this.$store.commit('changeBreadcumb', this.breadcrumb)
    this.review()
  },
  methods: {
    review() {
      const vm = this
      vm.tableData = []
      let id = this.$route.query.name
      let data = {
        id: id
      }

      vm.$post(
        `${vm.$store.state.basedataUrl}/vehicleFault/getAllVehicleFault`,
        data
      ).then(data => {
        if (data.code === 200) {
          let vdata = data.data
          for (var i = 0; i < vdata.length; i++) {
            let Longitude = vdata[i].alarmLongitude
            let Latitude = vdata[i].alarmLatitude
            let address = Longitude + ',' + Latitude
            // 新建一个对象，新增自定义字段
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
        } else {
        }
      })
    },
    // 将处理状态转化为中文“未处理”
    getStatus(processStatus) {
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
        let statusName = '一级'
        return statusName
      }
      if (alarmLevel === '2') {
        let statusName = '二级'
        return statusName
      }
      if (alarmLevel === '3') {
        let statusName = '三级'
        return statusName
      }
    }
  }
}
</script>
<style scoped>
.addreess {
  font-weight: bolder;
  font-size: 33px;
  color: #7b7777;
}
img {
  width: 50%;
  height: 30%;
  margin-left: 18rem;
}
</style>
<style >
.table .el-table th div {
  color: rgb(51, 51, 51);
}
</style>


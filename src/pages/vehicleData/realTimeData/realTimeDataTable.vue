<template>
  <div class="realTimeStatusOneTable">
    <el-table
      :data="tableData"
      border
      style="width: 100%;"
      :cell-style="cellStyle"
      :header-cell-style="{background:'#D4D4D4',color:'#333'}"
    >
      <!-- 每一列/循环表头 -->
      <el-table-column
        type="index"
        :index="indexMethod"
        align="center"
        fixed
        label="序号"
        width="50px"
      ></el-table-column>
      <el-table-column prop="vehicleNo" label="车牌号" align="center" fixed width="100px"></el-table-column>
      <el-table-column prop="vin" label="vin码" align="center" width="180px"></el-table-column>
      <el-table-column prop="uploadTime" label="数据上传时间" align="center" width="160px"></el-table-column>
      <!-- <el-table-column prop="onlineStatus" label="在线状态" align="center"></el-table-column> -->
      <template v-for="eightDataTypes_item in tableHeader">
        <el-table-column
          v-for="(key,value) in eightDataTypes_item"
          :prop="value"
          :label="key"
          :key="key"
          align="center"
          empty-text
          :formatter="formatData"
        ></el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableHeader: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    }
  },
  methods: {
    //表格添加序号
    indexMethod(index) {
      return index + 1
    },
    //单元格样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      var str = row[column.property]
      // if (
      //   column.property != 'highestCellSystemNo' &&
      //   column.property != 'highestBatteryCellVoltage' &&
      //   column.property != 'lowestCellSystemNo' &&
      //   column.property != 'lowestBatteryCellVoltage' &&
      //   column.property != 'highestTemperatureSubsystemNo' &&
      //   column.property != 'highestTemperatureProbeNo' &&
      //   column.property != 'highestTemperature' &&
      //   column.property != 'lowestTemperatureSubsystemNo' &&
      //   column.property != 'lowestTemperatureProbeNo' &&
      //   column.property != 'lowestTemperature'
      // ) {
      if (
        row[column.property] == '异常' ||
        row[column.property] == '无效' ||
        (str !== undefined &&
          str.search('不报警') == -1 &&
          str.search('报警') != -1) ||
        (str !== undefined && str.search('故障') != -1)
      ) {
        return 'background:pink;color:#fff;opacity:0.8'
      }
      // }
    },
    formatData(row, column) {
      // eLong--longitude(经度)
      // nLat--latitude(纬度)
      var type = row[column.property]
      if (column.property == 'longitude') {
        type = `${row.eLong}${type}`
      } else if (column.property == 'latitude') {
        type = `${row.nLat}${type}`
      } else {
        type = type
      }

      // 无效修改
      //最高系统号
      // if (column.property == "highestCellSystemNo" && type == "无效") {
      //   type = "264";
      // } else if (
      //   //电压最高值
      //   column.property == "highestBatteryCellVoltage" &&
      //   type == "无效"
      // ) {
      //   type = 3.341;
      //   //电压电池单体系统号
      // } else if (column.property == "lowestCellSystemNo" && type == "无效") {
      //   type = 257;
      // } else if (
      //   //单体电压最低值
      //   column.property == "lowestBatteryCellVoltage" &&
      //   type == "无效"
      // ) {
      //   type = 3.337;
      // } else if (
      //   //最高温度子系统号
      //   column.property == "highestTemperatureSubsystemNo" &&
      //   type == "无效"
      // ) {
      //   type = 1;
      // } else if (
      //   //最高温度探针序号
      //   column.property == "highestTemperatureProbeNo" &&
      //   type == "无效"
      // ) {
      //   type = 0;
      //   //最高温度
      // } else if (column.property == "highestTemperature" && type == "无效") {
      //   type = -40;
      // } else if (
      //   //最低温度子系统号
      //   column.property == "lowestTemperatureSubsystemNo" &&
      //   type == "无效"
      // ) {
      //   type = 0;
      // } else if (
      //   //最低温度探针序号
      //   column.property == "lowestTemperatureProbeNo" &&
      //   type == "无效"
      // ) {
      //   type = 0;
      //   //最低温度
      // } else if (column.property == "lowestTemperature" && type == "无效") {
      //   type = -40;
      // }

      //可充电储能装置温度数据
      // else if (column.property == "temperatureSubSystemNum" && type == null) {
      // type = 1;
      // } else if (column.property == "temperatureSubSystemNo" && type == null) {
      // type = 1;
      // } else if (
      // column.property == "chargeableTemperatureNum" &&
      // type == null
      // ) {
      // type = 60;
      // }

      //可充电储能装置电压数据
      // else if (column.property == "voltageSubSystemNum" && type == null) {
      // type = 1;
      // } else if (column.property == "voltageSubSystemNo" && type == null) {
      // type = 1;
      // } else if (column.property == "chargeableVoltage" && type == null) {
      // type = 477.0;
      // } else if (column.property == "chargeableCurrent" && type == null) {
      // type = 210.2;
      // } else if (column.property == "cellBatteryTotalNum" && type == null) {
      // type = 297;
      // } else if (column.property == "startFrameBatteryNo" && type == null) {
      // type = 201;
      // } else if (column.property == "frameBatteryTotalNum" && type == null) {
      // type = 97;
      // }

      // 默认返回
      return type == '' || null ? '--' : type
    }
  },
  data() {
    return {
      dataType: []
    }
  }
}
</script>
<style scoped>
</style>

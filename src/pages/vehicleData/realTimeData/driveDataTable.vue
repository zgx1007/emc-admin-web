<template>
  <div class="realTimeStatusOneTable">
    <el-table
      :data="tableData2"
      border
      style="width: 100%;"
      :cell-style="cellStyle"
      :header-cell-style="{background:'#D4D4D4',color:'#333'}"
      :span-method="objectSpanMethod"
    >
      <!-- 每一列/循环表头 -->
      <el-table-column prop="sequence" label="序号" align="center" fixed width="50px"></el-table-column>
      <el-table-column prop="vehicleNo" label="车牌号" align="center" fixed width="100px"></el-table-column>
      <el-table-column prop="vin" label="vin码" align="center" width="180px"></el-table-column>
      <el-table-column prop="uploadTime" label="数据上传时间" align="center" width="160px"></el-table-column>
      <!-- <el-table-column prop="onlineStatus" label="在线状态" align="center"></el-table-column> -->
      <el-table-column prop="driveMotorNo" label="电机类别" align="center" :formatter="formatType"></el-table-column>
      <template v-for="eightDataTypes_item in tableHeader">
        <el-table-column
          v-for="(key,value) in eightDataTypes_item"
          :prop="value"
          :label="key"
          :key="key"
          align="center"
          :formatter="isNull"
          empty-text
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
  watch: {
    tableData(val) {
      this.dataProcessing(val)
    },
    tableHeader(val) {}
  },
  created() {
    this.dataProcessing(this.tableData)
  },
  methods: {
    //数据处理
    dataProcessing(passedData) {
      let data = []

      let keys = [] //驱动电机列表键
      this.tableHeader.forEach(function(item, index, arr) {
        keys.push(Object.keys(item)[0])
      })

      for (let index of Object.keys(passedData)) {
        let tableData = passedData[index].driveMotorList
        if (tableData.length != 0) {
          for (let item in tableData) {
            tableData[item].vin = passedData[index].vin
            tableData[item].vehicleNo = passedData[index].vehicleNo
            tableData[item].uploadTime = passedData[index].uploadTime
            tableData[item].driveMotorNum = passedData[index].driveMotorNum
            data.push(tableData[item])
          }
        } else {
          let oneData = {}
          for (let item of keys) {
            oneData[item] = ''
          }
          oneData.vin = passedData[index].vin
          oneData.vehicleNo = passedData[index].vehicleNo
          oneData.uploadTime = passedData[index].uploadTime
          oneData.driveMotorNum = passedData[index].driveMotorNum
          data.push(oneData)
        }
      }

      this.tableData2 = JSON.parse(JSON.stringify(data))
      //合并单元格
      this.setRowspan()
    },

    //单元格样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      var str = row[column.property]
      if (columnIndex != 0) {
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
      }
    },
    //合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //合并的列
      if (
        column.property == 'vehicleNo' ||
        column.property == 'uploadTime' ||
        column.property == 'sequence' ||
        column.property == 'vin' ||
        column.property == 'driveMotorNum'
      ) {
        //this.spanArr这个数组里面存的是table里面连续的有几条数据相同
        //例如:[1,1,2,0,2,0]
        //1  代表的没有连续的相同的
        //2  代表连续的两个相同
        //0  代表是和上一条内容相同
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row, //行
          colspan: _col //列
        }
      }
    },
    //类别转换
    formatType(row, column) {
      var type = row[column.property]
      return type == 1 ? '左电机' : type == 2 ? '右电机' : '--'
    },
    isNull(row, column) {
      var type = row[column.property]
      return type == '' ? '--' : type
    },
    setRowspan() {
      this.spanArr = [] //在data里面定义
      this.position = 0 //在data里面定义
      this.tableData2.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
          this.position = 0
          item.sequence = index + 1 //设置序号
        } else {
          if (
            this.tableData2[index].vehicleNo ===
            this.tableData2[index - 1].vehicleNo
          ) {
            this.spanArr[this.position] += 1 //连续有几行项目名名称相同
            this.spanArr.push(0) // 名称相同后往数组里面加一项0

            //当项目名称相同时，设置当前序号和前一个相同
            this.tableData2[index].sequence = this.tableData2[
              index - 1
            ].sequence
          } else {
            this.spanArr.push(1)
            this.position = index
            //当项目名称不同时，将当前序号设置为前一个序号+1
            this.tableData2[index].sequence =
              this.tableData2[index - 1].sequence + 1
          }
        }
      })
    }
  },

  data() {
    return {
      dataType: [],
      tableData2: [],
      spanArr: [],
      position: 0
    }
  }
}
</script>
<style scoped>
</style>

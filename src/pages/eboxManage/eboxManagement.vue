<template>
  <div>
    <div class="user">
      <el-select
        v-model="types"
        filterable
        clearable
        placeholder="所有车辆类别"
        @change="selectVehicleTypeInfo()"
      >
        <el-option
          v-for="item in vehicle"
          :key="item.vehicleType"
          :label="item.vehicleType"
          :value="item.vehicleType"
        ></el-option>
      </el-select>
      <el-select
        v-model="brand"
        filterable
        clearable
        placeholder="所有品牌"
        @change="selectVehicleTypeInfo()"
      >
        <el-option
          v-for="item in vehicleBrand"
          :key="item.vehicleBrand"
          :label="item.vehicleBrand"
          :value="item.vehicleBrand"
        ></el-option>
      </el-select>
      <el-select
        v-model="model"
        filterable
        clearable
        placeholder="所有车型"
        @change="selectVehicleTypeInfo()"
      >
        <el-option
          v-for="item in vehicleTypes"
          :key="item.vehicleTypeId"
          :label="item.vehicleModel"
          :value="item.vehicleModel"
        ></el-option>
      </el-select>
      <el-select
        v-model="ver"
        filterable
        clearable
        placeholder="所有版本"
        @change="selectVehicleTypeInfo()"
      >
        <el-option
          v-for="item in version1"
          :key="item.version"
          :label="item.key"
          :value="item.version"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="add">添 加</el-button>
    </div>
    <div class="div-table">
      <el-table
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border
        style="width:100%"
        :header-cell-style="{background:'#324157'}"
      >
        <el-table-column prop="version" label="版本号" width="140" align="center"></el-table-column>
        <el-table-column prop="upgradeVin" label="目标车辆" width="200" align="center"></el-table-column>
        <el-table-column prop="vehicleType" label="车辆类型" align="center"></el-table-column>
        <el-table-column prop="vehicleBrand" label="车辆品牌" align="center"></el-table-column>
        <el-table-column prop="vehicleModel" label="车辆型号" align="center"></el-table-column>
        <el-table-column prop="description" label="版本说明" align="center"></el-table-column>
        <el-table-column prop="vehicleCount" label="升级的车辆数量" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" plain size="small" @click="update(scope.row)">编辑</el-button>
            <el-button
              type="text"
              plain
              size="small"
              @click="disable(scope.row.id,scope.row.status)"
            >{{getStatus(scope.row.status)}}</el-button>
            <!-- <el-button type="text" plain size="small" @click="upgradeUrl">文件地址</el-button> -->
            <a target="_blank" :href="scope.row.upgradeUrl">文件下载地址</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit
      :addDialog="addDialog"
      :vehicle="vehicle"
      @add:success="showAllData()"
      @updata:addDialog="val => addDialog = val"
      @cancel:cancel="() => vehicle = null"
    ></edit>
    <update
      :detailData="detailData"
      :editDialog="editDialog"
      @updata:editDialog="val => editDialog = val"
      @add:success="showAllData()"
      @cancel:cancel="() => detailData = null"
      @edit:success="showAllData()"
    ></update>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[12, 15, 20, 30, 40]"
      :page-size="12"
      layout="total, sizes, prev, pager, next, jumper"
      prev-text="上一页"
      next-text="下一页"
      :total="tableData.length"
      background
    ></el-pagination>
  </div>
</template>

<script>
import animated from 'animate.css'
import edit from './eboxManagementEdit.vue'
import update from './eboxManagementUpdate.vue'
export default {
  components: {
    edit,
    update
  },
  data() {
    return {
      // 传值到弹框
      addDialog: false,
      editDialog: false,
      detailData: {},
      // 用户显示
      tableData: [],
      standards: '',
      statusName: ['启用', '停用'],
      // 分页默认
      currentPage: 1,
      pagesize: 12,
      // 下拉框
      version1: [],
      vehicleTypes: [],
      vehicle: [],
      vehicleTypes: [],
      vehicleBrand: [],
      vehicleModel: [],
      model: [],
      brand: [],
      ver: [],
      types: [],
      key: '',
      disableValue: '停用',
      breadcrumb: []
    }
  },
  watch: {
    disableValue(val, oldVal) {
      //(val)
      //(oldVal)
    }
  },
  created() {
    this.vehicle = this.$store.state.vehicleTypes
    this.vehicleBrand = this.$store.state.vehicleBrand
    this.vehicleTypes = this.$store.state.vehicleModel
    this.$store.commit('changeBreadcumb', [])
    this.showAllData()
    this.getVersionNumber()
  },
  methods: {
    // 查询所有
    showAllData(ob = {}) {
      const vm = this
      vm.detailData = null
      vm.tableData = []
      // //(vm.$store.state.basedataUrl)
      vm.$post(`${vm.$store.state.basedataUrl}/terminal/getAllVersion`).then(
        data => {
          if (data.code === 200) {
            vm.tableData = data.data
          } else {
            //('失败')
          }
        }
      )
    },
    // 查询所有版本号
    getVersionNumber() {
      const vm = this
      vm.version = []
      // //(vm.$store.state.basedataUrl)
      vm.$post(`${vm.$store.state.basedataUrl}/terminal/getVersionNumber`).then(
        data => {
          if (data.code === 200) {
            vm.version1 = data.data
          } else {
            //('失败')
          }
        }
      )
    },
    // 查询车类型
    // showAllVehicleType() {
    //   const vm = this
    //   vm.vehicleTypes = []
    //   vm.$post(`${vm.$store.state.basedataUrl}/vehicleTypeInfo/getAllVehicleType`).then(data => {
    //     if (data.code === 200) {
    //       vm.vehicleTypes = data.data
    //       let returnData = data.data
    //       let temp1 = []
    //       let temp2 = []
    //       let tempVehicle1 = []
    //       let tempVehicle2 = []
    //       let tempBrand1 = []
    //       let tempBrand2 = []
    //       // 类型去重
    //       for (let i = 0;i < returnData.length;i++) {
    //         tempVehicle1.push(returnData[i].vehicleType)
    //       }
    //       for (let i = 0;i < tempVehicle1.length;i++) {
    //         if(temp1.indexOf(tempVehicle1[i]) === -1){
    //           temp1.push(tempVehicle1[i])
    //         }
    //       }
    //       for (let i = 0;i < temp1.length;i++) {
    //         let t = {
    //           vehicleType: temp1[i]
    //         }
    //         tempVehicle2.push(t)
    //       }
    //       vm.vehicle = tempVehicle2
    //       // 品牌去重
    //       for (let i = 0;i < returnData.length;i++) {
    //         tempBrand1.push(returnData[i].vehicleBrand)
    //       }
    //       for (let i = 0;i < tempBrand1.length;i++) {
    //         if(temp2.indexOf(tempBrand1[i]) === -1){
    //           temp2.push(tempBrand1[i])
    //         }
    //       }
    //       for (let i = 0;i < temp1.length;i++) {
    //         let t = {
    //           vehicleBrand: temp2[i]
    //         }
    //         tempBrand2.push(t)
    //       }
    //       vm.vehicleBrand = tempBrand2
    //     } else {
    //       //("失败")
    //     }
    //   })
    // },
    // 条件查询
    selectVehicleTypeInfo() {
      const vm = this
      vm.tableData = []
      let data = {
        vehicleType: vm.types,
        vehicleBrand: vm.brand,
        vehicleModel: vm.model,
        version: vm.ver
      }
      //(data)
      vm.$post(
        `${vm.$store.state.basedataUrl}/terminal/getByVehicleTypeInfo`,
        data
      ).then(data => {
        if (data.code === 200) {
          vm.tableData = data.data
        } else {
          //('失败')
        }
      })
    },
    // 文件下载
    upgradeUrl() {},
    //
    getStatus(status) {
      const vm = this
      return status < vm.statusName.length ? vm.statusName[status] : ''
    },
    // 停用和启用
    disable(id, status) {
      const vm = this
      let sName
      let vName
      let statusValue
      //(status)
      if (status === 1) {
        sName = '停用'
        vName = '停止'
        statusValue = 0
      }
      if (status === 0) {
        sName = '启用'
        vName = '会'
        statusValue = 1
      }
      this.$confirm(
        `${sName}后，该版本的所有车载终端将${vName}发送实时数据`,
        `确认${sName}？`,
        {
          confirmButtonText: `确定${sName}`,
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          vm.$post(
            `${
              vm.$store.state.basedataUrl
            }/terminal/updateVersion?id=${id}&status=${statusValue}`
          ).then(data => {
            if (data.code === 200) {
              this.$message({
                type: 'success',
                message: `成功${sName}!`
              })
              vm.showAllData()
            } else {
              //('失败')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 修改
    update(row) {
      this.editDialog = true
      this.detailData = row
    },
    // 新增
    add() {
      this.detailData = null
      this.addDialog = true
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
.cell {
  text-align: center;
}

.adduser {
  margin-bottom: 10px;
  background: #d7dfec;
}

.userInput {
  width: 20%;
}

.user {
  margin-bottom: 10px;
}

.div-table {
  box-shadow: 7px 5px 6px #888888;
}

/* 分页 */
.el-pagination {
display: flex;
justify-content: flex-end;
}
</style>

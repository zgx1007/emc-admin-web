<template>
  <div>
    <div class="user">
      <!-- <el-input type="text" size="small" class="userInput" v-model="standards"></el-input> -->
      <el-select
        v-model="types"
        filterable
        clearable
        placeholder="车辆类型"
        @change="selectStandards()"
      >
        <el-option
          v-for="item in vehicleTypes"
          :key="item.vehicleType"
          :label="item.vehicleType"
          :value="item.vehicleType"
        ></el-option>
      </el-select>
      <el-select
        v-model="brand"
        filterable
        clearable
        placeholder="车辆品牌"
        @change="selectStandards()"
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
        placeholder="车辆型号"
        @change="selectStandards()"
      >
        <el-option
          v-for="item in vehicleModel"
          :key="item.vehicleModel"
          :label="item.vehicleModel"
          :value="item.vehicleModel"
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
        <el-table-column type="index" label="序号" width="140" align="center"></el-table-column>=
        <el-table-column prop="vehicleType" label="车辆类型" align="center"></el-table-column>
        <el-table-column prop="vehicleBrand" label="车辆品牌" align="center"></el-table-column>
        <el-table-column prop="vehicleModel" label="车辆型号" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" plain size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" plain size="small">整车设备</el-button>
            <el-button
              type="text"
              plain
              size="small"
              @click="disable(scope.row.vehicleTypeId,scope.row.status)"
            >{{getStatus(scope.row.status)}}</el-button>
            <el-button type="text" plain size="small" @click="pro(scope.row)">协议设置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <edit
        :detailData="detailData"
        :editDialog="editDialog"
        @updata:editDialog="val => editDialog = val"
        @add:success="showAllStandards()"
        @cancel:cancel="() => detailData = null"
        @edit:success="showAllStandards()"
      ></edit>
      <pro
        :detailData="detailData"
        :proDialog="proDialog"
        @updata:proDialog="val => proDialog = val"
        @cancel:cancel="() => detailData = null"
        @edit:success="showAllStandards()"
      ></pro>
    </div>
    <!-- <add :addDialog="addDialog"></add>  -->
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
import edit from './vehicleInfoManagementEdit.vue'
import pro from './vehicleProtocolSetting.vue'
export default {
  components: { edit, pro },
  data() {
    return {
      // 弹框
      editDialog: false,
      proDialog: false,
      addDialog: false,
      detailData: {},
      // 用户显示
      tableData: [],
      statusName: ['激活', '作废'],
      // 分页默认
      currentPage: 1,
      pagesize: 12,
      // 下拉框
      vehicleTypes: [],
      types: [],
      vehicleBrand: [],
      brand: [],
      vehicleModel: [],
      model: []
    }
  },
  created() {
    this.$store.commit('changeBreadcumb', [])
    this.showAllStandards()
    this.vehicleTypes = this.$store.state.vehicleTypes
    this.vehicleBrand = this.$store.state.vehicleBrand
    this.vehicleModel = this.$store.state.vehicleModel
    // this.showAllVehicleType();
  },
  methods: {
    // 查询所有
    showAllStandards(ob = {}) {
      const vm = this
      vm.detailData = null
      let d = {
        vehicleType: vm.types + '',
        vehicleBrand: vm.brand + '',
        vehicleModel: vm.model + ''
      }
      vm.tableData = []
      vm.$post(
        `${vm.$store.state.basedataUrl}/vehicleTypeInfo/getVehicleTypeInfo`,
        d
      ).then(data => {
        if (data.code === 200) {
          vm.tableData = data.data
        } else {
          //("失败")
        }
      })
    },
    // 查询车类型

    // 条件查询
    selectStandards() {
      const vm = this
      vm.tableData = []
      let key = vm.vehicleTypeId
      let d = {
        vehicleType: vm.types + '',
        vehicleBrand: vm.brand + '',
        vehicleModel: vm.model + ''
      }
      if (key === '') {
        vm.showAllStandards()
      } else {
        //(d)
        vm.$post(
          `${vm.$store.state.basedataUrl}/vehicleTypeInfo/getVehicleTypeInfo`,
          d
        ).then(data => {
          if (data.code === 200) {
            vm.tableData = data.data
          } else {
            //("失败");
          }
        })
      }
    },
    getStatus(status) {
      const vm = this
      return status < vm.statusName.length ? vm.statusName[status] : ''
    },
    // 停用和启用
    disable(vehicleTypeId, status) {
      const vm = this
      let sName
      let title
      let statusValue

      if (status === 1) {
        sName = '作废后，已选择此车型的车辆信息不更改,但其他车辆不能选择使用此车型'
        title = '作废'
        statusValue = 0
      }
      if (status === 0) {
        sName = '激活后，将恢复此车型的使用'
        title = '激活'
        statusValue = 1
      }
      this.$confirm(
        `${sName}`,
        `${title}提示`,
        {
          confirmButtonText: `确定${title}`,
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          let data = {
            vehicleTypeId: vehicleTypeId,
            status: statusValue
          }
          //(data)
          vm.$post(
            `${vm.$store.state.basedataUrl}/vehicleTypeInfo/discard`,
            data
          ).then(data => {
            if (data.code === 200) {
              this.$message({
                type: 'success',
                message: `成功${sName}!`
              })
              vm.showAllStandards()
            } else {
              //("失败")
            }
          })
        })
        .catch(() => {
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
    // 修改
    edit(row) {
      this.editDialog = true
      this.detailData = row
    },
    // 协议设置
    pro(row) {
      this.proDialog = true
      this.detailData = row
    },
    // 新增
    add() {
      this.detailData = null
      this.editDialog = true
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

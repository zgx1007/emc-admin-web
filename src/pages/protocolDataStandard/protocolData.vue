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
        v-model="vehicleModel"
        filterable
        clearable
        placeholder="车辆型号"
        @change="selectStandards()"
      >
        <el-option
          v-for="item in vehicleTypes"
          :key="item.vehicleTypeId"
          :label="item.vehicleModel"
          :value="item.vehicleModel"
        ></el-option>
      </el-select>
      <el-input type="text" placeholder="输入标准名称查询" clearable style="width: 300px" v-model="desc"></el-input>
      <el-button type="primary" @click="selectDescription">查 询</el-button>
      <div class="batchAdd1">
        <el-button type="primary" @click="add()">批量添加标准项</el-button>
        <el-button type="primary" @click="dialogVisible = true">预警次数设置</el-button>
      </div>
      <el-dialog
        title="预警次数设置"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        center
        width="30%"
        @opened="getWarningTimes"
      >
        <el-form :model="warningForm" :rules="rules2" ref="warningForm">
          <el-form-item label="预警次数(每隔*秒记为一次预警)：" label-width="240px" prop="times">
            <el-input
              v-model="warningForm.times"
              autocomplete="off"
              maxlength="4"
              style="width: 190px; margin-right: 5px"
            ></el-input>
            <label>秒</label>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setWarningTimes">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="div-table">
      <el-table
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border
        style="width:100%"
        :header-cell-style="{background:'#324157'}"
      >
        <el-table-column type="index" label="序号" width="140" align="center"></el-table-column>
        <el-table-column prop="description" label="标准项" width="200" align="center"></el-table-column>
        <el-table-column prop="itemValue" label="值范围" align="center"></el-table-column>
        <el-table-column prop="vehicleType" label="车辆类型" align="center"></el-table-column>
        <el-table-column prop="vehicleBrand" label="车辆品牌" align="center"></el-table-column>
        <el-table-column prop="vehicleModel" label="车辆型号" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="editItem(scope.row)">编辑</el-button>
            <el-button
              type="primary"
              size="small"
              class="new"
              @click="addAlertItem(scope.row)"
            >新增预警项</el-button>
            <!-- 新增预警项dialog弹框开始 -->
            <el-dialog
              title="新增预警项"
              :visible.sync="dialogVisible2"
              width="30%"
              :close-on-click-modal="false"
            >
              <el-form label-width="80px" :model="alarmForm" :rules="rules" ref="alarmForm">
                <el-form-item label="预警名称" prop="alarmName">
                  <el-input type="text" autocomplete="on" v-model="alarmForm.alarmName"></el-input>
                </el-form-item>
                <el-form-item label="预警值" required>
                  <el-col :span="11">
                    <el-form-item prop="itemValueMin">
                      <el-input
                        v-model.number="alarmForm.itemValueMin"
                        class="input"
                        style="width:100%"
                        validate-event
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2" style="text-align: center;">~</el-col>
                  <el-col :span="11">
                    <el-form-item prop="itemValueMax">
                      <el-input
                        v-model.number="alarmForm.itemValueMax"
                        class="input"
                        style="width:100%"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item label="预警等级" prop="alarmLevel">
                  <el-select v-model="alarmForm.alarmLevel" clearable style="width: 100%;">
                    <el-option
                      v-for="item in alarmLevelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="roleDialogCancel()">取 消</el-button> -->
                <el-button type="primary" @click="dialogOk(alarmForm)">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 新增预警项dialog弹框结束 -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit
      :detailData="detailData"
      :editDialog="editDialog"
      @updata:editDialog="val => editDialog = val"
      @add:success="showAllStandards()"
      @cancel:cancel="() => detailData = null"
      @edit:success="showAllStandards()"
    ></edit>
    <add
      :addDialog="addDialog"
      @updata:addDialog="val => addDialog = val"
      @add:success="showAllStandards()"
      @cancel:cancel="() => detailData = null"
    ></add>
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
import animated from 'animate.css'
import edit from './protocolDataEdit.vue'
import add from './bathAddData.vue'
export default {
  components: {
    edit,
    add
  },
  data() {
    return {
      // 弹框
      editDialog: false,
      addDialog: false,
      dialogVisible: false,
      dialogVisible2: false,
      detailData: {},
      // 预警项弹框
      alarmForm: {
        id: '',
        vehicleTypeId: '',
        itemKey: '',
        alarmName: '',
        itemValue: '',
        itemValueMin: '',
        itemValueMax: '',
        alarmLevel: ''
      },
      alarmLevelOptions: [
        {
          value: '1',
          label: '一级预警'
        },
        {
          value: '2',
          label: '二级预警'
        },
        {
          value: '3',
          label: '三级预警'
        }
      ],
      rules: {
        alarmName: [
          { required: true, message: '请输入预警名称', trigger: 'blur' }
        ],
        itemValueMin: [
          { required: true, message: '请输入称预警等级', trigger: 'blur' },
          { type: 'number', message: '称预警等级为数字值' }
        ],
        itemValueMax: [
          { required: true, message: '请输入称预警等级', trigger: 'blur' },
          { type: 'number', message: '称预警等级为数字值' }
        ],
        alarmLevel: [
          { required: true, message: '请选择预警等级名称', trigger: 'blur' }
        ]
      },
      // 预警次数设置校验
      rules2: {
        times: [
          {
            required: true,
            message: '请输入称预警等级',
            trigger: ['blur', 'change']
          },
          {
            pattern: window._check.isPositiveIntegerReg,
            message: '请输入大于0的正整数',
            trigger: ['blur', 'change']
          }
        ]
      },
      // 显示
      tableData: [],
      standards: '',
      // 分页默认
      currentPage: 1,
      pagesize: 12,
      // 下拉框
      vehicleTypes: [],
      vehicle: [],
      types: [],
      vehicleBrand: [],
      brand: [],
      vehicleModel: [],
      key: '',
      description: '',
      desc: '',
      // 预警次数设置
      warningForm: {
        times: '',
        id: ''
      },
      // 面包屑
      breadcrumb: [
        { name: '协议数据标准', path: '' },
        { name: '协议标准', path: '' }
      ]
    }
  },
  created() {
    this.$store.commit('changeBreadcumb', this.breadcrumb)
    this.showAllStandards()
    this.showAllVehicleType()
  },
  mounted() {},
  methods: {
    // 查询所有
    showAllStandards(ob = {}) {
      const vm = this
      vm.detailData = null
      vm.tableData = []
      // //(vm.$store.state.basedataUrl)
      vm.$post(`${vm.$store.state.basedataUrl}/vehicleStandards/getAll`).then(
        data => {
          if (data.code === 200) {
            vm.tableData = data.data
          } else {
            //("失败");
          }
        }
      )
    },
    // 查询预警次数
    getWarningTimes() {
      const vm = this
      vm.$post(
        `${vm.$store.state.basedataUrl}/vehicleConfig/getAllVehicleConfig`
      ).then(data => {
        if (data.code === 200) {
          let temp = data.data[0].configValue / 1000
          vm.warningForm.times = temp
          vm.warningForm.id = data.data[0].id
        } else {
        }
      })
    },
    // 查询车类型
    showAllVehicleType() {
      const vm = this
      vm.vehicleTypes = []
      vm.$post(
        `${vm.$store.state.basedataUrl}/vehicleTypeInfo/getAllVehicleType`
      ).then(data => {
        if (data.code === 200) {
          vm.vehicleTypes = data.data
          let returnData = data.data
          let temp1 = []
          let temp2 = []
          let tempVehicle1 = []
          let tempVehicle2 = []
          let tempBrand1 = []
          let tempBrand2 = []
          // 类型去重
          for (let i = 0; i < returnData.length; i++) {
            tempVehicle1.push(returnData[i].vehicleType)
          }
          for (let i = 0; i < tempVehicle1.length; i++) {
            if (temp1.indexOf(tempVehicle1[i]) === -1) {
              temp1.push(tempVehicle1[i])
            }
          }
          for (let i = 0; i < temp1.length; i++) {
            let t = {
              vehicleType: temp1[i]
            }
            tempVehicle2.push(t)
          }
          vm.vehicle = tempVehicle2
          // 品牌去重
          for (let i = 0; i < returnData.length; i++) {
            tempBrand1.push(returnData[i].vehicleBrand)
          }
          for (let i = 0; i < tempBrand1.length; i++) {
            if (temp2.indexOf(tempBrand1[i]) === -1) {
              temp2.push(tempBrand1[i])
            }
          }
          for (let i = 0; i < temp1.length; i++) {
            let t = {
              vehicleBrand: temp2[i]
            }
            tempBrand2.push(t)
          }
          vm.vehicleBrand = tempBrand2
        } else {
          //("失败");
        }
      })
    },
    // 条件查询
    selectStandards() {
      const vm = this
      vm.tableData = []
      let key = vm.vehicleTypeId
      if (key === '') {
        vm.showAllStandards()
      } else {
        vm.$post(
          `${
            vm.$store.state.basedataUrl
          }/vehicleStandards/getByVehicleTypeInfo?vehicleType=${
            vm.types
          }&vehicleBrand=${vm.brand}&vehicleModel=${vm.vehicleModel}`
        ).then(data => {
          if (data.code === 200) {
            vm.tableData = data.data
          } else {
            //("失败");
          }
        })
      }
    },
    // 模糊查询标准项
    selectDescription() {
      const vm = this
      vm.tableData = []
      let key = vm.desc
      if (key === '') {
        vm.showAllStandards()
      } else {
        vm.$post(
          `${
            vm.$store.state.basedataUrl
          }/vehicleStandards/getByDescription?description=${key}`
        ).then(data => {
          if (data.code === 200) {
            vm.tableData = data.data
          } else {
            //("失败");
          }
        })
      }
    },
    // 新增预警项弹框
    addAlertItem(alarmForm) {
      this.dialogVisible2 = true
      this.alarmForm.itemKey = alarmForm.itemKey
      this.alarmForm.vehicleTypeId = alarmForm.vehicleTypeId
      if (this.$refs.alarmForm) {
        this.$refs.alarmForm.resetFields()
      }
    },
    // 新增预警项提交
    dialogOk(data) {
      data.itemValue = `${data.itemValueMin}~${data.itemValueMax}`
      this.$refs.alarmForm.validate(valid => {
        if (valid) {
          if (data.itemValueMin <= data.itemValueMax) {
            //(data)
            this.$post(
              `${this.$store.state.basedataUrl}/alarmDefinition/insert`,
              data
            ).then(data => {
              if (data.code === 200) {
                this.dialogVisible2 = false
                this.$message.success(data.msg)
              }
            })
          } else {
            this.$message.error('预警值范围不正确')
          }
        } else {
          this.$message.error('请填写完表单')
        }
      })
    },
    // 修改
    edit(row) {
      this.editDialog = true
      this.detailData = row
    },
    // 批量新增
    add() {
      this.addDialog = true
    },
    // 设置预警次数
    setWarningTimes() {
      let data = {
        id: this.warningForm.id,
        configValue: this.warningForm.times * 1000
      }
      this.$refs.warningForm.validate(valid => {
        if (valid) {
          this.$post(
            `${this.$store.state.basedataUrl}/vehicleConfig/updateById`,
            data
          ).then(data => {
            if (data.code === 200) {
              this.warningForm.times = data.data.configValue
              this.$message({ message: '修改成功', type: 'success' })
              this.dialogVisible = false
            }
          })
        } else {
          this.$message.error('请填写完表单')
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
    //编辑
    editItem(data) {
      //(data);
      this.$router.push({
        name: '编辑预警项',
        params: {
          data: data
        }
      })
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
.batchAdd1 {
  display: inline;
  float: right;
}
.erInput {
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

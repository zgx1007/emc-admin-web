<template>
  <el-dialog
    :title="dialogTitle"
    @close="cancel('editForm')"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="600px"
  >
    <el-form :model="editForm" ref="editForm" label-width="130px" v-loading="isLoading" :rules="rules">
      <el-form-item label="车辆类型：" prop="vehicleType">
        <el-select
          v-model="editForm.vehicleType"
          filterable
          clearable
          placeholder="请选择车辆类型"
          style="width: 300px"
        >
          <el-option
            v-for="item in vehicle"
            :key="item.vehicleType"
            :label="item.vehicleType"
            :value="item.vehicleType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车辆品牌：" prop="vehicleBrand">
        <el-select
          v-model="editForm.vehicleBrand"
          filterable
          clearable
          placeholder="请选择车辆品牌"
          style="width: 300px"
        >
          <el-option
            v-for="item in vehicleBrands"
            :key="item.vehicleBrand"
            :label="item.vehicleBrand"
            :value="item.vehicleBrand"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="车辆型号：" v-if="isEdit" prop="vehicleModel">
        <el-select
          v-model="editForm.vehicleModel"
          filterable
          clearable
          placeholder="请选择车辆型号"
          style="width: 300px"
        >
          <el-option
            v-for="item in vehicleModels"
            :key="item.vehicleModel"
            :label="item.vehicleModel"
            :value="item.vehicleModel"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="车辆型号：" prop="vehicleModel">
        <el-input type="text" v-model="editForm.vehicleModel" style="width: 300px" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="适配协议：" prop="terminalHandleType">
        <el-select
          v-model="editForm.terminalHandleType"
          filterable
          clearable
          placeholder="请选择适配协议"
          style="width: 300px"
        >
          <el-option
            v-for="item in protocol"
            :key="item.value"
            :label="item.value"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="CAN1波特率：" prop="can1BaudRate">
        <el-input type="text" v-model="editForm.can1BaudRate" maxlength="6" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="CAN2波特率：" prop="can2BaudRate">
        <el-input type="text" v-model="editForm.can2BaudRate" maxlength="6" style="width: 300px"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel('editForm')">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    detailData: Object,
    editDialog: Boolean
  },
  data() {
    return {
      dialogTitle: '',
      dialogVisible: this.editDialog,
      isEdit: false,
      isLoading: false,
      // 下拉框
      vehicleTypes: [],
      vehicle: [],
      vehicleBrands: [],
      vehicleModels: [],
      // 修改用判断
      m: false,
      // 协议
      protocol: [
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        },
        {
          value: '3',
          label: '3'
        },
        {
          value: '4',
          label: '4'
        },
        {
          value: '5',
          label: '5'
        }
      ],
      // 校验
      rules: {
        can1BaudRate: [
          {required: true,message: '请输入波特率',trigger: ['blur', 'change']},
          {pattern: window._check.canBaudRate,message: '请输入正确的值范围（0~500000）',trigger: ['blur', 'change']}
        ],
        can2BaudRate: [
          {required: true,message: '请输入波特率',trigger: ['blur', 'change']},
          {pattern: window._check.canBaudRate,message: '请输入正确的值范围（0~500000）',trigger: ['blur', 'change']}
        ],
        vehicleModel: [
          {required: true,message: '请输入车辆型号',trigger: ['blur', 'change']},
          {pattern: window._check.isEnglistNumberReg,message: '输入格式有误，正确格式例：K8',trigger: ['blur', 'change']}
        ],
        vehicleBrand: [
          {required: true,message: '请输入车辆品牌',trigger: ['blur', 'change']}
        ],
        vehicleType: [
          {required: true,message: '请输入车辆类型',trigger: ['blur', 'change']}
        ],
        terminalHandleType: [
          {required: true,message: '请选择适配协议',trigger: ['blur', 'change']}
        ]
      },
      // 新增
      editForm: {
        vehicleTypeId: '',
        can1BaudRate: '250000',
        can2BaudRate: '250000',
        terminalHandleType: '',
        vehicleType: '',
        vehicleBrand: '',
        vehicleModel: '',
        status: ''
      }
    }
  },
  watch: {
    editDialog(val) {
      this.vehicle = this.$store.state.vehicleTypes
      this.vehicleBrands = this.$store.state.vehicleBrand
      this.vehicleModels = this.$store.state.vehicleModel
      if (!val) {
        this.emptyEditFrom()
      } else if (this.detailData) {
        this.isEdit = true
        this.dialogTitle = '编 辑'
        for (let key in this.editForm) {
          this.editForm[key] = this.detailData[key]
        }
        this.editForm.terminalHandleType = parseInt(this.detailData.terminalHandleType)
      } else {
        this.isEdit = false
        this.dialogTitle = '添 加'
      }
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('updata:editDialog', val)
    }
  },
  created() {},
  methods: {
    // 提交
    submit() {
      const vm = this
      vm.$refs.editForm.validate(valid => {
        if (valid) {
          let data = {
            terminalHandleType: vm.editForm.terminalHandleType + '',
            can1BaudRate: vm.editForm.can1BaudRate,
            can2BaudRate: vm.editForm.can2BaudRate,
            vehicleType: vm.editForm.vehicleType + '',
            vehicleBrand: vm.editForm.vehicleBrand + '',
            vehicleModel: vm.editForm.vehicleModel + '',
            status: vm.editForm.status
          }
          if (vm.detailData) {
            data.vehicleTypeId = vm.detailData.vehicleTypeId
          }
          let url = vm.detailData
            ? '/vehicleTypeInfo/updateVehicleTypeInfo'
            : '/vehicleTypeInfo/insert'
          console.log(data)
          vm.$post(vm.$store.state.basedataUrl + url, data).then(r => {
            if (r && r.code === 200) {
              vm.editForm = {
                vehicleTypeId: '',
                can1BaudRate: '',
                can2BaudRate: '',
                vehicleType: '',
                vehicleBrand: '',
                vehicleModel: '',
                status: ''
              }
              if (vm.isEdit) {
                vm.$emit('edit:success', true)
                vm.$message.success('修改成功')
              } else {
                vm.$emit('add:success', true)
                vm.$message.success('新增成功')
              }
            }
            vm.dialogVisible = false
          })
        } else {
          vm.$message.error('表单填写不完整')
        }
      })
    },
    // 查询车类型
    showAllVehicleType() {
      const vm = this
      vm.vehicleTypes = []
    },
    // 清空表单
    emptyEditFrom() {
      this.editForm = {
        vehicleTypeId: '',
        can1BaudRate: '',
        can2BaudRate: '',
        vehicleType: [],
        vehicleBrand: [],
        vehicleModel: [],
        status: ''
      }
      this.vehicle = []
      this.vehicleBrand = []
    },
    // 取消
    cancel(formName) {
      const vm = this
      vm.emptyEditFrom()
      vm.$refs[formName].resetFields()
      vm.$emit('cancel:cancel', true)
      vm.dialogVisible = false
    }
  }
}
</script>

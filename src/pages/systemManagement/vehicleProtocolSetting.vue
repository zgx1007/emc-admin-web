<template>
  <el-dialog
    :title="dialogTitle"
    @close="cancel('editForm')"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="30%"
  >
    <el-form :model="editForm" ref="editForm" label-width="130px" label-position="left" :rules="rules">
      <el-form-item label="适配协议" prop="terminalHandleType">
        <el-select v-model="editForm.terminalHandleType" filterable clearable placeholder="请选择适配协议">
          <el-option
            v-for="item in protocol"
            :key="item.value"
            :label="item.value"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="CAN1波特率" prop="can1BaudRate">
        <el-input type="text" autocomplete="off" v-model="editForm.can1BaudRate" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="CAN2波特率" prop="can2BaudRate">
        <el-input type="text" autocomplete="off" v-model="editForm.can2BaudRate" style="width: 300px"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel('editForm')">取 消</el-button>
      <el-button type="primary" @click="updateVehicleStandards">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    detailData: Object,
    proDialog: Boolean
  },
  data() {
    return {
      dialogTitle: '',
      dialogVisible: this.proDialog,
      isEdit: false,
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
      // 用户显示
      tableData: [],
      statusData: [],
      rules: {
        terminalHandleType: [
          {required: true,message: '请选择适配协议',trigger: ['blur', 'change']}
        ],
        can1BaudRate: [
          {required: true,message: '请输入波特率',trigger: ['blur', 'change']},
          {pattern: window._check.isNaturalNum,message: '请输入正整数（含0）',trigger: ['blur', 'change']}
        ],
        can2BaudRate: [
          {required: true,message: '请输入波特率',trigger: ['blur', 'change']},
          {pattern: window._check.isNaturalNum,message: '请输入正整数（含0）',trigger: ['blur', 'change']}
        ],
      },
      // 数据
      editForm: {
        vehicleTypeId: '',
        can1BaudRate: '',
        can2BaudRate: '',
        terminalHandleType: []
      }
    }
  },
  watch: {
    proDialog(val) {
      if (!val) {
        this.emptyEditFrom()
      } else if (this.detailData) {
        this.isEdit = true
        this.dialogTitle = '协议设置'
        for (let key in this.editForm) {
          this.editForm[key] = this.detailData[key]
        }
      }
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('updata:proDialog', val)
    }
  },
  methods: {
    // 提交
    updateVehicleStandards() {
      const vm = this
      vm.$refs.editForm.validate(valid => {
        if (valid) {
          let data = {
            vehicleTypeId: vm.editForm.vehicleTypeId,
            terminalHandleType: vm.editForm.terminalHandleType + '',
            can1BaudRate: vm.editForm.can1BaudRate,
            can2BaudRate: vm.editForm.can2BaudRate
          }
          if (vm.detailData) {
            data.vehicleTypeId = vm.detailData.vehicleTypeId
          }
          let url = '/vehicleTypeInfo/updateVehicleTypeInfo'

          vm.$post(vm.$store.state.basedataUrl + url, data).then(r => {
            if (r && r.code === 200) {
              vm.editForm = {
                vehicleTypeId: '',
                terminalHandleType: [],
                can1BaudRate: '',
                can2BaudRate: ''
              }
              vm.$emit('edit:success', true)
              vm.$message.success('修改成功')
            }
            vm.dialogVisible = false
          })
        } else {
          vm.$message.error('表单填写不完整')
        }
      })
    },
    // 清空表单
    emptyEditFrom() {
      this.editForm = {}
      this.statusData = []
    },
    // 取消
    cancel(formName) {
      const vm = this
      vm.$refs[formName].resetFields()
      vm.$emit('cancel:cancel', true)
      vm.dialogVisible = false
    }
  }
}
</script>
<style >
.eltable .el-table td,
.eltable .el-table th {
  border-bottom: none;
}
</style>
<style lang="scss" scoped>
</style>

<template>
  <el-dialog
    :title="dialogTitle"
    @close="cancel('editForm')"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <el-form
      :model="editForm"
      ref="editForm"
      label-width="80px"
      v-loading="isLoading"
      :rules="rules"
    >
      <el-form-item label="标准项" prop="description">
        <el-input type="text" autocomplete="off" v-model="editForm.description" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="值范围" prop="itemValue">
        <el-input type="text" autocomplete="off" v-model="editForm.itemValue"></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="roleId" required>
        <el-select v-model="editForm.roleId" clearable placeholder="请选择">
          <el-option v-for="item in roleDta" :key="item.id" :label="item.roleName" :value="item.id" ></el-option>
        </el-select>
      </el-form-item>-->
      <div class="eltable">
        <el-table class="test" :data="statusData" style="width:50%" fixed="left">
          <el-table-column prop="itemValue" width="80" align="right"></el-table-column>
          <el-table-column prop="description" width="80" align="left"></el-table-column>
        </el-table>
      </div>
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
    editDialog: Boolean
  },
  data() {
    return {
      dialogTitle: '',
      dialogVisible: this.editDialog,
      isEdit: false,
      isLoading: false,
      // 修改用判断
      m: false,
      // 用户显示
      tableData: [],
      roleDta: [],
      statusData: [],
      rules: {
        itemValue: [
          {
            required: true,
            message: '请输入有效值',
            trigger: ['blur', 'change']
          }
          // {pattern: window._check.isNumberReg, message: '请输入数字', trigger: 'blur'}
        ]
      },
      // 新增
      editForm: {
        description: '',
        itemValue: '',
        itemKey: '',
        vehicleTypeId: ''
      }
    }
  },
  watch: {
    editDialog(val) {
      if (!val) {
        this.emptyEditFrom()
      } else if (this.detailData) {
        this.isEdit = true
        // //(this.detailData)
        this.dialogTitle = '修 改'
        for (let key in this.editForm) {
          this.editForm[key] = this.detailData[key]
        }
        const vm = this
        // //(this.detailData.itemKey)
        vm.$post(
          `${
            vm.$store.state.basedataUrl
          }/vehicleStandardsStatusInfo/getByItemKeyAndVehicleTypeId?itemKey=${
            this.detailData.itemKey
          }&vehicleTypeId=${this.detailData.vehicleTypeId}`
        ).then(data => {
          if (data.code === 200) {
            vm.statusData = data.data
          } else {
            //("失败")
          }
        })
        // //(detailData)
        // this.editForm.description = this.detailData.description
        this.editForm.itemValue = this.detailData.itemValue
        this.editForm.itemKey = this.detailData.itemKey
        this.editForm.vehicleTypeId = this.detailData.vehicleTypeId
      } else {
        this.isEdit = false
        this.dialogTitle = '添 加'
      }
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('updata:editDialog', val)
    },
    'editForm.loginName'(val, oldVal) {
      //('new:' + val, 'old:' + oldVal)
    }
  },
  methods: {
    // 提交
    updateVehicleStandards() {
      const vm = this
      vm.$refs.editForm.validate(valid => {
        if (valid) {
          let data = {
            // description: vm.editForm.description,
            itemKey: vm.editForm.itemKey,
            itemValue: vm.editForm.itemValue,
            vehicleTypeId: vm.editForm.vehicleTypeId
          }
          if (vm.detailData) {
            data.id = vm.detailData.id
          }
          let url = '/vehicleStandards/update'
          //(data)
          vm.$post(vm.$store.state.basedataUrl + url, data).then(r => {
            if (r && r.code === 200) {
              vm.editForm = {
                description: '',
                itemValue: '',
                itemKey: '',
                vehicleTypeId: ''
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
    // 清空表单
    emptyEditFrom() {
      // this.editForm.itemValue = ''
      // this.editForm.description = ''
      this.editForm = {}
      this.statusData = []
    },
    // 取消
    cancel(formName) {
      const vm = this
      vm.$refs[formName].resetFields()
      vm.$emit('cancel:cancel', true)
      vm.dialogVisible = false
      vm.editForm = {
        description: '',
        itemValue: '',
        itemKey: '',
        vehicleTypeId: ''
      }
      vm.statusData = []
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

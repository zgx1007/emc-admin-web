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
      label-width="96px"
      v-loading="isLoading"
      :rules="rules"
    >
      <el-form-item label="版本号:" prop="version">
        <el-input type="text" autocomplete="off" v-model="editForm.version" :disabled="m"></el-input>
      </el-form-item>
      <el-form-item label="品牌型号:" prop="vehicleType">
        <el-input type="text" autocomplete="off" v-model="editForm.vehicleType" :disabled="m"></el-input>
      </el-form-item>
      <el-form-item label="车辆品牌:" prop="vehicleBrand">
        <el-input type="text" autocomplete="off" v-model="editForm.vehicleBrand" :disabled="m"></el-input>
      </el-form-item>
      <el-form-item label="车辆型号:" prop="vehicleModel">
        <el-input type="text" autocomplete="off" v-model="editForm.vehicleModel" :disabled="m"></el-input>
      </el-form-item>
      <el-form-item label="目标车辆:" prop="upgradeVin" required>
        <el-radio v-model="redio1" label="1" @change="redioChange">全选(勾选后将对该车型下的所有车辆进行升级)</el-radio>
        <br />
        <el-radio v-model="redio1" label="2" @change="redioChange">自定义选择</el-radio>
        <br />
        <el-input type="text" autocomplete="off" v-model="editForm.upgradeVin"></el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="cancel('editForm')">取 消</el-button>
      <el-button type="primary" @click="insertNewVersion">立即升级</el-button>
    </span>
    <div class="tip">
      <p>【立即升级】将会在车辆启动时自动检测并下载新版本，并在下一次启用时自动安装</p>
    </div>
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
      vehicleType: '',
      vehicelBrand: '',
      v: [],
      vehicleData: [],
      redio1: '',
      // 文件上传
      uploadUrl: `${this.$store.state.basedataUrl}/terminal/uploadVersionFile`,
      uploadHeaders: { token: `${this.$store.state.token}` },
      dialogTitle: '',
      dialogVisible: this.editDialog,
      isEdit: false,
      isLoading: false,
      // 修改用判断
      m: true,
      // 用户显示
      version: '',
      tableData: [],
      roleDta: [],
      statusData: [],
      rules: {
        upgradeVin: [
          {
            required: true,
            message: '请输入有效值',
            trigger: ['blur', 'change']
          }
          // {pattern: window._check.isNumberReg, message: '请输入数字', trigger: 'blur'}
        ]
      },
      // 数据
      editForm: {
        // vehicle: '',
        version: '',
        upgradeVin: [],
        vehicleBrand: '',
        vehicleModel: '',
        vehicleType: ''
      }
    }
  },
  watch: {
    editDialog(val) {
      if (!val) {
        this.emptyEditFrom()
      } else if (this.detailData) {
        const vm = this
        vm.isEdit = true
        vm.dialogTitle = '修 改'
        vm.editForm.version = vm.detailData.version
        vm.editForm.upgradeVin = vm.detailData.upgradeVin
        vm.editForm.vehicleBrand = vm.detailData.vehicleBrand
        vm.editForm.vehicleModel = vm.detailData.vehicleModel
        vm.editForm.vehicleType = vm.detailData.vehicleType
        if (vm.editForm.upgradeVin != '*') {
          vm.redio1 = '2'
        } else {
          vm.redio1 = '1'
        }
      } else {
        this.isEdit = false
        this.dialogTitle = '添 加'
      }
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('updata:editDialog', val)
    }
    //   "editForm.upgradeVin"(val) {
    //       //('----------', val)
    //     if (val === '*') {
    //       this.redio1 === '1'
    //       this.isDisabled = true
    //     } else {
    //       this.redio1 === '2'
    //       this.isDisabled = false
    //     }
    //   }
  },
  methods: {
    // 提交
    insertNewVersion() {
      const vm = this
      vm.$refs.editForm.validate(valid => {
        if (valid) {
          vm.$post(
            `${vm.$store.state.basedataUrl}/terminal/updateVersion?id=${
              vm.detailData.id
            }&upgradeVin=${vm.editForm.upgradeVin}`
          ).then(r => {
            if (r && r.code === 200) {
              vm.editForm = {}
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
    // 上传文件格式
    fileType(file) {
      let fileName = file.name.substring(file.name.lastIndexOf('.') + 1)
      //(fileName);
      const type1 = fileName === 'txt'
      const type2 = fileName === 'bin'
      if (!type1 && !type2) {
        this.$message.error('上传文件只能是 txt/bin 格式！')
      }
    },
    // 上传回调函数
    uploadSuccess(response, file, fileList) {
      //(response, file, fileList)
      const vm = this
      if (response.code === 200) {
        vm.$message.success(`文件【${file.name}】上传成功`)
        vm.editForm.upgradeUrl = response.msg
        // vm.fileList.push({
        //   url: response.data.url,
        //   name: file.name
        // });
      } else {
        //(response);
        vm.$message.error(`文件【${file.name}】上传失败，${response.msg}`)
      }
      // vm.loading.close();
    },
    // 清空表单
    emptyEditFrom() {},
    // 按钮改变
    redioChange() {
      if (this.redio1 === '1') {
        this.isDisabled = true
        this.editForm.upgradeVin = '*'
      } else {
        this.editForm.upgradeVin = ''
        this.isDisabled = false
      }
    },
    // 取消
    cancel(formName) {
      const vm = this
      vm.$refs[formName].resetFields()
      vm.$emit('cancel:cancel', true)
      vm.dialogVisible = false
      // vm.statusData = []
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
.dialog-footer {
  display: block;
  text-align: center;
}
.tip {
  text-align: center;
  .p {
    margin: 0px;
  }
}
</style>

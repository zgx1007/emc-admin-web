<template>
  <el-dialog :title="dialogTitle" @open="getToken()" @close="cancel('editForm')" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="dialogVisible" width="50%">
    <el-form :model="editForm" ref="editForm" label-width="96px" v-loading="isLoading" :rules="rules">
      <el-form-item label="版本号:" prop="version">
        <el-input type="text" autocomplete="off" v-model="editForm.version"></el-input>
      </el-form-item>
      <el-form-item label="品牌型号:">
        <el-select v-model="vehicleType" clearable placeholder="请选择车型" @change="selectBrand(vehicleType)">
          <el-option v-for="item in v" :key="item.id" :label="item.vehicleType" :value="item.vehicleType" ></el-option>
        </el-select>
        <div ref="checkboxPanel" class="checkboxPanel" style="display: none">
          <div v-for="item in vehicleData" :key="item.id" >
            <p :model="vehicelBrand">{{item.vehicelBrand}}</p>
            <el-checkbox-group v-model="editForm.roleDta" prop="roleDta">
              <el-checkbox v-for="model in item.vehicleModel" :key="model.id" :label="model.id">{{model.model}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="目标车辆:" prop="upgradeVin">
        <el-radio v-model="redio1" @change="redioChange" label="1">全选(勾选后将对该车型下的所有车辆进行升级)</el-radio><br>
        <el-radio v-model="redio1" @change="redioChange" label="2">自定义选择</el-radio><br>
        <el-input type="text" autocomplete="off" v-model="editForm.upgradeVin" :disabled="isDisabled"></el-input>
      </el-form-item>
      <el-form-item label="上传文件:" prop="file">
        <el-upload class="upload-demo" ref="upload" :action="uploadUrl" :on-success="uploadSuccess" :headers="uploadHeaders" accept=".bin, .txt" multiple>
          <el-button size="small" type="primary">上传文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传bin文件，且不超过100kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="更新内容:" prop="description">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入版本更新内容" v-model="editForm.description"></el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="cancel('editForm')">取 消</el-button>
      <el-button type="primary" @click="insertNewVersion">新建版本</el-button>
    </span>
    <div class="tip">
      <p>【立即升级】将会在车辆启动时自动检测并下载新版本，并在下一次启用时自动安装</p>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      // detailData: Object,
      addDialog: Boolean,
      vehicle: Array
    },
    data() {
      return {
        vehicelBrand: '',
        v: [],
        vehicleData: [],
        redio1: '',
        isDisabled: true,
        // 文件上传
        uploadUrl: `${this.$store.state.basedataUrl}/terminal/uploadVersionFile`,
        // uploadUrl:'',
        uploadHeaders: {},
        dialogTitle: '',
        dialogVisible: this.addDialog,
        isEdit: false,
        isLoading: false,
        // 修改用判断
        m: false,
        // 用户显示
        version: '',
        tableData: [],
        vehicleType:'',
        statusData: [],
        rules: {
          version:[
            {required: true, message: '请输入有效值', trigger: ['blur', 'change']},
            {pattern: window._check.isNumberReg, message: '请输入数字', trigger: 'blur'}
          ],
          vehicleType: [
            {required: true, message: '请输入品牌型号', trigger: ['blur', 'change']},
          ],
          upgradeVin: [
            {required: true, message: '请输入目标车辆', trigger: ['blur', 'change']},
          ]
        },
        // 数据
        editForm: {
          version: '',
          upgradeVin: '',
          description: '',
          roleDta: [],
          upgradeUrl: ''
        }
      }
    },
    watch: {
      addDialog(val) {
        this.isEdit = false
        this.v = this.vehicle
        this.dialogTitle = '添 加'
        this.dialogVisible = val
      },
      dialogVisible(val) {
        this.$emit('updata:addDialog', val)
      }
    },
    methods: {
      getToken(){
        this.uploadHeaders = {
          token: window.sessionStorage.getItem('token')
        }
      },
      // 提交
      insertNewVersion() {
        const vm = this
        vm.$refs.editForm.validate((valid) => {
          if (valid) {
            // const formData = new FormData()
            // formData.append('version', vm.editForm.version)
            // formData.append('upgradeVin', vm.editForm.upgradeVin)
            // formData.append('vehicleTypeInfoList', vm.editForm.vehicleTypeInfoList)
            // formData.append('description', vm.editForm.description)
            // formData.append('file', vm.editForm.file)
            let data = {
              version: vm.editForm.version,
              upgradeVin: vm.editForm.upgradeVin,
              vehicleTypeInfoList: vm.editForm.roleDta,
              description: vm.editForm.description,
              upgradeUrl: vm.editForm.upgradeUrl
            }
            let url = '/terminal/insertNewVersion'
            vm.$post(vm.$store.state.basedataUrl + url, data).then(r => {
              if (r && r.code === 200) {
                vm.editForm = {
                  version: '',
                  upgradeVin: '',
                  description: '',
                  roleDta: [],
                  upgradeUrl: ''
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
      // 查询车型
      selectBrand(val){
        const vm = this
        // console.log(val)
        if(vm.vehicleType === ''){
          this.$refs.checkboxPanel.style.display = "none"
        } else {
          vm.vehicleData = []
          vm.$post(`${vm.$store.state.basedataUrl}/vehicleTypeInfo/getByVehicleType?vehicleType=${val}`).then(data => {
            if (data.code === 200) {
              let returnData = data.data
              // vm.vehicleData = data.data
              for (var i = 0; i < returnData.length; i++) {
                let tempVehicleData = {
                  vehicelBrand: returnData[i].vehicelBrand,
                  vehicleModel: []
                }
                for (var j = 0; j < returnData[i].vehicleModel.length; j++) {
                  let temp3 = {
                    model: returnData[i].vehicleModel[j].vehicleModel,
                    id: returnData[i].vehicleModel[j].vehicleTypeId
                  }
                  tempVehicleData.vehicleModel.push(temp3)
                }
                vm.vehicleData.push(tempVehicleData)
              }
              console.log(vm.vehicleData)
              this.$refs.checkboxPanel.style.display = ""
            } else {
              console.log("失败")
            }
          })
        }
        
      },
      // 上传文件格式
      fileType(file) {
        let fileName = file.name.substring(file.name.lastIndexOf(".") + 1)
        const type1 = fileName === "txt"
        const type2 = fileName === "bin"
        if (!type1 && !type2) {
          this.$message.error("上传文件只能是 txt/bin 格式！")
        }
      },
      // 上传回调函数
      uploadSuccess(response, file, fileList) {
        console.log(response, file, fileList)
        const vm = this;
        if (response.code === 200) {
          vm.$message.success(`文件【${file.name}】上传成功`)
          vm.editForm.upgradeUrl = response.data
          console.log()
          // vm.fileList.push({
          //   url: response.data.url,
          //   name: file.name
          // });
        } else {
          console.log(response)
          vm.$message.error(`文件【${file.name}】上传失败，${response.msg}`)
        }
        // vm.loading.close();
      },
      onUploadChange(file){
        // this.editForm.file = file.raw
        // var reader = new FileReader()
        // reader.readAsDataURL(file.raw)
        // reader.onload = function(e){
        //   console.log(this.result)
        // }
      },
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
      // 清空表单
      emptyEditFrom() {

      },
      // 取消
      cancel(formName) {
        const vm = this
        vm.$refs[formName].resetFields()
        vm.$emit('cancel:cancel', true)
        vm.dialogVisible = false
        // vm.statusData = []
      },
    }
  }

</script>
<style >
.eltable .el-table td,.eltable .el-table th{
  border-bottom: none;
}
</style>
<style lang="scss" scoped>
.dialog-footer {
  display: block;
  text-align: center
}
.tip {
  text-align: center;
  .p{
    margin: 0px;
  }
}
</style>

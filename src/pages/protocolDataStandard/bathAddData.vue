<template>
  <el-dialog
    :title="dialogTitle"
    @close="cancel"
    :close-on-press-escape="false"
    @open="getAllVehicleType"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="70%"
  >
    <div class="selectDiv">
      <el-form :model="editForm">
        <el-form-item>
          <el-select
            v-model="cascaderId"
            clearable
            placeholder="请选择车型"
            @change="selectBrand(cascaderId)"
          >
            <el-option
              v-for="item in v"
              :key="item.id"
              :label="item.vehicleType"
              :value="item.vehicleType"
            ></el-option>
          </el-select>
          <div ref="checkboxPanel" class="checkboxPanel" style="display: none;">
            <div v-for="item in vehicleData" :key="item.id">
              <p :model="vehicelBrand">{{item.vehicelBrand}}</p>
              <el-checkbox-group v-model="roleDta">
                <el-checkbox
                  v-for="model in item.vehicleModel"
                  :key="model.id"
                  :label="model.id"
                >{{model.model}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="checkboxDiv" style="width:100%">
            <el-checkbox-group v-model="checkedDate">
              <el-checkbox
                v-for="list in dataList"
                :label="list"
                :key="list.id"
              >{{list.description}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <!-- <el-cascader expand-trigger="hover" :options="options" v-model="selectedOptions1"  @change="handleChange"></el-cascader> -->
    </div>
    <span class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="add">确认添加</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    addDialog: Boolean
  },
  data() {
    return {
      dialogVisible: this.addDialog,
      dialogTitle: '',
      checkedDate: [],
      addData: [],
      // 联动
      editForm: {},
      vehicelBrand: '',
      v: [],
      vehicleData: [],
      cascaderId: '',
      roleDta: [],
      selectedOptions1: [],
      options: [],
      dataList: []
    }
  },
  watch: {
    addDialog(val) {
      const vm = this
      vm.dialogTitle = '添加标准项'
      vm.dialogVisible = val
      vm.v = this.$store.state.vehicleTypes
      vm.$post(
        `${vm.$store.state.basedataUrl}/vehicleStandards/getVehicleStandards`
      ).then(data => {
        if (data.code === 200) {
          vm.dataList = data.data
        } else {
          //("失败")
        }
      })
    },
    dialogVisible(val) {
      this.$emit('updata:addDialog', val)
    }
  },
  methods: {
    cancel() {
      const vm = this
      vm.options = []
      vm.selectedOptions1 = []
      vm.$emit('cancel:cancel', true)
      vm.dialogVisible = false
    },
    getAllVehicleType() {
      const vm = this
      vm.$post(`${vm.$store.state.basedataUrl}/vehicleTypeInfo/getLevel`).then(
        data => {
          if (data.code === 200) {
            // vm.options = data.data
            let returnData = data.data
            let temoOptions
            let temoOptionsChildren
            let temoLastChildren
            for (var i = 0; i < returnData.length; i++) {
              temoOptions = {
                value: returnData[i].value,
                label: returnData[i].label,
                children: []
              }
              for (var j = 0; j < returnData[i].children.length; j++) {
                temoOptionsChildren = {
                  value: returnData[i].children[j].value + j,
                  label: returnData[i].children[j].label,
                  children: []
                }
                for (
                  var k = 0;
                  k < returnData[i].children[j].children.length;
                  k++
                ) {
                  temoLastChildren = {
                    // value: returnData[i].vehicleBrandDtoList[j].vehicleModelDtoList[k].value,
                    label: returnData[i].children[j].children[k].label,
                    value: returnData[i].children[j].children[k].id
                  }
                  temoOptionsChildren.children.push(temoLastChildren)
                }
                temoOptions.children.push(temoOptionsChildren)
              }
              vm.options.push(temoOptions)
            }
            //(vm.options)
          } else {
            //("失败")
          }
        }
      )
    },
    add() {
      const vm = this
      vm.addData = []
      for (var i = 0; i < vm.checkedDate.length; i++) {
        let temp = {
          abnormal: vm.checkedDate[i].abnormal,
          description: vm.checkedDate[i].description,
          id: vm.checkedDate[i].id,
          invalid: vm.checkedDate[i].invalid,
          itemKey: vm.checkedDate[i].itemKey,
          itemValue: vm.checkedDate[i].itemValue,
          category: vm.checkedDate[i].category,
          vehicleTypeId: vm.roleDta
        }
        vm.addData.push(temp)
      }
      //(vm.addData)
      vm.$post(
        `${
          vm.$store.state.basedataUrl
        }/vehicleStandards/insertVehicleStandards`,
        vm.addData
      ).then(data => {
        if (data.code === 200) {
          vm.options = []
          vm.dataList = []
          vm.selectedOptions1 = []
          vm.$emit('adaddd:success', true)
          vm.$message.success('新增成功')
          vm.dialogVisible = false
        } else {
          //("失败")
        }
      })
    },
    // 查询车型
    selectBrand(val) {
      const vm = this
      // //(val)
      if (vm.cascaderId === '') {
        this.$refs.checkboxPanel.style.display = 'none'
      } else {
        vm.vehicleData = []
        //(val)
        vm.$post(
          `${
            vm.$store.state.basedataUrl
          }/vehicleTypeInfo/getByVehicleType?vehicleType=${val}`
        ).then(data => {
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
            //(vm.vehicleData)
            this.$refs.checkboxPanel.style.display = ''
          } else {
            //("失败")
          }
        })
      }
    },
    handleChange(value) {
      //(this.selectedOptions1)
      this.cascaderId = value[2]
      //(this.cascaderId);
    }
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox {
  width: 20%;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
</style>
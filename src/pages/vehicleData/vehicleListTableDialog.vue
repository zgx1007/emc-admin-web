<template>
  <div>
    <!-- 车辆信息操作dialog弹框开始 -->
    <el-dialog
      :title="dialogTiltle"
      :visible.sync="formDialogVisible"
      width="30%"
      class="addDialog"
      @close="cancel('vehicleForm')"
      :close-on-click-modal="false"
    >
      <!-- 表单 -->
      <el-form
        label-width="80px"
        :model="vehicleForm"
        ref="vehicleForm"
        id="vehicleForm"
        :rules="rules"
      >
        <el-form-item label="vin码" prop="vin">
          <el-input
            clearable
            type="text"
            autocomplete="on"
            v-model="vehicleForm.vin"
            :disabled="modify"
            maxlength="17"
          ></el-input>
        </el-form-item>
        <el-form-item label="车牌号" prop="vehicleNo">
          <el-input clearable type="text" maxlength="8" v-model="vehicleForm.vehicleNo"></el-input>
        </el-form-item>
        <el-form-item label="运营路线" prop="line">
          <el-input clearable type="text" maxlength="20" v-model="vehicleForm.line"></el-input>
        </el-form-item>
        <el-form-item label="运营公司" required>
          <!-- <companyCascader @companyId="companyIdChange($event)" :changeValue="changeValue"></companyCascader> -->
          <el-cascader
            expand-trigger="hover"
            :options="companyData"
            v-model="companyOptionsValve"
            @change="companyDialogHandleChange"
            placeholder="请选择运营公司"
            clearable
            style="width:100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="车辆类别" required>
          <div class="block" style="margin-Left:0;width:100%">
            <el-cascader
              expand-trigger="hover"
              :options="vehicleTypeData"
              v-model="vehicleCategoryValue"
              @change="vehicleHandleChange"
              placeholder="请选择车辆类别"
              clearable
              :disabled="modify"
              style="width: 100%;"
            ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="城市编号" required>
          <div class="block" style="margin-Left:0;width:100% ">
            <el-cascader
              expand-trigger="hover"
              :options="cityCodeData"
              v-model="cityCodeValue"
              @change="cityCodeHandleChange"
              placeholder="请选择城市"
              clearable
              style="margin-Left:0;width:100% "
            ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="生产日期" prop="produceDate">
          <div>
            <el-date-picker
              v-model="vehicleForm.produceDate"
              type="date"
              placeholder="选择生产日期"
              format="yyyy 年 MM 月 dd 日"
              style="width: 100%;"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="出厂日期" prop="outfactoryDate">
          <el-date-picker
            v-model="vehicleForm.outfactoryDate"
            type="date"
            placeholder="选择出厂日期"
            format="yyyy 年 MM 月 dd 日"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="vehicleDialogCancel(vehicleForm)">取消</el-button>
        <el-button type="primary" @click="vehicleDialogOk(vehicleForm)">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import companyCascader from '@/pages/common/companyCascader.vue'
export default {
  components: {
    companyCascader
  },
  props: {
    companyData: {
      type: Array,
      required: true,
      default: function() {
        return {
          companyData: []
        }
      }
    },
    vehicleTypeData: {
      type: Array,
      required: true,
      default: function() {
        return {
          vehicleTypeData: []
        }
      }
    },
    cityCodeData: {
      type: Array,
      required: true,
      default: function() {
        return {
          cityCodeData: []
        }
      }
    },
    allCity: {
      type: Array,
      required: true,
      default: function() {
        return {
          allCity: []
        }
      }
    },
    matchData: {
      type: Array,
      required: true,
      default: function() {
        return {
          matchData: []
        }
      }
    }
  },
  created() {},
  methods: {
    //运营机构选择(表单)
    companyDialogHandleChange(value) {
      let length = value.length
      this.vehicleForm.companyId = value[length - 1]
      // this.companyOptionsValve = value;
    },
    //类别选择
    vehicleHandleChange(value) {
      this.vehicleForm.vehicleTypeId = value[2]
    },
    //表单城市选择改变
    cityCodeHandleChange(value) {
      this.vehicleForm.cityCode = value[1]
    },
    //设置表单的默认值
    setFormValue(statu, data) {
      if (statu == 0) {
        this.dialogTiltle = '添加车辆'
        this.modify = false
        this.vehicleForm = {}
        this.companyOptionsValve = []
        this.vehicleForm.companyId = ''
        this.cityCodeValue = []
        this.vehicleCategoryValue = []
        this.changeValue = []
      } else {
        this.dialogTiltle = '修改车辆'
        this.modify = true
        this.vehicleForm = data
        this.companyOptionsValve = []
        this.changeValue = []

        //默认城市选择
        for (let item of this.allCity) {
          if (data.cityCode == item.code) {
            this.cityCodeValue = [item.province, data.cityCode]
            break
          }
        }

        //默认公司选择
        var modifyCompanyId = data.companyId
        for (let item of this.matchData) {
          if (modifyCompanyId == item.id) {
            let path = item.path.split('/')
            for (let item of path) {
              this.companyOptionsValve.push(parseInt(item))
              // this.changeValue.push(parseInt(path[item]));
            }
          }
        }

        //默认车辆类别选择
        this.vehicleCategoryValue = [
          data.vehicleType,
          data.vehicleBrand,
          JSON.stringify(data.vehicleTypeId)
        ]
      }
    },
    // 弹框确定按钮
    vehicleDialogOk(data) {
      let outfactoryDate = data.outfactoryDate
      let produceDate = data.produceDate

      if (outfactoryDate == null || outfactoryDate == null) {
        this.$message.info('时间不选择默认不修改')
      }

      this.$refs.vehicleForm.validate(valid => {
        if (valid && data.vehicleTypeId && data.cityCode && data.companyId) {
          if (data.id) {
            //修改车辆
            this.$post(
              `${this.$store.state.basedataUrl}/vehicle/updateVehicle`,
              data
            ).then(data => {
              if (data.code == 200) {
                this.formDialogVisible = false
                this.$message.success(data.msg)
                this.$emit('refreshTable', 1)
              }
            })
          } else {
            //添加车辆
            this.$post(
              `${this.$store.state.basedataUrl}/vehicle/insertVehicle`,
              data
            ).then(data => {
              if (data.code == 200) {
                this.formDialogVisible = false
                this.$message.success(data.msg)
                this.$emit('refreshTable', 1)
              }
            })
          }
        } else {
          this.$message.error('请填写完表单')
          return false
        }
      })
    },
    // 弹窗点击取消按钮
    vehicleDialogCancel(data) {
      this.formDialogVisible = false
      this.$refs.vehicleForm.clearValidate()
    },
    // 弹框点击打叉按钮
    cancel(formName) {
      this.$refs[formName].clearValidate()
    },
    companyIdChange(id) {
      this.vehicleForm.companyId = id
    },
    // 日期格式转化为时间戳
    formatDate(data) {
      var returnDate
      if (typeof data == 'string') {
        returnDate = new Date(data.replace(/-/g, '/')).getTime()
      } else {
        returnDate = Number(data)
      }
      return returnDate
    }
  },
  data() {
    var checkDate = (rule, value, callback) => {
      let data = this.vehicleForm
      var produceTimetamp
      var outfactoryTimetamp

      if (data.produceDate) {
        produceTimetamp = this.formatDate(data.produceDate)
      }

      if (data.outfactoryDate) {
        outfactoryTimetamp = this.formatDate(data.outfactoryDate)
      }
      // 校验日期
      if (
        produceTimetamp &&
        outfactoryTimetamp &&
        produceTimetamp > outfactoryTimetamp
      ) {
        callback(new Error('生产日期应该小于出厂日期'))
      } else {
        callback()
      }
    }
    return {
      formDialogVisible: false, //弹窗显示
      modify: false,
      dialogTiltle: '',
      vehicleCategoryValue: [],
      companyOptionsValve: [],
      cityCodeValue: [],
      changeValue: [],
      // 车辆表单
      vehicleForm: {
        id: '',
        vin: '',
        line: '',
        vehicleNo: '',
        companyId: '',
        vehicleTypeId: '',
        produceDate: '',
        outfactoryDate: '',
        cityCode: []
      },
      // 校验规则
      rules: {
        vin: [
          { required: true, message: '请输入vin码', trigger: 'blur' },
          {
            pattern: window._check.vinPattern,
            message: 'vin码格式有误（长度为17位且必须包含数字大写字母）',
            trigger: 'blur'
          }
        ],
        vehicleNo: [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          {
            pattern: window._check.vehicleNoPattern,
            message: '请填写正确的车牌号（长度为7位或8位,首字母必须为中文）',
            trigger: 'blur'
          }
        ],
        produceDate: [{ validator: checkDate, trigger: 'blur' }],
        outfactoryDate: [{ validator: checkDate, trigger: 'blur' }]
      }
    }
  }
}
</script>
<style scoped>
</style>

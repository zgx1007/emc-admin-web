<template>
  <div id="vehicleWarningEditing">
    <!-- 编辑预警项 -->
    <div class="topWrap">
      <h1>编辑预警项</h1>
      <el-row>
        <div class="grid-content bg-purple topDiv" :gutter="20">
          <div style="width:10%;font-size:1.3em;">标准项名称：</div>
          {{standardData.description}}
        </div>
        <div class="grid-content bg-purple topDiv" style="margin-top:20px">
          <div style="width:10%;font-size:1.3em;display: inline-block;">正常值状态：</div>
          <el-form
            :rules="rules"
            :model="standardData"
            ref="standardData"
            style="display: inline-block;"
          >
            <el-form-item prop="itemValue">
              <el-input
                v-model="standardData.itemValue"
                style="margin-right:10px;"
                clearable
                maxlength="15"
              ></el-input>N*m
            </el-form-item>
          </el-form>
        </div>
        <div v-show="showDescription" style="margin-left:10.5%">
          <span>
            状态值说明:(
            <span
              style="margin-left:10px"
              v-for="item in statusValueDescription"
              :key="item.value"
            >{{item.itemValue}},{{item.description}}</span>
            )
          </span>
        </div>
      </el-row>
    </div>

    <!-- 编辑预警项table -->
    <div class="bottom">
      <el-form :rules="model.rules" :model="model" ref="alarmForm">
        <el-table
          :data="model.tableData"
          style="width: 100%"
          :default-sort="{prop: 'date', order: 'descending'}"
        >
          <el-table-column label="预警名称">
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableData.' + scope.$index + '.alarmName'"
                :rules="model.rules.alarmName"
              >
                <el-input v-model="scope.row.alarmName" clearable style="width:100%" maxlength="15"></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="预警值">
            <template slot-scope="scope" style="display: flex;">
              <el-form-item
                :prop="'tableData.' + scope.$index + '.itemValueMin'"
                :rules="model.rules.itemValueMin"
                align="center"
              >
                <el-input
                  v-model.number="scope.row.itemValueMin"
                  style="width:100%"
                  clearable
                  maxlength="15"
                ></el-input>
              </el-form-item>
              <strong style="margin:auto 10px">~</strong>
              <el-form-item
                :prop="'tableData.' + scope.$index + '.itemValueMax'"
                :rules="model.rules.itemValueMax"
              >
                <el-input
                  v-model.number="scope.row.itemValueMax"
                  style="width:100%"
                  clearable
                  maxlength="15"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="预警等级">
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableData.' + scope.$index + '.alarmLevel'"
                :rules="model.rules.alarmLevel"
              >
                <el-select v-model="scope.row.alarmLevel" clearable style="width: 90%;">
                  <el-option
                    v-for="item in alarmLevelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="deleteAlarm(scope.$index,scope.row.id)"
              >删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <!-- 新增预警项 -->
      <!-- <el-button
        type="primary"
        icon="el-icon-plus"
        class="new"
        @click="addAlertItem(alarmForm)"
      >新增预警项</el-button>-->

      <!-- 新增预警项dialog弹框开始 -->
      <!-- <el-dialog title="新增预警项" :visible.sync="dialogVisible" width="30%">
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
                <el-input v-model.number="alarmForm.itemValueMax" class="input" style="width:100%"></el-input>
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
          <el-button @click="roleDialogCancel()">取 消</el-button>
          <el-button type="primary" @click="dialogOk(alarmForm)">确 定</el-button>
        </span>
      </el-dialog>-->

      <!-- 页面操作 -->
      <div slot="footer" class="dialog-footer" style=" margin-top: 30px;text-align: left;">
        <el-button @click="cancelEdit()">取消编辑</el-button>
        <el-button type="primary" @click="saveAlert(standardData,model.tableData)">保存编辑</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    this.$store.commit('changeBreadcumb', this.breadcrumb)
  },
  mounted() {
    let data = this.$route.params.data
    this.standardData = data //用保存标准项数据
    this.getAlertItems(data.itemKey, data.vehicleTypeId) //根据itemKey项获取预警项
    this.alarmForm.itemKey = data.itemKey
    this.alarmForm.vehicleTypeId = data.vehicleTypeId
    this.getStatusValueDescription(data.itemKey, data.vehicleTypeId)
  },
  methods: {
    //新增预警项
    addAlertItem(alarmForm) {
      this.dialogVisible = true
      if (this.$refs.alarmForm) {
        this.$refs.alarmForm.resetFields()
      }
    },
    //保存编辑
    saveAlert(standardData, data) {
      const vm = this
      // 校验1：标准值
      let p1 = new Promise(function(resolve, reject) {
        vm.$refs['standardData'].validate(valid => {
          valid ? resolve() : reject()
        })
      })

      // 校验2:预警项
      let p2 = new Promise(function(resolve, reject) {
        vm.$refs['alarmForm'].validate(valid => {
          valid ? resolve() : reject()
        })
      })

      Promise.all([p2, p1])
        .then(resolve => {
          if (data.length) {
            // 预警范围值
            for (let item of data) {
              item.itemValue = `${item.itemValueMin}~${item.itemValueMax}`
            }

            // 修改预警项
            this.$post(
              `${this.$store.state.basedataUrl}/alarmDefinition/updateList`,
              { alarmList: data, idList: this.deleteIdList }
            ).then(data => {
              if (data.code === 200) {
                this.$message.info(`${data.msg}`)
                if (data.msg == '修改成功') {
                  this.modifyStandardItem(standardData)
                  this.deleteIdList = []
                }
              }
            })
          } else {
            this.modifyStandardItem(standardData)
          }
        })
        .catch(e => {
          this.$message.error(`数据格式有误或为空`)
        })
    },
    // 取消编辑
    cancelEdit() {
      this.$router.push({
        path: '/protocolDataStandard/protocolData'
      })
      // this.$refs.alarmForm.resetFields()
      // this.getAlertItems(
      //   this.standardData.itemKey,
      //   this.standardData.vehicleTypeId
      // )
      // this.standardData = JSON.parse(JSON.stringify(this.cancelEditData))
      // this.deleteIdList = []
    },
    // 获取状态值说明
    getStatusValueDescription(itemKey, vehicleTypeId) {
      this.$post(
        `${
          this.$store.state.basedataUrl
        }/vehicleStandardsStatusInfo/getByItemKeyAndVehicleTypeId?itemKey=${itemKey}&vehicleTypeId=${vehicleTypeId}`
      ).then(data => {
        if (data.code === 200) {
          if (data.data.length != 0) {
            this.statusValueDescription = data.data
            this.showDescription = true
          }
        }
      })
    },
    //修改标准项
    modifyStandardItem(standardData) {
      let data = {
        id: standardData.id,
        itemKey: standardData.itemKey,
        itemValue: standardData.itemValue,
        vehicleTypeId: standardData.vehicleTypeId
      }
      this.$post(
        `${this.$store.state.basedataUrl}/vehicleStandards/update`,
        data
      ).then(data => {
        if (data.code === 200) {
          this.$router.push({
            path: '/protocolDataStandard/protocolData'
          })
        }
      })
    },
    //删除
    deleteAlarm(index, id) {
      this.$confirm('确定需要删除此条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.model.tableData.splice(index, 1)
          this.deleteIdList.push(id)
        })
        .catch(() => {
          this.$message.info('已取消删除!')
        })
    },

    //表单确认
    dialogOk(data) {
      data.itemValue = `${data.itemValueMin}~${data.itemValueMax}`
      this.$refs.alarmForm.validate(valid => {
        if (valid) {
          if (data.itemValueMin <= data.itemValueMax) {
            this.$post(
              `${this.$store.state.basedataUrl}/alarmDefinition/insert`,
              data
            ).then(data => {
              if (data.code === 200) {
                this.dialogVisible = false
                this.$message.success(data.msg)
                this.getAlertItems(
                  this.standardData.itemKey,
                  this.standardData.vehicleTypeId
                )
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
    //根据itemKey项获取预警项
    getAlertItems(itemKey, vehicleTypeId) {
      this.$post(
        `${
          this.$store.state.basedataUrl
        }/alarmDefinition/getListByKey?itemKey=${itemKey}&vehicleTypeId=${vehicleTypeId}`
      ).then(data => {
        if (data.code === 200) {
          //最小值最大值
          for (let item of data.data) {
            item.itemValueMin = Number(item.itemValue.split('~')[0])
            item.itemValueMax = Number(item.itemValue.split('~')[1])
          }
          this.model.tableData = data.data
        }
      })
    }
  },
  data() {
    var rangeValue = (rule, value, callback) => {
      let index = rule.field.split('.')[1]
      if (
        value === '' ||
        parseInt(this.model.tableData[index].itemValueMin) >
          parseInt(this.model.tableData[index].itemValueMax)
      ) {
        callback(new Error('预警值左边应该小于右边'))
      } else {
        callback()
      }
    }
    return {
      // 面包屑
      breadcrumb: [
        { name: '协议标准数据', path: '' },
        { name: '协议标准', path: '/protocolDataStandard/protocolData' },
        { name: '编辑配置', path: '' }
      ],
      isTrue: false, //判断预警值是否正确
      statusValueDescription: '',
      showDescription: false,
      standardData: {},
      deleteIdList: [], //删除的ID集合
      form: {},
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
      // 标准项校验规则
      rules: {
        itemValue: [
          { required: true, message: '请输入标准项', trigger: 'blur' },
          {
            pattern: /^[\d~,-]*$/,
            message: '标准项为数字和字符',
            trigger: 'blur'
          }
        ]
      },
      model: {
        rules: {
          alarmName: [
            {
              type: 'string',
              required: true,
              pattern: /[^ ]/, //不为空
              message: '必填字段且不为空',
              trigger: 'blur'
            }
          ],
          itemValueMin: [
            {
              type: 'number',
              required: true,
              message: '必填且为数字值',
              trigger: ['blur', 'change']
            },
            {
              pattern: /^(\-|\+)?\d+(\.\d+)?$/,
              message: '正数、负数、和小数',
              trigger: 'blur'
            },
            { validator: rangeValue, trigger: 'blur' }
          ],
          itemValueMax: [
            {
              type: 'number',
              required: true,
              message: '必填且为数字值',
              trigger: ['blur', 'change']
            },
            {
              pattern: /^(\-|\+)?\d+(\.\d+)?$/,
              message: '正数、负数、和小数',
              trigger: 'blur'
            },
            { validator: rangeValue, trigger: 'blur' }
          ],
          alarmLevel: {
            required: true,
            message: '请选择预警项',
            trigger: 'change'
          }
        },
        tableData: []
      }
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss">
#vehicleWarningEditing .input {
  width: 35%;
  display: inline-block;
}
#vehicleWarningEditing .new {
  margin-top: 30px;
}
.topDiv div {
  width: 77%;
  display: inline-block;
}
/* 布局 */
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
h1 {
  font-size: 1.4em;
}
.topWrap {
  border-bottom: 1px solid #797979;
  padding-bottom: 30px;
}
</style>
<style>
#vehicleWarningEditing .el-table .cell {
  display: flex;
}

#vehicleWarningEditing .el-form-item {
  margin: 22px 0;
  width: 98%;
}
</style>


<template>
  <div>
    <div class="content">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="15rem"
        label-position="right"
        class="ebox"
      >
        <p class="title">BOX数据传输时间设置:</p>
        <el-form-item
          v-for="item in tableData"
          :key="item.itemKey"
          prop="itemValue"
          :label="item.description"
          :value="item.itemValue"
        >
          <el-input
            v-model="item.itemValue"
            type="text"
            autocomplete="off"
            maxlength="5"
            @blur="blur"
          ></el-input>
          <el-form-item class="second" :label="item.unit"></el-form-item>
        </el-form-item>
        <el-form-item label="服务器登录账号" prop="loginName">
          <el-input v-model="ruleForm.loginName" @blur="blur2"></el-input>
        </el-form-item>
        <el-form-item label="服务器登录密码" prop="loginPassword" style="margin-top:40px">
          <el-input v-model="ruleForm.loginPassword" @blur="blur2"></el-input>
        </el-form-item>
        <el-button @click="resetForm()">取 消</el-button>
        <el-button type="primary" @click="save()">保 存</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      ruleForm: {
        description: '',
        itemValue: '',
        itemKey: '',
        id: '',
        loginName: '',
        loginPassword: ''
      },
      // 表单验证规则
      rules: {
        loginName: [
          {
            pattern: window._check.eightString,
            message: '请输入8个字母或者数字字符'
          }
        ],
        loginPassword: [
          {
            pattern: window._check.eightString,
            message: '请输入8个字母或者数字字符'
          }
        ]
      }
    }
  },
  // 面包屑置空
  created() {
    this.$store.commit('changeBreadcumb', []), this.showAllReportInterval()
  },
  methods: {
    // 初始化查询所有
    showAllReportInterval() {
      const vm = this
      vm.tableData = []
      vm.$post(
        `${vm.$store.state.basedataUrl}/terminal/getAllTerminalConfig`
      ).then(data => {
        if (data.code === 200) {         
          vm.ruleForm.loginName=data.data[5].itemValue
          vm.ruleForm.loginPassword=data.data[6].itemValue
          vm.tableData = data.data.splice(0, 5)
          for (let item of this.tableData) {
            // let left = item.unit.indexOf('(')
            // let center = item.unit.indexOf("-")
            // let right = item.unit.indexOf(")")
            // item.min = item.unit.slice(left + 1, center)
            // item.max = item.unit.slice(center + 1, right)
          }
        }
      })
    },
    blur() {
      for (let item of this.tableData) {
        let min = parseInt(item.min)
        let value = parseInt(item.itemValue)
        let max = parseInt(item.max)
        if (item.itemValue === '') {
          this.$message.error('请输入值，不能为空')
        } else if (value < min || value > max) {
          this.$message.error('请输入正确的范围值')
          break
        }
      }
    },
    blur2() {
      if (this.ruleForm.loginName === '') {
        this.$message.error('请输入值，不能为空')
      } else if (this.ruleForm.loginPassword === '') {
        this.$message.error('请输入值，不能为空')
      }
    },
    // 保存修改的值
    save() {
      const vm = this
      let data = {
        loginName: vm.ruleForm.loginName,
        loginPassword: vm.ruleForm.loginPassword
      }
      for (let i = 0; i < vm.tableData.length; i++) {
        let a = vm.tableData[i].itemKey
        let b = vm.tableData[i].itemValue
        data[a] = b
      }
      vm.$refs.ruleForm.validate(valid => {
        if (valid) {
          vm.$post(
            `${vm.$store.state.basedataUrl}/terminal/updateListByKeys`,
            data
          ).then(data => {
            if (data.code === 200) {
              vm.$message.success(data.msg)
            }
          })
        } else {
          vm.$message.error('表单填写不完整')
        }
      })
    },
    //  取消编辑
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.showAllReportInterval()
    }
  }
}
</script>
<style scoped >
/* 标题样式 */
.title {
  font-weight: bolder;
  margin-left: 30px;
}
.el-form {
  width: 500px;
}
.el-button {
  margin-left: 27%;
  margin-top: 2rem;
}
.second {
  position: relative;
  left: 85%;
  top: -2.5rem;
}
.el-form-item {
  margin-bottom: 2px;
}
</style>



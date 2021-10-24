<template>
  <el-form ref="ruleForm2" :rules="rules2" :model="ruleForm2"  class="demo-dynamic">
    <el-form-item prop="loginName" label="用户名称">
      <el-input v-model="ruleForm2.loginName" maxlength="16" disabled=""></el-input>
    </el-form-item>
    <el-form-item
      prop="email" label="修改邮箱">
      <el-input v-model="ruleForm2.email" maxlength="50" ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
      <el-button @click="resetForm('ruleForm2')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      ruleForm2: {
        userId: '',
        email: '',
        loginName: ''
      },
      // 面包屑
      breadcrumb: [
        { name: '个人设置', path: '' },
        { name: '个人信息', path: '' }
      ],
      rules2: {
        loginName: [
          {
            required: true,message: '请输入用户名', trigger: ['blur', 'change']
          },
          {
              pattern: window._check.userPattern,
              message: '请输入正确的用户名,2到16位（字母，数字，下划线，减号）',
              trigger: ['blur', 'change']
          }
        ],
        email: [
          { pattern: window._check.isEmail, message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.$store.commit('changeBreadcumb', this.breadcrumb)
    let id = sessionStorage.getItem('id')
    let loginName = sessionStorage.getItem('loginName')
    let email = sessionStorage.getItem('email')
    this.ruleForm2.loginName = loginName
    this.ruleForm2.userId = id
    this.ruleForm2.email = email
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          let vm = this
          let data = {
            id: vm.ruleForm2.userId,
            email: vm.ruleForm2.email,
            loginName: vm.ruleForm2.loginName
          }
          //(data)
          $post(
            `${vm.$store.state.basedataUrl}/system/user/info/updateUserInfo`,
            data
          ).then(data => {
            if (data.code === 200) {
              vm.$message({ message: data.msg, type: 'success' })
            } else {
              alert('提交失败')
            }
          })
        } else {
          //('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped >
.el-form {
  width: 400px;
  margin-top: 50px;
}
</style>

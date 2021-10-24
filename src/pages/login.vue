<template>
  <div class="login-page-container">
    <vue-particles
      color="#E0FFFF"
      :particleOpacity="0.7"
      :particlesNumber="100"
      shapeType="circle"
      :particleSize="4"
      linesColor="#47CD88"
      :linesWidth="1"
      :lineLinked="false"
      :lineOpacity="0"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="false"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="remove"
    ></vue-particles>
    <div class="form-div">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="login-container">
        <h3 class="login_title">EMC系统登录</h3>
        <el-form-item prop="loginName" label="登录账号：">
          <el-input type="text" v-model="ruleForm2.loginName" auto-complete="off" maxlength="16" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="登录密码：">
          <el-input
            type="text"
            id="paw"
            v-model="ruleForm2.password"
            auto-complete="off"
            placeholder="密码"
            maxlength="16"
            @keyup.native.enter="login"
          ></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="login" :loading="logining">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import crypto from 'crypto'
export default {
  props: {},
  data() {
    return {
      logining: false,
      ruleForm2: {
        loginName: '',
        password: ''
      },
      routes: [],
      rules2: {
        loginName: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
          {
              pattern: window._check.userPattern,
              message: '请输入正确的用户名,2到16位（字母，数字，下划线，减号）',
              trigger: ['blur', 'change']
          }
        ],
        password: [
          {required: true,message: '请输入密码',trigger: 'blur'},
          {pattern: window._check.pattern,message: '请输入正确的密码格式（4-16位任意字符）',trigger: ['blur', 'change']}
        ]
      },
      // 记住密码
      checked: false
    }
  },
  created() {
    const loginName = localStorage.getItem('loginName')
    const password = localStorage.getItem('password')
    if (loginName && password) {
      this.ruleForm2.loginName = loginName
      this.ruleForm2.password = password
      this.checked = true
    }
  },
  watch: {
    // 监听如果清空用户名或密码，取消‘记住密码’选中状态
    'ruleForm2.password'(val) {
      if (!val) {
        this.checked = false
        localStorage.clear()
      }
    },
    'ruleForm2.loginName'(val) {
      if (!val) {
        this.checked = false
        localStorage.clear()
      }
    }
  },
  methods: {
    login() {
      const vm = this
      vm.$refs.ruleForm2.validate((valid) => {
      if (valid) {
      // 调用后端登陆接口
      if (!vm.ruleForm2.loginName) {
        vm.$message({
          message: '请输入账户',
          type: 'error'
        })
      }
      if (!vm.ruleForm2.password) {
        vm.$message({
          message: '请输入密码',
          type: 'error'
        })
      } else {
        let loginName
        let password
        if (localStorage.getItem('checked')) {
          loginName = vm.ruleForm2.loginName
          password = vm.ruleForm2.password
        } else {
          loginName = vm.ruleForm2.loginName
          password = cryptPwd(vm.ruleForm2.password)
        }
        //(password);
        vm.$post(`${vm.$store.state.basedataUrl}/login`, {
          loginName: loginName,
          password: password
        }).then(result => {
          if (result && result.data) {
            // //(result.data);
            if (result.code === 200) {
              if (vm.checked) {
                localStorage.setItem('loginName', loginName)
                localStorage.setItem('password', password)
                localStorage.setItem('checked', true)
              } else {
                localStorage.clear()
              }
              window.sessionStorage.setItem('loginName', result.data.loginName)
              window.sessionStorage.setItem('realName', result.data.realName)
              window.sessionStorage.setItem('email', result.data.email)
              window.sessionStorage.setItem('role', result.data.authAry)
              window.sessionStorage.setItem('token', result.data.token)
              window.sessionStorage.setItem('city', result.data.city)
              window.sessionStorage.setItem('id', result.data.id)
              window.sessionStorage.setItem('cityCode', result.data.cityCode)
              vm.$store.dispatch('setToken', result.data.token)
              // 菜单
              window.sessionStorage.setItem(
                'list',
                JSON.stringify(result.data.list)
              )
              vm.$store.dispatch('setToken', result.data.token)
              let routes = this.$router.options.mergeRoutes(result.data.list)
              vm.$store.dispatch('setMergeRoutes', routes)
              vm.$store.dispatch('setRoute', routes)
              this.$router.addRoutes(this.$store.getters.addRouters)
              // //('菜单:', this.$router.options.routes)
              vm.$router.push({
                path: '/statisticalAnalysis/welcome'
              })
            } else {
              vm.$alert('用户名或密码错误！', '提示信息', {
                confirmButtonText: '确定'
              })
            }
          }
        })
        // 加密的方法
        function cryptPwd(password) {
          var md5 = crypto.createHash('md5')
          return md5.update(password).digest('hex')
        }
      }
     } else {
           vm.$message.error('表单填写不完整')
         }
      })

    }
  }
}
</script>
<style scoped>
.login-page-container {
  height: 100%;
  width: 100%;
  position: absolute;
  background: url('../assets/img/home/timg.jpg') no-repeat fixed center;
  background-size: 100% 100%;
}
.login-container {
  border-radius: 5px;
  background-clip: padding-box;
  margin: 100px auto;
  width: 306px;
  height: 356px;
  padding: 10px 20px 13px;
  background: #fff;
  border: 1px solid #eaeaea;
  -webkit-box-shadow: 0 0 25px #cac6c6;
  box-shadow: 0 0 25px #cac6c6;
  position: absolute;
  left: 64%;
  top: 81px;
}
.login_title {
  color: #2196f3;
  text-align: center;
}
/* label字体样式修改 */
</style>
<style >
/* label字体样式修改 */
.login-container .el-form-item__label {
  color: #2196f3;
}
.login-container #paw {
  font-family: "PasswordEntry";
}
</style>




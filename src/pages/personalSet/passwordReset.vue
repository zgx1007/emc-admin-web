<template>
  <el-form
    :model="ruleForm2"
    status-icon
    :rules="rules2"
    ref="ruleForm2"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="原始密码" prop="pwd">
      <el-input type="password" v-model="ruleForm2.pwd" autocomplete="off" maxlength="16"></el-input>
    </el-form-item>
    <el-form-item label="新的密码" prop="newPwd">
      <el-input type="password" v-model="ruleForm2.newPwd" autocomplete="off" maxlength="16"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleForm2)">提交</el-button>
      <el-button @click="resetForm(ruleForm2)">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import crypto from "crypto";
export default {
  created() {
    this.$store.commit("changeBreadcumb", this.breadcrumb);
    let id = sessionStorage.getItem("id");
    this.ruleForm2.userId = id;
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("newPwd");
        }
        callback();
      }
    };
    return {
      ruleForm2: {
        userId: "",
        pwd: "",
        newPwd: ""
      },
      // 面包屑
      breadcrumb: [
        { name: "个人设置", path: "" },
        { name: "密码管理", path: "" }
      ],
      rules2: {
        pwd: [
          { required: true, message: "请输入原始密码", trigger: ["blur"] },
          { validator: validatePass, trigger: "blur" },
          {
            pattern: window._check.pattern,
            message: "请输入正确的密码格式（4-16位任意字符)",
            trigger: ["blur", "change"]
          }
        ],
        newPwd: [
          {
            required: true,
            message: "请输入新的密码",
            trigger: ["blur", "change"]
          },
          {
            pattern: window._check.pattern,
            message: "请输入正确的密码格式（4-16位任意字符)",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  methods: {
    submitForm(form) {
      const vm = this;
      vm.$refs.ruleForm2.validate(valid => {
        if (valid) {
          if (vm.ruleForm2.pwd === vm.ruleForm2.newPwd) {
            // 两个密码相同
            this.$alert("新的密码不能与旧密码相同，请重新设置", "提示！", {
              confirmButtonText: "确定",
              callback: action => {
                vm.ruleForm2.newPwd = "";
              }
            });
          } else {
            // 两个密码不相同
            let paramForm = {
              newPwd: vm.cryptPwd(form.newPwd),
              pwd: vm.cryptPwd(form.pwd),
              userId: form.userId
            };
            vm.$post(
              `${vm.$store.state.basedataUrl}/system/user/pwd/updatePassword`,
              paramForm
            ).then(data => {
              if (data.code === 200) {
                this.$message({
                  message: "修改密码成功！请重新登陆",
                  type: "success"
                });

                this.$router.replace("/login");
              }
            });
          }
        } else {
          this.$message({
            message: "表单填写有误！",
            type: "error"
          });
          return false;
        }
      });
    },
    resetForm(ruleForm2) {
      this.$refs.ruleForm2.resetFields();
    },
    // 加密的方法
    cryptPwd(value) {
      var md5 = crypto.createHash("md5");
      return md5.update(value).digest("hex");
    }
  }
};
</script>
<style scoped >
.el-form {
  width: 400px;
  margin-top: 50px;
}
</style>


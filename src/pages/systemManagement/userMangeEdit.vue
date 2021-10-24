<template>
  <el-dialog :title="dialogTitle" @close="cancel('editForm')" :close-on-click-modal="false" :visible.sync="dialogVisible" width="50%">
    <el-form :model="editForm" ref="editForm" label-width="100px" v-loading="isLoading" :rules="rules1">
      <el-form-item label="真实名字" prop="realName">
        <el-input type="text" autocomplete="off" v-model="editForm.realName" maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="用户名称" prop="loginName">
        <el-input type="text" autocomplete="off" v-model="editForm.loginName" :disabled="isEdit" maxlength="16"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="passWord" v-if="showAdmin">
        <el-input type="password" autocomplete="off" v-model="editForm.passWord" maxlength="16"></el-input>
      </el-form-item>
      <el-form-item label="城 市" prop="cityCode">
        <el-select v-model="editForm.cityCode" filterable clearable placeholder="请选择城市">
          <el-option v-for="item in citys" :key="item.id" :label="item.city" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input type="text" autocomplete="off" v-model="editForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input type="email" autocomplete="off" v-model="editForm.email" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="对应角色" prop="roleId" required>
        <el-select v-model="editForm.roleId" filterable clearable placeholder="请选择">
          <el-option v-for="item in roleDta" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel('editForm')">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import crypto from 'crypto'
  export default {
    props: {
      detailData: Object,
      citys: Array,
      roleDta: Array,
      editDialog: Boolean
    },
    data() {
      return {
        showAdmin:true,
        dialogTitle: '',
        dialogVisible: this.editDialog,
        isEdit: false,
        isLoading: false,
        num: 0,
        value4: '',
        // 下拉框
        key: '',
        // 修改用判断
        m: false,
        // 用户显示
        tableData: [],
        // 新增
        editForm: {
          realName: '',
          phone: '',
          cityCode: '',
          loginName: '',
          passWord: '',
          email: '',
          roleName: '',
          roleId: ''
        },
        // 表单验证规则
        rules1: {
          realName: [{
              required: true,
              message: '请输入真实姓名',
              trigger: ['blur', 'change']
            },
            {
              pattern: window._check.isChineseReg,
              message: '请输入中文姓名',
              trigger: ['blur', 'change']
            }
          ],
          cityCode: [
            {required: true,message: '请选择城市',trigger: ['blur', 'change']}
          ],
          loginName: [
            {
              required: true,
              message: '请输入用户名',
              trigger: ['blur', 'change']
            },
            {
              validator: this.existLoginName,
              trigger: 'blur'
            },
            {
              pattern: window._check.userPattern,
              message: '请输入正确的用户名,2到16位（字母，数字，下划线，减号）',
              trigger: ['blur', 'change']
            }
          ],
          passWord: [
            {
            required: true,
            message: '请输入密码',
            trigger: 'change'
            },
            {pattern: window._check.pattern,message: '请输入正确的密码格式（4-16位任意字符）',trigger: ['blur', 'change']}
          ],
          email: [
            {
              pattern: window._check.isEmail,
              message: '请输入正确的邮箱',
              trigger: 'blur'
            }
          ],
          roleId: [{
            required: true,
            message: '请选择对应角色',
            trigger: ['blur', 'change']
          }],
          phone: [{
              required: true,
              message: '请输入手机号',
              trigger: ['blur', 'change']
            },
            {
              pattern: window._check.isPhoneReg,
              message: '手机号格式有误',
              trigger: ['blur', 'change']
            }
          ]
        }
      }
    },
    watch: {
      editDialog(val) {
        if (!val) {
          this.emptyEditFrom()
        } else if (this.detailData) {
          this.isEdit = true
          this.dialogTitle = '修 改'
          this.showAdmin = false
          for (let key in this.editForm) {
            this.editForm[key] = this.detailData[key]
          }
          this.editForm.realName = this.detailData.realName
          for (var j=0; j < this.citys.length; j++) {
            if (this.detailData.city === this.citys[j].city) {
              this.editForm.cityCode = this.citys[j].code
            }
          }
          for (var i=0; i< this.roleDta.length; i++) {
            if (this.detailData.roleName === this.roleDta[i].roleName) {
              this.editForm.roleId = this.roleDta[i].id
            }
          }
        } else {
          this.showAdmin = true
          this.isEdit = false
          this.dialogTitle = '添 加'
          // this.$refs.passWord.style.display = ''
        }
        this.dialogVisible = val
      },
      dialogVisible(val) {
        this.$emit('updata:editDialog', val)
      },
      // dialogTitle(val){
      //   if(val === '添 加') {
      //     this.$refs.passWord.style.display = ''
      //   } else if(val === '修 改'){
      //     this.$refs.passWord.style.display = 'none'
      //   }
      // },
    },
    methods: {
      // 提交
      addUser() {
        const vm = this
        let data
        vm.$refs.editForm.validate((valid) => {
          if (valid) {
            if(!vm.isEdit){
              data = {
                realName: vm.editForm.realName,
                code: vm.editForm.cityCode,
                phone: vm.editForm.phone,
                loginName: vm.editForm.loginName,
                passWord: cryptPwd(vm.editForm.passWord), // 加密
                email: vm.editForm.email,
                roleId: vm.editForm.roleId
              }
            } else {
              data = {
                realName: vm.editForm.realName,
                code: vm.editForm.cityCode,
                phone: vm.editForm.phone,
                loginName: vm.editForm.loginName,
                passWord: vm.editForm.passWord,
                email: vm.editForm.email,
                roleId: vm.editForm.roleId
              }
            }
            if (vm.detailData) {
              data.id = vm.detailData.id
            }
            console.log(data)
            let url = vm.detailData ? '/system/user/updateUserInfo' : '/system/user/addUser'
            vm.$post(vm.$store.state.basedataUrl + url, data).then(r => {
              if (r && r.code === 200) {
                vm.editForm = {
                  realName: '',
                  cityCode: '',
                  phone: '',
                  loginName: '',
                  passWord: '',
                  email: '',
                  roleId: ''
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
        // 加密的方法
        function cryptPwd(password) {
          var md5 = crypto.createHash('md5');
          return md5.update(password).digest('hex')
        }
      },
      onOpen(){
        this.selectCitys()
        this.getRoleDta()
      },
      // 清空表单
      emptyEditFrom() {
        this.editForm.realName = ''
        this.editForm.loginName = ''
        this.editForm.phone = ''
        this.editForm.cityCode = ''
        this.editForm.passWord = '',
        this.editForm.email = '',
        this.editForm.roleId = ''
      },
      // 取消
      cancel(formName) {
        const vm = this
        vm.editForm = {
          realName: '',
          loginName: '',
          cityCode: '',
          phone: '',
          passWord: '',
          email: '',
          roleId: ''
        }
        vm.$refs[formName].resetFields()
        vm.$emit('cancel:cancel', true)
        vm.dialogVisible = false
      },
      // 账户是否已被使用
      existLoginName(rule, value, callback) {
        const vm = this
        let loginName = {
          loginName: value
        }
        if (vm.isEdit) {
          callback && callback()
        } else {
          vm.$post(`${vm.$store.state.basedataUrl}/system/user/verifyUserName`, JSON.stringify(loginName.loginName)).then(
            data => {
              if (data && data.code === 200) {
                callback && callback()
              } else if (data.code === 500) {
                callback && callback(new Error('该用户名称已被使用'))
              }
            })
        }
      },
      // 邮箱是否已被使用
      existEmail(rule, value, callback) {
        const vm = this
        let email = {
          email: value
        }
        vm.$post(`${vm.$store.state.basedataUrl}/system/user/verifyUserEmail`, JSON.stringify(email.email)).then(data => {
          if (data && data.code === 200) {
            callback && callback()
          } else if (data.code === 500) {
            callback && callback(new Error('该邮箱已被使用'))
          }
        })
      }
    }
  }

</script>

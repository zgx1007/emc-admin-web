<template>
  <div>
    <div class="user">
      <!-- <el-button class="adduser" size="small" @click="showAllUserInfo">查 询</el-button> -->
      <el-button class="adduser" size="small" @click.stop="add">添 加</el-button>
    </div>
    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      border
      style="width:100%"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="realName" label="真实姓名" width="100"></el-table-column>
      <el-table-column prop="city" label="城市" width="100"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="120"></el-table-column>
      <el-table-column prop="loginName" label="用户名称" width="100"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="100"></el-table-column>
      <el-table-column prop="email" label="企业邮箱" width="180"></el-table-column>
      <el-table-column prop="loginTime" label="登录时间" width="180"></el-table-column>
      <el-table-column prop="lastLoginTime" label="退出时间" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <span>{{getStatus(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" plain size="small" @click="deleteUser(scope.row.id)">删除用户</el-button>
          <el-button type="primary" plain size="small" @click="resetPassword(scope.row.id)">重置密码</el-button>
          <el-button type="danger" plain size="small" @click="edit(scope.row)">修改信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit
      :detailData="detailData"
      :editDialog="editDialog"
      :citys="citys"
      :roleDta="roleDta"
      @updata:editDialog="val => editDialog = val"
      @add:success="showAllUserInfo()"
      @cancel:cancel="() => detailData = null"
      @edit:success="showAllUserInfo()"
    ></edit>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 30, 40]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      prev-text="上一页"
      next-text="下一页"
      :total="tableData.length"
    ></el-pagination>
  </div>
</template>

<script>
import edit from './userMangeEdit.vue'
import { randomBytes } from 'crypto'
export default {
  components: { edit },
  created() {
    this.$store.commit('changeBreadcumb', this.breadcrumb)
    this.showAllUserInfo()
    this.getRoleDta()
    this.selectCitys()
  },
  data() {
    return {
      // 弹框
      editDialog: false,
      detailData: {},
      display: '',
      // 城市和角色
      citys: [],
      roleDta: [],
      // 添加用户
      input: '',
      dialogVisible: false,
      isLoading: false,
      num: 0,
      value4: '',
      // 用户显示
      tableData: [],
      roleDta: [],
      // 分页默认
      currentPage: 1,
      pagesize: 5,
      // 新增
      editForm: {
        realName: '',
        phone: '',
        city: '',
        loginName: '',
        passWord: '',
        email: '',
        roleId: ''
      },
      // 面包屑
      breadcrumb: [
        { name: '系统管理', path: '' },
        { name: '用户管理', path: '' }
      ]
    }
  },
  methods: {
    // 删除用户信息
    deleteUser(id) {
      const vm = this
      vm.$confirm('是否删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.isLoading = true
        let data = id
        vm.$post(
          `${vm.$store.state.basedataUrl}/system/user/deleteUser?id=${data}`).then(r => {
          if (r && r.code === 200) {
            this.currentPage = 1
            vm.$message({ message: '删除成功', type: 'success' })
            vm.showAllUserInfo()
          }
          vm.isLoading = false
        })
      })
    },
    // 查询用户
    showAllUserInfo(ob = {}) {
      const vm = this
      vm.detailData = null
      vm.tableData = []
      vm.$post(
        `${vm.$store.state.basedataUrl}/system/user/showAllUserInfo`
      ).then(data => {
        if (data.code === 200) {
          vm.tableData = data.data
          vm.length = data.data.length
        }
      })
    },
    // 重置密码
    resetPassword(id) {
      const vm = this
      vm.$confirm('是否重置密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.isLoading = true
        let data = id
        vm.$post(
          `${vm.$store.state.basedataUrl}/system/user/resetPassword`,
          data
        ).then(r => {
          if (r && r.code === 200) {
            vm.$message({ message: `${r.msg}`, type: 'success' })
            vm.showAllUserInfo()
          }
          vm.isLoading = false
        })
      })
    },
    // 城市下拉框
    selectCitys() {
      const vm = this
      vm.citys = []
      vm.$post(`${vm.$store.state.basedataUrl}/city/getAllCity`).then(data => {
        if (data.code === 200) {
          vm.citys = data.data
        } else {
        }
      })
    },
    // 角色远程搜索
    getRoleDta() {
      const vm = this
      vm.roleDta = []
      let pageIndex = 0
      vm.$post(
        `${vm.$store.state.basedataUrl}/system/role/roleInfo`,
        pageIndex
      ).then(data => {
        if (data.code === 200) {
          vm.roleDta = data.data
        }
      })
    },
    // 修改
    edit(row) {
      this.editDialog = true
      this.detailData = row
      this.citys = this.citys
      this.roleDta = this.roleDta
    },
    // 新增
    add() {
      this.detailData = null
      this.editDialog = true
      this.citys = this.citys
      this.roleDta = this.roleDta
    },
    getStatus(status) {
      const statusName = ['冻结', '正常']
      return status < statusName.length ? statusName[status] : ''
    },
    // 分页方法
    handleSizeChange: function(size) {
      this.pagesize = size
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    },
    // 清空表单
    emptyEditFrom() {
      this.editForm.realName = ''
      this.editForm.phone = ''
      this.editForm.city = ''
      this.editForm.loginName = ''
      ;(this.editForm.passWord = ''),
        (this.editForm.email = ''),
        (this.editForm.roleId = '')
    }
  }
}
</script>
<style scoped>
.cell {
  text-align: center;
}
.adduser {
  margin-bottom: 10px;
  background: #d7dfec;
}
.userInput {
  width: 20%;
}
.user {
  margin-bottom: 5px;
}
/* 分页 */
.el-pagination {
display: flex;
justify-content: flex-end;
}
</style>

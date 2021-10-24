<template>
  <div>
    <!-- 角色操作dialog弹框开始 -->
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form label-width="80px" :model="roleForm">
        <el-form-item label="角色名称" :rules="rules">
          <el-input type="text" autocomplete="off" v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描叙" :rules="rules">
          <el-input type="text" autocomplete="off" v-model="roleForm.description"></el-input>
        </el-form-item>
        <!--  权限选择 -->
        <el-form-item label="权限选择">
          <el-tree
            :data="treeData"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            :default-checked-keys="selected"
            ref="tree"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogcancel()">取 消</el-button>
        <el-button type="primary" @click="roleDialogOk()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色操作dialog弹框结束 -->
  </div>
</template>
<script>
export default {
  created() {
    this.$store.commit('changeBreadcumb', this.breadcrumb)
    this.getRoleInfo()
    this.getAllMenu()
  },
  data() {
    return {
      // 添加角色
      input: '',
      dialogVisible: false,
      pageIndex: 0,
      tableData: [],
      // 面包屑
      breadcrumb: [
        { name: '系统管理', path: '' },
        { name: '角色管理', path: '' }
      ],
      form: {},
      /*添加角色表单*/
      addroleForm: {
        roleName: '',
        description: ''
      },
      //角色表单
      roleForm: {
        roleName: '',
        description: ''
      },
      /*权限选择*/
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      //选中的权限
      selected: [],
      rules: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        {
          type: 'text',
          message: '请输入正确的邮箱地址',
          trigger: ['blur', 'change']
        }
      ]
    }
  },
  methods: {
    //查询角色
    getRoleInfo() {
      const vm = this
      vm.tableData = []
      let pageIndex = vm.pageIndex
      vm.$post(
        `${vm.$store.state.basedataUrl}/system/role/roleInfo`,
        pageIndex
      ).then(data => {
        if (data.code === 200) {
          vm.tableData = data.data
        }
      })
    },
    //删除角色
    deleteRole(res) {
      this.$confirm('是否确定删除此角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const vm = this

          vm.$post(
            `${vm.$store.state.basedataUrl}/system/role/deleteRole`,
            res
          ).then(data => {
            if (data.code === 200) {
            }
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //添加角色关闭弹窗
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    /*角色表单弹窗操作：添加角色、删除角色*/
    rolrData(statu, res) {
      const vm = this
      vm.dialogVisible = true
      this.$nextTick(() => {
        if (statu == 0) {
          vm.roleForm = vm.addroleForm
          vm.defaultData()
        } else {
          vm.roleForm = res
          vm.defaultData(res.list)
        }
      })
    },
    // 弹窗默认数据
    defaultData(res) {
      ////(res);
      let arr = []
      if (res) {
        for (var i = 0; i < res.length; i++) {
          arr.push(res[i].authoriryId)
        }
      }
      this.$refs.tree.setCheckedKeys(arr) //设置树形控件默认选中项
    },
    //角色弹窗点击确定按钮
    roleDialogOk() {
      //("点击了确定按钮");
      const vm = this
      ////(vm.roleForm.id)
      let checkedKeys = vm.$refs.tree.getCheckedKeys() //获取当前的选中的节点
      var data = {
        roleName: vm.roleForm.roleName,
        description: vm.roleForm.description,
        nodes: checkedKeys
      }
      if (vm.roleForm.id) {
        //修改角色
        data.id = vm.roleForm.id
        let url = `${vm.$store.state.basedataUrl}/system/role/updateRole`
        vm.sendRequest(url, data)
      } else {
        //添加角色
        let url = `${vm.$store.state.basedataUrl}/system/role/saveRole`
        vm.sendRequest(url, data)
      }
      ////(data);
      vm.dialogVisible = false
    },
    //调接口发送请求(添加用户,修改用户)
    sendRequest(url, data) {
      const vm = this
      ////("999", url, data);
      /*vm.$post(url, JSON.stringify(data)).then((res) => {
        if (res.code === 200) {
          //(res);
          this.$message({
            showClose: true,
            message: '成功！',
            type: 'success'
          });
        }
      })*/
    },
    // 角色弹窗点击取消按钮
    roleDialogcancel() {
      //("点击取消按钮");
      const vm = this
      vm.dialogVisible = false
      vm.addroleForm.roleName = ''
      vm.addroleForm.description = ''
    },
    /*显示所有权限列表*/
    getAllMenu() {
      const vm = this
      vm.$post(`${vm.$store.state.basedataUrl}/system/auth/authInfo`).then(
        res => {
          if (res.code === 200) {
            ////(res, res.data)
            var list = res.data
            let treeAllData = vm.treeData

            //遍历父级菜单
            for (var i = 0; i < list.length; i++) {
              if (list[i].parentId == -1) {
                treeAllData.push(parentMuem(i))
              }

              function parentMuem(i) {
                var obj = {}
                obj['parentId'] = i // 新增键值对
                obj['label'] = list[i].authName
                obj['id'] = list[i].id
                return obj
              }
            }

            //生成子集菜单
            for (var j = 0; j < treeAllData.length; j++) {
              treeAllData[j]['children'] = []
            }

            //遍历子集菜单
            for (var i = 0; i < list.length; i++) {
              for (var j = 0; j < treeAllData.length; j++) {
                if (treeAllData[j].id == list[i].parentId) {
                  treeAllData[j].children.push(childrenMuem(j))
                }
              }

              function childrenMuem(j) {
                var objchild = {}
                objchild['parentId'] = j // 新增键值对
                objchild['label'] = list[i].authName
                objchild['id'] = list[i].id
                return objchild
              }
            }
          }
          //(this.treeData);
        }
      )
    }
  }
}
</script>
<style>
.cell {
  text-align: center;
}

th {
  color: #2d8cf0;
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
</style>

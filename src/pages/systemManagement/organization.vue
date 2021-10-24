<template>
  <div class="wrap">
    <!-- 权限列表 -->
    <div class="custom-tree-container">
      <div class="block">
        <el-tree
          :data="treedData"
          :show-checkbox="showCheckbox"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="text" size="small" @click="() => append(data)">增加</el-button>
              <el-button type="text" size="small" @click="() => modify(data)">修改</el-button>
              <el-button type="text" size="small" @click="() => remove(node, data)">删除</el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <!-- 角色操作dialog弹框开始 -->
    <el-dialog
      :title="dialogTiltle"
      :visible.sync="dialogVisible"
      width="30%"
      @close="cancel('permissionForm')"
      :close-on-click-modal="false"
    >
      <el-form label-width="80px" :model="permissionForm" :rules="rules" ref="permissionForm">
        <el-form-item :label="nameLabel" prop="name">
          <el-input
            type="text"
            autocomplete="on"
            v-model="permissionForm.name"
            clearable
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submitForm(permissionForm)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色操作dialog弹框结束 -->
  </div>
</template>

<script>
export default {
  created() {
    let id = this.$route.query.id
    this.id = id
    this.$store.commit('changeBreadcumb', this.breadcrumb)
    this.getCompany(id) //获取部门等级
  },
  data() {
    //添加了一个最高级：所有权限
    const datatestTest = [
      {
        id: -1,
        label: '所有权限',
        children: [],
        type: 0
      }
    ] //权限列表
    const datatest = [] //权限列表
    return {
      treedData: JSON.parse(JSON.stringify(datatestTest)), //树形结构数据
      showCheckbox: false, //是否有勾选框
      id: '', //部门id
      dialogVisible: false,
      dialogTiltle: '表单名称',
      nameLabel: '部门名称',
      permissionForm: {
        name: ''
      },
      breadcrumb: [
        { name: '系统管理', path: '' },
        { name: '企业管理', path: '/systemManagement/businessManagement' },
        { name: '组织架构', path: '' }
      ],
      //表单校验规则
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          {
            pattern: /[^ ]/,
            message: '不能为空格',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取部门等级
    getCompany(id) {
      this.$post(`${this.$store.state.basedataUrl}/company/getCompany`, {
        id
      }).then(data => {
        if (data.data.companyMenuDtos.length != 0) {
          this.treedData = data.data.companyMenuDtos
        } else {
          this.$router.push({ path: '/systemManagement/businessManagement' })
        }
        let companyData = data.data.companyMenuDtos
      })
    },
    // 增加子节点
    append(data) {
      let level = data.path.split('/').length - 2
      if (level >= 8) {
        this.$message.error('抱歉！部门级别最高八级')
      } else {
        this.nameLabel = '部门名称'
        this.permissionForm = {
          parentId: data.id,
          path: data.path
        }
        this.dialogVisible = true
        this.dialogTiltle = '增加'
      }
    },
    //修改节点
    modify(data) {
      //最高级别
      data.parentId == 0
        ? (this.nameLabel = '企业名称')
        : (this.nameLabel = '部门名称')

      this.dialogVisible = true
      this.dialogTiltle = '修改'
      this.permissionForm = {
        name: data.label,
        parentId: data.parentId,
        id: data.id
      }
    },
    //删除节点
    remove(node, data) {
      this.$confirm('您确定要删除此权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        //点击确定
        .then(() => {
          //删除接口
          this.$post(`${this.$store.state.basedataUrl}/company/deleteCompany`, {
            id: data.id
          }).then(data => {
            if (data.code == 200) {
              this.$message.info(data.msg)
              if (data.msg == '删除成功') {
                this.getCompany(this.id)
              }
            }
          })
        })
        //点击取消
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 取消表单提交
    cancel() {
      const vm = this
      vm.dialogVisible = false
      vm.$refs.permissionForm.resetFields()
      vm.$refs.permissionForm.clearValidate()
    },
    //提交表单
    submitForm(data) {
      const vm = this
      this.$refs.permissionForm.validate(valid => {
        if (valid) {
          if (this.dialogTiltle == '增加') {
            let url = `${this.$store.state.basedataUrl}/company/insertCompany`
            this.addModifyInterface(url, data)
          } else {
            let url = `${this.$store.state.basedataUrl}/company/updateCompany`
            this.addModifyInterface(url, data)
          }
          this.dialogVisible = false
        } else {
          this.$message.error('请填写完表单')
        }
      })
    },
    //添加(修改)接口
    addModifyInterface(url, paramData) {
      this.$post(url, paramData).then(data => {
        if (data.code == 200) {
          if (data.msg == '添加成功' || data.msg == '修改成功') {
            this.getCompany(this.id)
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.wrap {
  margin-top: 55px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node span:nth-child(2) {
  display: inline-block;
}
.el-select {
  width: 100%;
}
</style>
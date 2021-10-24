<template>
  <!-- 搜索运营公司 -->
  <div class="block">
  <div class="block">
      <el-form :model="editForm" ref="editForm">
        <el-form-item prop="vin2">
          <el-input
            v-model="editForm.vin2"
            prefix-icon="el-icon-search"
            placeholder="请输入vin码、车牌查询"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
  </div>
    <el-cascader
      :options="companyOptions"
      v-model="selectedOptions"
      @change="HandleChange"
      placeholder="请选择运营公司"
      clearable
      change-on-select
    ></el-cascader>
    <!-- 时间段选择 -->
    <div class="block">
      <el-date-picker
        v-model="date"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      ></el-date-picker>
    </div>
    <div class="block">
      <el-button size="small" type="primary" @click="SelectTime()">查询</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //  设置选择今天以及今天以前的日期(不能选择当天)
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      editForm: {
        vin2: ''
      },
      date: ['2019-06-01', '2019-06-18'],
      companyOptions: [], //运营公司选择器选项
      selectedOptions: [1, 5, 9],
      companyId: '',
      lastPath: '9'
    }
  },
  created() {
    this.getAllCompany()
    this.SelectTime()
  },
  methods: {
    // 时间查询
    SelectTime() {
      let vm = this
      let path = vm.selectedOptions.join('/') + '/'
      let beginTime = vm.date[0]
      let endTime = vm.date[1]
      endTime = endTime.replace(/-/g, '/')
      beginTime = beginTime.replace(/-/g, '/')
      let endTime2 = parseInt(new Date(endTime) / (1000 * 60 * 60 * 24))
      let beginTime2 = parseInt(new Date(beginTime) / (1000 * 60 * 60 * 24))
      let day = endTime2 - beginTime2
      if (day > 30) {
        alert('时间范围为30天')
      } else {
        let data = {
          beginTime: vm.date[0],
          endTime: vm.date[1],
          path: path,
          lastPath: vm.lastPath
        }
        this.$emit('listen', data)
      }
    },
    HandleChange(value) {
      this.lastPath = value[value.length - 1]
    },
    //所属机构
    getAllCompany() {
      this.$post(`${this.$store.state.basedataUrl}/company/getCompany`, {
        id: 0
      }).then(data => {
        const vm = this
        if (data.code === 200) {
          // //(data.data)
          let companyData = data.data.companyMenuDtos
          //删除子集为空的项
          deleteChildren(companyData)
          function deleteChildren(companyData) {
            for (let item in companyData) {
              if (companyData[item].children.length != 0) {
                let child = companyData[item].children
                deleteChildren(child)
              } else {
                delete companyData[item].children
              }
            }
          }

          this.companyOptions = data.data.companyMenuDtos
        }
      })
    }
  },
  props: {
    changeValue: {
      type: Object,
      default: function() {
        return {
          changeValue: []
        }
      }
    }
  },
  watch: {
    companyId(val) {
      this.$emit('companyId', val)
    },
    changeValue(val) {
      this.selectedOptions = val
    }
  }
}
</script>
<style scoped>
.block {
  display: inline-block;
  margin-left: 12px;
  margin-bottom: 10px;
}
</style>

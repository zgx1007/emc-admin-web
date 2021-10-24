<template>
  <!-- 搜索运营公司 -->
  <div class="block" style="width:200px;">
    <el-cascader
      expand-trigger="hover"
      :options="companyOptions"
      v-model="selectedOptions"
      @change="HandleChange"
      placeholder="请选择运营公司"
      :change-on-select="allowFather"
      clearable
    ></el-cascader>
  </div>
</template>
<script>
export default {
  created() {
    this.getAllCompany();
  },
  methods: {
    HandleChange(value) {
      this.companyId = value[value.length - 1];
    },
    //所属机构
    getAllCompany() {
      this.$post(`${this.$store.state.basedataUrl}/company/getCompany`, {
        id: 0
      }).then(data => {
        const vm = this;
        if (data.code === 200) {
          let companyData = data.data.companyMenuDtos;

          //删除子集为空的项
          deleteChildren(companyData);
          function deleteChildren(companyData) {
            for (let item in companyData) {
              if (companyData[item].children.length != 0) {
                let child = companyData[item].children;
                deleteChildren(child);
              } else {
                delete companyData[item].children;
              }
            }
          }

          this.companyOptions = data.data.companyMenuDtos;
        }
      });
    }
  },
  data() {
    return {
      companyOptions: [], //运营公司选择器选项
      selectedOptions: [],
      companyId: "",
      allowFather: true
    };
  },
  props: {
    changeValue: {
      type: Object,
      default: function() {
        return {
          changeValue: []
        };
      }
    }
  },
  watch: {
    companyId(val) {
      this.$emit("companyId", val);
    },
    changeValue(val) {
      this.selectedOptions = val;
    }
  }
};
</script>
<style scoped>
</style>

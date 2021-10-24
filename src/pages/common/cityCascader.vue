<template>
  <!-- 搜索运营公司 -->
  <div class="block" style="width:200px;">
    <el-cascader
      expand-trigger="hover"
      :options="options"
      v-model="selectedOptions"
      @change="handleChange"
      placeholder="请选择省会"
      :change-on-select="allowFather"
      clearable
    ></el-cascader>
  </div>
</template>
<script>
export default {
  created() {
    this.getAllCity();
  },
  methods: {
    handleChange(value) {
      this.cityCode = value;
      this.matchingCity(value[1]);
    },
    //获取所有城市
    getAllCity() {
      this.$post(`${this.$store.state.basedataUrl}/city/getAllCity`).then(
        data => {
          if (data.code === 200) {
            let res = data.data;

            this.options = [];
            this.allCity = data.data; //所有城市列表

            let allProvince = this.provincialDataProcessing(res); //已经过处理得省会数据
            this.writeSelector(allProvince); //遍历省将数据写入级联选择器

            //遍历市将数据写入级联选择器
            for (let res_item of res) {
              for (let options_item of this.options) {
                if (res_item.province == options_item.label) {
                  options_item.children.push({
                    value: res_item.code,
                    label: res_item.city
                  });
                }
              }
            }
          }
        }
      );
    },
    //遍历省会
    provincialDataProcessing(res) {
      let allProvince = [];
      for (let item of res) {
        allProvince.push(item.province);
      }
      let city = window._format.arrRemoveDuplicates(allProvince); //数组去重
      return city;
    },
    //遍历省将数据写入级联选择器
    writeSelector(allProvince) {
      for (let item of allProvince) {
        this.options.push({
          value: item,
          label: item,
          children: []
        });
      }
    },
    //匹配城市设置当前区域
    matchingCity(city) {
      for (let item of this.allCity) {
        if (city == item.code) {
          this.cityCode.push(item.city);
        }
      }
    }
  },
  data() {
    return {
      cityCode: [],
      allowFather: false,
      selectedOptions: [], //选择器选择项
      allProvince: [], //所有省会
      options: [],
      allCity: "" // 存储所有城市
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
    cityCode(val) {
      this.$emit("cityCode", val);
    },
    changeValue(val) {
      this.selectedOptions = val;
    }
  }
};
</script>
<style scoped>
</style>

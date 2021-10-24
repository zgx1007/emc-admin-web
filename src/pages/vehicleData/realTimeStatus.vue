<template>
  <div class="realTimeStatusOne">
    <!-- 省会、vin、运营公司查询 -->
    <realTimeDataSearchBox @search_tableData="search_tableData(arguments)"></realTimeDataSearchBox>
    <!-- 标签页 -->
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      type="border-card"
      style="margin-top:30px"
    >
      <template v-for="tab_item in eightDataTypes">
        <el-tab-pane v-for="(key,value) in tab_item" :label="key" :name="value" :key="value">
          <div class="realTimeTable">
            <realTimeDataTable :tableHeader="passedData" :tableData="tableData2" v-if="!tableShow"></realTimeDataTable>
            <driveDataTable :tableHeader="passedData" :tableData="tableData2" v-if="tableShow"></driveDataTable>
          </div>
        </el-tab-pane>
      </template>
    </el-tabs>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[5, 8, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalData"
        background
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import realTimeDataSearchBox from "@/pages/vehicleData/realTimeData/realTimeDataSearchBox";
import realTimeDataTable from "@/pages/vehicleData/realTimeData/realTimeDataTable";
import driveDataTable from "@/pages/vehicleData/realTimeData/driveDataTable";
export default {
  components: {
    realTimeDataSearchBox,
    realTimeDataTable,
    driveDataTable
  },
  created() {
    let city = window.sessionStorage.getItem("city");
    this.cityCode = window.sessionStorage.getItem("cityCode");
    this.$store.commit("changeBreadcumb", this.breadcrumb);
    this.getVehicleRealTimeInfo(); //获取所有实时数据
    this.getAllVehicleStandards(); //获取所有类别数据(标准项)
  },
  methods: {
    //获取所有类别数据(标准项)
    getAllVehicleStandards() {
      this.$post(
        `${this.$store.state.basedataUrl}/vehicleStandards/getNoNLatAndELong`
      ).then(data => {
        this.allData = data.data;
        this.getTypeName();
      });
    },
    //获取所有类型名称
    getTypeName() {
      let allTypes = [];
      for (let item of this.allData) {
        allTypes.push(item.category);
      }
      this.allTypeName = window._format.arrRemoveDuplicates(allTypes);

      //修改分类表头数据格式
      let typeName = this.allTypeName;
      let arrmap = typeName.map(function(val, index, arr) {
        let html = {
          [index]: val
        };
        return html;
      });
      this.eightDataTypes = arrmap;

      //循环标签页表头
      let length = this.allTypeName.length;
      for (let i = 0; i < length; i++) {
        this.typeData.push({
          [i]: []
        });
      }

      this.classification();
    },
    //把数据分类
    classification() {
      let length = this.allTypeName.length;
      for (let i = 0; i < length; i++) {
        this.typeData[i][i] = this.forClassification(this.allTypeName[i]);
      }
      this.passedData = this.typeData[this.activeName][this.activeName];
    },
    forClassification(name) {
      let data = [];
      let allData = this.allData;
      for (let item of allData) {
        if (name == item.category) {
          data.push({ [item.itemKey]: item.description });
        }
      }
      return data;
    },

    //查询接口
    searchInter({ vin, cityCode, companyId, page, pageSize }) {
      let data = {
        cityCode,
        vehicleVinOrNo: vin,
        companyId,
        page,
        pageSize
      };
      this.$post(
        `${
          this.$store.state.basedataUrl
        }/vehicleRealTime/getVehicleRealTimeInfo`,
        data
      ).then(data => {
        if (data.code === 200) {
          if (data.data) {
            this.tableData2 = data.data[0];
            this.totalData = data.data[1];
          } else {
            this.tableData2 = [];
            this.totalData = 0;
          }
        }
      });
    },
    //标签页选择
    handleClick(tab, event) {
      if (tab.name == 0) {
        this.tableShow = true;
      } else {
        this.tableShow = false;
      }
      this.passedData = this.typeData[tab.name][tab.name]; //修改表头数据
    },
    getRowClass({ column }) {
      return "background:#eee;color:#333";
    },
    //查询所有实时数据
    getVehicleRealTimeInfo() {
      // let cityCode = "";
      let cityCode = this.cityCode;
      let vin = "";
      let page = 1;
      let pageSize = 20;
      let data = {
        cityCode,
        vehicleVinOrNo: vin,
        companyId: "",
        page,
        pageSize
      };
      this.$post(
        `${
          this.$store.state.basedataUrl
        }/vehicleRealTime/getVehicleRealTimeInfo`,
        data
      ).then(data => {
        if (data.code === 200) {
          if (data.data) {
            this.tableData2 = data.data[0];
            this.totalData = data.data[0].length;
          }
        }
      });
    },
    //查询vin修改表格数据
    search_tableData(event) {
      this.currentPage = 1;
      this.vin = event[0];
      this.cityCode = event[1];
      this.companyId = event[2];
      this.changeQueryParameter(); //调查询接口
    },
    //分页方法(切换每页条数)
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.changeQueryParameter();
    },
    //分页方法(切换页数)
    handleCurrentChange(val) {
      this.currentPage = val;
      this.changeQueryParameter();
    },
    //查询参数改变之后调查询接口
    changeQueryParameter() {
      let vin = this.vin;
      let cityCode = this.cityCode;
      let companyId = this.companyId;
      let page = this.currentPage;
      let pageSize = this.pageSize;
      this.searchInter({ vin, cityCode, companyId, page, pageSize });
    }
  },
  data() {
    return {
      passedData: [], //传递到表格的的数据
      vehicleType: [], //车型的值
      currentPage: 1, //当前页
      totalData: 0, //总条目数
      pageSize: 8,
      page: 1,
      vin: "",
      cityCode: "",
      companyId: "",
      breadcrumb: [], // 面包屑
      allData: [], //从后台获取的全部数据项
      activeName: 0, //打开的选项卡的值，为对应el-tab-pane的name值
      typeData: [], //标签页类型数据
      tableData2: [], //表格数据
      allTypeName: [],
      // 实时数据类型
      eightDataTypes: [],
      tableShow: true
    };
  }
};
</script>
<style scoped>
.realTimeStatusOne .el-input__inner {
  width: 500px;
}
.realTimeStatusOne .el-tabs el-tabs--top {
  margin-top: 30px;
}
.page {
  margin-top: 20px;
  text-align: right;
}
</style>

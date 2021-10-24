<template>
  <div id="vehicleBasicInfoTable">
    <div style="margin-bottom:20px">
      <!-- 添加车辆 -->
      <el-button type="primary" @click.stop="addVehicle(0,1)" style>添加车辆</el-button>
      <!-- 批量导入车辆 -->
      <el-dropdown trigger="click">
        <el-button type="primary" :loading="importLoading">
          批量导入车辆
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-success="uploadSuccess"
              :before-upload="beforeUpload"
              :show-file-list="showList"
              multiple
              accept=".xls, .xlsx"
              :headers="uploadHeaders"
              :file-list="fileList"
            >选择文件导入</el-upload>
          </el-dropdown-item>
          <el-dropdown-item>
            <a href="../../../static/车辆基本信息表模板.xls" download="模板.xls" class="download">下载导入模板</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 批量导入车辆返回的信息dialog -->
      <el-dialog title="导入成功" :visible.sync="dialogTableVisible">
        <div style="margin:10px 0">部分导入成功,失败数据如下：</div>
        <el-table :data="gridData" border max-height="500px" style="overflow: overlay;width:100%">
          <el-table-column property="lineId" label="excel表格对应行数" align="center"></el-table-column>
          <el-table-column property="message" label="错误类型" align="center"></el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <!-- 搜索块 -->
    <vehicleListSearchBox @search_box="searchBox(arguments)" @vehicle_type="vehicleAllType($event)"></vehicleListSearchBox>
    <!-- <div class="city">当前城市：{{currentCity}}</div> -->

    <!-- 车辆列表表格 -->
    <div class="table_c" id="table_c">
      <el-table
        :data="tableData2"
        border
        style="width: 100%;"
        :row-class-name="tableRowClassName"
        :row-style="{background:'white',color:'#606266'}"
        :header-cell-style="{background:'#D4D4D4',color:'#333'}"
        v-loading="loading"
      >
        <!-- 每一列 -->
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="vin" label="VIN码" width="200px" align="center"></el-table-column>
        <el-table-column prop="vehicleNo" label="车牌号" align="center"></el-table-column>
        <el-table-column
          prop="companyId"
          label="运营公司"
          align="center"
          width="150px"
          :formatter="formatCompany"
        ></el-table-column>
        <template v-for="dataFieldName_item in dataFieldName">
          <el-table-column
            v-for="(key,value) in dataFieldName_item"
            :prop="value"
            :label="key"
            :key="value"
            align="center"
            :class="value"
            :formatter="isNull"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </template>
        <!-- <el-table-column prop="produceDate" label="生产日期" align="center" :formatter="formatDate"></el-table-column>
        <el-table-column prop="outfactoryDate" label="出厂日期" align="center" :formatter="formatDate"></el-table-column>-->
        <!-- 每一行数据的操作 -->
        <el-table-column
          label="操作"
          style="display: flex;flex-direction: column;width: 60%;"
          width="200px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="ViewRealTimeData(scope.row)"
              :disabled="scope.row.status == '0'"
            >查看</el-button>
            <el-button type="text" @click="addVehicle(1,scope.row)">修改</el-button>
            <el-button type="text" @click="deleteVehicle(scope.row.vin)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage3"
          :page-sizes="[8, 15, 20, 30]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalData"
          background
        ></el-pagination>
      </div>

      <!-- 车辆信息操作dialog弹框开始 -->
      <vehicleListTableDialog
        :companyData="companyOptions"
        :vehicleTypeData="vehicleCategoryOptions"
        :cityCodeData="options"
        :allCity="allCity"
        :matchData="matchData"
        ref="vehicleListTableDialog"
        @refreshTable="refreshTable($event)"
      ></vehicleListTableDialog>
    </div>
  </div>
</template>


<script>
import vehicleListSearchBox from "@/pages/vehicleData/vehicleListSearchBox.vue";
import vehicleListTableDialog from "@/pages/vehicleData/vehicleListTableDialog.vue";

export default {
  //页面初始化
  created() {
    this.getAllCity(); //获取所有省会信息
    this.getAllCompany(); //获取所有机构(运营公司)
    this.getAllVehicleType(); //获取所有车辆类别
    this.queryValueChange(1); //进入页面获取所有车辆基本信息
    this.currentCity = window.sessionStorage.getItem("city");
    this.$store.commit("changeBreadcumb", this.breadcrumb);
  },
  components: {
    vehicleListSearchBox,
    vehicleListTableDialog
  },
  methods: {
    //表格选中类名
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    //分页方法(切换每页条数)
    handleSizeChange(val) {
      this.pageItem = val;
      this.currentPage3 = 1;
      this.queryValueChange(1);
    },
    //分页方法(切换页数)
    handleCurrentChange(val) {
      this.queryValueChange(val);
    },
    //查询值改变
    queryValueChange(pageValue) {
      let page = pageValue;
      let vin = this.vin;
      let pageSize = this.pageItem;
      let cityCode = this.cityCode;
      let companyId = this.companyId;
      let vehicleType = this.vehicleType;
      let vehicleBrand = this.vehicleBrand;
      let vehicleModel = this.vehicleModel;
      this.allSearchInterFace({
        vin,
        cityCode,
        page,
        pageSize,
        companyId,
        vehicleType,
        vehicleBrand,
        vehicleModel
      });
    },
    //所有查询的接口
    allSearchInterFace({
      vin,
      cityCode,
      page,
      pageSize,
      companyId,
      vehicleType,
      vehicleBrand,
      vehicleModel
    }) {
      let data = {
        vin,
        cityCode,
        page,
        pageSize,
        companyId,
        vehicleType,
        vehicleBrand,
        vehicleModel
      };
      this.$post(
        `${this.$store.state.basedataUrl}/vehicle/getVehicleListByPage`,
        data
      ).then(data => {
        if (data.code === 200) {
          if (data.data) {
            this.totalData = data.data[1];
            this.dataProcessing(data.data[0]); //统一数据处理
          } else {
            this.tableData2 = [];
            this.totalData = 0;
          }
        }
      });
    },
    //搜索框
    searchBox(event) {
      this.currentPage3 = 1;
      this.vin = event[0];
      this.companyId = event[1];
      this.cityCode = event[2];
      this.vehicleType = event[3];
      this.vehicleBrand = event[4];
      this.vehicleModel = event[5];
      this.queryValueChange(1);
    },
    //车辆的所有类型
    vehicleAllType(event) {
      this.allVehicleType = event;
    },
    // 获取所有省会城市
    getAllCity() {
      this.$post(`${this.$store.state.basedataUrl}/city/getAllCity`).then(
        data => {
          if (data.code === 200) {
            let res = data.data;

            this.options = [];
            let allCity = []; //所有城市列表
            this.allCity = data.data;

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
      for (let item in res) {
        allProvince.push(res[item].province);
      }
      let city = window._format.arrRemoveDuplicates(allProvince); //数组去重
      return city;
    },
    //遍历省将数据写入级联选择器
    writeSelector(allProvince) {
      for (let item in allProvince) {
        this.options.push({
          value: allProvince[item],
          label: allProvince[item],
          children: []
        });
      }
    },
    // 统一数据处理放入表格
    dataProcessing(data) {
      if (data.length > 0) {
        //生产和出厂日期格式转换
        // for (let i = 0; i < data.length; i++) {
        //   if (data[i].produceDate || data[i].outfactoryDate) {
        //     data[i].produceDate = window._format.dataToYMD(data[i].produceDate);
        //     data[i].outfactoryDate = window._format.dataToYMD(
        //       data[i].outfactoryDate
        //     );
        //   }
        // }
        this.tableData2 = data;
      } else if (data.length == 0) {
        this.tableData2 = [];
      } else {
        //一条数据
        // if (data.produceDate || data.outfactoryDate) {
        //   data.produceDate = window._format.dataToYMD(data.produceDate);
        //   data.outfactoryDate = window._format.dataToYMD(data.outfactoryDate);
        // }
        this.tableData2 = [data];
        this.totalData = 1;
        this.tableData2[0].index = 1;
      }
    },
    // 查看实时数据
    ViewRealTimeData(res) {
      let vehicleVinOrNo = res.vin;
      //路由传参
      this.$router.push({
        name: "车辆详情",
        params: {
          vin: vehicleVinOrNo,
          companyData: this.matchData,
          allVehicleType: this.allVehicleType,
          status: 1
        }
      });
    },
    // 添加车辆
    addVehicle(statu, data) {
      this.$refs.vehicleListTableDialog.formDialogVisible = true; //修改子组件data里面的数据
      let formData = JSON.parse(JSON.stringify(data));
      this.$refs.vehicleListTableDialog.setFormValue(statu, formData);
    },
    //弹窗子组件刷新表格
    refreshTable(event) {
      this.queryValueChange(event);
    },
    // 删除车辆按钮
    deleteVehicle(res) {
      this.$confirm("是否确定删除这条车辆数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post(
            `${
              this.$store.state.basedataUrl
            }/vehicle/deleteVehicleInfoByVin?vin=${res}`
          ).then(data => {
            if (data.code === 200) {
              this.$message({
                type: "success",
                message: data.msg
              });
              //删除成功之后重新获取所有车辆信息
              this.currentPage3 = 1;
              let page = 1;
              this.queryValueChange(page);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 上传成功(失败)
    uploadSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.importLoading = false;
        this.$message.success(response.msg);
        if (response.msg != "批量导入成功") {
          this.dialogTableVisible = true;
          this.gridData = response.data;
        }
      } else {
        this.importLoading = false;
        this.$message.error(`文件【${file.name}】上传失败，${response.msg}`);
      }
    },
    //上传前
    beforeUpload() {
      this.importLoading = true;
    },
    // 上传文件格式
    fileType(file) {
      let fileName = file.name.substring(file.name.lastIndexOf(".") + 1);
      const type1 = fileName === "xls";
      const type2 = fileName === "xlsx";
      if (!type1 && !type2) {
        this.$message.error("上传文件只能是 xls/xlsx 格式！");
      }
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
            for (let item of companyData) {
              if (item.children.length != 0) {
                let child = item.children;
                deleteChildren(child);
              } else {
                delete item.children;
              }
            }
          }

          this.companyOptions = data.data.companyMenuDtos;
          this.matchData = data.data.companyDtos; //未封装的数据
        }
      });
    },

    //日期格式转换
    formatDate(row, column) {
      // row[column.property] 能读取到该行该列的数据
      var date = new Date(row[column.property]);
      return (
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      );
    },
    //运营公司格式转换
    formatCompany(row, column) {
      var id = row[column.property];
      for (let item of this.matchData) {
        if (id == item.id) {
          return item.label;
        }
      }
    },
    //车辆类别(级联选择)
    getAllVehicleType() {
      const vm = this;
      vm.$post(`${vm.$store.state.basedataUrl}/vehicleTypeInfo/getLevel`).then(
        data => {
          if (data.code === 200) {
            vm.vehicleCategoryOptions = data.data;
          }
        }
      );
    },
    isNull(row, column) {
      var value = row[column.property];
      return value == null ? "--" : value;
    }
  },
  data() {
    return {
      showList: false,
      tableData2: [], //表格数据
      tableData: [],
      loading: false, //加载
      vehicleCategoryOptions: [], //类别
      allProvince: [], //所有省会
      options: [], //搜索省会
      vin: "", //输入框值
      currentPage3: 1, //当前页
      totalData: 100, //总条目数
      pagesize: 12, // 分页默认
      pageItem: 8,
      fileList: [],
      uploadUrl: `${this.$store.state.basedataUrl}/vehicle/upload`,
      uploadHeaders: { token: `${this.$store.state.token}` },
      importLoading: false, //导入加载
      companyOptions: [], //运营公司选择器选项
      companyId: "", //选择运营公司
      breadcrumb: [], // 面包屑
      dialogTableVisible: false, //批量导入
      cityCode: "",
      allCity: [],
      matchData: [],
      gridData: [],
      allVehicleType: [],
      //表格字段的键值
      dataFieldName: [
        // { vin: "vin码" },
        // { vehicleNo: "车牌号" },
        // { companyId: "运营公司id" },
        // { companyId: "运营公司" },
        { vehicleType: "车辆类型" },
        { vehicleBrand: "车辆品牌" },
        { vehicleModel: "车辆型号" },
        { cityCode: "城市编号" },
        { produceDate: "生产日期" },
        { outfactoryDate: "出厂日期" }
      ]
    };
  }
};
</script>
<style scoped>
.el-table .warning-row {
  background: #5470ec;
}

.el-table .success-row {
  background: #5470ec;
}

.input-with-select {
  width: 200px;
  margin-left: 10px;
}

.el-table,
.el-table__expanded-cell {
  background-color: #1b96c72c;
}

.table_c {
  width: 100%;
  height: 100%;
  background-size: 100% auto;
  margin-top: 20px;
}

/* 分页 */
/* .el-pagination {
} */
.block {
  display: inline-block;
  margin-left: 10px;
  width: 160px;
}
.el-table__row :hover {
  cursor: pointer;
}
.addDialog .el-form-item__label {
  float: left;
  color: #409eff;
}
.cell {
  display: flex;
  flex-direction: column;
  width: 50%;
}
.page {
  margin-top: 20px;
  text-align: right;
}
.vin {
  width: 300px;
}
.city {
  float: right;
  height: 40px;
  line-height: 40px;
}
#vehicleBasicInfoTable .el-select {
  width: 130px;
  margin-left: 10px;
}

.download {
  text-decoration: none;
  color: #606266;
  width: 100%;
  text-align: center;
  display: inline-block;
}
.download:hover {
  color: #66b1ff;
}
</style>
<style>
.el-upload-list {
  position: absolute;
  left: 130px;
  top: -3px;
}

#table_c .outfactoryDate {
  background: #f09494;
  color: #fff;
}
</style>

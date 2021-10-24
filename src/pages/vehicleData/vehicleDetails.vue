<template>
  <div class="realTimeStatusOne">
    <!-- 搜索vin输入框 -->
    <el-input
      clearable
      placeholder="请输入vin码 、车牌号"
      class="input-with-select"
      v-model="vehicleVinOrNo"
      style="width:25%"
    >
      <el-button slot="append" icon="el-icon-search" @click="seach()"></el-button>
    </el-input>

    <div class="basicInfo">
      <div class="logo">
        <img src="../../assets/realbus.png" alt="logo" />
      </div>
      <div class="data">
        <div>
          <p>
            <span class="title">车牌号：</span>
            <span>{{basicData.vehicleNo}}</span>
          </p>
          <p>
            <span class="title">VIN码：</span>
            <span>{{basicData.vin}}</span>
          </p>
        </div>
        <div>
          <p>
            <span class="title">运营路线：</span>
            <span>{{basicData.line}}</span>
          </p>
          <p>
            <span class="title">所属机构：</span>
            <span>{{basicData.companyId | formatCompany}}</span>
          </p>
        </div>
        <div>
          <p>
            <span class="title">车辆品牌：</span>
            <span>{{basicData.vehicleTypeId | formatVehicleBrand}}</span>
          </p>
          <p>
            <span class="title">更新时间：</span>
            <span>{{realData.uploadTime}}</span>
            <!-- <span v-if="showData">暂无数据</span> -->
          </p>
        </div>
      </div>
    </div>
    <!-- 标签页 -->
    <el-tabs style="margin-top:20px">
      <el-tab-pane label="整车数据">
        <h3 v-if="showData">暂无数据</h3>
        <completeVehicleData :realData="realData" v-if="!showData" v-show="tabShow"></completeVehicleData>
      </el-tab-pane>
      <el-tab-pane label="报警数据">
        <h3 v-if="showData">暂无数据</h3>
        <alarmData :realData="realData" :tableField="alarmData" v-show="tabShow"></alarmData>
      </el-tab-pane>
      <el-tab-pane label="驱动电机数据">
        <h3 v-if="showData">暂无数据</h3>
        <driveMotorDataType
          :realData="realData.driveMotorList"
          :tableField="driveMotorDataType"
          v-show="tabShow"
        ></driveMotorDataType>
      </el-tab-pane>
      <el-tab-pane label="极值数据">
        <h3 v-if="showData">暂无数据</h3>
        <extremeData :realData="realData" :tableField="extremeData" v-show="tabShow"></extremeData>
      </el-tab-pane>
      <el-tab-pane label="车辆位置数据">
        <h3 v-if="showData">暂无数据</h3>
        <locationInfor :realData="realData" v-show="tabShow"></locationInfor>
      </el-tab-pane>
      <el-tab-pane label="燃料电池">
        <h3 v-if="showData">暂无数据</h3>
        <theFuelCell :realData="realData" :tableField="theFuelCell" v-show="tabShow"></theFuelCell>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import completeVehicleData from '@/pages/vehicleData/vehicleDetails/completeVehicleData'
import theFuelCell from '@/pages/vehicleData/vehicleDetails/theFuelCell'
import alarmData from '@/pages/vehicleData/vehicleDetails/alarmData'
import driveMotorDataType from '@/pages/vehicleData/vehicleDetails/driveMotorDataType'
import extremeData from '@/pages/vehicleData/vehicleDetails/extremeData'
import locationInfor from '@/pages/vehicleData/vehicleDetails/locationInfor'

var _this
export default {
  components: {
    completeVehicleData, //整车数据
    theFuelCell, //燃料电池
    alarmData, //报警数据
    driveMotorDataType, //驱动电机数据
    extremeData, //极值数据
    locationInfor //位置信息
  },
  filters: {
    formatCompany: function(value) {
      if (value) {
        let matchData = _this.matchData
        return _this.matchDataFun(_this.matchData, 'id', value, 'label')
      }
    },
    formatVehicleBrand: function(value) {
      return _this.matchDataFun(
        _this.allVehicleType,
        'vehicleTypeId',
        value,
        'vehicleBrand'
      )
    },
    formatDate: function(value) {
      return window._format.dataToYMD(value)
    }
  },
  created() {
    let status = this.$route.params.status
    return status == 0
      ? this.$store.commit('changeBreadcumb', this.vehicleMapBreadcrumb)
      : status == 1
      ? this.$store.commit('changeBreadcumb', this.vehicleListBreadcrumb)
      : ''
  },
  mounted() {
    let vin = this.$route.params.vin
    this.matchData = this.$route.params.companyData
    this.allVehicleType = this.$route.params.allVehicleType
    this.getAllVehicleType()
    this.getAllCompany()
    this.getAllVehicleStandards() //获取标准项数据
    this.queryVehicleInfo(vin)
    this.queryVehicleRealTimeData(vin)
  },
  beforeCreate() {
    _this = this
  },
  methods: {
    // vin码或是车牌号查询车辆实时数据
    queryVehicleRealTimeData(vin) {
      let vehicleVinOrNo = vin
      this.$post(
        `${
          this.$store.state.basedataUrl
        }/vehicleRealTime/getVehicleRealTimeByVinOrNo?vehicleVinOrNo=${vehicleVinOrNo}`
      ).then(data => {
        if (data.code == 200) {
          // this.$message.success(data.msg);
          if (data.data) {
            this.realData = data.data
            this.showData = false
            this.tabShow = true
          } else {
            this.realData = {}
            this.tabShow = false
            this.showData = true
          }
        }
      })
    },
    //查询车辆基本信息
    queryVehicleInfo(vehicleVinOrNo) {
      this.$post(
        `${
          this.$store.state.basedataUrl
        }/vehicle/getVehicleByVinOrNo?vehicleVinOrNo=${vehicleVinOrNo}`
      ).then(data => {
        if (data.code === 200) {
          if (data.data) {
            this.basicData = data.data
            // this.tabShow = true;
          } else {
            this.basicData = []
            // this.tabShow = false;
          }
        }
      })
    },
    //查询
    seach() {
      let vin = window._format.trim(this.vehicleVinOrNo)
      if (vin) {
        this.queryVehicleRealTimeData(vin)
        this.queryVehicleInfo(vin)
      } else {
        this.$message.error('请输入查询条件')
      }
    },
    //数据转换函数
    matchDataFun(data, key, value, returnKey) {
      // data:转换的对比数据 key:对比key value:传过来的值, returnKey：返回的key;
      for (let item in data) {
        if (data[item][key] == value) {
          return data[item][returnKey]
        }
      }
    },
    //获取标准项数据
    getAllVehicleStandards() {
      // getVehicleStandards
      this.$post(
        `${this.$store.state.basedataUrl}/vehicleStandards/getVehicleStandards`
      ).then(data => {
        let dataAll = []
        this.allTypesData = dataAll
        this.allTypesData = data.data
        this.getTypeName()
      })
    },
    //获取所有类型名称
    getTypeName() {
      let allTypes = []
      for (let item of this.allTypesData) {
        allTypes.push(item.category)
      }
      this.allTypeName = window._format.arrRemoveDuplicates(allTypes)
      this.classification()
    },
    //把数据分类
    classification() {
      this.driveMotorDataType = this.forClassification(this.allTypeName[0])
      this.completeVehicleData = this.forClassification(this.allTypeName[1])
      this.extremeData = this.forClassification(this.allTypeName[2])
      this.alarmData = this.forClassification(this.allTypeName[3])
      this.locationInfor = this.forClassification(this.allTypeName[4])
      this.theFuelCell = this.forClassification(this.allTypeName[5])
      this.engineData = this.forClassification(this.allTypeName[6])
    },
    forClassification(name) {
      let data = []
      let allData = this.allTypesData

      for (let item of this.allTypesData) {
        if (name == item.category) {
          data.push({ [item.itemKey]: item.description })
        }
      }
      return data
    },
    //车辆类别(级联选择)
    getAllVehicleType() {
      const vm = this
      vm.$post(
        `${vm.$store.state.basedataUrl}/vehicleTypeInfo/getAllVehicleType`
      ).then(data => {
        if (data.code === 200) {
          vm.allVehicleType = data.data
        }
      })
    },
    //所属机构
    getAllCompany() {
      this.$post(`${this.$store.state.basedataUrl}/company/getCompany`, {
        id: 0
      }).then(data => {
        const vm = this
        if (data.code === 200) {
          this.matchData = data.data.companyDtos //未封装的数据
        }
      })
    }
  },
  data() {
    return {
      realData: {}, //车辆实时数据
      basicData: {}, //车辆基本信息
      vehicleVinOrNo: '', // 输入框值
      tabShow: false,
      showData: false,
      companyData: [],
      matchData: [],
      allFields: [],
      allTypesData: [], //所有分类
      allTypeName: [],
      completeVehicleData: [], //整车数据
      theFuelCell: [], //燃料电池
      alarmData: [], //报警数据
      driveMotorDataType: [], //驱动电机数据
      engineData: [], //发动机数据
      extremeData: [], //极值数据
      locationInfor: [], //位置信息
      // 车辆列表面包屑
      vehicleListBreadcrumb: [
        { name: '车辆管理', path: '' },
        { name: '车辆列表', path: '/vehicleData/vehicleList' },
        { name: '车辆详情', path: '' }
      ],
      // 实时位置面包屑
      vehicleMapBreadcrumb: [
        { name: '车辆管理', path: '' },
        { name: '实时位置', path: '/vehicleData/vehicleMap' },
        { name: '车辆详情', path: '' }
      ]
    }
  },
  watch: {
    realData(val) {
      this.realData = val
    },
    allFields(val) {
      this.allFields = val
    },
    basicData(val) {}
  }
}
</script>
<style scoped>
.basicInfo {
  position: relative;
}
.data {
  background: #d1effc;
  font-size: 1.4em;
  padding: 20px;
  border-radius: 30px;
  display: flex;
  margin: 20px 0 30px 38px;
  height: 74px;
  padding-left: 90px;
}
.data .title {
  color: #7f7f7f;
}
.data div {
  margin-top: -20px;
  flex-grow: 1;
}
.logo {
  background: #0f8ee7;
  border-radius: 70px;
  padding: 20px;
  display: inline-block;
  position: absolute;
}
.logo img {
  width: 70px;
}
</style>

<template>
  <div class="theFuelCell" v-if="pageData">
    <!-- <div class="top">
      <template v-for=" warningField_item in  warningField">
        <div v-for="(key,value) in  warningField_item" :key="value" class="border_left">
          <h3 class="title">{{key}}</h3>
          <h3 class="value">{{topTitle[value]}}</h3>
        </div>
      </template>
    </div>-->

    <div class="bottom">
      <stripeTable :tableFlels="leftTable" :tableData="pageData"></stripeTable>
      <stripeTable :tableFlels="rightTable" :tableData="pageData" style="marginLeft:2%"></stripeTable>
    </div>
  </div>
</template>
<script>
import stripeTable from "@/pages/vehicleData/vehicleDetails/stripeTable";
export default {
  components: {
    stripeTable
  },
  created() {},
  methods: {
    forClassification(type, start, end) {
      for (let i = start; i <= end; i++) {
        type.push(this.tableField[i]);
      }
    }
  },
  data() {
    return {
      pageData: this.realData,
      leftTable: [],
      rightTable: [],
      warningField: [
        { remainingBattery: "一级预警次数" },
        { fuelConsumptionRate: "二级预警次数" },
        { estimatedDrivingTime: "三级预警次数" },
        { fuelCellVoltage: "待处理预警数" },
        { fuelCellCurrent: "设备维修次数" },
        { remainingBattery: "待处理维修数" }
      ]
    };
  },
  props: {
    realData: {
      type: Object,
      required: true
    },
    tableField: {
      type: Array,
      required: true
    }
  },
  watch: {
    realData(val) {
      this.pageData = val;
    },
    tableField(val) {
      this.tableField = val;
      let length = this.tableField.length;
      let half = Math.ceil(length / 2);
      this.forClassification(this.leftTable, 0, half - 1);
      this.forClassification(this.rightTable, half, length);
    }
  }
};
</script>
<style scoped>
.top {
  display: flex;
}
.top div {
  border: 1px solid #ec808d;
  border-left: beige;
  padding: 20px 30px;
  flex-grow: 1;
}
.top .title {
  color: #7f7f7f;
}
.top .value {
  color: #ec808d;
}
.top h3 {
  text-align: center;
}
.border_left:first-child {
  border-left: 1px solid #ec808d;
}
.bgc {
  background: #eee;
}
.bottom {
  /* font-size: 1.2em; */
  display: flex;
}
.bottom .title {
  display: inline-block;
  width: 50%;
}
.bottom .value {
  display: inline-block;
  width: 40%;
}
.bottom span {
  border: 1px #d4d4d4 solid;
  padding: 20px 10px;
}
.bottom .value {
  margin-left: -6px;
}
.left {
  flex-grow: 1;
}
.right {
  flex-grow: 1;
}
</style>

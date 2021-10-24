<template>
  <div>
    <div class="top" v-for="num_item in num" :key="num_item">
      <template v-for="driveMotorField_item in driveMotorField">
        <div
          v-for="(key,value) in driveMotorField_item"
          :key="value"
          :class="{blue:true,gray:realData[num_item].driveMotorStatus == 3}"
        >
          <h3 class="title">{{key}}</h3>
          <h3 class="value" v-if="realData!==undefined">{{realData[num_item][value]}}</h3>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      num: [], //电机个数
      driveMotorField: [
        { driveMotorNo: "序号" },
        { driveMotorStatus: "运行状态" },
        { driveMotorSpeed: "转速" },
        { driveMotorTorque: "转矩" },
        { driveMotorTemperature: "温度" },
        { motorCtrlInputVoltage: "控制器输入电压" },
        { motorCtrlDcBusbarCurrent: "控制器直流母线电流" },
        { driveMotorCtrlTemperature: "控制器温度" }
      ],
      isGray: false
    };
  },
  props: {
    realData: {
      type: Array
    }
  },
  watch: {
    realData(val) {
      this.realData = val;
      this.num = [];
      if (val && val.length != 0) {
        for (let item in val) {
          this.num.push(item);
        }
      }
    }
  }
};
</script>
<style scoped>
.top {
  display: flex;
  margin-bottom: 20px;
}
.top div {
  padding: 20px 30px;
  flex-grow: 1;
}

.blue {
  border: 1px solid #2bb453;
  border-left: beige;
  color: #2bb453;
}

.blue:first-child {
  border-left: 1px solid #2bb453;
}

.gray {
  border: 1px solid #7f7f7f;
  border-left: beige;
  color: #7f7f7f;
}

.gray:first-child {
  border-left: 1px solid #7f7f7f;
}

.top .title {
  color: #7f7f7f;
}

.top h3 {
  text-align: center;
}
.bottom {
  margin-top: 30px;
}
</style>

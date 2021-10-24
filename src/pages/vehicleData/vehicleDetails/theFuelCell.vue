{<template>
  <div class="theFuelCell">
    <div class="top">
      <template v-for=" topTable_item in  topTable">
        <div v-for="(key,value) in  topTable_item" :key="value" class="border_left">
          <h3 class="title">{{key}}</h3>
          <h3 class="value">{{realData[value] | formatData}}</h3>
        </div>
      </template>
    </div>
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
  filters: {
    formatData: function(value) {
      return value === "" ? "--" : value;
    }
  },
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
      // tableField: [],
      topTable: [],
      leftTable: [],
      rightTable: []
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
      let length = this.tableField.length - 3;
      let half = Math.ceil(length / 2);
      this.forClassification(this.topTable, 0, 2);
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
  border: 1px solid #2bb453;
  border-left: beige;
  padding: 20px 30px;
  flex-grow: 1;
}
.top .title {
  color: #7f7f7f;
}
.top .value {
  color: #09a838;
}
.top h3 {
  text-align: center;
}
.border_left:first-child {
  border-left: 1px solid #2bb453;
}

.bottom {
  margin-top: 20px;
  display: flex;
}

/* 表格样式 */
table {
  border: 1px solid #d6d6d6;
  border-collapse: collapse;
  width: 49%;
}
table td {
  border: 1px solid #d6d6d6;
}
table td {
  padding: 20px;
}
.bgc {
  background: #f0f0f0;
}
</style>

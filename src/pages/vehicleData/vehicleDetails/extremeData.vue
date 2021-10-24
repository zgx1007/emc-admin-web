<template>
  <div class="extremeData" v-if="pageData">
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
  display: -webkit-inline-box;
  width: 100%;
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

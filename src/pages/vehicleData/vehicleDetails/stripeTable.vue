<template>
  <table>
    <template v-for=" (tableFlels_item,index) in  tableFlels">
      <tr v-for="(key,value) in  tableFlels_item" :key="value" :class="{bgc:index%2 == 1}">
        <td class="title">{{key}}</td>
        <td class="value">{{tableData[value] | formatData}}</td>
      </tr>
    </template>
  </table>
</template>
<script>
export default {
  methods: {},
  filters: {
    formatData: function(value) {
      return value === "" ? "--" : value;
    }
  },
  data() {
    return {
      pageData: this.tableData
      // tableFlels: []
    };
  },
  props: {
    tableData: {
      type: Object,
      required: true
    },
    tableFlels: {
      type: Array,
      required: true
    }
  },
  watch: {
    tableData(val) {
      this.pageData = val;
    },
    tableFlels(val) {
      this.tableFlels = val;
    }
  }
};
</script>
<style scoped>
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

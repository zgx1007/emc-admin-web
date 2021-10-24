<template>
  <div>
    <div>
      <el-table :data="tableData" border style="width:100%" align="center" id="out-table">
        <el-table-column prop="carID" label="车牌" align="center"></el-table-column>
        <el-table-column prop="vin" label="Vin码" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" align="center"></el-table-column>
        <el-table-column prop="onlineTime" label="在线时长(h)" align="center"></el-table-column>
        <el-table-column prop="svgMileage" label="日行驶里程(km)" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 分页显示 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10,20, 30,40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      prev-text="上一页"
      next-text="下一页"
      :total="total"
      background
    ></el-pagination>
    <!-- 分页显示 -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      total: 10,
      currentPage: 1,
      pageSize: 10,
      companyOptions: [], //运营公司选择器选项
      selectedOptions: [],
      operatingCompany: '', //选择运营公司
      value1: '',
      // 单部车辆详情表格
      tableData: [
        {
          carID: 'HESJ1234',
          vin: 2452,
          state: '在线',
          time: 12,
          onlineTime: 1293,
          svgMileage: 3246
        }
      ],
      // 面包屑
      breadcrumb: [
        { name: '统计分析', path: '' },
        {
          name: '车辆运行统计',
          path: '/statisticalAnalysis/vehicleOperationStatistics'
        },
        { name: '车辆明细', path: '' }
      ]
    }
  },
  components: {},
  created() {
    this.review()
    this.$store.commit('changeBreadcumb', this.breadcrumb)
  },
  methods: {
    review() {
      //('查看')
      const vm = this
      vm.tableData = []
      let date = this.$route.query.operationDate
      let path = this.$route.query.operationPath
      let data = {
        page: 1,
        num: this.pageSize,
        date: date,
        lastPath: path
      }
      //(data)
      vm.$post(
        `${vm.$store.state.basedataUrl}/statistics/getBusDetailsInfo`,
        data
      ).then(r => {
        if (r.code === 200) {
          //(r)
          this.total = r.data.total
          this.tableData = r.data.dataList
          //(data)
        } else {
          //('查询getBusDetailsInfo失败')
        }
      })
    },
    // 分页方法
    handleSizeChange: function(size) {
      const vm = this
      vm.tableData = []
      let date = this.$route.query.operationDate
      let path = this.$route.query.operationPath
      let data = {
        page: this.currentPage,
        num: size,
        date: date,
        lastPath: path
      }
      //(data)
      vm.$post(
        `${vm.$store.state.basedataUrl}/statistics/getBusDetailsInfo`,
        data
      ).then(r => {
        if (r.code === 200) {
          //(r.data.dataList)
          this.total = r.data.total
          this.tableData = r.data.dataList
          //(data)
        } else {
          //('查询getBusDetailsInfo失败')
        }
      })
      this.pageSize = size
      this.currentPage = 1
      //('一页多少条' + size)
    },
    handleCurrentChange: function(currentPage) {
      const vm = this
      vm.tableData = []
      let date = this.$route.query.operationDate
      let path = this.$route.query.operationPath
      let data = {
        page: currentPage,
        num: this.pageSize,
        date: date,
        lastPath: path
      }
      //(data)
      vm.$post(
        `${vm.$store.state.basedataUrl}/statistics/getBusDetailsInfo`,
        data
      ).then(r => {
        if (r.code === 200) {
          //(r.data.dataList)
          this.total = r.data.total
          this.tableData = r.data.dataList
          //(data)
        } else {
          //('查询getBusDetailsInfo失败')
        }
      })
      this.currentPage = currentPage
      //('当前页第' + currentPage)
    }
  }
}
</script>
<style lang="scss" scoped>
/* 分页 */
.el-pagination {
display: flex;
justify-content: flex-end;
}
</style>


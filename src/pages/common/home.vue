<template>
  <el-container class="main-container">
    <el-header>
      <z-header></z-header>
    </el-header>
    <el-container style="margin-top:10px">
      <el-aside class="zaside" style="width:202px">
        <zAside></zAside>
      </el-aside>
      <el-main  id="main">
       <!-- 面包屑 start -->
        <div class="breadcrumb-box">
          <el-breadcrumb
            v-if="$store.state.breadcrumb.length > 1"
            separator-class="el-icon-arrow-right"
          >
            <template v-for="(item, i) in $store.state.breadcrumb">
              <el-breadcrumb-item v-if="item.path" :key="i" :to="{ path: item.path }">
                <img src class="icon">
                <span>{{item.name}}</span>
              </el-breadcrumb-item>
              <el-breadcrumb-item v-else :key="i">{{item.name}}</el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>
        <!-- 面包屑 end -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  import zHeader from "@/pages/common/header.vue";
  import zAside from "@/pages/common/aside.vue";
  export default {
    name: "index",
    data() {
      return {};
    },
    components: {
      zAside,
      zHeader
    },
    created() {
      this.$store.commit('changeBreadcumb', [])
    }
  };

</script>
<style scoped>
  .el-header {
    padding: 0; 
    height: 90px;
  }
  #main{
    width: 1560px;
    padding-top : 6px;
    /* overflow:auto;  */
    max-height:98%;
  }
  .main-container {
    position: relative;
    width: 100%;
    height: 100%; 
    overflow: hidden;
  }
  img.icon {
    height: 10px;
  }
  .breadcrumb-box {
    padding-bottom: 10px;
  }
  .el-aside {
    background-color: #060c3c;
    border-right: 1px solid white;
  }
</style>

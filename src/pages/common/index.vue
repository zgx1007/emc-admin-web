<template>
  <el-container class="main-container">
    <el-header>
      <z-header></z-header>
    </el-header>
    <el-container style="margin-top:10px">
      <el-aside class="zaside">
        <zAside></zAside>
      </el-aside>
      <el-main class="main">
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
  created() {}
};
</script>

<style  scoped>
.el-header {
  padding: 0;
  height: 90px;
}
.main-container {
  position: absolute;
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
}
.zaside {
  /* background: #3d455a;
  height: 659px; */
  margin-top: 2px;
  width: 202px;
}
.el-aside {
  background-color: #3d455a;
}

</style>

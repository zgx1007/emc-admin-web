<template>
  <el-container class="aside-main">
    <el-menu
      :default-active="$route.path"
      class="sidebar-el-menu"
      router
      :collapse="collapse"
      background-color="#060c3c"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
    >
      <!-- <template v-for="(item,index) in $router.options.routes"> -->
      <template v-for="(item,index) in $store.state.addRouters">
        <el-submenu :index="index+''" v-if="!item.leaf && !item.hidden" :key="item.name">
          <template slot="title">
            <img :src="item.iconCls" class="img-size">
            <span :hidden="collapse">{{item.name}}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :index="child.path"
            :key="child.path"
          >{{child.name}}</el-menu-item>
        </el-submenu>
        <el-menu-item
          v-if="item.leaf&&item.children.length>0"
          :index="item.children[0].path"
          :key="item.name"
        >
          <i :class="item.iconCls"></i>
          <span :hidden="collapse">{{item.children[0].name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      collapse: false,
      icon: '/static/img/set.png'
    };
  },
  created() {
    // bus.$on('collapse', msg => {
    //   this.collapse = msg
    // })
  }
};
</script>
<style scoped>
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 100%;
}
.img-size {
  width: 20px;
  height: 19px;
}
/* .el-menu-item,
.el-submenu__title {
  width: 200px;
} */
</style>

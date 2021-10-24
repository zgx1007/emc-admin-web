<template>
  <div>
    <el-container style="height: 100%;" class="elcont">
      <el-header class="header" style="height: 70px;">
        <img src="../../assets/img/home/headLogo.png" alt="logo" class="logo-img" @click="$router.push('/statisticalAnalysis/welcome')">
        <div class="operating">
          <div class="realName">
            <p>欢迎，{{realName}}</p>
          </div>
          <el-dropdown trigger="hover" class="dropdown-span" @command="handleCommand">
            <span class="el-dropdown-link hand">
                <img src=                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             "../../assets/set.png" alt="退出">
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="msg">个人信息</el-dropdown-item>
              <el-dropdown-item command="pwd">修改密码</el-dropdown-item>
              <el-dropdown-item command="out">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        collapse: false,
        realName: "",
        fullscreen: false,
        centerDialogVisible: false
      };
    },
    created() {
      this.realName = sessionStorage.getItem('realName')
    },
    methods: {
      handleCommand(command) {
        const vm = this
        if (command === "out") {
          this.$confirm("确认退出吗?", "提示", {
              type: 'warning'
            })
            .then(() => {
              sessionStorage.clear();
              vm.$router.push("/login");
            })
            .catch(() => {});
        }
        if (command === "pwd") {
          vm.$router.push("/personalSet/passwordReset")
        }
        if (command === "msg") {
          vm.$router.push("/personalSet/personManagement")
        }
      },
      // collapseChage() {
      //   this.collapse = !this.collapse;
      //   bus.$emit("collapse", this.collapse);
      // },
      // 全屏
      handleFullScreen() {
        let element = document.documentElement;
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        } else {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
          }
        }
        this.fullscreen = !this.fullscreen;
      },
      mounted() {
        if (document.body.clientWidth < 1500) {
          this.collapseChage();
        }
      }
    }
  };

</script>

<style lang="scss" scoped>
  .header {
    line-height: 50px;
    // overflow: hidden;
  }

  .logo {
    float: left;
  }

  .hand {
    cursor: pointer;
  }

  .logo h1 {
    margin: 0;
    font-size: 26px;
    padding-left: 10px;
    font-weight: normal;
    line-height: 46px;
    cursor: pointer;
  }

  .operating {
    float: right;

    .updatePwd {
      // position: absolute;
      // top: 10px;
      padding-top: 3px;
    }
  }

  .operating div {
    float: left;
    padding: 0 17px;
  }

  .username {
    margin: 0;
    font-size: 15px;
  }

  .iconfont {
    width: 24px;
    padding-top: 18px;
    text-align: center;
    font-size: 19px;
  }

  .collapse-btn {
    padding-top: 8px;
    float: left;
    cursor: pointer;
    font-size: 24px;
  }

  .btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    margin-top: 5px;
    font-size: 43px;
  }

  .el-dropdown-link img {
    width: 31px;
    height: 31px;
    padding-top: 22px;
  }

  .header {
    background: #060c3c;
    color: #fff;
    border-bottom: 1px solid;
  }

  .logo-img {
    width: 342px;
    width: 342px;
    position: relative;
    top: 47%;
    left: -1%;
    transform: translate(0, -50%);
  }

  .btn-quit {
    position: relative;
    left: 83.5%;
    top: 10%;
    transform: translate(-50%, 0);
  }

  .logo-img:hover {
    cursor: pointer;
  }

</style>

<template>
  <el-container>
    <!-- head -->
    <el-header>
      <div>
        <span>MIDNIGHT HEARTBREAK CLUB</span>
      </div>
      <el-button round @click="logout">Lover Boy</el-button>
    </el-header>
    <!-- body -->
    <el-container>
      <!-- leftSideMenus -->
      <el-aside :width="isCollapse ? '70px' : '250px'">
        <div class="toggle-button" 
        @click="doCollapse">Toosie Slide</div>
        <!-- :unique-opened="true"-> 是否只保持一个子菜单的展开 -->
        <!-- :collapse-transition="false" -> 关闭动画 -->
        <!-- router -> 导航开启路由模式 -->
        <!-- :default-active="activePath" -> 当前激活菜单的 index -->
        <el-menu
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="true"
          router
          :default-active="activePath"
          background-color="#F2F6FC"
          text-color="#666666"
          active-text-color="#FF9655"
        >
          <!-- lv1 menu-->
          <el-submenu :index="item.id+''" 
          v-for="item in menuList" 
          :key="item.id">
            <!-- lv1 template -->
            <template slot="title">
              <i class="el-icon-no-smoking"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- lv2 menu -->
            <!-- 导航开启路由模式：将index值作为导航路由 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- lv2 template -->
              <template slot="title">
                <i class="el-icon-toilet-paper"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- main content -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // leftMenuDate
      menuList: [],
      // default collapse
      isCollapse: false,
      // path of active
      activePath: ''
    };
  },
  created() {
    this.getMenuList(),
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    logout() {
      // clear token
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // get menu
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    // menu collapse
    doCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // save activePath
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
    }
  }
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #F2F6FC;
  display: flex;
  justify-content: space-between;
  padding-left: 90px;
  align-items: center;
  color: #000000;
  font-size: 30px;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 40px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #F2F6FC;

  .el-menu {
    border: 5px;
  }
}
.el-main {
  background-color: #EBEEF5;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button {
  background-color: #FF9655;
  font-size: 17px;
  line-height: 24px;
  color: #000000;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上去变成小手
  cursor: pointer;
}
</style>
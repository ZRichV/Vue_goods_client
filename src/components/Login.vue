<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/mylogo.png" alt="avatar" />
      </div>
      <!-- 登录表单 -->
      <div>
        <el-form
          class="login_form"
          label-width="60px"
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入账户名"
              clearable
              prefix-icon="el-icon-user-solid"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              show-password
              prefix-icon="el-icon-no-smoking"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="register">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            //表单验证
            loginFormRules: {
                username: [
                    { required: true, message: '请输入账户名', trigger: blur },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
                ],
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        login () {
            // 表单预验证
            this.$refs.loginFormRef.validate(async valid =>{
                if ( !valid ) return false;
                // this.$http.post('login', this.loginForm): 返回值为promise
                // 返回值为promise，可加await简化操作 相应的也要加async
                const { data: res }= this.$http.post('login', this.loginForm);
                if( res.meta.status !== 200) return this.$message.error( '登录失败' );
                this.$message.success( '登录成功' );
                // 1、将登陆成功之后的token, 保存到客户端的sessionStorage中; localStorage中是持久化的保存
                // 1.1 项目中出现了登录之外的其他API接口，必须在登陆之后才能访问
                // 1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中
                window.sessionStorage.setItem( 'token', res.data.token);
                // 2、通过编程式导航跳转到后台主页, 路由地址为：/home
                this.$router.push('/home');
            })
        },
        register () {
            this.$router.push('/register');
        }
    }
};
</script>

<style lang="less" scoped>
// lang="less" 支持less格式
// scoped vue的指令，只在当前组件生效
.login_container {
  height: 100%;
  background-color: #2c71b8;
}
.login_box {
  width: 450px;
  height: 360px;
  background-color: #fff;
  position: absolute;
  left: 75%;
  top: 50%;
  border-radius: 10px;
  -webkit-transform: translate(-50%, -50%);
  background-color: #fff;
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 0 0 5px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #fff;
    }
  }
}
.login_form {
  position: absolute;
  top: 100px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
}
</style>
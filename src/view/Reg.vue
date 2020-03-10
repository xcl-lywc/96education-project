<!--注册中心 -->
<template>
  <div>
    <div class="background-wrap">
      <div class="reg-background"></div>
    </div>
    <div class="reg-box">
      <div class="box-title">
        欢迎注册
      </div>
      <div class="box-form">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-position="labelPosition">
					<el-form-item prop="role" label="角色：">
						<el-select v-model="ruleForm.role" placeholder="请选择角色"  class="fill-width">
							<el-option label="学生" :value="1"></el-option>
							<el-option label="教员" :value="2"></el-option>
							<el-option label="管理员" :value="3"></el-option>
							<el-option label="机构" :value="4"></el-option>
						</el-select>
					</el-form-item>
          <el-form-item prop="name" label="用户名：">
            <el-input type="text" v-model="ruleForm.name" auto-complete="off" placeholder="请输入用户名">
              <i slot="prefix" class="el-input__icon fa fa-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="account" label="账号：">
            <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入账号">
              <i slot="prefix" class="el-input__icon fa fa-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码：">
            <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码" show-password>
              <i slot="prefix" class="el-input__icon fa fa-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="checkPass" label="确认密码：">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="请再次输入密码" show-password>
              <i slot="prefix" class="el-input__icon fa fa-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="buttonLoading" @click="submitForm('ruleForm')" class="fill-width" type="primary">
            {{buttonLoading ? '注册中' : '注册'}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="buttonLoading" @click="resetForm('ruleForm')" class="fill-width">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="box-footer">
        <el-button type="text" class="text-dark-blue" @click="goToLogin();">
          <i class="el-icon-d-arrow-right"></i><i class="el-icon-d-arrow-right"></i><i class="el-icon-d-arrow-right"></i>
          登录中心
          <i class="el-icon-d-arrow-left"></i><i class="el-icon-d-arrow-left"></i><i class="el-icon-d-arrow-left"></i>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import qs    from "qs"; //需要传表单时, 引用此包
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validateaccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'));
        } else {
          callback();
        }
      };
      return {
        buttonLoading: false,
        ruleForm: {
          password:  '',
          account:   '',
          checkPass: '',
					role:      null,
        },
        rules: {
					role: [
						{ required: true, message: '请选择角色', trigger: 'change' }
					],
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, validator: validatePass, trigger: 'blur' },
            { pattern: /^[\a-zA-Z0-9_-]{3,16}$/, message: '密码不符合要求' },
          ],
          checkPass: [
            { required: true, validator: validatePass2, trigger: 'blur' },
            { pattern: /^[\a-zA-Z0-9_-]{3,16}$/, message: '密码不符合要求' },
          ],
          account: [
            { required: true, validator: validateaccount, trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9_-]{1,16}$/, message: '账号不符合要求' },
          ],
        },
      };
    },
    components: {
     
    },
    created () {
      
    },
    mounted () {
      // --------- 键盘时间的监听
      window.addEventListener('keypress', this.pressEnter);
    },
    methods: {
      /**
       * 回车注册事件
       * @param  {[type]}                 event [description]
       * @return {[type]}                       [description]
       */
      pressEnter (event) { 
        if(this.$route.path && this.$route.path == "/reg") { //仅在注册页调用此事件
          if(event.key == "Enter") {
            this.submitForm('ruleForm');
          }
        }
      },
      /**
       * 注册按钮
       * @param  {[type]}                 formName [description]
       * @return {[type]}                          [description]
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.reg();
          } else {
            return false;
          }
        });
      },
      /**
       * 注册
       * @return {[type]}                 [description]
       */
      reg() {
        var self = this;
        self.buttonLoading = true;
        let config = {
          url: `${this.common.basePath}/user/create`,
          method: "post",
          data: this.ruleForm
        }
        this.axios(config).then((r) => {
          // message
          this.$message.success(r.data.meta.message)
          
          // go to page
          let target = null;
          target = 'Login'
          this.goToTarget(target);
          
          // buttonLoading
          self.buttonLoading = false;
        }).catch((e) => {
          self.buttonLoading = false;
          self.$message.error(e)
        })
      },
      /**
       * 注册成功，前往指定页面
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      goToTarget (target) {
        let self  = this
        self.$router.push({name: target});
      },
      /**
       * 重置按钮
       * @param  {[type]}                 formName [description]
       * @return {[type]}                          [description]
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /**
       * 前往登录中心
       * @return {[type]}                 [description]
       */
      goToLogin(){
        this.$router.push({path: '/login'});
      },
    },
  }
</script>

<style scoped lang="less">
  @darkBlue: #114275;
  @keyframes scaleBackground {
    0% {transform:scale(1, 1);background-image: url("../assets/img/reg01.jpg");}
    50% {transform:scale(1.08, 1.08);background-image: url("../assets/img/reg02.jpg");}
    100% {transform:scale(1, 1);background-image: url("../assets/img/reg01.jpg");}
  }
  .text-dark-blue {
    color: @darkBlue;
  }
  .background-wrap {
    overflow: hidden;
    .reg-background {
      width: 100vw;
      height: 100vh;
      background-position: center;
      background-size:cover;
      animation: scaleBackground 15s infinite;
      transition-timing-function: ease-in-out;
    }
  }
  .reg-box {
    position: absolute;
    top: 300px;
    right: calc(50vw - 250px);
    width: 500px;
    overflow: hidden;
    margin: -243px auto 0 auto;
    padding: 41px 62px;
    box-sizing: border-box;
    border-radius: 10px;
    box-shadow: 0 0 10px #ebeef5;
    color: #333;
    -webkit-box-sizing: border-box;
    background-color: #e1f7f496;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #171717b8;
    .el-form-item__content {
      padding-left: 0;
    }
    .box-title{
      color: @darkBlue;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid @darkBlue;
    }
    .box-form{
      padding: 0 15px;
    }
    .box-footer{
      text-align: center;
      font-size: 14px;
    }
  }
</style>
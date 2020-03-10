<!--登录 -->
<template>
  <div>
    <div class="background-wrap">
      <div class="login-background"></div>
    </div>
    <div class="title-box">
      <h1>96教育</h1>
      <h4>96教育专注于在线教育领域的系统研发和技术服务，为各大互联网教育机构和企业提供优质的在线教育系统。其团队核心成员均拥有多年丰富的在线教育行业从业经验和海外教育背景，在历经一年多的产品研发和升级迭代，最终发布了目前的Eduline在线教育系统。</h4>
    </div>
    <div class="login-box">
      <div class="box-title">
        欢迎登录
      </div>
      <div class="box-form">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0">
					<el-form-item label="" prop="role">
						<el-select v-model="ruleForm.role" placeholder="请选择角色">
							<el-option v-for="item in roleData.rows" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
          <el-form-item prop="account">
            <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入账号" @change="checked = false">
              <i slot="prefix" class="el-input__icon fa fa-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input type="password" v-model="ruleForm.passWord" auto-complete="off" placeholder="请输入密码" show-password @change="checked = false">
              <i slot="prefix" class="el-input__icon fa fa-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="checked" class="fl" @change="rememberClick" :disabled='ruleForm.username==""||ruleForm.passWord==""'><span class="text-dark-blue">记住密码</span></el-checkbox>
            <el-button type="text" class="text-dark-blue fr" @click="goToReg();"><i class="el-icon-d-arrow-right"></i>注册中心<i class="el-icon-d-arrow-left"></i></el-button>
          </el-form-item>
          <el-form-item>
            <el-button :loading="buttonLoading" @click="submitForm('ruleForm')" class="fill-width" type="primary">
            {{buttonLoading ? '登录中' : '登录'}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="buttonLoading" @click="resetForm('ruleForm')" class="fill-width">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="box-footer"></div>
    </div>
  </div>
</template>

<script>
  import qs    from "qs"; //需要传表单时, 引用此包
  export default {
    data() {
      var validatepass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
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
        checked: false,
        buttonLoading: false,
        ruleForm: {
          passWord: '',
          account:  '',
					role:     null,
        },
        rules: {
					role: [
						{ required: true, message: '请选择角色', trigger: 'change' }
					],
          passWord: [
            { validator: validatepass, trigger: 'blur' },
            { pattern: /^[\a-zA-Z0-9_-]{3,16}$/, message: '密码不符合要求' },
          ],
          account: [
            { validator: validateaccount, trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9_-]{1,16}$/, message: '账号不符合要求' },
          ],
        },

        roleData: {rows:[],total:0},
      };
    },
    components: {
     
    },
    created () {
      var self = this;
      self._remember();
    },
    mounted () {
      this.queryRole();
      // --------- 键盘时间的监听
      window.addEventListener('keypress', this.pressEnter);
    },
    methods: {
      /**
       * 查询角色
       * @return {[type]}                     [description]
       */
      queryRole(){
        var self = this;
        let config = {
          url: `${this.common.basePath}/role`,
          method: "get",
          params: {}
        }
        this.axios(config).then((r) => {
          this.roleData = r.data.data;
        }).catch((e) => {
          self.$message.error(e)
        })
      },

      /**
       * 回车登录事件
       * @param  {[type]}                 event [description]
       * @return {[type]}                       [description]
       */
      pressEnter (event) { 
        if(this.$route.path && this.$route.path == "/login") { //仅在登录页调用此事件
          if(event.key == "Enter") {
            this.submitForm('ruleForm');
          }
        }
      },
      /**
       * 登录按钮
       * @param  {[type]}                 formName [description]
       * @return {[type]}                          [description]
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.login();
            // this.goToTarget('Home');
          } else {
            return false;
          }
        });
      },
      /**
       * 登录
       * @return {[type]}                 [description]
       */
      login() {
        var self = this;
        self.buttonLoading = true;
        let config = {
          url: `${this.common.basePath}/user/login`,
          method: "post",
          data: this.ruleForm
        }
        this.axios(config).then((r) => {
          // Authorization
          // this.axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;
					
					// 保存字典
          this.getDictionary()
					
          // go to page
          let target = null;
          target = 'Home'
          this.goToTarget(target);

          // sessionStorage
          // sessionStorage.setItem('Access-Token',JSON.stringify(r.headers['access-token']));
          // sessionStorage.setItem('Access-Key',JSON.stringify(r.data.data.userId));
					sessionStorage.setItem('userInfo',JSON.stringify(r.data.data));
          
          // buttonLoading
          self.buttonLoading = false;
        }).catch((e) => {
          self.buttonLoading = false;
          self.$message.error(e)
        })
      },
      /**
       * 登陆成功，前往指定页面
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      goToTarget (target) {
        let self  = this
        self.$router.push({name: target});
      },
      /**
       * 登陆成功，查询字典数据
       * @return {[type]}                 [description]
       */
      getDictionary(){
        var self = this;
        self.loading = true;
        let config = {
          url: `${this.common.basePath}/dictionaries/type`,
          method: "post",
          data: {}
        }
        this.axios(config).then((r) => {
        	// this.tableData = r.data.data;
        }).catch((e) => {
          self.$message.error(e)
        })
      },
      /**
       * 重置按钮
       * @param  {[type]}                 formName [description]
       * @return {[type]}                          [description]
       */
      resetForm(formName) {
        this.checked = false;
        this.ruleForm.passWord = '';
        this.ruleForm.username = '';
        localStorage.setItem("remember",'false');
        localStorage.removeItem('username');
        localStorage.removeItem('passWord');
        this.$refs[formName].resetFields();
      },
      /**
       * 点击按钮
       * @return {[type]}                 [description]
       */
      rememberClick() {
        this.checked ? localStorage.setItem("remember",'true') : localStorage.setItem("remember",'false')
        this.checked ? localStorage.setItem("username", this.ruleForm.username) : localStorage.removeItem('username');
        this.checked ? localStorage.setItem("passWord", this.ruleForm.passWord) : localStorage.removeItem('passWord');
      },
      /**
       * 记住账号密码
       * @return {[type]}                 [description]
       */
      _remember() {
        if(JSON.parse(localStorage.getItem("remember"))) { 
          this.checked = true;
          if(localStorage.getItem("username") && localStorage.getItem("passWord")) {
            this.ruleForm.username = localStorage.getItem("username");
            this.ruleForm.passWord = localStorage.getItem("passWord");
          }
        }else{
          this.checked = false;
          localStorage.removeItem('username');
          localStorage.removeItem('passWord');
        }
      },
      /**
       * 前往注册中心
       * @return {[type]}                 [description]
       */
      goToReg(){
        this.$router.push({path: '/reg'});
      },
    },
  }
</script>

<style scoped lang="less">
  @darkBlue: #114275;
  @keyframes scaleBackground {
    0% {transform:scale(1, 1);background-image: url("../assets/img/login01.jpg");}
    50% {transform:scale(1.08, 1.08);background-image: url("../assets/img/login02.jpg");}
    100% {transform:scale(1, 1);background-image: url("../assets/img/login01.jpg");}
  }
  .text-dark-blue {
    color: @darkBlue;
  }
  .background-wrap {
    overflow: hidden;
    .login-background {
      width: 100vw;
      height: 100vh;
      background-position: center;
      background-size:cover;
      animation: scaleBackground 15s infinite;
      transition-timing-function: ease-in-out;
    }
  }
  .title-box {
    position: absolute;
    width: 28vw;
    left: 10vw;
    top: 50%;
    margin-top: -158px;
    color: #4e5fbc;
    h1{
      font-size:36px;
    }
  }
  .login-box {
    position: absolute;
    top: 50%;
    right: 15vw;
    width: 500px;
    overflow: hidden;
    margin: -243px auto 0 auto;
    padding: 41px 62px;
    box-sizing: border-box;
    border-radius: 10px;
    box-shadow: 0 0 10px #ebeef5;
    color: #333;
    -webkit-box-sizing: border-box;
    background-color: #d4d4d496;
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
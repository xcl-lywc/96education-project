<template>
  <div id="nav-layout"> 
  	<!-- Header -->
  	<div class="header-wrap overflow-hidden">
			<div class="fl logo">
				<img src="../assets/education.png" height="80" width="80" alt="">
				<!-- <img src="../assets/logo.jpg" height="200" width="200" alt=""> -->
			</div>
			<div class="fr user" v-if="userInfo">
				<el-dropdown @command="handleCommand">
					<div class="el-dropdown-link">
						<el-avatar :size="50" :src="userInfo.picture" @error="errorHandler" class="fl">
							<img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
						</el-avatar>
						<span class="username fl marl10">{{userInfo.name}}</span>
					</div>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item icon="el-icon-s-home" command="home">首页</el-dropdown-item>
						<el-dropdown-item icon="el-icon-info" command="info">用户信息</el-dropdown-item>
						<el-dropdown-item icon="el-icon-edit" command="edit">修改信息</el-dropdown-item>
						<el-dropdown-item icon="el-icon-sold-out" command="out">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
  	<!-- Main -->
  	<div class="main-wrap">
	    <transition name="el-zoom-in-bottom">
		    <el-row v-loading="loading">
		      <!-- 水平方向导航 -->
		      <transition name="el-zoom-in-top">
		        <el-col v-if="navMode == 'horizontal'" :span="24" class="horizontal main-nav-wrap">
			        <!-- 通过时间来触发刷新 -->
			        <nav-bar></nav-bar>
			      </el-col>
		      </transition>
		      <!-- 竖直方向导航 -->
		      <transition name="el-zoom-in-bottom">
			      <el-col v-if="navMode == 'vertical'" :span="4" class="vertical main-nav-wrap">
			        <!-- 通过时间来触发刷新 -->
			        <nav-bar></nav-bar>
			      </el-col>
		      </transition>
		      <!-- 页面主体 -->
		      <el-col :span="navMode == 'vertical' ? 20 : 24" :class="{'vertical-box': navMode == 'vertical', 'horizontal-box': navMode == 'horizontal', 'main-view-wrap':true}">
		      	<div class="main-view-content-wrap" ref="contentWrap">
		          <router-view v-loading="mainLoading"></router-view>
		        </div>
		      </el-col>
		    </el-row>
	    </transition>
  	</div>
		<!-- Footer -->
		<!-- <div class="footer-wrap">Footer</div> -->
		
		
		<el-dialog
		  title="基本信息"
		  :visible.sync="centerDialogVisible"
		  width="500px"
		  center>
		  <div v-if="userInfo">
				<!-- <el-card shadow="never"> -->
					<el-form label-width="60px">
						<el-row :gutter="20">
						  <el-col :span="12">
								<el-form-item label="姓名:">{{userInfo.name}}</el-form-item>
								<el-form-item label="性别:">{{ common.conversionDic(sexData.rows,userInfo.sex) }}</el-form-item>
								<el-form-item label="角色:">{{ common.conversionDic(roleData.rows,userInfo.role) }}</el-form-item>
							</el-col>
						  <el-col :span="12">
								<el-avatar :size="50" :src="userInfo.picture" @error="errorHandler" class="fl">
									<img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
								</el-avatar>
							</el-col>
							<el-col :span="24">
								<el-form-item label="电话:">{{userInfo.phoneNumber}}</el-form-item>
							</el-col>
							<el-col :span="24">
								<el-form-item label="地址:">{{userInfo.address}}</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				<!-- </el-card> -->
			</div>
		</el-dialog>

		<!-- 修改用户信息 -->
		<el-dialog title="修改用户信息" :visible.sync="dialogVisible" width="800px">
			<el-form ref="dialogForm"  :model="dialogForm" label-width="120px" v-loading="dialogLoading">
				<el-row>
					<div class="overflow-hidden">
						<el-col :span="12">
							<el-form-item 
								label="姓名：" prop="name"
								:rules="[
									{ required: true, message: '请输入姓名', trigger: 'blur' }
								]">
								<el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.name" placeholder="姓名"></el-input>
							</el-form-item>
							<el-form-item
								label="性别：" prop="sex"
								:rules="[
									{ required: true, message: '请选择性别', trigger: 'change' }
								]">
								<el-select v-model="dialogForm.sex" placeholder="性别">
									<el-option v-for="item in sexData.rows" :label="item.name" :value="item.id"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item
								label="角色：" prop="role"
								:rules="[
									{ required: true, message: '请选择角色', trigger: 'change' }
								]">
								<el-select v-model="dialogForm.role" placeholder="角色" disabled>
									<el-option v-for="item in roleData.rows" :label="item.name" :value="item.id"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item 
								label="头像：" prop="picture">
								<crop-avatar :fileTypes="['png', 'jpg']" @uploadSuccess="uploadAvatarSuccess" :size="'mini'" :avatar="dialogForm.picture"></crop-avatar>
							</el-form-item>
						</el-col>
					</div>
					<el-col :span="12">
						<el-form-item 
							label="账号：" prop="account"
							:rules="[
								{ required: true, message: '请输入账号', trigger: 'blur' }
							]">
							<el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.account" placeholder="账号"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item 
							label="密码：" prop="password"
							:rules="[
								{ required: true, message: '请输入密码', trigger: 'blur' }
							]">
							<el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.password" placeholder="密码"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item 
							label="联系电话：" prop="phoneNumber"
							:rules="[
								{ required: true, message: '请输入联系电话', trigger: 'blur' }
							]">
							<el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.phoneNumber" placeholder="联系电话"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item 
							label="地址：" prop="address"
							:rules="[
								{ required: false, message: '请输入地址', trigger: 'blur' }
							]">
							<el-input type="textarea" :rows="3" :maxlength="128" :show-word-limit="true" v-model="dialogForm.address" placeholder="地址..."></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item 
							label="简介：" prop="synopsis"
							:rules="[
								{ required: false, message: '请输入内容', trigger: 'blur' }
							]">
							<el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogForm.synopsis" placeholder="内容..."></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false" size="small">取消</el-button>
				<el-button type="primary" @click="submitForm('dialogForm')" size="small" :loading="bottonLoding" :disabled="bottonLoding">保 存{{bottonLoding?' 中...':''}}</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>
	import NavBar from "../components/NavBar.vue"
	import CropAvatar from "../components/CropAvatar.vue"
  export default {
		components: {
      "nav-bar":        NavBar,
      "crop-avatar":    CropAvatar
    },
    data(){
    	return{
				userInfo:      JSON.parse(sessionStorage.getItem('userInfo')),
    		loading:       false,
        mainLoading:   false,
        navMode:       "vertical",
        dialogLoading: false,
        bottonLoding:  false,

        dicData:    {rows:[],total:0},
        roleData:   {rows:[],total:0},
				sexData:    {rows:[],total:0},
				
				centerDialogVisible:false,
				dialogVisible:      false,
				dialogForm:         {},

    	};
    },
    created(){
			this.queryDic(null);
			this.queryDic(5);
			this.queryRole();
    },
		mounted(){
			
		},
		methods:{
			errorHandler() {
				return true
			},
			/**
			 * 上传头像
			 * @param  {[type]}                 val [description]
			 * @return {[type]}                     [description]
			 */
			uploadAvatarSuccess(val) {
				this.dialogForm.picture = val.path
			},
			/**
			 * 下拉选事件
			 * @param  {[type]}                 command [description]
			 * @return {[type]}                         [description]
			 */
			handleCommand(command) {
				if(command=='info'){
					this.centerDialogVisible = true;
				}else if(command=='edit'){
					this.dialogVisible = true;
					this.$refs['dialogForm']?this.$refs['dialogForm'].resetFields():'';
					this.dialogLoading = true;
					this.axios.get(`${this.common.basePath}/user/one`,{params:{id:this.userInfo.id}}).then((response) => {
					  this.dialogForm = response.data.data;
					  this.dialogLoading = false;
					}).catch((errorMsg) => {
					  this.dialogLoading = false;
					  this.$message.error(errorMsg);
					}) 
				}else if(command=='home'){
					let self  = this
					self.$router.push({name: 'Home'}); 
				}else{
					let self  = this
					self.$router.push({name: 'Login'});
					sessionStorage.removeItem('userInfo');
				}
			},

			/**
       * 查询字典
       * @return {[type]}                     [description]
       */
      queryDic(type){
        var self = this;
        let config = {
          url: `${this.common.basePath}/dictionaries/type`,
          method: "post",
          data: {typeId:type}
        }
        this.axios(config).then((r) => {
					type==null?this.dicData = r.data.data:"";
					type==5?this.sexData = r.data.data:"";
        }).catch((e) => {
          self.$message.error(e)
        })
      },
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
			 * 提交修改用户信息的表单
			 * @param  {[type]}                 formName [description]
			 * @return {[type]}                          [description]
			 */
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.bottonLoding = true;
						let form = this.dialogForm;
						form.id = this.dialogForm.id;
						this.axios.post(`${this.common.basePath}/user/update`,form).then((response) => {
							this.$message.success("修改用户信息"+response.data.meta.message+"，退登后可更新用户信息！！！");
							// this.query();
							this.bottonLoding = false;
							this.dialogVisible = false;
						}).catch((errorMsg) => {
							this.bottonLoding = false;
							this.$message.error(errorMsg);
						}) 
					} else {
						return false;
					}
				});
			},
		}
  }
</script>

<style scoped>
  #nav-layout {
    
  }
</style>
<template>
  <div class="role-page">
		<!-- 头部 面包屑导航 -->
		<div class="main-view-wrap-header">
			<el-card class="" shadow="never">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
					<el-breadcrumb-item>用户管理</el-breadcrumb-item>
					<el-breadcrumb-item>角色列表</el-breadcrumb-item>
				</el-breadcrumb>
			</el-card>			
		</div>
		<!-- 主要内容 -->
		<div class="main-view-wrap-content">
			<!-- 搜素区域 -->
			<el-card class="marb20">
				<el-form :inline="true" :model="searchForm" ref="searchForm">
				  <el-form-item label="名称：" prop="name">
				    <el-input v-model="searchForm.name" placeholder="角色名称"></el-input>
				  </el-form-item>
				  <el-form-item label="编码：" prop="code">
				    <el-input v-model="searchForm.code" placeholder="角色编码"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="searchForm.pageNum = 1;query();" size="small"  icon="el-icon-search">查询</el-button>
						<el-button @click="resetForm('searchForm')" size="small" icon="el-icon-refresh">重置</el-button>
				  </el-form-item>
				</el-form>
			</el-card>
			<!-- 内容区域 -->
			<el-card class="marb20">
				<!-- 内容标题以及操作 -->
				<div slot="header" class="clearfix">
				  <span>角色列表</span>
				  <el-button class="fr" type="success" size="small" @click="operation('add','dialogForm',null)"  icon="el-icon-plus">添 加</el-button>
				</div>
				<!-- 表格数据 -->
				<el-table
					:data="tableData.rows"
					border
					v-loading="loading"
					style="width: 100%">
					<el-table-column
						type="index"
						fixed="left"
						width="50"
						align="center"
						label="序号">
					</el-table-column>
					<el-table-column
						prop="name"
						label="角色名称"
						show-overflow-tooltip
						align="center"
						width="200">
					</el-table-column>
					<el-table-column
						prop="code"
						label="角色编码"
						show-overflow-tooltip
						align="center"
						width="150">
					</el-table-column>
					<el-table-column
						prop="description"
						label="简介"
						show-overflow-tooltip
						align="center"
						width="">
					</el-table-column>
					<el-table-column
						fixed="right"
						width="240"
						align="center"
						label="操作">
						<template slot-scope="scope">
							<el-button
								type="primary"
								size="small"
								@click="operation('edit','dialogForm',scope.row)" icon="el-icon-edit">编 辑</el-button>
							<el-button
								size="small"
								type="danger"
								@click="deleteOperation(scope.row)" icon="el-icon-delete">删 除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-pagination
				  class="text-right mart20"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="searchForm.pageNum"
					:page-sizes="[10, 20, 30, 40]"
					:page-size="10"
					layout="total, sizes, prev, pager, next, jumper"
					:total="tableData.total">
				</el-pagination>
			</el-card>
		</div>
		<!-- 底部 -->
		<div class="main-view-wrap-footer"></div>
    
		<!-- 添加/编辑 -->
		<el-dialog :title="dialogType=='edit'?'编辑':'添加'" :visible.sync="dialogVisible" width="800px">
			<el-form ref="dialogForm"  :model="dialogForm" label-width="120px" v-loading="dialogLoading">
				<el-row>
					<div class="overflow-hidden">
						<el-col :span="24">
							<el-form-item 
								label="角色名称：" prop="name"
								:rules="[
									{ required: true, message: '请输入角色名称', trigger: 'blur' }
								]">
								<el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.name" placeholder="角色名称"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item 
								label="角色编码：" prop="code"
								:rules="[
									{ required: true, message: '请输入角色编码', trigger: 'blur' }
								]">
								<el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.code" placeholder="角色编码"></el-input>
							</el-form-item>
						</el-col>
					</div>
					<el-col :span="24">
						<el-form-item 
							label="简介：" prop="description"
							:rules="[
								{ required: false, message: '请输入内容', trigger: 'blur' }
							]">
							<el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogForm.description" placeholder="内容..."></el-input>
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
  export default {
    components:{

    },
    data (){
      return{
        loading:false,
				bottonLoding:false,
				
				searchForm: {
					name:     null,
					code:     null,
					pageSize: 10,
					pageNum:  1,
				},
				
				tableData:{rows:[],total:0},
				
				dialogLoading:false,
				dialogType:'add',
				dialogVisible:false,
				dialogForm:   {},
				
      };
    },
    created(){

    },
    mounted(){
			this.query();
    },
    methods:{
			/**
			 * 重置
			 * @param  {[type]}            formName [description]
			 * @return {[type]}                     [description]
			 */
			resetForm(formName) {
				this.searchForm.pageNum = 1;
				this.searchForm.pageSize = 10;
				this.$refs[formName]?this.$refs[formName].resetFields():'';
				this.query();
			},
			/**
			 * 分页
			 * @param  {[type]}                 val [description]
			 * @return {[type]}                     [description]
			 */
			handleSizeChange(val) {
				this.searchForm.pageSize = val;
				this.query();
			},
			handleCurrentChange(val) {
				this.searchForm.pageNum = val;
				this.query();
			},
			
			/**
			 * 查询
			 * @return {[type]}                     [description]
			 */
			query(){
				var self = this;
				self.loading = true;
				let config = {
				  url: `${this.common.basePath}/role`,
				  method: "get",
				  params: this.searchForm
				}
				this.axios(config).then((r) => {
					this.tableData = r.data.data;
				  self.loading = false;
				}).catch((e) => {
				  self.loading = false;
				  self.$message.error(e)
				})
			},
			
			/**
			 * 添加/编辑操作
			 * @param  {[type]}                 type     [description]
			 * @param  {[type]}                 formName [description]
			 * @param  {[type]}                 data     [description]
			 */
			operation(type,formName,data){
				this.dialogVisible = true;
				this.dialogType = type;
				this.$refs[formName]?this.$refs[formName].resetFields():'';
				type=='add'?this.dialogForm = {}:"";
				
				if(type=='edit'){
					// this.dialogForm = JSON.parse(JSON.stringify(data))s
					this.dialogLoading = true;
					this.axios.get(`${this.common.basePath}/role/${data.id}`).then((response) => {
					  this.dialogForm = response.data.data;
					  this.dialogLoading = false;
					}).catch((errorMsg) => {
					  this.dialogLoading = false;
					  this.$message.error(errorMsg);
					}) 
				}
			},
			/**
			 * 提交表单
			 * @param  {[type]}                 formName [description]
			 * @return {[type]}                          [description]
			 */
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.bottonLoding = true;
						if(this.dialogType == 'add'){
							let form = this.dialogForm;
							this.axios.post(`${this.common.basePath}/role`,form).then((response) => {
								this.$message.success(response.data.meta.message);
								this.query();
								this.bottonLoding = false;
								this.dialogVisible = false;
							}).catch((errorMsg) => {
								this.bottonLoding = false;
								this.$message.error(errorMsg);
							})  
						}else{
							let form = this.dialogForm;
							form.id = this.dialogForm.id;
							this.axios.patch(`${this.common.basePath}/role/${form.id}`,form).then((response) => {
								this.$message.success(response.data.meta.message);
								this.query();
								this.bottonLoding = false;
								this.dialogVisible = false;
							}).catch((errorMsg) => {
								this.bottonLoding = false;
								this.$message.error(errorMsg);
							}) 
						}
					} else {
						return false;
					}
				});
			},
			/**
			 * 注销
			 * @param  {[type]}                 data [description]
			 * @return {[type]}                      [description]
			 */
			deleteOperation(data){
				this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
				  confirmButtonText: '是',
				  cancelButtonText: '否',
				  type: 'warning'
				}).then(() => {
				  this.axios.patch(`${this.common.basePath}/role/delete/${data.id}`).then((response) => {
				    this.$message.success(response.data.meta.message);
				    this.query();
				  }).catch((errorMsg) => {
				    this.$message.error(errorMsg);
				  }) 
				}).catch(() => {});
			},
			
    },
  }
</script>

<style lang="less" scoped>
  .role-page{

  }
</style>
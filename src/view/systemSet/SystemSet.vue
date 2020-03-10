<template>
  <div class="user-page">
		<!-- 头部 面包屑导航 -->
		<div class="main-view-wrap-header">
			<el-card class="" shadow="never">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
					<el-breadcrumb-item>系统设置</el-breadcrumb-item>
				</el-breadcrumb>
			</el-card>			
		</div>
		<!-- 主要内容 -->
		<div class="main-view-wrap-content">
			<!-- 搜素区域 -->
			<el-card class="marb20">
				<el-form :inline="true" :model="searchForm" ref="searchForm">
				  <el-form-item label="类型：" prop="typeId">
						<el-select v-model="searchForm.typeId" placeholder="请选择类型">
							<el-option v-for="item in typeList" :label="item.name" :value="item.id"></el-option>
						</el-select>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="searchForm.pageNum = 1;query();" size="small"  icon="el-icon-search">查询</el-button>
						<el-button @click="resetForm('searchForm')" size="small" icon="el-icon-refresh">重置</el-button>
				  </el-form-item>
				</el-form>
			</el-card>
			<!-- 内容区域 -->
			<el-card class="marb20">
				<el-row :gutter="20">
					<el-col :span="6">
						<el-card shadow="never">
							<!-- 内容标题以及操作 -->
							<div slot="header" class="clearfix">
								<span>字典类型</span>
								<i class="el-icon-circle-plus-outline text-success fr font-size-20" @click="() => append('dialogForm01',null)"></i>
							</div>
							<!-- 类型树 -->
							<el-tree :data="typeTree" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="highlight" default-expand-all :indent="20">
								<div class="custom-tree-node fill-width" slot-scope="{ node, data }" @mouseenter="tempId = data.id" @mouseleave="tempId = null">
									<span>{{ node.label }}</span>
									<span v-if="tempId&&tempId == data.id">
										<i class="el-icon-delete text-danger fr font-size-20" @click.stop="() => remove(node, data)"></i>
									</span>
								</div>
							</el-tree>
						</el-card>
					</el-col>
					<el-col :span="18">
						<el-card shadow="never">
							<!-- 内容标题以及操作 -->
							<div slot="header" class="clearfix">
								<span>字典列表（{{conversionText()}}）</span>
								<el-button class="fr" v-if="searchForm.typeId" type="success" size="small" @click="operation('add','dialogForm',null)"  icon="el-icon-plus">添 加</el-button>
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
									label="名称"
									show-overflow-tooltip
									align="center"
									width="200">
								</el-table-column>
								<el-table-column
									prop="code"
									label="编码"
									show-overflow-tooltip
									align="center"
									width="150">
								</el-table-column>
								<el-table-column
									prop="description"
									label="描述"
									show-overflow-tooltip
									align="center"
									width="">
								</el-table-column>
								<el-table-column
									fixed="right"
									width="120"
									align="center"
									label="操作">
									<template slot-scope="scope">
										<!-- <el-button
											type="primary"
											size="small"
											@click="operation('edit','dialogForm',scope.row)" icon="el-icon-edit">编 辑</el-button> -->
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
					</el-col>
				</el-row>
			</el-card>
			
		</div>
		<!-- 底部 -->
		<div class="main-view-wrap-footer"></div>
    
		<!-- 添加/编辑字典列表 -->
		<el-dialog :title="dialogType=='edit'?'编辑':'添加'" :visible.sync="dialogVisible" width="800px">
			<el-form ref="dialogForm"  :model="dialogForm" label-width="120px" v-loading="dialogLoading">
				<el-row>
					<el-col :span="12">
						<el-form-item 
							label="名称：" prop="name"
							:rules="[
								{ required: true, message: '请输入名称', trigger: 'blur' }
							]">
							<el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.name" placeholder="名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item 
							label="编码：" prop="code"
							:rules="[
								{ required: true, message: '请输入编码', trigger: 'blur' }
							]">
							<el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.code" placeholder="编码"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item 
							label="简介：" prop="describe"
							:rules="[
								{ required: false, message: '请输入内容', trigger: 'blur' }
							]">
							<el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogForm.describe" placeholder="内容..."></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false" size="small">取消</el-button>
				<el-button type="primary" @click="submitForm('dialogForm')" size="small" :loading="bottonLoding" :disabled="bottonLoding">保 存{{bottonLoding?' 中...':''}}</el-button>
			</div>
		</el-dialog>
		
		<!-- 添加/编辑字典类型 -->
		<el-dialog :title="dialogType=='edit'?'编辑':'添加'" :visible.sync="dialogVisible01" width="400px">
			<el-form ref="dialogForm01"  :model="dialogForm01" label-width="80px" v-loading="dialogLoading">
				<el-row>
					<el-col :span="24">
						<el-form-item 
							label="名称：" prop="name"
							:rules="[
								{ required: true, message: '请输入名称', trigger: 'blur' }
							]">
							<el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm01.name" placeholder="名称"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible01 = false" size="small">取消</el-button>
				<el-button type="primary" @click="submitFormType('dialogForm01')" size="small" :loading="bottonLoding" :disabled="bottonLoding">保 存{{bottonLoding?' 中...':''}}</el-button>
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
					typeId:   null,
					pageSize: 10,
					pageNum:  1,
				},
				typeList:[],
				
				typeTree:[{id:null,name:'全部',childrens:[]}],
				defaultProps: {
					children: 'childrens',
					label: 'name'
				},
				highlight:true,// 高亮显示
				tempId:      null, //鼠标浮动对应的节点id
				tableData:{rows:[],total:0},
				
				
				dialogLoading:false,
				dialogType:'add',
				dialogVisible:false,
				dialogForm:   {},
				
				dialogVisible01:false,
				dialogForm01:   {},
      };
    },
    created(){

    },
    mounted(){
			this.query();
			this.queryType();
    },
    methods:{
    	/**
    	 * 转化文本
    	 * @return {[type]} [description]
    	 */
    	conversionText(){
    		let typeList = this.typeList;
    		let type = this.searchForm.typeId;
    		let result = '';
    		if(type){
    			typeList.forEach( function(element, index) {
    				if(type == element.id){
    					result = element.name;
    					return;
    				}
    			});
    		}else{
    			result = '全部'
    		}
    		return result;
    	},
			/**
			 * 重置
			 * @param  {[type]}            formName [description]
			 * @return {[type]}                     [description]
			 */
			resetForm(formName) {
				this.searchForm.pageNum = 1;
				this.searchForm.pageSize = 10;
				this.$refs[formName]?this.$refs[formName].resetFields():'';

				this.searchForm.typeId = null;
				this.searchForm.typeId ? this.highlight = true : this.highlight = false;
				
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
			 * 点击字典类型，查询字典列表
			 * @param  {[type]}                data [description]
			 * @return {[type]}                     [description]
			 */
			handleNodeClick(data) {
				this.searchForm.typeId = data.id;
				this.searchForm.typeId ? this.highlight = true : this.highlight = false;
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
				  url: `${this.common.basePath}/dictionaries/type`,
				  method: "post",
				  data: this.searchForm
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
			 * 查询字典类型
			 * @return {[type]}                     [description]
			 */
			queryType(){
				var self = this;
				self.loading = true;
				let config = {
				  url: `${this.common.basePath}/dType/list`,
				  method: "get",
				  data: {}
				}
				this.axios(config).then((r) => {
					this.typeList = r.data.data;
					this.typeTree[0].childrens = r.data.data;
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
					this.dialogLoading = true;
					this.axios.get(`${this.common.basePath}/dictionaries/one`,{params:{id:data.id}}).then((response) => {
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
							form.type = this.searchForm.typeId;
							this.axios.post(`${this.common.basePath}/dictionaries/add`,form).then((response) => {
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
							this.axios.post(`${this.common.basePath}/dictionaries/updata`,form).then((response) => {
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
			 * 删除
			 * @param  {[type]}                 data [description]
			 * @return {[type]}                      [description]
			 */
			deleteOperation(data){
				this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
				  confirmButtonText: '是',
				  cancelButtonText: '否',
				  type: 'warning'
				}).then(() => {
				  this.axios.delete(`${this.common.basePath}/dictionaries/delete`,{params:{id:data.id}}).then((response) => {
				    this.$message.success(response.data.meta.message);
				    this.query();
				  }).catch((errorMsg) => {
				    this.$message.error(errorMsg);
				  }) 
				}).catch(() => {});
			},
			
			/**
			 * 添加类型
			 * @param  {[type]}                 type     [description]
			 * @param  {[type]}                 formName [description]
			 * @param  {[type]}                 data     [description]
			 */
			append(formName,data){
				this.dialogType = "add";
				this.dialogVisible01 = true;
				this.$refs[formName]?this.$refs[formName].resetFields():'';
				this.dialogForm01 = {};
			},
			/**
			 * 提交添加类型的表单
			 * @param  {[type]}                 formName [description]
			 * @return {[type]}                          [description]
			 */
			submitFormType(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.bottonLoding = true;
						if(this.dialogType == 'add'){
							let form = this.dialogForm01;
							this.axios.post(`${this.common.basePath}/dType/create?name=${form.name}`).then((response) => {
								this.$message.success(response.data.meta.message);
								this.queryType();
								this.bottonLoding = false;
								this.dialogVisible01 = false;
							}).catch((errorMsg) => {
								this.$message.error(errorMsg);
							})  
						}else{
							let form = this.dialogForm;
							form.id = this.dialogForm.id;
							this.axios.post(`${this.common.basePath}/dType/updata`,form).then((response) => {
								this.$message.success(response.data.meta.message);
								this.queryType();
								this.bottonLoding = false;
								this.dialogVisible01 = false;
							}).catch((errorMsg) => {
								this.$message.error(errorMsg);
							}) 
						}
					} else {
						return false;
					}
				});
			},
			/**
			 * 删除类型
			 * @param  {[type]}                 data [description]
			 * @param  {[type]}                 node [description]
			 * @return {[type]}                      [description]
			 */
			remove(node, data) {
				this.$confirm('此操作将删除该类型, 是否继续?', '提示', {
				  confirmButtonText: '是',
				  cancelButtonText: '否',
				  type: 'warning'
				}).then(() => {
				  this.axios.delete(`${this.common.basePath}/dType/delete`,{params:{id:data.id}}).then((response) => {
				    this.$message.success(response.data.meta.message);
				    this.queryType();
				  }).catch((errorMsg) => {
				    this.$message.error(errorMsg);
				  }) 
				}).catch(() => {});
			},
			
    },
  }
</script>

<style lang="less" scoped>
  .user-page{

  }
</style>
<!-- 家教信息广场 -->
<template>
  <div class="homeinfo-page" ref="contentWrap">
    <!-- 头部 面包屑导航 -->
    <div class="main-view-wrap-header">
      <el-card class="" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>家教信息广场</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>      
    </div>
    <!-- 主要内容 -->
    <div class="main-view-wrap-content">
      <!-- 搜素区域 -->
      <el-card class="marb20">
        <el-form :inline="true" :model="searchForm" ref="searchForm">
					<el-form-item label="发布者：" prop="releaseUser">
					  <el-select v-model="searchForm.releaseUser" placeholder="发布者">
					    <el-option v-for="item in userData.rows" :label="item.name" :value="item.id"></el-option>
					  </el-select>
					</el-form-item>
					<el-form-item label="日期：" prop="dateVal">
            <el-date-picker
              v-model="searchForm.dateVal"
              type="datetimerange"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="学历：" prop="level">
            <el-select v-model="searchForm.level" placeholder="学历">
              <el-option v-for="item in levelData.rows" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
					<el-form-item label="科目：" prop="subject">
					  <el-select v-model="searchForm.subject" placeholder="科目">
					    <el-option v-for="item in subjectData.rows" :label="item.name" :value="item.id"></el-option>
					  </el-select>
					</el-form-item>
					<el-form-item label="年级：" prop="grade">
					  <el-select v-model="searchForm.grade" placeholder="年级">
					    <el-option v-for="item in gradeData.rows" :label="item.name" :value="item.id"></el-option>
					  </el-select>
					</el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchForm.pageNum = 1;query(true);" size="small"  icon="el-icon-search">查询</el-button>
            <el-button @click="resetForm('searchForm')" size="small" icon="el-icon-refresh">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <!-- 内容区域 卡片-->
      <el-card class="marb20">
      	<!-- 内容标题以及操作 -->
        <div slot="header" class="clearfix">
          <span>家教信息广场</span>
          <!-- 只有教员、管理员、机构才能发布 -->
          <el-button class="fr" type="success" size="small" @click="operation('add','dialogForm',null)"  icon="el-icon-plus" v-if="userInfo&&(userInfo.role==1||userInfo.role==3||userInfo.role==4)">发 布</el-button>
        </div>
        <!-- 卡片数据 -->
        <div v-loading="loading">
          <el-row class="" v-if="tableData.total > 0" :gutter="20">
            <el-checkbox-group v-model="selection" size="small">
	            <el-col :span="8" v-for="(item, index) in tableData.rows" :key="index">
	              <el-card class="card-wrap">
	                <el-tag class="width-percentage" type="success">
		                <h3 class="card-title marb0">
		                  <!-- <el-checkbox :label="item.id" :disabled="false"><span v-show="false">label</span></el-checkbox> -->
		                  <span class="card-title">{{item.title}}</span>
		                </h3>
	                </el-tag>
	                <div class="card-content">
	                	<el-form label-width="90px" class="show-detail-form">
	                		<el-row :gutter="20">
											  <el-col :span="24">
											  	<el-form-item label="序列号：">
												    <div>{{ item.serialNumber }}</div>
												  </el-form-item>
											  </el-col>
											  <el-col :span="12">
											  	<el-form-item label="发布人：">
												    <div>{{ common.conversionDic(userData.rows,item.releaseUser) }}</div>
												  </el-form-item>
											  </el-col>
											  <el-col :span="12">
											  	<el-form-item label="发布时间：">
												    <div>{{ common._convertDate(item.createTime,'yyyy年MM月dd日') }}</div>
												  </el-form-item>
											  </el-col>
											  <el-col :span="12">
											  	<el-form-item label="学历：">
												    <div>{{ common.conversionDic(dicData.rows,item.level) }}</div>
												  </el-form-item>
											  </el-col>
											  <el-col :span="12">
											  	<el-form-item label="年级：">
												    <div>{{ common.conversionDic(dicData.rows,item.grade) }}</div>
												  </el-form-item>
											  </el-col>
											  <el-col :span="12">
											  	<el-form-item label="科目：">
												    <div>{{ common.conversionDic(dicData.rows,item.subject) }}</div>
												  </el-form-item>
											  </el-col>
											  <el-col :span="12">
											  	<el-form-item label="薪资：">
												    <div>{{ item.salaryPrice }} 元/小时</div>
												  </el-form-item>
											  </el-col>
											  <el-col :span="12">
											  	<el-form-item label="学时：">
												    <div>{{ item.classHour }} 小时</div>
												  </el-form-item>
											  </el-col>
											  <el-col :span="12">
											  	<el-form-item label="状态：">
												    <div>
												    	<el-tag v-if="item.status==1">待接单</el-tag>
													    <el-tag type="success" v-if="item.status==2">已接单</el-tag>
													    <el-tag type="info" v-if="item.status==3">已完成</el-tag>
												    </div>
												  </el-form-item>
											  </el-col>
											  <el-col :span="24">
											  	<el-form-item label="日期：">
												    <div>{{ common._convertDate(item.sTime,'yyyy年MM月dd日')}}~{{common._convertDate(item.eTime,'yyyy年MM月dd日') }}</div>
												  </el-form-item>
											  </el-col>
											</el-row>
	                		<el-form-item label="内容：">
										    <div class="more-line-ellipsis">{{ item.content }}</div>
										  </el-form-item>
										  <el-form-item label="备注：">
										    <div class="a-line-ellipsis">{{ item.remarks }}</div>
										  </el-form-item>
										</el-form>
	                </div>
	                <div class="card-bottom">
	                  <div class="operation-area text-right" v-if="userInfo">
	                  	<!-- 
		                  	编辑、删除：只有管理员和学生自己发布的、机构自己发布的才能进行编辑和删除操作
		                  	下单：只有管理员和教员才能进行接单操作 
	                  	-->
	                  	<el-button
				                type="primary"
				                size="small"
				                v-if="(userInfo.role==4&&userInfo.id==item.releaseUser)||(userInfo.role==1&&userInfo.id==item.releaseUser)||userInfo.role==3"
				                @click="operation('edit','dialogForm',item)" icon="el-icon-edit">编 辑</el-button>
											<el-button
											  size="small"
											  v-if="userInfo&&userInfo.role!=1"
											  type="success"
											  :disabled="item.status!=1"
											  @click="orderOperation(item,'single')" icon="el-icon-shopping-cart-full">接 单</el-button>
				              <el-button
				                size="small"
				                type="danger"
				                v-if="(userInfo.role==4&&userInfo.id==item.releaseUser)||(userInfo.role==1&&userInfo.id==item.releaseUser)||userInfo.role==3"
				                @click="deleteOperation(item)" icon="el-icon-delete">删 除</el-button>
				              <el-button
				                type="info"
				                size="small"
				                @click="drawer = true;queryEvaluate(item);commentOperateData = item;toCommentData = null;evaluate=[]" icon="el-icon-view">查看评论</el-button>
		                 </div>
		                  
	                </div>
	              </el-card>
	            </el-col>
            </el-checkbox-group>
          </el-row>
          <el-row class="text-center text-info" v-else>
            暂无数据
          </el-row>
        </div>
      </el-card>
			<!-- 内容区域 表格 -->
      <!-- <el-card class="marb20">
        <el-table
          :data="tableData.rows"
          :row-key="getRowKeys"
          @selection-change="handleSelectionChange"
          border
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            fixed="left"
            type="selection"
            :selectable="checkSelectable"
            :reserve-selection="true"
            width="55">
          </el-table-column>
        </el-table>
      </el-card> -->
    </div>
    <!-- 底部 -->
    <div class="main-view-wrap-footer">
    	<!-- <video src="http://www.lppdd.top:8090/Content/1.mp4" controls="controls">
				您的浏览器不支持 video 标签。
			</video> -->
    </div>
    
    <!-- 添加/编辑 -->
    <el-dialog :title="dialogType=='edit'?'编辑':'发布家教信息'" :visible.sync="dialogVisible" width="800px">
      <el-form ref="dialogForm"  :model="dialogForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
					<el-col :span="12">
					  <el-form-item 
					    label="标题：" prop="title"
					    :rules="[
					      { required: true, message: '请输入标题', trigger: 'blur' }
					    ]">
					    <el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.title" placeholder="标题"></el-input>
					  </el-form-item>
					</el-col>
					<el-col :span="24">
					  <el-form-item 
					    label="日期：" prop="dateVal"
					    :rules="[
					      { required: true, message: '请选择日期', trigger: 'change' }
					    ]">
							<el-date-picker
							  v-model="dialogForm.dateVal"
							  type="daterange"
								:picker-options="pickerOptions"
							  value-format="timestamp"
							  range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
							</el-date-picker>
					  </el-form-item>
					</el-col>
					<el-col :span="12">
					  <el-form-item 
					    label="学时：" prop="classHour"
					    :rules="[
					      { required: true, message: '请输入学时', trigger: 'blur' }
					    ]">
							<el-input-number v-model="dialogForm.classHour" :min="0"></el-input-number> 小时
					  </el-form-item>
					</el-col>
					<el-col :span="12">
					  <el-form-item 
					    label="薪资：" prop="salaryPrice"
					    :rules="[
					      { required: true, message: '请输入薪资', trigger: 'blur' }
					    ]">
							<el-input-number v-model="dialogForm.salaryPrice" :min="0" :step="100"></el-input-number> 元/小时
					  </el-form-item>
					</el-col>
					<el-col :span="12">
					  <el-form-item 
					    label="学历：" prop="level"
					    :rules="[
					      { required: true, message: '选择学历', trigger: 'change' }
					    ]">
							<el-select v-model="dialogForm.level" placeholder="学历">
							  <el-option v-for="item in levelData.rows" :label="item.name" :value="item.id"></el-option>
							</el-select>
					  </el-form-item>
					</el-col>
					<el-col :span="12">
					  <el-form-item 
					    label="科目：" prop="subject"
					    :rules="[
					      { required: true, message: '选择科目', trigger: 'change' }
					    ]">
							<el-select v-model="dialogForm.subject" placeholder="科目">
							  <el-option v-for="item in subjectData.rows" :label="item.name" :value="item.id"></el-option>
							</el-select>
					  </el-form-item>
					</el-col>
					<el-col :span="12">
					  <el-form-item 
					    label="年级：" prop="grade"
					    :rules="[
					      { required: true, message: '选择年级', trigger: 'change' }
					    ]">
							<el-select v-model="dialogForm.grade" placeholder="年级">
							  <el-option v-for="item in gradeData.rows" :label="item.name" :value="item.id"></el-option>
							</el-select>
					  </el-form-item>
					</el-col>
					<el-col :span="24">
					  <el-form-item 
					    label="信息内容：" prop="content"
					    :rules="[
					      { required: true, message: '请输入内容', trigger: 'blur' }
					    ]">
					    <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogForm.content" placeholder="内容..."></el-input>
					  </el-form-item>
					</el-col>
          <el-col :span="24">
            <el-form-item 
              label="备注：" prop="remarks"
              :rules="[
                { required: false, message: '请输入内容', trigger: 'blur' }
              ]">
              <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogForm.remarks" placeholder="内容..."></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取消</el-button>
				<el-button type="primary" @click="submitForm('dialogForm')" size="small" :loading="bottonLoding" :disabled="bottonLoding">保 存{{bottonLoding?' 中...':''}}</el-button>
      </div>
    </el-dialog>

    
		<el-drawer title="评论信息" :visible.sync="drawer" size="500px" :direction="direction" :modal="false">
			<!-- 评论树 -->
		  <el-tree
				:data="evaluate"
				:indent="20"
				icon-class="el-icon-more"
				empty-text="暂无评分"
				class="evaluate-tree-box">
				<div class="custom-evaluate-tree" slot-scope="{ node, data }" @mouseover=" tempAtId = data.id " @mouseout="tempAtId = null">
					<div class="top">
						<div class="user fl">
							<el-avatar :size="30" src="../../assets/img/male.png" @error="true" class="fl">
					      <img src="../../assets/img/male.png" height="30" width="30"/>
					    </el-avatar>
					    <span class="fl info">{{ common.conversionDic(userData.rows,data.spokeMan) }}</span>
							<span class="fl info">{{common._convertDate(data.createTime,'yyyy/MM/dd hh:mm:ss')}}</span>
							<span class="fl info text-warning">{{data.score}}分</span>
						</div>
						<div v-show="tempAtId == data.id" class="operate fr">
							<el-button v-if="!data.parentId" type="text" size="mini" @click.stop="toCommentData = data">追评</el-button>
							<!-- <el-button
								class="text-danger"
								type="text"
								size="mini"
								@click.stop="deleteComment(data)">
								删除
							</el-button> -->
							&nbsp;&nbsp;&nbsp;&nbsp;
							<el-popconfirm title="该评论确定删除吗？" @onConfirm="deleteComment(data)">
							  <el-button class="text-danger" type="text" size="mini" slot="reference" @click.stop>删除</el-button>
							</el-popconfirm>
						</div>
					</div>
					<div class="bottom">
						<div class="content">
							{{data.content}}
						</div>
					</div>
				</div>
			</el-tree>
			<!-- 发表评论 -->
			<div class="publish-box">
				<el-form ref="scoreForm"  :model="scoreForm" label-width="0">
					<el-form-item 
				    label="" prop="val"
				    :rules="[
				      { required: true, message: '请评分', trigger: 'blur' }
				    ]">
				    <el-rate v-model="scoreForm.val" show-score :max="10"></el-rate>
				  </el-form-item>
				  <el-form-item 
				    label="" prop="content"
				    :rules="[
				      { required: true, message: '请输入评论内容', trigger: 'blur' }
				    ]">
				    <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="scoreForm.content" placeholder="内容..."></el-input>
				  </el-form-item>
				</el-form>
				<div class="overflow-hidden">
					<el-link type="primary" v-if="toCommentData" class="fl mart8" @click="toCommentData=null">去评价单子</el-link>
					<el-button
					  v-if="toCommentData"
						class="fr"
	          size="small"
	          type="primary"
	          @click="publishComment('scoreForm');" icon="el-icon-s-comment"  :loading="bottonLoding" :disabled="bottonLoding">追 评{{bottonLoding?' 中...':''}}</el-button>
					<el-link type="primary" v-if="toCommentData" class="fr mart8 marr5" @click="toCommentData=null" :underline="false">@{{common.conversionDic(userData.rows,toCommentData.spokeMan)}}</el-link>

					<el-button
						v-if="!toCommentData"
						class="fr"
	          size="small"
	          type="success"
	          @click="publishComment('scoreForm');" icon="el-icon-s-comment"  :loading="bottonLoding" :disabled="bottonLoding">发 表{{bottonLoding?' 中...':''}}</el-button>
				</div>
				
			</div>
		</el-drawer>
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
				evaluateLoading:false,
				userInfo:JSON.parse(sessionStorage.getItem("userInfo"))||null,
				pickerOptions: {
					disabledDate: (time) => {
					 let nowData = new Date()
					 nowData = new Date(nowData.setDate(nowData.getDate() - 1))
					 return time < nowData
					}
				},
				getRowKeys(row) {//列表 获取row的key值(vue + element-ui Table 的数据多选 多页选择数据回显，分页记录保存选中的数据)
          return row.id;
        },
        selection:[],// 列表多选
        
        searchForm: {
          dateVal:  null,
          releaseUser:null,
          level:null,
					subject:null,
					grade:null,
          pageSize: 6,
          pageNum:  1,
        },
        scrollLoadSw: true, //滚动加载开关
        
        tableData:  {rows:[],total:0},
				dicData:    {rows:[],total:0},
				levelData:  {rows:[],total:0},
				subjectData:{rows:[],total:0},
				gradeData:  {rows:[],total:0},
				userData:   {rows:[],total:0},
        
        dialogLoading:false,
        dialogType:'add',
        dialogVisible:false,
        dialogForm:   {},

        drawer:false,
        direction: 'rtl',
        evaluate:[],
				tempAtId:null,

				commentOperateData:null,// 评论的单子的数据
				toCommentData:null,// 根据评论信息去追评的数据
				scoreForm:{},
      };
    },
    created(){
			this.queryDic(null);
			this.queryDic(1);
			this.queryDic(2);
			this.queryDic(3);
			this.queryUser();
    },
    mounted(){

      // ------ 滚动加载更多 -------
      // 通过$refs获取dom元素
      let box = this.$refs.contentWrap;
      // 监听这个dom的scroll事件
      box.addEventListener('scroll', () => {
      // 滑动到底部50的时候操作数据
      if(box.clientHeight + 50 >= box.scrollHeight - box.scrollTop ) {
        // ------ 值为true表示可以再次请求
        if(this.scrollLoadSw){
          this.scrollLoadSw = false;
          if(this.searchForm.pageNum < this.tableData.total / this.searchForm.pageSize){
            this.query(false);
          } 
        }
         
        }  
      }, false)   

      //----- 初始化 ------- 
      this.query(true);

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
        this.query(true);
      },
      /**
       * 列表 多选的值变化
       * @param  {Array} val [description]
       * @return {[type]}     [description]
       */
      handleSelectionChange(val) {
        this.selection = val;
        console.log(this.selection)
      },
      /**
       * 列表 多选的禁用
       * @param  {[type]}                 row [description]
       * @return {[type]}                     [description]
       */
      checkSelectable(row) {
	      let result = true;
	      if(this.userInfo.role==1){
	      	result = false;
	      }else{
	      	row.status!=1?result = false : result = true;
	      }
				return result;	      
	    },
      
      /**
       * 查询列表，请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @params {bool} isRefresh true为重置数据 false累加数据
       * @return {[type]}                     [description]
       */
      query(isRefresh){
        var self = this;
        self.loading = true;
        this.axios.get(`${this.common.basePath}/tutorRelease`,{params: this._queryParams(isRefresh)}).then((r) => {
          // ---------- 当时加载更多是，就需要累加，否则直接覆盖
          if(!isRefresh) { 
            // ----------- 合并两个数组 ------------
            this.tableData.rows = this.tableData.rows.concat(r.data.data.rows);

            this.tableData.total = r.data.data.total;
          }else{
            // ---------- 查询第一页数据 ---------  
            this.tableData = r.data.data;
          }
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true;
          self.loading = false;
        }).catch((error) => {
          this.$message.error(error); 
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true;
          self.loading = false;
        });
      },
      _queryParams(isRefresh){
      	isRefresh ? this.searchForm.pageNum = 1 : this.searchForm.pageNum ++;
      	let params = {
          releaseUser:this.searchForm.releaseUser,
          level:this.searchForm.level,
					subject:this.searchForm.subject,
					grade:this.searchForm.grade,
          pageSize: this.searchForm.pageSize,
          pageNum:  this.searchForm.pageNum,
        };
        if(this.searchForm.dateVal&&this.searchForm.dateVal.length>0){
        	params.sTime = this.searchForm.dateVal[0];
        	params.eTime = this.searchForm.dateVal[1];
        }
        return params;
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
					type==1?this.levelData = r.data.data:"";
					type==2?this.subjectData = r.data.data:"";
					type==3?this.gradeData = r.data.data:"";
        }).catch((e) => {
          self.$message.error(e)
        })
      },
			/**
			 * 查询发布者
			 * @return {[type]}                     [description]
			 */
			queryUser(){
			  var self = this;
			  let config = {
			    url: `${this.common.basePath}/user/list`,
			    method: "post",
			    data: {role:null}
			  }
			  this.axios(config).then((r) => {
			    this.userData = r.data.data;
			  }).catch((e) => {
			    self.$message.error(e)
			  })
			},
			/**
			 * 查询某条单子的评价
			 * @param  {[type]}                 data [description]
			 * @return {[type]}                      [description]
			 */
			queryEvaluate(data){
			  var self = this;
			  self.evaluateLoading = true;
			  let config = {
			    url: `${this.common.basePath}/evaluate/one`,
			    method: "get",
			    params: {id:data.id}
			  }
			  this.axios(config).then((r) => {
			    this.evaluate = r.data.data;
			    self.evaluateLoading = false;
			  }).catch((e) => {
			    self.evaluateLoading = false;
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
          // this.dialogForm = JSON.parse(JSON.stringify(data))
          this.dialogLoading = true;
          this.axios.get(`${this.common.basePath}/tutorRelease/${data.id}`).then((response) => {
            this.dialogForm = response.data.data;
						this.dialogForm.dateVal = [response.data.data.sTime,response.data.data.eTime];
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
							form.status = 1;// （1待接单，2已接单，3已完成）
							form.creator = this.userInfo.id;
							form.createTime = new Date().getTime();
							form.releaseUser = this.userInfo.id;
	
							form.dateVal ? form.sTime = form.dateVal[0] : '';
							form.dateVal ? form.eTime = form.dateVal[1] : '';
							// delete form.dateVal
							this.axios.post(`${this.common.basePath}/tutorRelease/create`,form).then((response) => {
							  this.$message.success(response.data.meta.message);
							  this.query(true);
								this.bottonLoding = false;
							  this.dialogVisible = false;
							}).catch((errorMsg) => {
								this.bottonLoding = false;
							  this.$message.error(errorMsg);
							}) 
							
               
            }else{
              let form = this.dialogForm;
              form.dateVal ? form.sTime = form.dateVal[0] : '';
              form.dateVal ? form.eTime = form.dateVal[1] : '';
              // delete form.dateVal
              form.id = this.dialogForm.id;
              this.axios.patch(`${this.common.basePath}/tutorRelease/${form.id}`,form).then((response) => {
                this.$message.success(response.data.meta.message);
                this.query(true);
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
       * 删除订单
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      deleteOperation(data){
        this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.axios.patch(`${this.common.basePath}/tutorRelease/delete/${data.id}`).then((response) => {
            this.$message.success(response.data.meta.message);
            this.query(true);
          }).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }).catch(() => {});
      },
      /**
       * 下单
       * @param  {[type]}                 data [description]
       * @param  {[type]}                 type [description]
       * @return {[type]}                      [description]
       */
      orderOperation(data,type){
        this.$confirm('是否下单?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
        	
         	let form = {receiveId:this.userInfo.id};
         	if(type=='single'){
         		form.id = data.id;
         	}else{
         		form.ids = this.selection.map(item => {return item.id});
         	}
         	this.userInfo.role==2?form.teacher = this.userInfo.id:'';

          this.axios.post(`${this.common.basePath}/receive/confirm`,form).then((response) => {
            this.$message.success(response.data.meta.message);
            this.query(true);
          }).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }).catch(() => {});
      },

      /**
       * 发表评论
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      publishComment(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
						this.bottonLoding = true;
            let form = {
						  createTime: new Date().getTime(),
						  creator: this.userInfo.id,
						  spokeMan:this.userInfo.id,
						  parentId: this.toCommentData?this.toCommentData.id:null,
						  score: this.scoreForm.val,
						  release:this.commentOperateData.id,//单子id
						  serialNumber:this.commentOperateData.serialNumber,//单子序列号
						  content:this.scoreForm.content,
            }
						this.axios.post(`${this.common.basePath}/evaluate`,form).then((response) => {
						  this.$message.success(response.data.meta.message);
						  this.queryEvaluate(this.commentOperateData);
							this.bottonLoding = false;
						  this.scoreForm.val = 0;// 发表成功，清空记录
						  this.scoreForm.content = null;// 发表成功，清空记录
						}).catch((errorMsg) => {
							this.bottonLoding = false;
						  this.$message.error(errorMsg);
						}) 
          } else {
            return false;
          }
        });
      },
      /**
       * 删除评论
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      deleteComment(data){
        // this.$confirm('此操作将删除该评论, 是否继续?', '提示', {
        //   confirmButtonText: '是',
        //   cancelButtonText: '否',
        //   type: 'warning'
        // }).then(() => {
        //   this.axios.patch(`${this.common.basePath}/evaluate/delete/${data.id}`).then((response) => {
        //     this.$message.success(response.data.meta.message);
        //     this.queryEvaluate(this.commentOperateData);
        //   }).catch((errorMsg) => {
        //     this.$message.error(errorMsg);
        //   }) 
        // }).catch(() => {});
        this.axios.delete(`${this.common.basePath}/evaluate/${data.id}`).then((response) => {
          this.$message.success(response.data.meta.message);
          this.queryEvaluate(this.commentOperateData);
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        })
      },
      
    },
  }
</script>

<style lang="less" scoped>
  .homeinfo-page{
		overflow-y: auto;
		height: calc(100vh - 60px);
  }
</style>
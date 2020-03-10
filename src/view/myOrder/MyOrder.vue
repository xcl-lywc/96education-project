<!-- 我的接单 -->
<template>
  <div class="user-page">
    <!-- 头部 面包屑导航 -->
    <div class="main-view-wrap-header">
      <el-card class="" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>我的接单</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>      
    </div>
    <!-- 主要内容 -->
    <div class="main-view-wrap-content">
      <!-- 搜素区域 -->
      <el-card class="marb20">
        <el-form :inline="true" :model="searchForm" ref="searchForm">
          <el-form-item label="接单人:" prop="receiveId">
            <el-select v-model="searchForm.receiveId" placeholder="请选择接单人">
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
          <span>我的接单列表</span>
          <!-- <el-button class="fr" type="success" size="small" @click="operation('add','dialogForm',null)"  icon="el-icon-plus">添 加</el-button> -->
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
            prop="serialNumber"
            label="序列号"
            show-overflow-tooltip
            align="center"
            width="150">
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            show-overflow-tooltip
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            prop="eTime"
            label="日期"
            show-overflow-tooltip
            align="center"
            width="300">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.sTime,'yyyy年MM月dd日')}}~{{common._convertDate(scope.row.eTime,'yyyy年MM月dd日')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="releaseUser"
            label="发布人"
            show-overflow-tooltip
            align="center"
            width="100">
            <template slot-scope="scope">
              {{common.conversionDic(userData.rows,scope.row.releaseUser)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="发布时间"
            show-overflow-tooltip
            align="center"
            width="200">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.createTime,'yyyy年MM月dd日')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="level"
            label="学历"
            show-overflow-tooltip
            align="center"
            width="100">
            <template slot-scope="scope">
              {{common.conversionDic(dicData.rows,scope.row.level)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="grade"
            label="年级"
            show-overflow-tooltip
            align="center"
            width="100">
            <template slot-scope="scope">
              {{common.conversionDic(dicData.rows,scope.row.grade)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="subject"
            label="科目"
            show-overflow-tooltip
            align="center"
            width="100">
            <template slot-scope="scope">
              {{common.conversionDic(dicData.rows,scope.row.subject)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="classHour"
            label="学时"
            show-overflow-tooltip
            align="center"
            width="100">
            <template slot-scope="scope">
              {{scope.row.classHour}}小时
            </template>
          </el-table-column>
          <el-table-column
            prop="salaryPrice"
            label="薪资"
            show-overflow-tooltip
            align="center"
            width="100">
            <template slot-scope="scope">
              {{scope.row.salaryPrice}}元/小时
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            label="内容"
            show-overflow-tooltip
            align="center"
            width="">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            show-overflow-tooltip
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1">待接单</el-tag>
              <el-tag type="success" v-if="scope.row.status==2">已接单</el-tag>
              <el-tag type="info" v-if="scope.row.status==3">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注"
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
                size="small"
                type="success"
                :disabled="scope.row.status==3||scope.row.status==1"
                @click="completeOperation(scope.row)" icon="el-icon-shopping-cart-2">完 成</el-button>
              <el-button
                size="small"
                type="danger"
                :disabled="scope.row.status!=2"
                @click="cancelOperation(scope.row)" icon="el-icon-shopping-cart-2">取 消</el-button>
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
				userInfo:JSON.parse(sessionStorage.getItem("userInfo"))||null,
        
        searchForm: {
          dateVal:  null,
          receiveId:null,
          pageSize: 10,
          pageNum:  1,
        },
        
        tableData:{rows:[],total:0},
        userData: {rows:[],total:0},
        dicData:    {rows:[],total:0},
        userData:   {rows:[],total:0},
      };
    },
    created(){
      this.queryDic(null);
      this.queryUser();
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
          url: `${this.common.basePath}/receive/list`,
          method: "post",
          data: this.searchForm
        }
				config.data.receiveId = this.userInfo.id;
        config.data.dateVal ? config.data.sTime = config.data.dateVal[0] : delete config.data.sTime;
        config.data.dateVal ? config.data.eTime = config.data.dateVal[1] : delete config.data.eTime;
        // delete config.data.dateVal

        this.axios(config).then((r) => {
          this.tableData = r.data.data;
          self.loading = false;
        }).catch((e) => {
          self.loading = false;
          self.$message.error(e)
        })
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
        }).catch((e) => {
          self.$message.error(e)
        })
      },
      /**
       * 查询接单人
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
       * 完成订单
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      completeOperation(data){
        this.$confirm('是否完成该订单?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.axios.get(`${this.common.basePath}/receive/complete`,{params:{id:data.id}}).then((response) => {
            this.$message.success(response.data.meta.message);
            this.query();
          }).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }).catch(() => {});
      },
      /**
       * 取消订单
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      cancelOperation(data){
        this.$confirm('是否取消该订单?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.axios.get(`${this.common.basePath}/receive/cancel`,{params:{id:data.id}}).then((response) => {
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
  .user-page{

  }
</style>
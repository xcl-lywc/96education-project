<!-- 导航组件 -->
<template>  
  <div id="nav-bar">
    <el-menu
			class="el-menu-vertical-demo menu-vertical-box"
			@select="handleSelect"
			active-text-color="#409EFF">
			<el-menu-item index="HomeInfo">
				<i class="el-icon-info"></i>
				<span slot="title">家教信息广场</span>
			</el-menu-item>
			<el-menu-item index="MyOrder">
				<i class="el-icon-menu"></i>
				<span slot="title">我的接单</span>
			</el-menu-item>
			<el-submenu index="PersonManageIndex">
				<template slot="title">
					<i class="el-icon-user"></i>
					<span>用户管理</span>
				</template>
				<el-menu-item index="UserList">用户列表</el-menu-item>
				<el-menu-item index="RoleList">角色列表</el-menu-item>
			</el-submenu>
			<el-menu-item index="SystemSet">
				<i class="el-icon-setting"></i>
				<span slot="title">系统设置</span>
			</el-menu-item>
			
		</el-menu>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        
      }
    },
    props: {
      
    },
    watch: {
    },
    created () {
      console.log(this.$router.options.routes)
    },
    mounted () {

    },
    methods: {
			handleSelect(key, keyPath) {
				console.log(key, keyPath);
				this.$router.push({name: key});
			}
    }
  }
</script>

<style lang='less'>
  #nav-bar{
		width: 100%;
		.menu-vertical-box{
			width: 100%;
			height: calc(100vh - 60px);
			background:#d9f3ff;
			.el-menu{
				background-color:#d9f3ff !important;
			}
		}
  }
</style>

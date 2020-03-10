import vue from 'vue';
import { MessageBox } from 'element-ui';
import router from '.././router'
import store from '.././store'
import qs from "qs"
const Vue = new vue({router, store}); //注册router, 实例中调用

export default {
  basePath:       `${window.location.origin}/api`,
  filePath:       `${window.location.origin}`,
  elementPagination: {     //elementUi中的分页所需数据
    pageSizes: [10, 20, 30],
    pageSizeDefault: 10,   //初始条数
    pageNumDefault:1,      //初始页码
  },
  emailReg:      /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
  mobileReg:     /^1[34578]\d{9}$/,
  /**
  * 将时间戳转换为某年某月某日 00：00：00
  * @params {string/number} timeSetback 时间戳
  * @params {string} format 时间格式
  */
  _convertDate(timeSetback, format){
    return timeSetback ? new Date(timeSetback).Format(format) : '无';
  },
	/*
	 * 转化字典、用户
	 */
	conversionDic(dic,id){
		let result = "无"
		dic.forEach( function(element, index) {
			if(element.id == id){
				result = element.name
				return;
			}
		});
		return result;
	},
  /*
   * 根据附件地址下载附件
   */
  downloadFileByUrl(fileUrl){
    window.open(fileUrl);
  },
  /**
   * 通用方法用于返回之前浏览的页面, 当path丢失时返回首页
   * @return {[type]} [description]
   */
  backForward () {
    let path = sessionStorage.getItem("historyPath") || "/"
    Vue.$router.push({path: path})
  },
  /**
   * 根据日期字符串获取星期几
   * @param dateString 日期字符串（如：2016-12-29），为空时为用户电脑当前日期
   * @returns {String}
   */
  getWeek(dateString){  
    var date; 
    date = new Date(dateString)  
    return "星期" + "日一二三四五六".charAt(date.getDay());
  },
  /*
   * 文本验证字符
   * @params {object} rule 文本详细信息
   * @params {string} value 文本的值
   * @params {object} callback 回调函数
   * @params {string} type  文本类型 single为单行(20)，textarea为多行(128)
   */
  wordNumberValid(rule, value, callback, type){  
    if(value){
      if(type == 'single'){
        if(value.length > 20){
          return callback(new Error('最大字数不能超过20个字'));
        }
        return callback();
      }else{
        if(value.length > 128){
          return callback(new Error('最大字数不能超过128个字'));
        }
        return callback();
      } 
    }
    return callback();
  },
  /*
   * blod 下载附件
   */
  _fileBold(response) {
    let fileName = decodeURI(response.headers['content-disposition'].substring(20, response.headers['content-disposition'].length));
    let url = window.URL.createObjectURL(new Blob([response.data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
  },
  /*
   * 查询文件流并下载
   * @params {string/number} fileId 
   */
  downloadFile(fileId){ 
    // ------ 文件流下载必须要指定responseType的类型为blob才能正确显示
    Vue.$request.requestAxios('get', basePath + '/file/'+ fileId +'/download', {responseType: "blob"}, 
      (respose) => {// 请求成功回调函数...
        this._fileBold(respose)
      }, (error) => {// 请求失败回调函数...
        Vue.$message('/file/'+fileId+'/download - 失败', 20)
      } 
    );
  },
  /**
   * 转化文本
   * @return {[type]} [description]
   */
  conversionText(arr,id){
    let result = '';
    if(id){
      arr.forEach( function(element, index) {
        if(id == element.id){
          result = element.name;
          return;
        }
      });
    }else{
      result = ''
    }
    return result;
  },
}

/*
*   格式化日期格式
*/
Date.prototype.Format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
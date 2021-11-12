/*
	uni-app  api封装
	
	
*/
//showToast
export const tip = function(title, duration=2000, icon='none',mask=true){
	return new Promise((resolve, reject)=>{
		uni.showToast({
			title:title,
			duration:duration,
			icon:icon,
			mask
		})
		setTimeout(()=>{
			resolve()
		},duration)
	})
}

//showLoading
export const showLoading = function(title="加载中...",mask=!0){
	uni.showLoading({
		title:title,
		mask:mask
	})
}

//hideLoading
export const hideLoading = function(){
	uni.hideLoading()
}

//页面跳转
export const to = function(url,type="nt"){
	let methods = {
		'nt': 'navigateTo',
		'rt': 'redirectTo',
		'st': 'switchTab',
		'rl': 'reLaunch',
		'nb': 'navigateBack',
	}
	return new Promise((resolve,reject)=>{
		uni[methods[type]]({
			url:url,
			success(){
				resolve()
			},
			fail(){
				reject()
			}
		})
	})
}

//获取元素信息
export const getEleInfo = function(ele,that){
	return new Promise((resolve,reject)=>{
		const query = uni.createSelectorQuery().in(that);
		query.select(ele).boundingClientRect(data => {
			resolve(data)
		}).exec();
	})
}

//#ifdef MP-WEIXIN
//微信支付
export const wxPay = function(data){
	return new Promise((resolve, reject)=>{
		uni.requestPayment({
			timeStamp:data.timeStamp,
			nonceStr:data.nonceStr,
			package:data.package,
			signType:data.signType || 'RSA',
			paySign:data.paySign,
			success(res){
				resolve()
			},
			fail(err){
				reject(err)
			},
			complete(res){
				uni.hideLoading()
			}
		})
	})
}
//#endif

//#ifdef MP-ALIPAY
//支付宝支付
export const aliPay = function(data){
	return new Promise((resolve, reject)=>{
		uni.requestPayment({
			orderInfo:data.trade_no,
			success(res){
				if(res.resultCode == '9000'){
					resolve(res)
				}else{
					//res.memo  返回支付宝失败信息
					reject(res)
				}
			},
			fail(err){
				reject(err)
			},
			complete(res){
				uni.hideLoading()
			}
		})
	})
}
//#endif

/*
	轮播、按钮动态链接跳转
	@params urlObj [Object]
				type:[Number] 1：页面路径  2：网络路径    <非必填>
				url:[String]  跳转路径  <必填>
				
*/
export const toPage = function(urlObj){
	if(!urlObj.type){
		urlObj.type = /^(http).*/.test(urlObj.url) ? 2 : 1
	}
	if(urlObj.type==1){
		uni.navigateTo({
			url:urlObj.url,
			fail(){
				//解决switch跳转不能携带参数问题，存储全局全局变量
				let tabparams = {}
				urlObj.url.split('?')[1].split('&').map((item)=>{
					let k = item.split('=')[0]
					let v = item.split('=')[1]
					tabparams[k] = v
				})
				getApp().globalData.TAB_PARAMS = tabparams
				
				uni.switchTab({
					url:urlObj.url,
					success(){
						//跳转之后重置参数
						let timego = setTimeout(()=>{
							getApp().globalData.TAB_PARAMS = ''
						},2000)
					}
				})
			}
		})
	}else if(urlObj.type==2){
		uni.navigateTo({
			url:'/pages/outlink/outlink?url='+urlObj.url
		})
	}
}

/*
	常用js函数

*/

//本地文件转base64
export const urlTobase64 = function(url,type="png") {
  const imgData = uni.getFileSystemManager().readFileSync(url, 'base64');
  const base64 = `data:image/${type};base64,` + imgData;
  return base64;
}

// 常用正则验证
export const regTest = function(str,type){
    var result = !1;
    switch(type){
        case 'phone'://电话
            result = /^(0|86|17951)?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/.test(str);
            break;
        case 'idnumber'://身份证号码
            result = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(str) || /^[1-9]\d{5}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}$/.test(str);
            break;
        default:
            result = !1;
            break;
    }
    return result
}

//隐藏手机号中间四位
export const hidePhoneNum = function(str) {
    return str.substr(0,3)+'****'+str.substr(-4,4)
}



//计算两时间戳相差时间
export const getLastDay = function(st, et){
	let a1 = Date.parse(new Date(st));
	let a2 = Date.parse(new Date(et));
	let day = parseInt((a2-a1)/ (1000 * 60 * 60 * 24));//核心：时间戳相减，然后除以天数
	return day
}

// 节流函数   （应用于拖拽、监听页面滑动）
export const throttle = function(fn, threshhold) {
    var timeout
    var start = new Date;
    var threshhold = threshhold || 160
    return function () {
        var context = this, args = arguments, curr = new Date() - 0
        clearTimeout(timeout)
        if(curr - start >= threshhold){ 
            fn.apply(context, args)
            start = curr
        }else{
            timeout = setTimeout(function(){
            fn.apply(context, args) 
            }, threshhold);
        }
    }
}

/**
   * @desc 函数防抖
   * @param func 目标函数
   * @param wait 延迟执行毫秒数
   * @param immediate true - 立即执行， false - 延迟执行
   */
export const debounce = function (func, wait, immediate=false) {
    let timer;
    return function() {
      let context = this,
          args = arguments;
           
      if (timer) clearTimeout(timer);
      if (immediate) {
        let callNow = !timer;
        timer = setTimeout(() => {
          timer = null;
        }, wait);
        if (callNow) func.apply(context, args);
      } else {
        timer  = setTimeout(() => {
          func.apply(context, args)
        }, wait)
      }
    }
}

/*
    判断IOS、Android
    @return {Bool} [true:Android , false:IOS]
*/
export const phoneSys = function(){
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isAndroid?true:false  
}


//流加载状态判断
export const loadMore = function(resData,list = [],page = 1,length = 10){
	let data = resData || [],loadStatus = 1;
	if(data.length==0&&list.length==0){
		loadStatus = 3 //'noData' 3
	}else if(data.length == length){
		loadStatus = 4 //'loading' 4
		page += 1
	}else{
		loadStatus = 2 //'noMore' 2
	}
	return {
		page,
		loadStatus,
		lists:list.concat(resData)
	}
}

//时间格式化
export const formatTime = function(date,fmt='yyyy-MM-dd hh:mm:ss'){
    var formatDate = function(date,fmt){
            date= new Date(date*1000);
            if(/(y+)/.test(fmt)){
                fmt = fmt.replace(RegExp.$1,(date.getFullYear()+"").substr(4-RegExp.$1.length));
            }
            var o ={
                'M+':date.getMonth()+1,
                'd+':date.getDate(),
                'h+':date.getHours(),
                'm+':date.getMinutes(),
                "s+":date.getSeconds()
            }
            for(var k in o){
                if(new RegExp(`(${k})`).test(fmt)){
                    var str =o[k]+'';
                    fmt = fmt.replace(RegExp.$1,(RegExp.$1.length ===1) ? str : padLeftZero(str));
                }
            }
            return fmt;
    };
    var padLeftZero = function(str){
        return  ('00'+str).substr(str.length);
    };
    return formatDate(date,fmt)
}

/*
	生成一天内指定间隔的时间段
	需求前置函数  formatTime 
	@params 
	s_time <String> 开始时间 '07:00'
	e_time <String> 结束时间 '22:00'
	step   <Number> 时间间隔  15
	min    <Number> 距离现在时间的最小间隔 0
*/
export const getTimeList = function(s_time, e_time, step, min = 0){
    let date = new Date()
    let sTimeArr = s_time.split(':')
    let eTimeArr = e_time.split(':')
	let etimeStr = ''
	if(eTimeArr[0] == 0){
		let date1 = new Date()
		date1.setDate(date1.getDate() + 1)
		etimeStr = `${date1.getFullYear()}/${date1.getMonth()+1}/${date1.getDate()} ${eTimeArr[0]}:${eTimeArr[1]}:00`
	}else{
		etimeStr = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${eTimeArr[0]}:${eTimeArr[1]}:00`
	}
    let stime = new Date(`${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${sTimeArr[0]}:${sTimeArr[1]}:00`)
	
    let etimeStamp = new Date(etimeStr)
	
    let timeArr = [],timeStamps = [],timeArr1 = []
    while(stime.getTime() <= etimeStamp.getTime()){
        let time = formatTime(parseInt(stime.getTime()/1000),'hh:mm')
		timeStamps.push(stime.getTime())
        stime.setMinutes(stime.getMinutes() + step)
        timeArr.push(time)
    }
	let nowDateTimeStamp = date.getTime() + min*60*1000
	timeStamps.forEach((item)=>{
		if(item >= nowDateTimeStamp){
			timeArr1.push(formatTime(parseInt(item/1000),'hh:mm'))
		}
	})
	timeArr1.unshift(formatTime(parseInt(nowDateTimeStamp/1000),'hh:mm'))
    return {
		timeArr,
		timeArr1
	}
}

/*
	生成多天内指定间隔的时间段
	需求前置函数  formatTime    getTimeList
	@params 
	s_time <String> 开始时间 '07:00'
	e_time <String> 结束时间 '22:00'
	step   <Number> 时间间隔  15
	days   <Number> 生成天数  7
	min    <Number> 距离现在时间的最小间隔 0
*/
export const getDate = function(s_time, e_time, step, days = 7, min = 0){
	let resDate = [],
	date = new Date(),
	initDateToday = `${date.getMonth()+1}/${date.getDate()}`,
	initDateTomorrowDate = new Date(new Date().setDate(date.getDate() + 1)),
	initDateTomorrow = `${initDateTomorrowDate.getMonth()+1}/${initDateTomorrowDate.getDate()}`;
	let weeks = ['周日','周一','周二','周三','周四','周五','周六']
	//获取昨天的date对象
	date.setDate(date.getDate()-1);
	//生成时间段
	let timelist = getTimeList(s_time,e_time,step,min)
	for(let i = 0;i<days;i++ ){
		//获取今天开始的接下来一周的date对象
		let dateDay = date.setDate(date.getDate()+1);
		let newDate = new Date(dateDay);
		let dateItem = {
			date:`${formatTime(parseInt(newDate.getTime()/1000),'MM-dd')}`,
			status:1,
			week:weeks[newDate.getDay()],
			sign:`${['今天','明天'][[initDateToday,initDateTomorrow].indexOf(newDate.getMonth()+1+'/'+newDate.getDate())] || '' }`,
			time:[]
		}
		
		let filters = i == 0? timelist.timeArr1:timelist.timeArr;
		if(!filters || filters.length == 0) continue;
		let itemT = filters.map((item)=>{
			let timeItem = {
				date:`${formatTime(parseInt(newDate.getTime()/1000),'yyyy-MM-dd')} ${item}`,
				time:`${item}`,
				sign:dateItem.sign
			}
			let newTimeItem = Object.assign(timeItem,{time:item})
			return newTimeItem
		})
		dateItem.time = itemT
		resDate.push(dateItem)
	}
	return resDate
}

//判断数组cArr是否在数组arr里
export const isContainArr = function(arr,cArr){
	let f_arr = cArr.filter(val => arr.indexOf(val) > -1);
	return f_arr.length == cArr.length?true:false 
}

/**
 * @function escapeHTML 转义html脚本 < > & " '
 * @param a -
 *            字符串
 */
export const escapeHTML = function(a){
    a = "" + a;
    return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");;
}


/**
 * @function unescapeHTML 还原html脚本 < > & " '
 * @param a -
 *            字符串
 */
export const unescapeHTML =  function(a){
    a = "" + a;
    return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

// 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
export const getDistance = function(lat1, lng1, lat2, lng2) {
	// 经纬度转换成三角函数中度分表形式。
	function rad(d) {
		return d * Math.PI / 180.0; 
	}
	var radLat1 = rad(lat1);
	var radLat2 = rad(lat2);
	var a = radLat1 - radLat2;
	var b = rad(lng1) - rad(lng2);
	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
		Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	s = s * 6378.137; // EARTH_RADIUS;
	s = Math.round(s * 10000) / 10000; //输出为公里

	var distance = s;
	var distance_str = "";
	return s;
}

/*图片缓存类*/
export class SaveImgToLocal{
	constructor() {
	    
	}
	//图片下载存储到本地
	downloadImage(url,id){
		return new Promise((resolve,reject)=>{
			uni.downloadFile({
				url:url,
				success(rs){
					if(rs.statusCode==200){
						uni.saveFile({
							tempFilePath:rs.tempFilePath,
							success(result){
								let storageInfo = {
									id:id,
									imageOfLocalPath:result.savedFilePath,
									imageOfName:url
								}
								resolve(storageInfo)
							},
							fail(err){
								reject(err)
							}
						})
					}else{
						reject(rs)
					}
				},
				fail(err){
					reject(err)
				}
			})
		})
	}
	
	//图片缓存检测
	//data:检测数据
	//typeName:缓存名称
	//name:对比字段名称
	//未完成：当data为对象时的处理；清理已未使用的缓存图片
	checkImageStorage(data,typeName,name){
		let imageStorage = uni.getStorageSync(typeName) || []
		let count = 0;//更新个数
		if(imageStorage.length>0){
			//存储缓存数据id,用于后面进行比较
			let imageStorageId = []
			imageStorage.map((item)=>{imageStorageId.push(item.id)})
			//循环判断数据项是否存在缓存
			data.forEach((item,index)=>{
				let imgUrl = item[name]
				//获取是否存在缓存
				let indexVal = imageStorageId.findIndex((it)=>{return item.id == it})
				if(indexVal>=0){//存在缓存
					if( imgUrl == imageStorage[indexVal].imageOfName){//图片路径一致，取缓存路径显示
						item[name] = imageStorage[indexVal].imageOfLocalPath
					}else{//图片路径不一致，做更新缓存处理
						count += 1
						downloadImage(imgUrl,item.id).then((res)=>{
							//删除原图片文件
							uni.removeSavedFile({
								filePath:imageStorage[indexVal].imageOfLocalPath,
								complete(){
									//更新缓存
									imageStorage[indexVal] = res
									count -= 1
								}
							})
						}).catch(()=>{
							count -= 1
						})
					}
				}else{//无缓存，添加缓存
					count += 1
					downloadImage(imgUrl,item.id).then((res)=>{
						imageStorage.push(res)
						count -= 1
					}).catch(()=>{
						count -= 1
					})
				}
			})
		}else{//不存在缓存
			data.forEach((item,index)=>{
				let imgUrl = item[name]
				count += 1
				downloadImage(imgUrl,item.id).then((res)=>{
					imageStorage.push(res)
					count -= 1
				}).catch(()=>{
					count -= 1
				})
			})
		}
		//判断是否处理完成，完成后重新设置缓存
		timego = setInterval(()=>{
			if(count==0){
				clearInterval(timego) 
				uni.setStorage({
					key:typeName,
					data:imageStorage, 
					success(){
						
					}
				})
			}
		},2000)
		return data
	}
	//图片缓存检测执行函数
	checkImageStorageF(data,typeName,name){
		let result = ''
		// #ifdef APP-PLUS
		result = checkImageStorage(data,typeName,name)
		// #endif
		// #ifdef H5
		result = data
		// #endif
		return result
	}
}

export default{
	tip,
	showLoading,
	hideLoading,
	to,
	getEleInfo,
	//#ifdef MP-WEIXIN
	wxPay,
	//#endif
	//#ifdef MP-ALIPAY
	aliPay,
	//#endif
	toPage,
	SaveImgToLocal,
	
	urlTobase64,
	regTest,
	hidePhoneNum,
	formatTime,
	getLastDay,
	debounce,
	throttle,
	phoneSys,
	loadMore,
	getTimeList,
	getDate,
	isContainArr,
	escapeHTML,
	unescapeHTML,
	getDistance,
	
}










	







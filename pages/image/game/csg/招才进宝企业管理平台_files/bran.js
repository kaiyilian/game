/**
 * Created by CuiMengxin on 2015/11/3.
 */
/**
 *  sessionStorage.setItem("CurrentEmployeeId",id);//当前员工id
 *  sessionStorage.setItem("deptList",deptList);//部门列表
 *  sessionStorage.setItem("workLineList",workLineList);//工段列表
 *  sessionStorage.setItem("workShiftList",workShiftList);//班组列表
 *  sessionStorage.setItem("postList",postList);//职位列表
 *
 *
 */


var DATATABLES_CHINESE_LANGUAGE = "json/Chinese.json";
var RESPONSE_OK_CODE = "1000";
var PERMISSION_DENIED_CODE = "2003";
var SESSION_TIMEOUT_CODE = "2004";
var ALL_COUNTRY = "100000";
var phone_reg = /^(13[0-9]|14[5|7]|15[^4]|17[0-9]|18[0-9])[0-9]{8}$/;

var timeOut = "2000";//按钮click之后，移除click事件，timeout之后，重新赋值click事件
var ajaxSetup = function () {
	$.ajaxSetup({
		accept: 'application/json',
		cache: false,
		contentType: 'application/json;charset=UTF-8'
	});
};


/*
 *POST方法
 *Parmas:url请求路径，params参数，successFunc请求成功回调方法，errorFunc请求失败回调方法
 */
var branPostRequest = function (url, params, successFunc, errorFunc, token) {
	//var param = JSON.stringify(params)
//debugger
	if (token) {
		$.ajaxSetup({
			headers: {
				token: token
			}
		});
	}

	ajaxSetup();
	$.ajax({
		url: url,
		method: 'POST',
		data: JSON.stringify(params),
		beforeSend: function (xhr) {
			//xhr.setRequestHeader('X-Test-Header', 'test-value');
		},
		success: function (data, status, jqXHR) {
			loadingRemove();//加载中 - 移除logo

			if (typeof data == "string") {
				//alert(data)
				//data = jQuery.parseJSON(data);//
				data = eval("(" + data + ")");
			}

			//alert(JSON.stringify(data))
			if (data["code"] == PERMISSION_DENIED_CODE) {
				branError("接口没有访问权限");
			}
			else if (data["code"] == SESSION_TIMEOUT_CODE) {
				location.href = "login";
			}
			else {
				if (successFunc)
					successFunc(data);
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrow) {
			loadingRemove();//加载中 - 移除logo
			//toastr.error("请求异常");
			if (errorFunc)
				errorFunc();
		}
	});
};

/*
 *GET方法
 *Parmas:url请求路径，successFunc请求成功回调方法，errorFunc请求失败回调方法
 */
var branGetRequest = function (url, successFunc, errorFunc) {
	//debugger
	//if (aa)alert(1)
	ajaxSetup();
	$.ajax({
		url: url,
		method: 'GET',
		success: function (data, status, jqXHR) {
			loadingRemove();//加载中 - 移除logo

			if (typeof data == "string") {
				data = eval("(" + data + ")");
			}

			if (data["code"] == PERMISSION_DENIED_CODE) {
				alert("接口没有访问权限");
			}
			else if (data["code"] == SESSION_TIMEOUT_CODE) {
				location.href = "login";
			}
			else {
				if (successFunc) {
					successFunc(data);
				}
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrow) {
			loadingRemove();//加载中 - 移除logo

			//toastr.error("请求异常");
			if (errorFunc)
				errorFunc(XMLHttpRequest);
		}
	});
};

//加载中 - logo出现
var loadingInit = function () {
	if ($("body").find(".load-container").length > 0) {
		$("body").find(".load-container").remove();
	}
	var $load = $("<div>").addClass("load-container").addClass("load");
	var $loader = $("<div>").addClass("loader");
	$loader.appendTo($load);
	$load.appendTo($("body"));

};
//加载中 - 移除logo
var loadingRemove = function () {
	$("body").find(".load-container").remove();
};

//json格式转换为字符串
var jsonParseParam = function (param, key) {
	var paramStr = "";

	if (param instanceof String || param instanceof Number || param instanceof Boolean) {
		paramStr += "&" + key + "=" + encodeURIComponent(param);
	}
	else {
		$.each(param, function (i) {
			var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
			paramStr += '&' + jsonParseParam(this, k);
		});
	}

	return paramStr.substr(1);


};

//将 时间戳转换格式 为 YYYY-MM-DD
var timeInit = function (time) {
	if (time == 0 || time == "" || time == null) {
		return " - - ";
	}
	//debugger
	var time = new Date(time).toLocaleDateString();//转换为 YYYY/MM/DD

	time = time.split("/");
	var timeList = "";
	for (var i = 0; i < time.length; i++) {
		if (parseInt(time[i]) < 10) {
			time[i] = "0" + time[i];
		}
		timeList += timeList == "" ? time[i] : ("-" + time[i]);
	}

	//alert(timeList)
	return timeList;

};

//将 时间戳转换格式 为 YYYY-MM
var timeInit1 = function (time) {
	if (time == 0 || time == "" || time == null) {
		return " - - ";
	}
	//debugger
	var time = new Date(time).toLocaleDateString();//转换为 YYYY/MM/DD

	time = time.split("/");
	var timeList = "";
	for (var i = 0; i < time.length - 1; i++) {
		if (parseInt(time[i]) < 10) {
			time[i] = "0" + time[i];
		}
		timeList += timeList == "" ? time[i] : ("-" + time[i]);
	}

	if (timeList.indexOf("9999") > -1) {
		timeList = "至今";
	}
	//alert(timeList)
	return timeList;

};

//错误提示
var branError = function (obj) {
	//alert(obj)
	if (typeof obj == "undefined") {
		toastr.error("请求异常,请联系管理员");
	}
	else if (typeof obj == "string") {
		toastr.error("系统错误：" + obj);
	}
	else {
		if (obj.status) {
			if (obj.status == 500) {
				toastr.error("系统错误，请联系管理员！");
			}
			else if (obj.status == 302) {
				toastr.error("网络连接已断开！");
			}
			else {
				toastr.error("请求异常");
			}
		}
		else {
			toastr.error(JSON.stringify(obj))
		}
	}
};

//显示页面加载动画
var showPageLoadHUD = function (divId) {
	if (divId) {

		//页面加载动画
		var pageLoadHUD = $("<div></div>");
		pageLoadHUD.addClass("sk-spinner sk-spinner-wave");
		pageLoadHUD.attr("style", "margin-top:200px;width:100px;");
		for (var i = 1; i < 6; i++) {
			var div = $("<div></div>").appendTo(pageLoadHUD);
			div.addClass("sk-rect" + i);
			pageLoadHUD.append("&nbsp;");
		}

		$(divId).html(pageLoadHUD);
	}
};

//显示提示信息
var toastrMsg = function (type, msg) {
	toastr.options = {
		positionClass: "toast-bottom-right",
	};

	if (type == "warning") {        //橙色
		toastr.warning(msg);
	}
	if (type == "info") {       //淡蓝
		toastr.info(msg);
	}
	if (type == "success") {        //淡绿
		toastr.success(msg);
	}
	if (type == "error") {      //红
		toastr.error(msg);
	}
};


/////////////////////////暂时不用///////////////////////////////////////////


//组件加载动画
var componentLoadHUD = $("<div></div>");
componentLoadHUD.addClass("sk-spinner sk-spinner-circle");
for (var i = 1; i <= 12; i++) {
	var div = $("<div></div>").appendTo(componentLoadHUD);
	div.addClass("sk-circle" + i + " sk-circle");
}

//隐藏组件加载动画
var dismissHUD = function (divId) {
	if (divId)
		$(divId).empty();
};

//显示组件加载动画
var showHUD = function (divId) {
	if (divId) {
		dismissHUD(divId);
		$(divId).append(componentLoadHUD);
	}
};


/**
 * 清除表单中内容
 * @param ele
 */
function clearForm(ele) {
	$(ele).find(':input').each(function () {
		switch (this.type) {
			case 'text':
				$(this).val('');
				break;
			case 'hidden':
				$(this).val('');
				break;
			case 'password':
				$(this).val('');
				break;
			case 'textarea':
				$(this).val('');
				break;
			case 'radio':
				this.checked = false;
			case 'checkbox':
				this.checked = false;
			case 'select-multiple':
			case 'select-one':
		}
	});
}


//删除警告
var deleteWarning = function (name, func) {
	swal({
		title: "确定要删除  \"" + name + "\"  吗",
		text: "删除后将无法恢复，请谨慎操作！",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "删除",
		closeOnConfirm: false
	}, function () {
		if (func) {
			func();
		}
	});
};



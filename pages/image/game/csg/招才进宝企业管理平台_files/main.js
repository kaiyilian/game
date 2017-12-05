/**
 * Created by CuiMengxin on 2015/11/12.
 */

var PERMISSION_DENIED_CODE = "2003";
var SESSION_TIMEOUT = "2004";

////加载动画2
//var showLoadPageHUD = function () {
//    $('#content-main').append(hud);
//}
//
//var dismissLoadPageHUD = function () {
//    $('#div_load_hud').remove();
//}

//选项卡及Tab内容相关JS
var existedTabIdArrya = new Array("menu_tab_index");//保存选项卡的数组
var selectedTabId = null;//选中的标签对应的id

var divTabShowWidth = 0;//tab一行可展示的宽度
var tabLineIndex = 1;//tab在当前页  从第1页开始
var tabLineCount = 0;//判断tab一行可以 有几个item
var tabLineTotal = 0;//tab一共的页数
var $itemTabWidth = 0;//每个tab的宽度（含padding）

$(function () {
	$itemTabWidth = $("#page-wrapper > .content-tabs .J_menuTab").width() + 30 + 1;
	//tab可展示的长度
	divTabShowWidth = $("#page-wrapper > .content-tabs").width() -
		($("#page-wrapper > .content-tabs .J_tabLeft").width() + 12) -
		($("#page-wrapper > .content-tabs .J_tabRight").width() + 12) -
		($("#page-wrapper > .content-tabs .J_tabClose").width() + 12);
	//判断tab一行可以 有几个item
	tabLineCount = Math.floor(divTabShowWidth / $itemTabWidth);//

	//修改密码弹框 - 显示（初始化）
	$(".pwd_modify_modal").on("show.bs.modal", function () {
		var $row = $(".pwd_modify_modal").find(".modal-body .row");
		$row.find(".old_pwd input").val("");
		$row.find(".new_pwd input").val("");
		$row.find(".new_pwd_sure input").val("");
	});
});

/**
 * 点击左侧菜单栏，请求tab的内容div
 * @param requestURL    请求actioin的路由
 * @param pageTabId        选项卡Id
 * @param pageName        选项卡名称
 */
var getInsidePageDiv = function (requestURL, pageTabId, pageName, succFun) {

	if ($.inArray(pageTabId, existedTabIdArrya) < 0) {  //如果标签还没有
		existedTabIdArrya.push(pageTabId);//数组加入新的item

		//添加选项卡
		var a = $("<a></a>").html(pageName);//赋值标签名称
		a.attr("id", pageTabId);//tab标签 id
		a.addClass("J_menuTab");//赋值标签class
		//a.attr("onclick", "menuTabOnclick('" + pageTabId + "')");//标签click事件
		a.click(function () {
			menuTabOnclick(pageTabId, succFun);
		});
		a.appendTo($('#div_page_tabs'));//放入标签组

		//关闭按钮
		var li = $("<li></li>");
		li.addClass("fa fa-times-circle");
		li.attr("onclick", "removeTab('" + pageTabId + "',event)");//移除标签
		li.appendTo(a);

		//内容展示
		var div = $("<div></div>").appendTo($('#content-main'));
		div.addClass("wrapper wrapper-content");
		div.attr("id", "page_" + pageTabId).attr("data-id", pageTabId);

		showPageLoadHUD('#page_' + pageTabId);//加载动画 加载中。

		//ajaxSetup();//

		$.ajax(requestURL, {
			async: true,
			success: function (data, status, jqXHR) {
				if (data["code"] == PERMISSION_DENIED_CODE) {
					toastr.error("页面没有访问权限");
					removeTab(pageTabId, event);
					//console.log("remove" + pageTabId);
				}
				else if (data["code"] == SESSION_TIMEOUT) {
					location.href = "login";
				}
				else {
					$('#page_' + pageTabId).html(data); //填充内容
					menuTabOnclick(pageTabId, succFun);//点击对应的tab
				}
			}
		});
	}
	else {
		menuTabOnclick(pageTabId, succFun);//标签选中事件
	}
};

//首页按钮点击事件
var indexTabOnclick = function () {
	//$("#index").addClass("active").siblings(".J_menuTab").removeClass("active");
	//$('#page_index').show().siblings(".wrapper").hide();//对应的内容展示
	//selectedTabId = "index";//选中的id
	//alert(11)

	menuTabOnclick("index");
};

//选项卡选中事件
var menuTabOnclick = function (pageTabId, succFun) {
	$('#' + pageTabId).addClass("active").siblings(".J_menuTab").removeClass("active");
	selectedTabId = pageTabId;//选中的id
	$('#page_' + pageTabId).show().siblings(".wrapper").hide();//对应的内容展示

	tabInit(pageTabId);//tab内容初始化

	//当前tab对应的navbar 显示
	$("#side-menu > li > ul > li > a").each(function () {

		var id = $(this).attr("data-id");
		if (id == pageTabId) {
			//$(this).closest("li").click();
			$(this).closest("ul").addClass("in");
			$(this).closest("ul").parent("li").addClass("active")
				.siblings("li").removeClass("active").find(".in").removeClass("in");
		}

	});

	if (succFun) {
		succFun();
	}

};

//tab内容初始化
var tabInit = function (pageTabId) {
	var divTabContentWidth = $("#div_page_tabs").width();//所有tab的总的长度
	tabLineTotal = Math.ceil($("#page-wrapper > .content-tabs .J_menuTab").length / tabLineCount);//总行数
	tabLineIndex = Math.ceil(($("#" + pageTabId).index() + 1) / tabLineCount);//从第一页开始

	var $itemTab = $("#page-wrapper > .content-tabs #div_page_tabs .J_menuTab");//每项tab

	//第一步 判断当前标签是否在一屏内

	var currentTabIndex = $("#" + pageTabId).index();//当前标签index

	var prevTabWidth = 0;//当前标签之前标签的总长度

	//遍历 该项标签之前的标签（包含当前标签）
	for (var i = 0; i <= currentTabIndex; i++) {
		var itemWidth = $itemTab.eq(i).width() + 30 + 1;
		prevTabWidth += itemWidth;//获取之前标签的总长度
	}
	//如果当前总长度小于 可展示长度
	if (prevTabWidth <= divTabShowWidth) {
		//前方左右标签显示
		$("#page-wrapper > .content-tabs #div_page_tabs").animate({marginLeft: 0}, "fast");
	}
	else {
		var marginLeft = 0;//向左移动的长度

		//如果当前标签之后 还有标签
		if ($("#" + pageTabId).next(".J_menuTab").length > 0) {

			var showTabWidth = 0;//需要显示的tab的总长度

			//遍历 该项标签(后一个标签) 之前的标签
			for (var i = 0; i <= currentTabIndex + 1; i++) {
				var itemWidth = $itemTab.eq(i).width() + 30 + 1;
				showTabWidth += itemWidth;//获取 要显示标签的总长度
			}

			var moreWidth = showTabWidth - divTabShowWidth;//超出的内容

		}
		else {   //如果当前标签之后 没有标签
			var moreWidth = divTabContentWidth - divTabShowWidth;//超出的内容
		}

		$itemTab.each(function () {
			var itemWidth = $(this).width() + 30 + 1;//对应标签的长度

			if (moreWidth > 0) {
				marginLeft += itemWidth;
				moreWidth = moreWidth - itemWidth;
			}
			else {
				return;
			}
		});
		$("#page-wrapper > .content-tabs #div_page_tabs")
			.animate({marginLeft: -marginLeft}, "fast")

	}

};

//关闭选项卡事件
var removeTab = function (pageTabId, event) {
	event.stopPropagation();//阻止事件冒泡

	var tabIndex = $.inArray(pageTabId, existedTabIdArrya);//
	if (tabIndex > 0) {//不能关闭首页
		existedTabIdArrya.splice(tabIndex, 1);//先从数组中删除
		$('#' + pageTabId).remove();//删除tab
		var tabDivId = "page_" + pageTabId;
		$('#' + tabDivId).remove();//删除div
		if (existedTabIdArrya.length <= tabIndex)
			menuTabOnclick(existedTabIdArrya[--tabIndex]);//选中前面的tab
		else
			menuTabOnclick(existedTabIdArrya[tabIndex]);//选中后面的tab
	}

	if (existedTabIdArrya.length <= 1) {        //数组全部删光
		indexTabOnclick();//首页点击事件
	}

};

//选中上一个tab事件
var PrevLineTab = function () {

	if (tabLineIndex <= 1) {
		return
	}
	else {
		tabLineIndex -= 1;
		var moreWidth = (tabLineIndex - 1) * tabLineCount * $itemTabWidth;

		$("#page-wrapper > .content-tabs #div_page_tabs")
			.animate({marginLeft: -moreWidth}, "fast")
	}

	//var selecedIndex = findSelectedTabIndex();
	//if (selecedIndex > 0) {
	//    menuTabOnclick(existedTabIdArrya[--selecedIndex]);
	//}
	//else menuTabOnclick(existedTabIdArrya[0]);
};

//选中下一个tab事件
var NextLineTab = function () {

	if (tabLineIndex >= tabLineTotal) {
		return
	}
	else {
		var moreWidth = tabLineIndex * tabLineCount * $itemTabWidth;
		tabLineIndex += 1;

		$("#page-wrapper > .content-tabs #div_page_tabs")
			.animate({marginLeft: -moreWidth}, "fast")
	}
	//
	//var selecedIndex = findSelectedTabIndex();
	//if (selecedIndex < existedTabIdArrya.length - 1) {
	//    menuTabOnclick(existedTabIdArrya[++selecedIndex]);
	//}
	//else menuTabOnclick(existedTabIdArrya[existedTabIdArrya.length - 1]);
};

//关闭全部选项卡
var closeAllTabs = function () {
	$('#div_page_tabs >a').each(function () {
		var pageTabId = $(this).attr("id");//当前标签id

		var tabIndex = $.inArray(pageTabId, existedTabIdArrya);//
		//alert(tabIndex)
		if (tabIndex > 0) {
			existedTabIdArrya.splice(tabIndex, 1);//先从数组中删除
			$('#' + pageTabId).remove();//删除tab
			var tabDivId = "page_" + pageTabId;
			$('#' + tabDivId).remove();//删除div
		}
	});
	indexTabOnclick();//首页点击事件
};

//关闭其他选项卡
var closeOtherTabs = function () {
	//alert($.inArray(selectedTabId, existedTabIdArrya))
	if ($.inArray(selectedTabId, existedTabIdArrya) == 0) {
		closeAllTabs();
		return;
	}

	//
	$('#div_page_tabs >a').each(function () {
		if (!$(this).hasClass("active")) {  //不是选中的标签
			var pageTabId = $(this).attr("id");//当前标签id

			var tabIndex = $.inArray(pageTabId, existedTabIdArrya);//
			if (tabIndex > 0) {
				existedTabIdArrya.splice(tabIndex, 1);//先从数组中删除
				$('#' + pageTabId).remove();//删除tab
				var tabDivId = "page_" + pageTabId;
				$('#' + tabDivId).remove();//删除div
			}
		}
	});

};

//获取用户信息
var getUserInfo = function () {
	var url = UrlList.userInfo_get;//
	branGetRequest(url, function (data) {
			//alert(JSON.stringify(data))

			if (data.code == 1000) {

				var id = "";
				var name = "";
				var company_name = "";
				var last_login_time = "";
				var last_login_ip = "";//

				if (data.result.id) {
					id = data.result.id;
				}
				else {
					id = "";
				}

				if (data.result.name) {
					name = data.result.name;
				}
				else {
					name = "";
				}

				if (data.result.last_login_time) {
					last_login_time = data.result.last_login_time;
					last_login_time = new Date(last_login_time).toLocaleString().replace(/\//g, "-");
				}
				else {
					last_login_time = "";
				}

				if (data.result.last_login_ip) {
					last_login_ip = data.result.last_login_ip;
				}
				else {
					last_login_ip = "";
				}

				if (data.result.corp_name) {
					company_name = data.result.corp_name;
				}
				else {
					company_name = "";
				}

				$("#head_layout").find(".user_name").html(name);
				//$("#head_layout").find(".user_name").attr("data-id", id);


				var $user_info = $(".index_container").find(".user_info");
				$user_info.find(".company_name").html(company_name);
				$user_info.find(".user_name").html(name);
				$user_info.find(".last_login_time").html(last_login_time);
				$user_info.find(".last_login_ip").html(last_login_ip);

				sessionStorage.setItem("user_name", name);
				sessionStorage.setItem("user_id", id);

			}
			else {
				branError(data.msg);
			}

		},
		function (error) {
			branError(error);
		}
	)
};

//修改密码弹框显示
var pwdModifyModalShow = function () {
	$(".pwd_modify_modal").modal({
		backdrop: false,
		keyboard: false
	});
};

//检查 确认密码是否正确
var CheckPwdIsRight = function () {
	//var new_pwd = $.trim($(".pwd_modify_modal").find(".new_pwd input").val());
	//var new_pwd_sure = $.trim($(".pwd_modify_modal").find(".new_pwd_sure input").val());
	//
	//if (new_pwd_sure != new_pwd) {
	//	toastr.error("两次密码输入不一致！");
	//}

};

//密码 修改确认
var pwdModifySure = function () {
	var txt = "";
	var old_pwd = $.trim($(".pwd_modify_modal").find(".old_pwd input").val());
	var new_pwd = $.trim($(".pwd_modify_modal").find(".new_pwd input").val());
	var new_pwd_sure = $.trim($(".pwd_modify_modal").find(".new_pwd_sure input").val());

	if (old_pwd == "") {
		txt = "请输入旧密码";
	}
	else if (new_pwd == "") {
		txt = "请输入新密码";
	}
	else if (new_pwd_sure == "") {
		txt = "请输入确认密码";
	}
	else if (new_pwd_sure != new_pwd) {
		txt = "两次密码输入不一致！";
	}

	if (txt != "") {
		toastr.error(txt);
		return
	}

	var obj = new Object();
	obj.account = sessionStorage.getItem("user_name");//:'登录名',
	obj.id = sessionStorage.getItem("user_id");//:'用户id',
	obj.old_password = old_pwd;//:'旧密码',
	obj.new_password = new_pwd;//:'新密码'
	//alert(JSON.stringify(obj))
	branPostRequest(UrlList.pwd_modify, obj, function (data) {
		//alert(JSON.stringify(data));

		if (data.code == 1000) {
			$(".pwd_modify_modal").modal("hide");
			toastr.success("密码修改成功，3s后请重新登录！");
			setTimeout(function () {
				location.replace("login");
			}, 3000)
		}
		else {
			branError(data.msg);
		}

	}, function (error) {
		//alert(JSON.stringify(error))
		branError(error)
	})
};

//登出 弹框显示
var LoginOutModalShow = function () {
	$(".login_out_modal").modal({
		keyboard: false,
		backdrop: false
	});
};

//登出
var LoginOut = function () {
	var url = UrlList.Login_Out;
	var obj = new Object();

	branPostRequest(url, obj, function (data) {
		if (data.code == 1000) {
			location.replace("login")
		}
		else {
			branError(data.msg)
		}

	}, function (error) {
		branError(error);
	})
};


////////////////////////////////////////


//寻找当前选中的tab的索引
var findSelectedTabIndex = function findSelectedTabIndex() {
	var selectIndex = 0;
	$('#div_page_tabs >a').each(function () {
		if ($(this).attr("class") != "J_menuTab") {
			selectIndex = $.inArray($(this).attr("id"), existedTabIdArrya);
		}
	});
	return selectIndex;
};


//关闭当前选项卡
var closeSelectedTab = function () {
	$('#div_page_tabs >a').each(function () {
		if ($(this).attr("class") != "J_menuTab") {
			removeTab($(this).attr("id"), event);
		}
	});
};


var showChangePwdModel = function () {
	$("#change_pwd_modal").modal("show");
};


//取消选中的选项卡
var cancelActiveMenuTab = function (pageTabId) {
	$('#div_page_tabs >a').each(function () {
		if ($(this).attr("id") != pageTabId) {
			$(this).attr("class", "J_menuTab");
			$('#page_' + $(this).attr("id")).hide();
		}
		else {
			$(this).attr("class", "active J_menuTab");
		}
	});
};
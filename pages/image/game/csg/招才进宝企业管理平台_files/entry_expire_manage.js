/**
 * Created by CuiMengxin on 2016/10/11.
 */

var $entry_info_modal = $(".entry_info_modal");//同意入职弹框

var entry_expire_manage = {

	totalPage: 10,//一共 的页数
	currentPage: 1,//当前页
	containerName: "",

	Init: function () {

		entry_expire_manage.containerName = ".entry_expire_container";
		entry_expire_manage.GetEmployeeList();


	},
	//获取 同意入职员工列表
	GetEmployeeList: function () {
		loadingInit();

		var obj = new Object();
		obj.page_size = "10";
		obj.page = entry_expire_manage.currentPage;

		branPostRequest(UrlList.contract_expire_list, obj, function (data) {
			//alert(JSON.stringify(data));

			if (data.code == 1000) {
				entry_expire_manage.totalPage = data.result.total_page;//总页数
				if (entry_expire_manage.currentPage > entry_expire_manage.totalPage) {
					entry_expire_manage.currentPage -= 1;
					entry_expire_manage.GetEmployeeList();
					return;
				}

				var contract_expire_list = "";
				if (data.result.models == null || data.result.models.length == 0) {
					//toastr.success("暂无合同到期的员工！");
					contract_expire_list = "<tr><td colspan='6'>查询结果为空</td></tr>";
				}
				else {
					for (var i = 0; i < data.result.models.length; i++) {
						var item = data.result.models[i];

						var id = item.id;//
						var name = item.name;//
						var version = item.version;//
						var start_time = item.start_time;//
						start_time = timeInit(start_time);
						var end_time = item.end_time;//
						end_time = timeInit(end_time);

						contract_expire_list +=
							"<tr class='employee_item' data-employeeId='" + id + "' " +
							"data-version='" + version + "'>" +
							"<td class='isTrue' onclick='entry_expire_manage.ChooseItem(this)'>" +
							"<img src='image/UnChoose.png'/>" +
							"</td>" +
							"<td class='employee_no'>" + (i + 1) + "</td>" +
							"<td class='employee_name'>" + name + "</td>" +
							"<td class='employee_contract_begin_time'>" + start_time + "</td>" +
							"<td class='employee_contract_end_time'>" + end_time + "</td>" +
							"<td class='btn_operate'>" +
							"<span class='btn btn-sm btn-success btn_renew' " +
							"onclick='entry_expire_manage.EmployeeRenewOnly(this)'>续约</span>" +
							"</td>" +
							"</tr>";
					}
				}

				$(entry_expire_manage.containerName).find(".contract_expire_list tbody")
					.html(contract_expire_list);

				entry_expire_manage.EmployeeListInit();//

			}
			else {
				branError(data.msg);
			}

		}, function (error) {
			branError(error);
		});

	},
	//员工列表 初始化
	EmployeeListInit: function () {
		if ($(entry_expire_manage.containerName)
				.find(".contract_expire_list .employee_item").length == 0) {
			$(entry_expire_manage.containerName).find('.pager_container').hide();
		}
		else {
			var options = {
				bootstrapMajorVersion: 3, //版本  3是ul  2 是div
				//containerClass:"sdfsaf",
				//size: "small",//大小
				alignment: "left",//对齐方式
				currentPage: entry_expire_manage.currentPage, //当前页数
				totalPages: entry_expire_manage.totalPage, //总页数
				numberOfPages: 5,//每页显示的 页数
				useBootstrapTooltip: true,//是否使用 bootstrap 自带的提示框
				itemContainerClass: function (type, page, currentpage) {  //每项的类名
					//alert(type + "  " + page + "  " + currentpage)
					var classname = "p_item ";

					switch (type) {
						case "first":
							classname += "p_first";
							break;
						case "last":
							classname += "p_last";
							break;
						case "prev":
							classname += "p_prev";
							break;
						case "next":
							classname += "p_next";
							break;
						case "page":
							classname += "p_page";
							break;
					}

					if (page == currentpage) {
						classname += " active "
					}

					return classname;
				},
				itemTexts: function (type, page, current) {  //
					switch (type) {
						case "first":
							return "首页";
						case "prev":
							return "上一页";
						case "next":
							return "下一页";
						case "last":
							return "末页";
						case "page":
							return page;
					}
				},
				tooltipTitles: function (type, page, current) {
					switch (type) {
						case "first":
							return "去首页";
						case "prev":
							return "上一页";
						case "next":
							return "下一页";
						case "last":
							return "去末页";
						case "page":
							return page === current ? "当前页数 " + page : "前往第 " + page + " 页"
					}
				},
				onPageClicked: function (event, originalEvent, type, page) { //点击事件

					//var currentTarget = $(event.currentTarget);
					entry_expire_manage.currentPage = page;
					entry_expire_manage.GetEmployeeList();

				}
			};

			var ul = '<ul class="pagenation" style="float:right;"></ul>';
			$(entry_expire_manage.containerName).find('.pager_container').show();
			$(entry_expire_manage.containerName).find('.pager_container').html(ul);
			$(entry_expire_manage.containerName).find('.pager_container ul')
				.bootstrapPaginator(options);
		}

		entry_expire_manage.IsChooseAll();//是否 已经全部选择
		entry_expire_manage.CheckEmployeeIsChoose();//底部 删除、同意入职按钮 初始化
	},

	//选中当前行
	ChooseItem: function (self) {
		if ($(self).closest(".employee_item").hasClass("active")) { //如果选中行
			$(self).closest(".employee_item").removeClass("active");
			$(self).find("img").attr("src", "image/UnChoose.png")
		}
		else { //如果未选中
			$(self).closest(".employee_item").addClass("active");
			$(self).find("img").attr("src", "image/Choosed.png")
		}

		entry_expire_manage.IsChooseAll();//是否 已经全部选择
	},
	//选择全部
	ChooseAll: function () {
		//alert(11)
		if ($(self).hasClass("active")) {   //已经选中
			$(self).removeClass("active").find("img").attr("src", "image/UnChoose.png")
			$(self).closest(entry_expire_manage.containerName)
				.find("table tbody .employee_item").removeClass("active")
				.find("img").attr("src", "image/UnChoose.png")
		}
		else {
			$(self).addClass("active").find("img").attr("src", "image/Choosed.png")
			$(self).closest(entry_expire_manage.containerName)
				.find("table tbody .employee_item").addClass("active")
				.find("img").attr("src", "image/Choosed.png")
		}

		entry_expire_manage.CheckEmployeeIsChoose();//检查是否有选中的 员工
	},
	//是否 已经全部选择
	IsChooseAll: function () {
		var chooseNo = 0;//选中的个数
		var $item = $(entry_expire_manage.containerName).find("tbody .employee_item");
		//console.log($item.length)
		for (var i = 0; i < $item.length; i++) {
			if ($item.eq(i).hasClass("active")) { //如果 是选中的
				chooseNo += 1;
			}
		}

		//没有全部选中
		if (chooseNo == 0 ||
			chooseNo < $(entry_expire_manage.containerName).find("tbody .employee_item").length) {
			$(entry_expire_manage.containerName).find(".choose_container").removeClass("active")
				.find("img").attr("src", "image/UnChoose.png");
		}
		else {
			$(entry_expire_manage.containerName).find(".choose_container").addClass("active")
				.find("img").attr("src", "image/Choosed.png");
		}

		entry_expire_manage.CheckEmployeeIsChoose();//底部 删除、同意入职按钮 初始化
	},
	//底部 删除、同意入职按钮 初始化
	CheckEmployeeIsChoose: function () {
		if ($(entry_expire_manage.containerName).find("tbody .employee_item.active").length > 0) {
			$(entry_expire_manage.containerName).find(".foot .btn_renew")
				.addClass("btn-success").removeClass("btn-default");
		}
		else {
			$(entry_expire_manage.containerName).find(".foot .btn_renew")
				.addClass("btn-default").removeClass("btn-success");
		}
	},

	//同意入职 弹框显示
	entryModalShow: function () {
		$entry_info_modal.modal("show");

		//同意入职 弹框出现后执行方法
		$entry_info_modal.on("shown.bs.modal", function () {

			entry_info.init();//初始化方法

			var $btn = $("<button>");
			$btn.addClass("btn");
			$btn.addClass("btn-success");
			$btn.addClass("btn_agree");
			$btn.html("确定");
			$btn.attr("onclick", "entry_expire_manage.entryAgree()");//同意入职 确认

			$entry_info_modal.find(".modal-footer").html($btn);
		});

	},
	//同意入职 确认
	entryAgree: function () {
		//entry_info
	}

};

$(function () {

});
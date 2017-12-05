/**
 * Created by Administrator on 2016/6/21.
 */

var index = {
	containerName: "",


	Init: function () {
		index.containerName = ".index_container";

		getUserInfo();//获取用户信息

		//var img_width = $(".index_img").width();
		//var img_height = img_width * 556 / 1174;
		//$(".index_img").css("height", img_height);
		//
		//$(window).resize(function () {
		//    var img_width = $(".index_img").width();
		//    var img_height = img_width * 556 / 1174;
		//    $(".index_img").css("height", img_height);
		//});

		//index.GetUserInfo();

		index.EmployeeContractExpireList();//获取合同到期列表
		index.EmployeeProbationExpireList();//获取 试用期到期 列表
		index.EmployeeEntryList();//获取 同意入职列表
	},

	//获取合同到期列表
	EmployeeContractExpireList: function () {
		var $contract_expire_block = $(index.containerName).find(".block_1");

		var obj = new Object();
		obj.page_size = "10";
		obj.page = "1";

		branPostRequest(UrlList.contract_expire_list, obj, function (data) {
			//alert(JSON.stringify(data));

			if (data.code == 1000) {

				var contract_expire_list_count = data.result.totalCount;//合同到期 员工数量
				var contract_expire_list = "";
				if (data.result.models == null || data.result.models.length == 0) {
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
							"<div class='contract_expire_item col-xs-12' data-version='" + version + "' " +
							"data-id='" + id + "'>" +
							"<div class='employee_name col-xs-2'>" + name + "</div>" +
							"<div class='col-xs-5'>" +
							"<span class='txt'>合同开始时间：</span>" +
							"<span class='employee_contract_begin_time'>" + start_time + "</span>" +
							"</div>" +
							"<div class='col-xs-5'>" +
							"<span class='txt'>合同到期时间：</span>" +
							"<span class='employee_contract_end_time'>" + end_time + "</span>" +
							"</div>" +
							"</div>";
					}
				}

				$contract_expire_block.find(".count").html(contract_expire_list_count);//合同到期的 员工数量

				if (contract_expire_list_count == 0) {	//如果没有 合同到期的 员工
					var contract_expire_none = "<div class='none'>暂无合同到期的员工</div>";
					$contract_expire_block.find(".contract_expire_list").html(contract_expire_none);
				}
				else {
					$contract_expire_block.find(".contract_expire_list").html(contract_expire_list);
				}

			}
			else {
				branError(data.msg);
			}

		}, function (error) {
			branError(error);
		})

	},
	//获取 试用期到期 列表
	EmployeeProbationExpireList: function () {
		var $probation_expire_block = $(index.containerName).find(".block_2");

		var obj = new Object();
		obj.page_size = "10";
		obj.page = "1";

		branPostRequest(UrlList.probation_expire_list, obj, function (data) {
			//alert(JSON.stringify(data));

			if (data.code == 1000) {

				var probation_expire_list_count = data.result.totalCount;//合同到期 员工数量
				var probation_expire_list = "";
				if (data.result.models == null || data.result.models.length == 0) {
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

						probation_expire_list +=
							"<div class='probation_expire_item col-xs-12' data-version='" + version + "' " +
							"data-id='" + id + "'>" +
							"<div class='employee_name col-xs-2'>" + name + "</div>" +
							"<div class='col-xs-5'>" +
							"<span class='txt'>试用期开始时间：</span>" +
							"<span class='employee_probation_begin_time'>" + start_time + "</span>" +
							"</div>" +
							"<div class='col-xs-5'>" +
							"<span class='txt'>试用期到期时间：</span>" +
							"<span class='employee_probation_end_time'>" + end_time + "</span>" +
							"</div>" +
							"</div>";
					}
				}

				$probation_expire_block.find(".count").html(probation_expire_list_count);//试用期到期的 员工数量

				if (probation_expire_list_count == 0) {	//如果没有 试用期到期的 员工
					var contract_expire_none = "<div class='none'>暂无试用期到期的员工</div>";
					$probation_expire_block.find(".probation_expire_list").html(contract_expire_none);
				}
				else {
					$probation_expire_block.find(".probation_expire_list").html(probation_expire_list);
				}

			}
			else {
				branError(data.msg);
			}

		}, function (error) {
			branError(error);
		})
	},
	//获取 同意入职列表
	EmployeeEntryList: function () {

	},

	//合同到期提醒 查看详情
	EmployeeContractExpireDetail: function () {
		var tabId = "contract_expire";//tab中的id
		var pageName = "合同到期";

		getInsidePageDiv(UrlList.contract_expire_index, tabId, pageName);
	},

	//试用期到期提醒 查看详情
	EmployeeProbationExpireDetail: function () {

		var tabId = "probation_expire";//tab中的id
		var pageName = "试用期到期";

		getInsidePageDiv(UrlList.probation_expire_index, tabId, pageName);

	},

	//同意入职 查看详情
	EmployeeEntryDetail: function () {

		var tabId = "entry_expire";//tab中的id
		var pageName = "同意入职";

		getInsidePageDiv(UrlList.entry_expire_index, tabId, pageName);

	}


};
/**
 * Created by CuiMengxin on 2016/10/12.
 */

var $entry_info_modal = $(".entry_info_modal");//同意入职弹框

var entry_info = {

	AgreeArray: "",//同意入职员工列表


	//初始化方法
	init: function () {

		entry_info.initWorkSnListByEntry();//初始化 同意入职弹框内 起始工号列表
		entry_info.initTimeByEntry();//初始化 同意入职弹框内 时间格式
		entry_info.initChooseEndDate();//初始化 选择结束日期
	},
	//初始化 同意入职弹框内 时间格式
	initTimeByEntry: function () {
		var $row = $entry_info_modal.find(".modal-body .row");

		//开始时间 click
		$row.find(".entry_info_begin_time").html("").click(function () {
			var opt = {
				elem: "#entry_info_begin_time"
				//min: laydate.now(),
			};

			laydate(opt)
		});
		$row.find(".icon_begin").click(function () {
			var opt = {
				elem: "#entry_info_begin_time"
				//min: laydate.now(),
			};

			laydate(opt)
		});
		//结束时间 click
		$row.find(".entry_info_end_time").html("").click(function () {
			var opt = {
				elem: "#entry_info_end_time"
				//min: laydate.now(),
			};

			laydate(opt)
		});
		$row.find(".icon_end").click(function () {
			var opt = {
				elem: "#entry_info_end_time"
				//min: laydate.now(),
			};

			laydate(opt)
		});

		//面试日期 click
		$row.find(".entry_info_interview_time").html("").click(function () {
			var opt = {
				elem: "#entry_info_interview_time"
				//min: laydate.now(),
			};

			laydate(opt)
		});
		$row.find(".icon_interview").click(function () {
			var opt = {
				elem: "#entry_info_interview_time"
				//min: laydate.now(),
			};

			laydate(opt)
		});

	},
	//初始化 同意入职弹框内 起始工号列表
	initWorkSnListByEntry: function () {
		var $row = $entry_info_modal.find(".modal-body .row");

		var url = UrlList.setting_job_num_manage_list;
		//alert(url)
		branGetRequest(url, function (data) {
			//alert(JSON.stringify(data));

			if (data.code == 1000) {

				var workSn = data.result.modals;
				var workSn_list = "";//
				if (!workSn || workSn.length == 0) {
					//toastrMsg("warning", "工号列表 为空，请先去'设置中心'-'工号前缀' 添加数据！");
					//return;
				}
				else {
					for (var i = 0; i < workSn.length; i++) {

						var item = workSn[i];
						var id = item.id;//
						var name = item.name;//
						var version = item.version;//版本
						//var latestSn=item.latestSn;//最近一次未分配的工号

						workSn_list += "<option value='" + id + "' " +
							"data-version='" + version + "'>" + name + "</option>";
					}
				}

				$row.find(".employee_no_begin select").html(workSn_list);
				if (workSn_list == "") {
					$row.find(".employee_no_begin select").attr("readonly", "readonly");
					$row.find(".employee_no_begin select").attr("data-isNull", "0");//是否为空 0 为空 1 不为空
				}

				//获取工号 后缀
				employee_prospectiveList.GetWorkSn("", function () {
					$row.find(".employee_no_begin").removeClass("isBad");
				}, function () {
					$row.find(".employee_no_begin").addClass("isBad");
				});
			}
			else {
				branError(data.msg);
			}

		}, function (error) {
			branError(error);
		})
	},
	//初始化 选择结束日期
	initChooseEndDate: function () {
		$entry_info_modal.find(".entry_end_date_list > span").each(function () {
			$(this).click(function () {

				
			});
		});
	},

	//根据 起始工号、分配总数 获取工号
	GetWorkSn: function (worksn_start, SuccessFunc, ErrorFunc) {
		var $modal = $(".employee_prospective_list_entry_modal").find(".modal-body");
		var $modal_line = $modal.find(".line");

		var count = employee_prospectiveList.AgreeArray.length;//同意入职员工数量

		$modal_line.find(".employee_no_count").html(count);//

		//单个用户 入职
		if (employee_prospectiveList.OnlyOrMore == "only") {
			$modal_line.find(".entry_more").hide().siblings(".entry_only").show();
			var name = sessionStorage.getItem("userName");
			console.log(123);
			$modal_line.find(".entry_only .employee_name").html(name);
		}
		//多个用户 入职
		if (employee_prospectiveList.OnlyOrMore == "more") {
			var $item = $(employee_prospectiveList.containerName).find(".employee_prospective_list")
				.find(".employee_item.active");

			if (count == 1) {   //只有一个用户入职
				var name = $item.eq(0).find(".employee_name").html();

				$modal_line.find(".entry_more").hide().siblings(".entry_only").show();
				$modal_line.find(".entry_only .employee_name").html(name);
			}
			else {
				$modal_line.find(".entry_only").hide().siblings(".entry_more").show();

				var name_start = $item.eq(0).find(".employee_name").html();
				var name_end = $item.eq(count - 1).find(".employee_name").html();
				$modal_line.find(".entry_more .start_people").html(name_start);
				$modal_line.find(".entry_more .end_people").html(name_end);
			}
		}

		var $work_sn = $modal.find(".employee_no_begin select");
		var work_sn_prefix_id = "";
		var version = "";
		if ($work_sn.attr("data-isNull") != 0) {		//如果工号前缀 不为空
			work_sn_prefix_id = $work_sn.find("option:selected").val();
			version = $work_sn.find("option:selected").attr("data-version");
		}

		var obj = {};
		obj.beginWorkSn = worksn_start;
		obj.count = count.toString();
		obj.id = work_sn_prefix_id;
		obj.version = version;

		//alert(JSON.stringify(obj))
		branPostRequest(UrlList.prospective_work_sn_get, obj, function (data) {
				//alert(JSON.stringify(data));

				if (data.code == 1000) {

					//var id = data.result.id;
					var beginWorkSn = data.result.beginWorkSn;
					var endWorkSn = data.result.endWorkSn;
					var version = data.result.version;
					var workSnPrefix = $(".employee_prospective_list_entry_modal").find(".employee_no_begin select option:selected").text();
					if (beginWorkSn == endWorkSn) {		//只有一个用户入职
						$modal_line.find(".entry_only").find(".employee_no").html(workSnPrefix + beginWorkSn);
					}
					else {
						$modal_line.find(".entry_more").find(".start_work_sn").html(beginWorkSn);
						$modal_line.find(".entry_more").find(".end_work_sn").html(endWorkSn);
					}

					$modal.find(".employee_no_begin input").val(beginWorkSn);
					$modal.find(".employee_no_begin select option:selected").attr("data-version", version);

					SuccessFunc();
				}
				else {
					branError(data.msg);
					ErrorFunc();
				}

			},
			function (error) {
				branError(error);
				ErrorFunc();
			});
	},

};

$(function () {

	////同意入职 弹框出现后执行方法
	//$entry_info_modal.on("shown.bs.modal", function () {
	//
	//	entry_info.initWorkSnListByEntry();//初始化 同意入职弹框内 起始工号列表
	//	entry_info.initTimeByEntry();//初始化 同意入职弹框内 时间格式
	//
	//});

});
/**
 * Created by Jack on 2016/5/26.
 * 获取 部门、工段、班组、职位、离职原因 列表
 */

var getBasicList = {

	get_depturl: "",
	get_worklineurl: "",
	get_workshifturl: "",
	get_posturl: "",

	//获取 部门、工段、班组、职位 列表
	GetBasicList: function (depturl, worklineurl, workshifturl, posturl, succFun, errFun) {
		getBasicList.get_depturl = depturl;
		getBasicList.get_worklineurl = worklineurl;
		getBasicList.get_workshifturl = workshifturl;
		getBasicList.get_posturl = posturl;

		getBasicList.GetDeptList(succFun, errFun);//获取 部门 列表
	},
	//获取 部门 列表
	GetDeptList: function (succFun, errFun) {
		//获取部门信息
		branGetRequest(getBasicList.get_depturl, function (data) {
				//alert(JSON.stringify(data))

				if (data.code == 1000) {

					var deptList = "";//部门列表
					if (data.result == null || data.result.length == 0) {
					}
					else {
						for (var i = 0; i < data.result.length; i++) {
							var item = data.result[i];
							var dept_id = item.department_id;//
							var dept_name = item.department_name;//
							deptList += "<option value='" + dept_id + "'>" + dept_name + "</option>";
						}
					}
					sessionStorage.setItem("deptList", deptList);//部门列表

					getBasicList.GetWorkLineList(succFun, errFun);//获取 工段 列表
				}
				else {
					errFun(data.msg);
				}
			},
			function (error) {
				errFun("error:" + JSON.stringify(error))
			})
	},
	//获取 工段 列表
	GetWorkLineList: function (succFun, errFun) {
		branGetRequest(getBasicList.get_worklineurl, function (data) {
				//alert(JSON.stringify(data))
				if (data.code == 1000) {

					var workLineList = "";//工段列表
					if (data.result == null || data.result.length == 0) {
					}
					else {
						for (var i = 0; i < data.result.length; i++) {

							var item = data.result[i];
							var workLine_id = item.work_line_id;//
							var workLine_name = item.work_line_name;//
							workLineList += "<option value='" + workLine_id + "'>" +
								workLine_name + "</option>";
						}
					}
					sessionStorage.setItem("workLineList", workLineList);//工段列表

					getBasicList.GetWorkShiftList(succFun, errFun);//获取 班组 列表
				}
				else {
					errFun(data.msg);
				}
			},
			function (error) {
				errFun("error:" + JSON.stringify(error))
			})
	},
	//获取 班组 列表
	GetWorkShiftList: function (succFun, errFun) {
		branGetRequest(getBasicList.get_workshifturl, function (data) {
				//alert(JSON.stringify(data))
				if (data.code == 1000) {

					var workShiftList = "";//班组列表
					if (data.result == null || data.result.length == 0) {
					}
					else {
						for (var i = 0; i < data.result.length; i++) {

							var item = data.result[i];
							var workShift_id = item.work_shift_id;//
							var workShift_name = item.work_shift_name;//
							workShiftList += "<option value='" + workShift_id + "'>" + workShift_name + "</option>";
						}
					}
					sessionStorage.setItem("workShiftList", workShiftList);//班组列表

					getBasicList.GetPostList(succFun, errFun);//获取 职位 列表
				}
				else {
					errFun(data.msg);
				}
			},
			function (error) {
				errFun("error:" + JSON.stringify(error))
			})
	},
	//获取 职位 列表
	GetPostList: function (succFun, errFun) {
		branGetRequest(getBasicList.get_posturl, function (data) {
				//alert(JSON.stringify(data))

				if (data.code == 1000) {

					var postList = "";//职位列表
					if (data.result == null || data.result.length == 0) {
					}
					else {
						for (var i = 0; i < data.result.length; i++) {

							var item = data.result[i];
							var post_id = item.position_id;//
							var post_name = item.position_name;//
							postList += "<option value='" + post_id + "'>" + post_name + "</option>";
						}
					}
					sessionStorage.setItem("postList", postList);//职位列表

					succFun();
				}
				else {
					errFun(data.msg);
				}
			},
			function (error) {
				errFun("error:" + JSON.stringify(error))
			})
	},
	//获取 离职原因 列表
	GetLeaveReasonList: function (leaveReason_url, succFun, errFun) {

		branGetRequest(leaveReason_url, function (data) {
			//alert(JSON.stringify(data))

			if (data.code == 1000) {

				var leaveReasonList = "";//
				if (data.result == null || data.result.length == 0) {
				}
				else {
					for (var i = 0; i < data.result.length; i++) {

						var item = data.result[i];
						var id = item.leave_reason_id;//
						var name = item.leave_reason_name;//
						var isBad = item.is_not_good;// 0 正常原因 1 不良原因

						if (isBad == 0) {
							leaveReasonList += "<option value='" + id + "'>" + name + "</option>>";
						}
						else {
							leaveReasonList += "<option class='isBad' value='" + id + "'>" +
								name + "</option>>";
						}
					}
				}
				sessionStorage.setItem("leaveReasonList", leaveReasonList);//离职原因列表

				succFun();

			}
			else {
				errFun(data.msg)
			}

		}, function (error) {
			errFun("error:" + JSON.stringify(error))
		})

	},


	//检查 部门、工段、班组、职位 列表 信息
	CheckBasicList: function () {
		if (sessionStorage.getItem("deptList") == "" ||
			sessionStorage.getItem("deptList") == null) {
			toastrMsg("error", "部门列表为空，请先去'设置中心'-'部门' 添加数据！");
			return false;
		}
		else if (sessionStorage.getItem("workShiftList") == "" ||
			sessionStorage.getItem("workShiftList") == null) {
			toastrMsg("error", "班组 列表为空，请先去'设置中心'-'班组' 添加数据！");
			return false;
		}
		else if (sessionStorage.getItem("workLineList") == "" ||
			sessionStorage.getItem("workLineList") == null) {
			toastrMsg("error", "工段 列表为空，请先去'设置中心'-'工段' 添加数据！");
			return false;
		}
		else if (sessionStorage.getItem("postList") == "" ||
			sessionStorage.getItem("postList") == null) {
			toastrMsg("error", "职位 列表为空，请先去'设置中心'-'职位' 添加数据！");
			return false;
		}
		else {
			return true
		}
	},

	//获取省份列表
	ProvinceList: function (url, succFun, errFun) {

		var obj = new Object();
		obj.id = "";
		obj.type = 0;
		//0 查询所有的省(如果type 0 id可以不传)
		//1 根据父id查询所有的子

		url += "?" + jsonParseParam(obj);
		branGetRequest(url, function (data) {
			//alert(JSON.stringify(data));

			if (data.code == 1000) {

				var province_list = "";
				for (var i = 0; i < data.result.models.length; i++) {
					var item = data.result.models[i];

					var id = item.id;
					var name = item.name;//
					var version = item.version;//

					province_list += "<option value='" + id + "' " +
						"data-version='" + version + "'>" + name + "</option>";
				}
				sessionStorage.setItem("province_list", province_list);
				succFun();
			}
			else {
				branError(data.msg);
				errFun();
			}

		}, function (error) {
			branError(error);
			errFun();
		});

	},
	//获取城市列表
	CityList: function (url, province_id, succFun, errFun) {
		var obj = new Object();
		obj.id = province_id;
		obj.type = 1;
		//0 查询所有的省(如果type 0 id可以不传)
		//1 根据父id查询所有的子

		url += "?" + jsonParseParam(obj);
		branGetRequest(url, function (data) {
			//alert(JSON.stringify(data));

			if (data.code == 1000) {

				var city_list = "";
				for (var i = 0; i < data.result.models.length; i++) {
					var item = data.result.models[i];

					var id = item.id;
					var name = item.name;//
					var version = item.version;//

					city_list += "<option value='" + id + "' " +
						"data-version='" + version + "'>" + name + "</option>";
				}

				sessionStorage.setItem("city_list", city_list);
				succFun();
			}
			else {
				branError(data.msg);
				errFun();
			}

		}, function (error) {
			branError(error);
			errFun();
		});

	},
	//获取省份列表
	AreaList: function (url, city_id, succFun, errFun) {
		var obj = new Object();
		obj.id = city_id;
		obj.type = 1;
		//0 查询所有的省(如果type 0 id可以不传)
		//1 根据父id查询所有的子

		url += "?" + jsonParseParam(obj);
		branGetRequest(url, function (data) {
			//alert(JSON.stringify(data));

			if (data.code == 1000) {

				var area_list = "";
				for (var i = 0; i < data.result.models.length; i++) {
					var item = data.result.models[i];

					var id = item.id;
					var name = item.name;//
					var version = item.version;//

					area_list += "<option value='" + id + "' " +
						"data-version='" + version + "'>" + name + "</option>";
				}

				sessionStorage.setItem("area_list", area_list);
				succFun();
			}
			else {
				branError(data.msg);
				errFun();
			}

		}, function (error) {
			branError(error);
			errFun();
		});

	}
};
/**
 * Created by Jack on 2016/5/19.
 */

//所有的 url

var UrlList = {

	//修改密码
	pwd_modify: "admin/user/pwd/change",
	//退出登录
	Login_Out: "admin/signout",
	//获取登录用户个人信息
	userInfo_get: "admin/user/info/detail",
	//获取省份 列表
	province_list: "admin/employee/roster/manage/localtion",
	//获取 城市 列表
	city_list: "admin/employee/roster/manage/localtion",
	//获取 地区 列表
	area_list: "admin/employee/roster/manage/localtion",
	//合同到期 - 页面
	contract_expire_index: "admin/home/expiration/detail",
	//合同到期 - 列表
	contract_expire_list: "admin/employee/roster/manage/expiration",
	//试用期到期 - 页面
	probation_expire_index: "admin/home/probation/detail",
	//试用期到期 - 列表
	probation_expire_list: "admin/employee/roster/manage/probation",
	//试用期到期 - 受理
	probation_expire_accept: "admin/employee/roster/manage/probation/process",
	//同意入职 到期 - 页面
	entry_expire_index: "admin/home/acceptOffer/detail",
	//同意入职 到期 - 列表
	entry_expire_list: "",
	//员工体检详情页面
	employee_physical_exam_detail_index: "admin/examination/index",
	//员工体检详情
	employee_physical_exam_detail_get_url: "admin/examination/result/querybyid",

	//从操作日志界面
	log_operation_index: "admin/log/operation/index",
	//获取 操作模块 列表
	log_module_list: "admin/log/operation/module/list",
	//获取 操作类型 列表
	log_type_list: "admin/log/operation/type/list",
	//获取 操作日志 列表
	log_operation_list: "admin/log/operation",

	//获取部门列表
	get_dept_list_prospective: "admin/employee/prospective/manage/department/list",
	get_dept_list_roster: "admin/employee/roster/manage/department/list",
	get_dept_list_leave: "admin/employee/leave/manage/department/list",
	//获取工段列表
	get_workLine_list_prospective: "admin/employee/prospective/manage/work_line/list",
	get_workLine_list_roster: "admin/employee/roster/manage/work_line/list",
	get_workLine_list_leave: "admin/employee/leave/manage/work_line/list",
	//获取班组列表
	get_workShift_list_prospective: "admin/employee/prospective/manage/work_shift/list",
	get_workShift_list_roster: "admin/employee/roster/manage/work_shift/list",
	get_workShift_list_leave: "admin/employee/leave/manage/work_shift/list",
	//获取职位列表
	get_post_list_prospective: "admin/employee/prospective/manage/position/list",
	get_post_list_roster: "admin/employee/roster/manage/position/list",
	get_post_list_leave: "admin/employee/leave/manage/position/list",

	//待入职
	//导入/添加页面
	prospective_add_index: "admin/employee/prospective/add/index",
	//待入职员工 - 保存（新增）
	prospective_add_save: "admin/employee/prospective/add/save",
	//待入职员工 - 保存（修改）
	prospective_add_update: "admin/employee/prospective/add/update",
	//待入职员工 - 删除
	prospective_add_del: "admin/employee/prospective/add/delete",
	//待入职员工 - Excel导入
	prospective_excel_import: "admin/employee/prospective/import/check",
	//待入职员工 - Excel确认导入
	prospective_excel_import_confirm: "admin/employee/prospective/import/confirm",

	//待入职员工 - 名单页面
	prospective_list_index: "admin/employee/prospective/list/index",
	//待入职员工名单 - 分页查询
	prospective_list: "admin/employee/prospective/manage/list",
	//待入职员工 - 详情页面
	prospective_detail_index: "admin/employee/prospective/manage/detail/index",
	//待入职员工详情 - 获取
	prospective_detail_get: "admin/employee/prospective/manage/detail",
	//待入职员工 - 获取工号
	prospective_work_sn_get: "admin/workSnPrefix/get/id",
	//待入职员工 - 同意入职
	prospective_accept: "admin/employee/prospective/manage/accept",
	//待入职员工 - 名单导出
	prospective_excel_export: "admin/employee/prospective/manage/export",
	//待入职员工 - 下载附件
	prospective_attachment_down: "admin/employee/prospective/manage/attachment/download",

	//花名册
	//花名册 - 页面
	roster_list_index: "admin/employee/roster/manage/index",
	//花名册 - 查询员工
	roster_list: "admin/employee/roster/manage/list",
	//在职员工详情页面
	roster_detail_index: "admin/employee/roster/manage/detail/index",
	//在职员工详情 - 获取
	roster_detail_get: "admin/employee/roster/manage/detail",
	//在职员工 - 获取员工信息（编辑时）
	roster_info_by_id: "admin/employee/roster/manage/get/id",
	//在职员工 - 信息修改
	roster_modify: "admin/employee/roster/manage/update",
	//在职员工 - 退工
	roster_leave: "admin/employee/roster/manage/leave",
	//在职员工 - 续签
	roster_contract_extension: "admin/employee/roster/manage/contract/extension",
	//在职员工 - 导出
	roster_excel_export: "admin/employee/roster/manage/export",
	//在职员工 - 下载附件
	roster_attachment_down: "admin/employee/roster/manage/attachment/download",


	//离职员工
	//离职员工 - 列表页面
	leave_list_index: "admin/employee/leave/index",
	//离职员工 - 列表
	leave_list: "admin/employee/leave/list",
	//离职员工 - 删除
	leave_employee_del: "admin/employee/leave/delete",
	//离职员工详情页面
	leave_detail_index: "admin/employee/leave/detail/index",
	//离职员工详情 - 获取
	leave_detail_get: "admin/employee/leave/detail",
	//离职员工 - 名单导出
	leave_excel_export: "admin/employee/leave/export",


	//消息
	//消息页面
	notification_list_index: "admin/notification/index",
	//历史消息 - 列表
	notification_list: "admin/notification/list",
	//消息 - 获取部门
	notification_dept_list_get: "admin/notification/department/list",
	//消息 - 删除
	notification_del: "admin/notification/delete",
	//消息 - 发布
	notification_release: "admin/notification/post",


	//设置中心

	//通用 管理页面
	setting_general_manage_index: "admin/setting/general/index",
	//入职消息提醒 - 获取
	setting_entry_remind: "admin/setting/general/message/check_in",
	//入职消息提醒 - 保存
	setting_entry_save: "admin/setting/general/message/check_in/update",

	//部门管理页面
	setting_dept_manage_index: "admin/setting/department/index",
	//部门 - 列表
	setting_dept_list: "admin/setting/department/list",
	//部门 - 添加
	setting_dept_add: "admin/setting/department/add",
	//部门 - 编辑
	setting_dept_edit: "admin/setting/department/update",
	//部门 - 删除
	setting_dept_del: "admin/setting/department/delete",
	//部门 - 编辑后 提交
	setting_dept_submit: "admin/setting/department/update",

	//工段 管理页面
	setting_workLine_manage_index: "admin/setting/work_line/index",
	//工段 - 列表
	setting_workLine_list: "admin/setting/work_line/list",
	//工段 - 添加
	setting_workLine_add: "admin/setting/work_line/add",
	//工段 - 删除
	setting_workLine_del: "admin/setting/work_line/delete",
	//工段 - 编辑
	setting_workLine_modify: "admin/setting/work_line/update",

	//班组 管理页面
	setting_workShift_manage_index: "admin/setting/work_shift/index",
	//班组 - 列表
	setting_workShift_list: "admin/setting/work_shift/list",
	//班组 - 添加
	setting_workShift_add: "admin/setting/work_shift/add",
	//班组 - 删除
	setting_workShift_del: "admin/setting/work_shift/delete",
	//班组 - 编辑
	setting_workShift_modify: "admin/setting/work_shift/update",

	//职位 管理页面
	setting_post_manage_index: "admin/setting/position/index",
	//职位 - 列表
	setting_post_list: "admin/setting/position/list",
	//职位 - 添加
	setting_post_add: "admin/setting/position/add",
	//职位 - 删除
	setting_post_del: "admin/setting/position/delete",
	//职位 - 编辑
	setting_post_modify: "admin/setting/position/update",

	//工号前缀 - 页面
	setting_job_num_manage_index: "admin/setting/work_sn_prefix/index",
	//工号前缀 - 列表
	setting_job_num_manage_list: "admin/workSnPrefix/get",
	//工号前缀 - 添加
	setting_job_num_manage_add: "admin/workSnPrefix/add",
	//工号前缀 - 删除
	setting_job_num_manage_del: "admin/workSnPrefix/del",
	//工号前缀 - 编辑
	setting_job_num_manage_modify: "admin/workSnPrefix/update",

	//离职原因 管理页面
	setting_leaveReason_manage_index: "admin/setting/leave_reason/index",
	//离职原因 - 列表
	setting_leaveReason_list: "admin/setting/leave_reason/list",
	//离职原因 - 添加
	setting_leaveReason_add: "admin/setting/leave_reason/add",
	//离职原因 - 删除
	setting_leaveReason_del: "admin/setting/leave_reason/delete",
	//离职原因 - 编辑
	setting_leaveReason_modify: "admin/setting/leave_reason/update",


	//企业管理

	//企业信息 - 页面
	corporation_info_index: "admin/corporation/info/index",
	//企业信息 - 获取
	corporation_info_get: "admin/corporation/info/detail",

	//厂车路线 - 页面
	corporation_route_index: "admin/corporation/bus/index",
	//厂车路线 - 查询
	corporation_route_get: "admin/corporation/bus/html/url",
	//厂车路线 - 上传
	corporation_route_upload: "admin/corporation/bus/preview/upload",
	//厂车路线- 确认导入
	corporation_route_upload_confirm: "admin/corporation/bus/upload/confirm",

	//员工手册 - 页面
	corporation_handbook_index: "admin/corporation/handbook/index",
	//员工手册 - 查询
	corporation_handbook_get: "admin/corporation/handbook/html/url",
	//员工手册 - 上传
	corporation_handbook_upload: "admin/corporation/handbook/upload",
	//员工手册- 确认导入
	corporation_handbook_upload_confirm: "admin/corporation/handbook/upload/confirm",


	//用户管理

	//用户管理 - 页面
	user_info_account_manage_index: "admin/permission/index",
	//账号获取 - 列表
	user_info_account_list: "admin/permission/get",
	//用户管理 - 新增
	user_info_account_add: "admin/permission/add",
	//用户管理 - 编辑
	user_info_account_modify: "admin/permission/update",
	//用户管理 - 删除
	user_info_account_del: "admin/permission/delete/ids",


	//薪资管理

	//薪资管理(未发布) - 页面
	salary_manage_index: "admin/salary/index",
	//薪资管理(已发布) - 页面
	salary_release_manage_index: "admin/salary/release/index",
	//薪资管理 - 列表查询
	salary_list: "admin/salary/get",
	//薪资管理 - excel 模板下载
	salary_excel_down: "admin/salary/download",
	//薪资管理 - excel 导入验证
	salary_excel_import_check: "admin/salary/verify",
	//薪资管理 - 确认导入
	salary_excel_import_confirm: "admin/salary/confirm",
	//薪资管理 - 删除
	salary_del: "admin/salary/delete/ids",
	//薪资管理 - 发布
	salary_release: "admin/salary/release",

	//薪资详情 - 页面
	salary_detail_index: "admin/salary/detail/index",
	//薪资详情 - 获取
	salary_detail_get: "admin/salary/detail"


};
define(['zepto', 'underscore', 'backbone',
		'swiper', 'echo', 'frozen', 'app/api',
		'app/utils', 'app/refreshtoken',
		'text!templates/addressInfo.html'
	],

	function ($, _, Backbone, Swiper, echo, frozen, Api, utils, Token, addressInfoTemplate) {

		var $page = $("#address-info-page");
		var type = 1;//需要判断先登录
		var $provinceId;
		var $cityId;
		var $districtId;
		var $addressStreet;
		var $addressName;
		var $addressPhone;
		var $btnDel;
		var addressName;
		var addressPhone;
		var addressStreet;
		var provinceId;
		var cityId;
		var districtId;
		var addressId;
		var isDefault;//是否是默认地址 0不是 1 是
		var addressInfoView = Backbone.View.extend({
			el: $page,
			render: function (id) {
				utils.showPage($page, function () {
					$page.empty().append(addressInfoTemplate);
					isDefault = 0;
					$provinceId    = $page.find("#provinceId");
					$cityId 	   = $page.find("#cityId");
					$districtId    = $page.find("#districtId");
					$addressStreet = $page.find(".address_street");
					$addressName   = $page.find(".address_name");
					$addressPhone  = $page.find(".address_phone");
					$btnDel  = $page.find(".btn_del");
					addressId = id;
					if (addressId) {//编辑收货地址

						//查询收货地址并 页面展示
						$btnDel.show();
						toGetAddress(addressId);
					}

					//新增收货地址
					if (addressId == null || addressId == '') {
					getProvinces(function() {
						getCities($provinceId.val(), function() {
							getDistricts($cityId.val());
						});
					}, 10);
				}
				});
			},
			events: {
				//保存地址
				"tap .btn_save": "saveAddresses",
				// 更新城市列表
				"change #provinceId": "updateCity",
				// 更新区列表
				'change #cityId': 'updateDistrict',
				// 点击默认状态
				'tap .ui-switch input': 'toggleDefault',
				// 删除地址
				'tap .btn_del': 'deleteAddress'
			},

			saveAddresses: function () {
				//验证信息
				if (!verify())
					return;

				toSaveAddress();

			},

			updateCity: function(e){

				var $this = $(e.currentTarget);

				getCities($this.val(), function () {
					$cityId.trigger('change');
				});
			},

			updateDistrict: function(e) {
				var $this = $(e.currentTarget);

				getDistricts($this.val());
			},

			toggleDefault: function(e){

				var tar = $("input[type='checkbox']").is(':checked');
				if(tar){
					isDefault = 1;
				}else{
					isDefault = 0;
				}
			},

			deleteAddress: function(e){

				$.Dialog.confirm('警告', '确认要删除此地址吗?', function() {
					
					var param = {id:addressId}

					Api.deleteAddress(param, function(successData){

						$.Dialog.success("删除成功");
						window.history.go(-1);
					}, function(errorData){

						//token过期 刷新token
						if (errorData.err_code == 20002) {

							Token.getRefeshToken(type, function (data) {

								deleteAddress();

							}, function (data) {

							});
						}

					});
			}, '放弃', '确定');
			},

		});

		//查询收货地址并 页面展示
		var toGetAddress = function () {

			var param = {id: addressId};
			Api.getAddress(param, function (successData) {

				toShowAddressInfo(successData.result);
			}, function (errorData) {

				//token过期 刷新token
				if (errorData.err_code == 20002) {

					Token.getRefeshToken(type, function (data) {

						toGetAddress();

					}, function (data) {

						window.location.href = window.LOGIN_REDIRECT_URL;
					});
				}

			});
		};


		//保存
		var toSaveAddress = function () {
			// 省10 江苏  106 苏州 3876 工业园区
			var str = '';
			if(addressId){
				str = "id=" + addressId;
			}
			var formData = "consignee=" + addressName + "&" +
				"mobile=" + addressPhone + "&" +
				"province_id=" + provinceId + '&' +
				"city_id=" + cityId + '&' +
				"district_id=" + districtId + '&' +
				"is_default=" + isDefault + '&' +
				"street=" + addressStreet + '&' + str;


			var param = {formData: formData};

			Api.saveAddresses(param, function (successData) {

				$.Dialog.success("保存成功");

				//window.location.hash = "addressManage";
				window.history.go(-1);

			}, function (errorData) {

				//token过期 刷新token
				if (errorData.err_code == 20002) {

					Token.getRefeshToken(type, function (data) {

						toSaveAddress();

					}, function (data) {

						window.location.href = window.LOGIN_REDIRECT_URL;
					});
				}
			});

		};

		// 加载地址信息
		var toShowAddressInfo = function (data) {

			$(".address_name").val(data.consignee);
			$(".address_phone").val(data.mobile);
			$(".address_street").val(data.street);
			//debugger
			if(data.is_default == 1){
				$(".check_box").attr("checked",true);
			}else {
				//$("input[type='checkbox']").attr("checked",false);
				// $(".check_box").attr("checked",false);
				// $(".check_box").checked = false;
				// $(".check_box").prop("checked",true);
			}

			getProvinces(function() {
					getCities($provinceId.val(), function() {
						getDistricts($cityId.val(), function() {

						}, data.district_id);
					}, data.city_id);
				}, data.province_id);

		};

		//验证信息
		var verify = function () {
			addressName = $addressName.val();

			addressPhone = $addressPhone.val();

			provinceId = $provinceId.val();

			cityId     = $cityId.val();

			districtId = $districtId.val();

			addressStreet = $.trim($addressStreet.val());

			if (addressName == "") {
				$.Dialog.info("请输入名字")
				return false;
			}

			if (addressPhone == "") {
				$.Dialog.info("请输入手机号")
				return false;
			}
			if (!$.isPhone(addressPhone)) {
				$.Dialog.info("您输入的手机号码格式不正确")

				return false;
			}
			
			
			// 验证省市区
			if (provinceId == '' || cityId == '' || districtId == '') {
				return $.Dialog.info('请选择省市区信息');
			}

			// 街道地址
			if (addressStreet == '') {
				return $.Dialog.info("请填写街道地址");
			}

			

			return true;

		};

		// 加载省份信息
		var getProvinces = function(callback, provinceId) {
			Api.getProvinces(null, function(data){

				var options = [];
				for (var i in data.result) {
					options.push("<option value=\""+data.result[i].id+"\" "+(provinceId==data.result[i].id?'selected':'')+">"+data.result[i].name+"</option>");
				}
				$provinceId.empty().append(options.join(""));
				typeof callback == 'function' && callback(data);
			}, function(data){


			});
		}

		// 加载城市信息
		var getCities = function(provinceId, callback, cityId ) {
			var param = {province_id:provinceId};
			Api.getCity(param, function(data){

				var options = [];
				for (var i in data.result) {
					options.push("<option value=\""+data.result[i].id+"\" "+(cityId==data.result[i].id?'selected':'')+">"+data.result[i].name+"</option>");
				}
				$cityId.empty().append(options.join(""));
				typeof callback == 'function' && callback(data);
			}, function(data){


			});
		}

		// 加载区县信息
		var getDistricts = function(cityId, callback, districtId ) {
			var param = {city_id:cityId};
			Api.getDistricts(param, function(data){

				var options = [];
				for (var i in data.result) {
					options.push("<option value=\""+data.result[i].id+"\" "+(districtId==data.result[i].id?'selected':'')+">"+data.result[i].name+"</option>");
				}
				$districtId.empty().append(options.join(""));
				typeof callback == 'function' && callback(data);
			}, function(data){


			});
		}


		return addressInfoView;
	});

define(
	['zepto', 'app/utils', 'underscore'],
	function ($, utils, _) {

		var ajaxSetup = function () {
			//$.ajaxSetup({
			//  accept: 'application/json',
			//  cache: true,
			//  contentType: 'application/json;charset=UTF-8'
			//});
		};

		return {

			//ajax get
			mxepGet: function (url, beforeSend, successFunc, errorFunc) {
				//ajaxSetup();

				$.ajax({
					url: url,
					type: 'GET',
					accept: 'application/json',
					loadMask: false,
					success: function (data, status, jqXHR) {
						//loadingRemove();//加载中 - 移除logo
						//alert(JSON.stringify(data))
						//console.log(JSON.stringify(data))

						if (data.err_code == 0) {
							if (successFunc) {
								successFunc(data);
							}
						}
						else {
							//alert(data.err_msg);
						}

					},
					onError: function (XMLHttpRequest, textStatus, errorThrow) {
						if (errorFunc)
							errorFunc(XMLHttpRequest);
					}
				});
			},

			mxepPost: function (url, params, beforeSend, successFunc, errorFunc) {

				$.ajax({
					url: url,
					type: 'POST',
					data: JSON.stringify(params),
					beforeSend: function (xhr) {
						//xhr.setRequestHeader('X-Test-Header', 'test-value');
					},
					success: function (data, status, jqXHR) {

						if (typeof data == "string") {
							data = eval("(" + data + ")");
						}

						//alert(JSON.stringify(data))
						if (data["err_code"] == 0) {
							if (successFunc)
								successFunc(data);
						}
						else {
							alert(JSON.stringify(data));
						}
					},
					onError: function (XMLHttpRequest, textStatus, errorThrow) {
						if (errorFunc)
							errorFunc(XMLHttpRequest);
					}
				});

			},

			/**
			 * 获取微信用户的openid
			 *
			 * @param  {[type]}   code   微信授权认证的code值
			 * @param  {Function} success [发送成功后的回调函数]
			 * @return {[type]}            [description]
			 */
			getOpenid: function (code, success) {
				$.ajax({
					url: window.API_URL + "/wechat/getopenid/" + code,
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					}
				});
			},

			/**
			 * 获取微信JsApi签名包
			 *
			 * @param  {Function} success [成功后的回调函数]
			 * @return {[type]}            [description]
			 */
			getJsApiSignpackage: function (success) {
				$.ajax({
					url: window.API_URL + "/wechat/getjsapi/signpackage",
					type: "GET",
					data: {url: "http://" + window.location.host + window.location.pathname},
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					}
				});
			},

			/**
			 * 注册获取验证码
			 * @param  {[type]}   mobile   [手机号码]
			 * @param  {Function} success [发送成功后的回调函数]
			 * @return {[type]}            [description]
			 */
			getCaptchaCode: function (param, beforeSend, success, error) {
				$.ajax({
					url: window.API_URL + "/members/register/mobile",
					type: "POST",
					dataType: 'json',
					data: "mobile=" + param.mobile,
					beforeSend: function () {
						typeof beforeSend == 'function' && beforeSend();
					},
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 注册 验证验证码
			 * @param  {[type]}   mobile   [手机号码]
			 * @param  {Function} success [发送成功后的回调函数]
			 * @return {[type]}            [description]
			 */
			sendCaptchaCode: function (param, beforeSend, success, error) {
				$.ajax({
					url: window.API_URL + "/members/register/captcha",
					type: "POST",
					dataType: 'json',
					data: param.formData,
					beforeSend: function () {
						typeof beforeSend == 'function' && beforeSend();
					},
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 注册 保存密码
			 * @param  {[type]}   password          [密码]
			 * @param  {[type]}   repeat_password   [重复密码]
			 * @param  {[type]}   register_token    [注册凭证]
			 * @param  {[type]}   openid            [微信用户惟一标识]
			 * @param  {Function} success           [发送成功后的回调函数]
			 * @return {[type]}                     [description]
			 */
			register: function (param, beforeSend, success, error) {
				$.ajax({
					url: window.API_URL + "/members/register/password",
					type: "POST",
					dataType: 'json',
					data: param.formData,
					beforeSend: function () {
						typeof beforeSend == 'function' && beforeSend();
					},
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 手机号登陆
			 * @param  {[type]}   mobile          [手机号码]
			 * @param  {[type]}   password        [密码]
			 * @param  {[type]}   openid          [微信用户惟一标识]
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [description]
			 */
			phoneLogin: function (param, beforeSend, success, error) {
				$.ajax({
					url: window.API_URL + "/members/login",
					type: "POST",
					dataType: 'json',
					data: param.formData,
					beforeSend: function () {
						typeof beforeSend == 'function' && beforeSend();
					},
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 置换凭证
			 * @param  {[type]}   refresh_token   [置换凭证]
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}   access_token  expire_time  refresh_token  [ 接口访问凭证  过期时间  置换凭证]
			 */
			refreshToken: function (param, beforeSend, success, error) {
				$.ajax({
					url: window.API_URL + "/members/refresh_token",
					type: "POST",
					dataType: 'json',
					data: param.formData,
					beforeSend: function () {
						typeof beforeSend == 'function' && beforeSend();
					},
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 个人信息
			 * @param  {[type]}   access_token    [接口访问凭证]
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getMemberInfo: function (param, beforeSend, success, error) {
				$.ajax({
					url: window.API_URL + "/members?access_token=" + utils.storage.get("access_token"),
					type: "GET",
					dataType: 'json',
					beforeSend: function () {
						typeof beforeSend == 'function' && beforeSend();
					},
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 更新昵称
			 * @param  {[type]}   access_token    [接口访问凭证]
			 * @param  {[type]}   nickname        [昵称]
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			saveNickName: function (param, beforeSend, success, error) {
				$.ajax({
					url: window.API_URL + "/members/nickname?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.formData,
					beforeSend: function () {
						typeof beforeSend == 'function' && beforeSend();
					},
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 修改密码
			 * @param  {[type]}   access_token    [接口访问凭证]
			 * @param  {[type]}   nickname        [昵称]
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			modifyPwd: function (param, beforeSend, success, error) {
				$.ajax({
					url: window.API_URL + "/members/password?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.formData,
					beforeSend: function () {
						typeof beforeSend == 'function' && beforeSend();
					},
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 查询分类
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getCategories: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/categories",
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 查询分类列表
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getCategoriesList: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/auctions/categories/" + param.categoryId + "?page=" + param.page + "&page_size=" + param.page_size,
					type: "GET",
					//data:param.paramData,
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 积分说明
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getIntegralExplainData: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/points/intros",
					type: "GET",
					data: param,
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 账户积分
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getAccountIntegration: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/members/points?access_token=" + utils.storage.get("access_token"),
					type: "GET",
					data: param,
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 查询积分记录
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getRecordList: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/points/logs?access_token=" + utils.storage.get("access_token") + "&type=" + param.recordType
					+ "&page=" + param.page + "&page_size=" + param.page_size,
					type: "GET",
					data: param,
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 查询梦想币记录
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getBalancesList: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/balances/logs?access_token=" + utils.storage.get("access_token") + "&type=" + param.recordType
					+ "&page=" + param.page + "&page_size=" + param.page_size,
					type: "GET",
					data: param,
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 查询红包记录
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getPackageList: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/coupons?access_token=" + utils.storage.get("access_token") + "&type=" + param.packageType
					+ "&page=" + param.page + "&page_size=" + param.page_size,
					type: "GET",
					data: param,
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 查询红包记录
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getPackageListOne: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/coupons?access_token=" + utils.storage.get("access_token"),
					type: "GET",
					data: param,
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *购物车 添加数量
			 * @param  {[type]}   access_token    [接口访问凭证]
			 * @param  {[type]}   auction_id      [夺宝商品编号]
			 * @param  {[type]}   quantity        [ 数量]
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			addToShoppingCart: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/shopping_carts/increase?access_token=" +
					utils.storage.get("access_token"),
					type: "POST",
					data: param.formData,
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *购物车 减少数量
			 * @param  {[type]}   access_token    [接口访问凭证]
			 * @param  {[type]}   auction_id      [夺宝商品编号]
			 * @param  {[type]}   quantity        [ 数量]
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			decreaseToShoppingCart: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/shopping_carts/decrease?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					data: param.formData,
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *购物车 删除购物车中 商品
			 * @param  {[type]}   access_token    [接口访问凭证]
			 * @param  {[type]}   auction_id      [夺宝商品编号]
			 * @param  {[type]}   quantity        [ 数量]
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			delGoodsFromShopCart: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/shopping_carts/delete?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					data: param.formData,
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *购物车 删除购物车中 商品
			 * @param  {[type]}   access_token    [接口访问凭证]
			 * @param  {[type]}   auction_id      [夺宝商品编号]
			 * @param  {[type]}   quantity        [ 数量]
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			delGoodsFromShopCart: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/shopping_carts/delete?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					data: param.formData,
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *购物车 删除购物车中 商品
			 * @param  {[type]}   access_token    [接口访问凭证]
			 * @param  {[type]}   auction_id      [夺宝商品编号]
			 * @param  {[type]}   quantity        [ 数量]
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			delGoodsFromShopCart: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/shopping_carts/delete?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					data: param.formData,
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *购物车 批量添加 商品
			 * @param  {[type]}   access_token    [接口访问凭证]
			 * @param  {[type]}   auction_id      [夺宝商品编号]
			 * @param  {[type]}   quantity        [ 数量]
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			batchAddShoppingCart: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/shopping_carts/batch/increase?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					data: param.formData,
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *购物车 清单列表
			 * @param  {[type]}   access_token    [接口访问凭证]
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getShoppingCarts: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/shopping_carts?access_token=" + utils.storage.get("access_token"),
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *首页 数据
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getHomeData: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/home",
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *抢购秒杀
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getFlashSale: function (param, success, error) {
				var url;
				if (utils.isLogined()) {
					url = "/flash_sale?access_token=" + utils.storage.get("access_token");
				} else {
					url = "/flash_sale";
				}
				$.ajax({
					url: window.API_URL + url,
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *抢购秒杀详情
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getFlashSaleInfo: function (param, success, error) {
				var url;
				if (utils.isLogined()) {
					url = "/flash_sale/" + param.flash_goods_id + "?access_token=" + utils.storage.get("access_token") + "&section=" + param.section;
				} else {
					url = "/flash_sale/" + param.flash_goods_id + "?section=" + param.section;
				}
				$.ajax({
					url: window.API_URL + url,
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *获取抢购权
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			toGetRightToBuy: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/flash_sale/reservation/" + param.flash_goods_id + "?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.formData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *抢购秒杀(已经登录)
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getIsLoginFlashSale: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/flash_sale?access_token=" + utils.storage.get("access_token"),
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *精选商品
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getSpecialGoodList: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/auctions/recommends" + "?page=" + param.page + "&page_size=" + param.page_size,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *晒单列表
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getShares: function (param, success, error) {
				var url = window.API_URL + "/shares";
				if (param.flag == 1) {
					url = url +
						"/my?page=" + param.page +
						"&page_size=" + param.page_size + "&access_token=" + utils.storage.get("access_token");
				} else {
					url = url +
						"?auction_id=" + param.auction_id +
						"&page=" + param.page +
						"&page_size=" + param.page_size;
				}
				$.ajax({
					url: url,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *晒单详情
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getShareDetail: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/shares/" + param.shareId,
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *充值模板
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getRechargeTemplate: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/recharge",
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *充值记录
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getRechargeRecord: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/logs/recharges?access_token=" + utils.storage.get("access_token") + "&page=" + param.page + "&page_size=" + param.page_size,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *热门搜索
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getHotSearchList: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/search/keywords",
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *搜索结果
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getSearchResults: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/auctions/search?keywords=" + param.keywords + "&page=" + param.page + "&page_size=" + param.page_size,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *得到签到信息
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getSignInfo: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/signIn?access_token=" + param.accessToken,
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *签到
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			signIn: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/signIn?access_token=" + param.accessToken,
					type: "POST",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *查询积分兑换比率
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getIntegralExchangeRate: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/points/exchange/ratio?access_token=" + utils.storage.get("access_token"),
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *积分兑换
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			exchangePoints: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/points/exchange?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.formData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *得到消息
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getMyMessageList: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/members/message?access_token=" + utils.storage.get("access_token") + "&page=" + param.page + "&page_size=" + param.page_size,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *推荐夺宝商品
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getIndianaGoods: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/home/auctions" +
					"?type=" + param.type +
					"&page=" + param.page +
					"&page_size=" + param.page_size +
					"&direction=" + param.direction,
					type: "GET",
					dataType: 'json',
					data: param.formData,
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *获取个人信息
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getMembersInfo: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/members?access_token=" + utils.storage.get("access_token"),
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *得到验证码 绑定手机号码第一步
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getBindPhoneVerCode: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/members/bind/mobile?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.fromData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 绑定手机号码第二步
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			bindStep2: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/members/bind/captcha?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.fromData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *绑定手机号码第三步
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			complatePhoneBind: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/members/bind/password?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.formData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *保存地址
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			saveAddresses: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/members/addresses?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.formData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *地址列表
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getAddressList: function (param, success, error) {
				var url;
				if (param != null) {
					url = "/members/addresses?access_token=" + utils.storage.get("access_token") + "&page=" + param.page + "&page_size=" + param.page_size;
				} else {
					url = "/members/addresses?access_token=" + utils.storage.get("access_token");
				}

				$.ajax({
					url: window.API_URL + url,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *查询收货地址
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			getAddress: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/members/addresses/" + param.id + "?access_token=" + utils.storage.get("access_token") + "&page=" + param.page + "&page_size=" + param.page_size,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *计算订单金额
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			settlement: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/flash/settlement?access_token=" + utils.storage.get("access_token") + "&coupon_id=" + param.coupon_id + "&flash_goods_id=" + param.flash_goods_id + "&section=" + param.section,
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *确认订单
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			firmOrder: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/flash/settlement?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.formData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 *订单支付
			 * @param  {Function} success         [发送成功后的回调函数]
			 * @return {[type]}                   [ description]
			 */
			orderPay: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/" + param.order_sn + "/pay?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			/**
			 * 会员登录
			 * @param  {[type]}   param   [手机号码]
			 * @param  {Function} beforeSend [提交请求前的执行函数]
			 * @return {[type]}            [description]
			 */
			login: function (param, beforeSend, success, error) {
				//param.openId = utils.storage.get("wxOpenid") || 'test';
				$.ajax({
					url: window.API_URL + "/member/login" + utils.storage.get("access_token"),
					type: "POST",
					data: JSON.stringify(param),
					dataType: 'json',
					beforeSend: function () {
						typeof beforeSend == 'function' && beforeSend();
					},
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},
			//获取夺宝 商品详情
			getDuobaoInfo: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/auctions/" + param.good_no + "?access_token=" + utils.storage.get("access_token"),
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},
			//获取 夺宝商品参与记录
			getAttendRecord: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/auctions/" + param.auction_date_id +
					"/records" +
					"?page=" + param.page +
					"&page_size" + param.page_size,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},
			//获取 往期揭晓
			getPastAnnounced: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/auctions/" + param.good_no +
					"/history" +
					"?page=" + param.page +
					"&page_size" + param.page_size,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},
			//获取 发现功能列表
			getFindFuncList: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/discovers",
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},
			//获取 心愿单列表
			getWishList: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/wishlists" +
					"?access_token=" + utils.storage.get("access_token") +
					"&page=" + param.page +
					"&page_size" + param.page_size,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},
			//发布我的心愿
			wishPush: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/wishlists/publish" +
					"?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					data: param,
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//中奖记录
			getPrizeRecordList: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/reward/history?access_token=" +
					utils.storage.get("access_token") + "&page=" + param.page + "&page_size=" + param.page_size,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//获取 揭晓详情
			getAnnouncedInfo: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/auctions" + "/" + param.auction_id +
					"?access_token=" + utils.storage.get("access_token") +
					"&auction_date_id=" + param.auction_date_id,
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},
			//获取夺宝 商品详情
			getDuobaoInfo: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/auctions/" + param.good_no +
					"?access_token=" + utils.storage.get("access_token"),
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},
			//商品数量 增加
			shoppingCartAdd: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/shopping_carts/increase?access_token=" +
					utils.storage.get("access_token"),
					type: "POST",
					data: param,
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//中奖纪录详情
			getPrizeDetail: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/" + param.order_id + "/reward/history?access_token=" +
					utils.storage.get("access_token"),
					type: "GET",
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//立即领取
			receiveImmediately: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/" + param.order_id + "/reward/receive?access_token=" +
					utils.storage.get("access_token"),
					type: "POST",
					data: param.formData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//确认收货
			confirmReceipt: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/" + param.order_id + "/receipt?access_token=" +
					utils.storage.get("access_token"),
					type: "POST",
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//获取 夺宝记录
			getAnnouncedRecord: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/auctions/history" +
					"?access_token=" + utils.storage.get("access_token") +
					"&type=" + param.type +
					"&page=" + param.page +
					"&page_size=" + param.page_size,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//获取 夺宝记录详情
			getAnnouncedRecordDetail: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/" + param.order_id +
					"/auctions/history" +
					"?access_token=" + utils.storage.get("access_token"),
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//修改性别
			genderModify: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/members/gender?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.formData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//创建晒单
			setUpShareOrder: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/shares/" + param.order_id + "?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.formData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//上传
			upload: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/upload",
					type: "POST",
					dataType: 'json',
					data: param.param,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//查询省份
			getProvinces: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/areas/provinces",
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//查询城市
			getCity: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/areas/provinces/" + param.province_id + "/cities",
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//查询区县
			getDistricts: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/areas/cities/" + param.city_id + "/counties",
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//删除收货地址
			deleteAddress: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/members/addresses/delete/" + param.id + "?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//确认转卖
			confirmResell: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/" + param.order_id + "/reward/resale?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.formData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//收回转卖
			takeBack: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/" + param.order_id + "/reward/callback?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//计算下单金额 购物车
			calculateOrderAmount: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/auctions/settlement?access_token=" + utils.storage.get("access_token") + "&coupon_id=" + param.coupon_id,
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//提交购物车订单
			submitShoppingOrder: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/auctions/settlement?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.formData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//购买记录
			getOrderList: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/goods/history?access_token=" + utils.storage.get("access_token") + "&type=" + param.type + "&page=" + param.page
					+ "&page_size=" + param.page_size,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//购买记录详情
			getOrderInfo: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/" + param.order_id + "/goods/history?access_token=" + utils.storage.get("access_token") + "&type=" + param.type,
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//删除订单
			deledeOrder: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/" + param.order_id + "/delete?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//取消订单
			cancelOrder: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/" + param.order_id + "/cancel?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//计算全价购买金额
			getFullTlement: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/goods/settlement?access_token=" + utils.storage.get("access_token") + "&coupon_id=" + param.coupon_id
					+ "&goods_id=" + param.goods_id + "&quantity=" + param.quantity,
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//夺宝商品全价购买下单
			duoBaoGoodsFullSubmit: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/goods/settlement?access_token=" +
					utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.formData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//获取 关于我们、
			getPageContent: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/page/content/" + param.key,
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//查询订单支付信息
			getOrderPayInfo: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/" + param.order_id + "/pay?access_token=" + utils.storage.get("access_token"),
					type: "GET",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//获取 骰子本期信息
			getDiceInfo: function (param, success, error) {
				var url = window.API_URL + "/game/dice/issue/info" +
					"?access_token=" + utils.storage.get("access_token") +
					"&date_sn=" + param.date_sn;

				//console.log("获取 骰子本期信息 url---"+url);

				$.ajax({
					url: url,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//投注  骰子
			dicePush: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/game/dice/bet" +
					"?access_token=" + utils.storage.get("access_token") +
					"&chip_amount=" + param.chip_amount +
					"&date_sn=" + param.date_sn +
					"&dice_size=" + param.dice_size +
					"&multiple=" + param.multiple,
					type: "POST",
					dataType: 'json',
					data: param,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//获取 猜水果本期信息
			getFruitInfo: function (param, success, error) {
				var url = window.API_URL + "/game/guess/fruit/issue/info" +
					"?access_token=" + utils.storage.get("access_token") +
					"&date_sn=" + param.date_sn;

				console.info("获取猜水果 URL：" + url);

				$.ajax({
					url: url,
					type: "GET",
					dataType: 'json',
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//投注  水果
			fruitPush: function (param, success, error) {
				var url = window.API_URL + "/game/guess/fruit/bet" +
						//	"?access_token=" + utils.storage.get("access_token") +
						//	"&" + param.bet_chips +
						//	"&date_sn=" + param.date_sn;
						//console.log("投注水果：" + url);

					"?access_token=" + utils.storage.get("access_token");
				//console.log("投注水果 ------ url：" + url);

				$.ajax({
					url: url,
					type: "POST",
					dataType: 'json',
					data: JSON.stringify(param),
					//contentType: "application/json; charset=utf-8",
					beforeSend: function (request) {
						request.setRequestHeader('Content-Type', 'application/json');
					},
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//设定购物车中制定商品的数量
			addNumberToShoppingCart: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/shopping_carts/" + param.auction_id +
					"?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.formData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//收回转卖
			TakeBackResellCash: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/" + param.order_id + "/reward/callback?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//确认收账
			confirReceive: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/orders/" + param.order_id + "/reward/confirm/pay?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//更新头像
			uploadImage: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/members/avatar?access_token=" + utils.storage.get("access_token"),
					type: "POST",
					dataType: 'json',
					data: param.formData,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			//
			getResalesList: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/resales?page=" + param.page + "&page_size=" + param.page_size,
					type: "GET",
					loadMask: false,
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},

			getResalesInfo: function (param, success, error) {
				$.ajax({
					url: window.API_URL + "/resales/" + param.resale_id,
					type: "GET",
					success: function (data) {
						typeof success == 'function' && success(data);
					},
					onError: function (data) {
						typeof error == 'function' && error(data);
					}
				});
			},


		};

	}
);
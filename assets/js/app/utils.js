define(
	[
		'zepto'
	],
	function ($) {
		var ajax = $.ajax;

		$.extend($, {

			isBlank: function (val) {
				return (val == null || val == "" || val == 'undefined');
			},

			getQueryString: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if (r != null)return unescape(r[2]);
				return null;
			},

			isNumber: function (val) {
				var reg = /^\d+$/;
				if (!val.match(reg)) {
					return false;
				}
				return true;
			},

			isPhone: function (val) {
				var reg = /^(13[0-9]|14\d{1}|15\d{1}|17\d{1}|18\d{1})\d{8}$/;
				return reg.test(val);
			},

			ajax: function (param) {
				var loadMask = typeof(param.loadMask) !== 'undefined'
					? param.loadMask : true; //是否支持遮罩层
				var success = param.success || function () {
					};
				var beforeSend = param.beforeSend || function () {
					};
				var onError = param.onError || null;
				return ajax({
					type: param.type || 'GET',
					url: param.url || "",
					dataType: param.dataType || null,
					data: param.data || {},
					crossDomain: true,

					beforeSend: function (request) {
						beforeSend(request);
						//设置header请求
						request.setRequestHeader("version", "1.0");
						request.setRequestHeader("source", "weixin");
						request.setRequestHeader("openid", storage.get("wxOpenid")); //设置openid
						//request.setRequestHeader("openid", "oLmqVt-1kevEVE36XHBehFGo1B-o"); //设置openid
						request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
						//request.setRequestHeader('Content-Type', 'application/json');
						request.setRequestHeader('Request-Hash', window.location.href);
						if (loadMask) {
							$.Dialog.loading('show');
						}
					},
					success: function (data) {
						/**
						 * 状态为1时，登录重定向
						 */
						if (data.code == 1) {
							window.location.href = window.LOGIN_REDIRECT_URL;
						}

						/**
						 * 状态不等于0时, 接口异常
						 */
						if (data.err_code != 0) {

							if (data.err_code == 20001) {
								//状态为20001时,缺少access_token;
								//重新登陆；
								storage.remove("loginSuccess");
								//window.location.href = window.LOGIN_REDIRECT_URL
								storage.set("loginSuccessBack", window.location.hash);
								//window.location.href = window.ctx + "/login.html";
								window.location.href = window.LOGIN_REDIRECT_URL;
							}

							if (data.err_code == 20002) {
								//storage.remove("loginSuccess");
								//状态为20002时，无效的accessToken
								//刷新接口访问凭证access_token 不报错

							} else if (data.err_code == 20003) {
								//无效的refresh_token 重新登陆
								//window.location.href = window.LOGIN_REDIRECT_URL
								storage.set("loginSuccessBack", window.location.hash);
								//window.location.href = window.ctx + "/login.html";
								storage.remove("loginSuccess");
								window.location.href = window.LOGIN_REDIRECT_URL;

							} else {
								if (data.err_code != 51002) {//解决夺宝详情中弹出“本期夺宝活动已经结束”问题
									$.message("warning", {
										content: data.err_msg
									});
								}

							}

							if (typeof param.onError == 'function') {
								param.onError(data);
							}

						} else {
							success(data);
						}
					},
					error: param.error || function () {
					},
					complete: param.complete || function (xhr, status) {
						//TODO 完成处理
						if (loadMask) {
							$.Dialog.loading('hide');
						}
					}
				});
			},

			message: function (type, param, callback) {
				var type = type || 'info';
				var content = param.content || "数据请求失败,请重试!";
				var stayTime = param.stayTime || 1500;
				var callback = callback || function () {
					};

				var toast = $("#message-mask");
				if (toast.length == 0) {
					$("body").append('<div id="message-mask"></div>');
					toast = $("#message-mask");
				}
				toast.empty().append('<div class=message-' + type + '>' + content + '</div>').show();
				setTimeout(function () {
					toast.hide();
					callback();
					toast = null;
				}, stayTime);
			},

			// 对话框
			Dialog: {
				success: function () {
					var msg = typeof arguments[0] == 'string' ? arguments[0] : '已完成';
					var expire = 1200;
					if (typeof arguments[1] == "number") {
						expire = arguments[1];
					} else if (typeof arguments[0] == "number") {
						expire = arguments[0];
					}
					var toast = "<div id=\"toast\"><div class=\"weui_mask_transparent\"></div><div class=\"weui_toast\"><i class=\"weui_icon_toast\"></i><p class=\"weui_toast_content\">" + msg + "</p></div></div>";
					$("body").append(toast);
					setTimeout(function () {
						$("body").children("#toast").remove();
					}, expire);
				},
				warn: function (msg) {
					$.Dialog.alert(msg);
				},
				error: function (msg) {
					$.Dialog.alert(msg);
				},
				alert: function () {
					//var title = "警告";
					var title = "夺宝号码";
					var msg = "";
					var callback = function () {
					};

					if (arguments.length < 1) {
						throw new Error("Missing parameter!");
					} else if (arguments.length == 1) {
						msg = arguments[0];
					} else if (arguments.length == 2) {
						if (typeof arguments[0] == "string" && typeof arguments[1] == "string") {
							title = arguments[0];
							msg = arguments[1];
						} else if (typeof arguments[0] == "string" && typeof arguments[1] == "number") {
							msg = arguments[0];
							callback = arguments[1];
						} else {
							throw new Error("Invalid parameters!");
						}
					} else if (arguments.length == 3) {
						if (typeof arguments[0] == "string" && typeof arguments[1] == "string" && typeof arguments[2] == "function") {
							title = arguments[0];
							msg = arguments[1];
							callback = arguments[2];
						} else {
							throw new Error("Invalid parameters!");
						}
					}
					var template = "<div class=\"weui_dialog_alert\" id=\"dialog_alert\">" +
						"<div class=\"weui_mask\"></div><div class=\"weui_dialog\">" +
						"<div class=\"weui_dialog_hd\"><strong class=\"weui_dialog_title\">" +
						title + "</strong></div><div class=\"weui_dialog_bd\">" + msg + "</div><div class=\"weui_dialog_ft\"><a href=\"javascript:;\" class=\"weui_btn_dialog btn_dialog_confirm primary\">确定</a></div></div></div>";
					$("body").append(template);

					var $alert = $("body").children(".weui_dialog_alert");
					$alert.find(".btn_dialog_confirm").click(function () {
						$alert.remove();
						callback();
					});

				},
				confirm: function () {
					if (typeof arguments[0] != "string" || typeof arguments[1] != "string" || typeof arguments[2] != "function") {
						throw new Error("Invalid parameters!");
					}

					var title = arguments[0];
					var msg = arguments[1];
					var callback = arguments[2];
					var cancelName = typeof arguments[3] == "string" ? arguments[3] : "取消";
					var sureName = typeof arguments[4] == "string" ? arguments[4] : "确定";

					var template = "<div class=\"weui_dialog_confirm\" id=\"dialog_confirm\"><div class=\"weui_mask\"></div><div class=\"weui_dialog\"><div class=\"weui_dialog_hd\"><strong class=\"weui_dialog_title\">" + title + "</strong></div><div class=\"weui_dialog_bd\">" + msg + "</div><div class=\"weui_dialog_ft\"><a href=\"javascript:;\" class=\"weui_btn_dialog btn_dialog_cancel default\">" + cancelName + "</a><a href=\"javascript:;\" class=\"weui_btn_dialog btn_dialog_confirm primary\">" + sureName + "</a></div></div></div>";
					$("body").append(template);

					var $confirm = $("body").children(".weui_dialog_confirm");
					$confirm.find(".btn_dialog_confirm").on('tap', function () {
						callback();
						$confirm.remove();
					});
					$confirm.find(".btn_dialog_cancel").on("tap", function () {
						$confirm.remove();
					});

				},
				loading: function () {
					var status = arguments[0] == 'show' ? 'show' : 'hide';
					var loading = "<div id=\"loadingToast\" class=\"weui_loading_toast\"><div class=\"weui_mask_transparent\"></div><div class=\"weui_toast\"><div class=\"weui_loading\"><div class=\"weui_loading_leaf weui_loading_leaf_0\"></div><div class=\"weui_loading_leaf weui_loading_leaf_1\"></div><div class=\"weui_loading_leaf weui_loading_leaf_2\"></div><div class=\"weui_loading_leaf weui_loading_leaf_3\"></div><div class=\"weui_loading_leaf weui_loading_leaf_4\"></div><div class=\"weui_loading_leaf weui_loading_leaf_5\"></div><div class=\"weui_loading_leaf weui_loading_leaf_6\"></div><div class=\"weui_loading_leaf weui_loading_leaf_7\"></div><div class=\"weui_loading_leaf weui_loading_leaf_8\"></div><div class=\"weui_loading_leaf weui_loading_leaf_9\"></div><div class=\"weui_loading_leaf weui_loading_leaf_10\"></div><div class=\"weui_loading_leaf weui_loading_leaf_11\"></div></div><p class=\"weui_toast_content\">数据加载中</p></div></div>";
					if (status == 'show') {
						$("body").append(loading);
					} else {
						$("body").children("#loadingToast").remove();
					}
				},
				info: function (msg) {
					$.message("warning", {
						content: msg,
						stayTime: 2000
					});
				}
			}
		});

		var getLoginUrl = function (appId, redirectUri) {
			var url = redirectUri;
			if (isWeiXin()) {
				url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + encodeURIComponent(redirectUri) + "&response_type=code&scope=snsapi_base&state=mxep#wechat_redirect";
			}

			return url;
		};

		var goBack = function (param) {

			var jumpHash = param.jumpHash || "";
			var jumpUrl = param.jumpUrl || "";
			$(".page").on("tap", ".he-header .he-header-left", function (e) {
				if ($(e.currentTarget).hasClass('btn-custom')) {
					return;
				}
				if (!$.isBlank(jumpHash)) {
					window.location.hash = jumpHash;
					return;
				}
				if (!$.isBlank(jumpUrl)) {
					window.location.href = jumpUrl;
					return;
				}
				history.back();
			});
		}

		var showHeader = function (param) {
			var jumpHash = param.jumpHash || "";
			var jumpUrl = param.jumpUrl || "";
			var title = param.title || "";
			var showSearch = param.showSearch || false;
			var $wxHead = $(".wx-head");
			$wxHead.show();
			$(".he-footer").show();
			$(".wx-head p").text(title);
			$(".wx-head button").off("tap").on("tap", function () {
				if ($.isBlank(jumpUrl)) {
					history.back();
					return;
				}

				if (!$.isBlank(jumpHash)) {
					window.hash = jumpHash;
				}

				if (!$.isBlank(jumpUrl)) {
					window.location = jumpUrl;
				}
			});


			if (showSearch) {
				$wxHead.find(".wx-he-search").removeClass("eh-hide");
			} else {
				$wxHead.find(".wx-he-search").addClass("eh-hide");
			}
		}


		var showPage = function (obj, callback) {

			obj.siblings(".page").empty().addClass("eh-hide");
			obj.removeClass("eh-hide");

			if (typeof callback == 'function') {
				callback();
			}
		}

		/**
		 * web存储
		 */
		var storage = {
			set: function (key, value) {
				return localStorage.setItem(key, value);
			},
			get: function (key) {
				return localStorage.getItem(key);
			},
			remove: function (key) {
				return localStorage.removeItem(key);
			}
		};


		/**
		 * 激活菜单
		 */
		var activeMenu = function (sort) {
			var obj;
			switch (sort) {
				case 5:
					obj = $("#menu-page #my");
					break;
				case 4:
					obj = $("#menu-page #shoppingCart");
					break;
				case 3:
					obj = $("#menu-page #find");
					break;
				case 2:
					obj = $("#menu-page #announced");
					break;
				case 1:
					obj = $("#menu-page #homepage");
				default:
					break;
			}
			//obj.addClass("active").siblings(".ui-col").removeClass("active");
			// obj.siblings().removeClass("highlight");
			// obj.addClass("highlight");
			obj.siblings().removeClass("active");
			obj.addClass("active");
		};

		var flyToCart = function (e, url) {
			var $this = $(e.currentTarget);
			var offset = $('#he-shoppingcart').offset(),
				flyer = $("<img class=\"u-flyer\" src='" + url + "' />");
			flyer.fly({
				start: {
					left: e.touches[0].pageX,
					top: e.touches[0].pageY
				},
				end: {
					left: offset.left + 22,
					top: offset.top,
					width: 20,
					height: 20
				},
				onEnd: function () {
					$(".u-flyer").remove();
				}
			});
		};

		/**
		 * 显示菜单
		 */
		var showMenu = function () {
			//debugger

			var $menuPage = $("#menu-page");
			if (storage.get("has_goods") == 1) {
				var $a = $menuPage.find(".he-btn-shoppingcart").find("a");
				if ($a.find(".point").length <= 0) {
					$a.append("<p class=\"point\"></p>");
				}
			}
			$menuPage.removeClass("eh-hide");
		};
		/**
		 * 隐藏菜单
		 */
		var hideMenu = function () {
			$("#menu-page").addClass("eh-hide");
			//$("#menu-page").removeClass("eh-show");
		};

		var getParam = function (paramName) {
			//获取当前URL
			var local_url = document.location.href;
			//获取要取得的get参数位置
			var get = local_url.indexOf(paramName + "=");
			if (get == -1) {
				return false;
			}
			//截取字符串
			var get_par = local_url.slice(paramName.length + get + 1);
			//判断截取后的字符串是否还有其他get参数
			var nextPar = get_par.indexOf("&");
			if (nextPar != -1) {
				get_par = get_par.slice(0, nextPar);
			}
			return get_par;
		};


		var Navigator = {
			currentPosition: function (success, error) {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function (position) {
						var coords = position.coords;
						console.info(coords.latitude + ', ' + coords.longitude);
						if (typeof success == 'function') {
							success(coords.longitude, coords.latitude);
							// callback('120.73301925701467', '31.25901492308543');
						}
					}, function (error) {
						switch (error.code) {
							case error.TIMEOUT:
								console.info("A timeout occured! Please try again!");
								break;
							case error.POSITION_UNAVAILABLE:
								console.info('We can\'t detect your location. Sorry!');
								break;
							case error.PERMISSION_DENIED:
								console.info('Please allow geolocation access for this to work.');
								break;
							case error.UNKNOWN_ERROR:
								console.info('An unknown error occured!');
								break;
						}
						if (typeof error == 'function') {
							error(error.code);
						}
					}, {
						enableHighAccuracy: true,
						timeout: 6000,
						maximumAge: 3000
					});
				} else {
					alert("Your browser does not support Geolocation!");
				}
			}
		};

		// 判断对象内容是否为空
		var isEmpty = function ($obj) {
			return $obj.html() ? false : true;
		};

		// 最长字符串
		var maxLength = function (str, length) {
			var s = str;
			if (str.length > length) {
				s = str.substring(0, length) + "...";
			}
			return s;
		};

		var showShareMask = function ($page) {
			var mask = '<div class="mask-title"><img src="assets/image/share_menu.png" alt=""/></div>';

			$page.find(".mask-title").remove();
			$page.append(mask);

			$page.find(".mask-title").on("tap", function () {
				$page.find(".mask-title").remove();
			});
		};

		/**
		 * 登陆成功后 loginSuccesss 置为 param（yes）
		 */
		var loginSuccess = function () {
			//var ta = param || "yes";
			storage.set("loginSuccess", "yes");
		};

		/**
		 * 判断是否登陆
		 */
		var isLogined = function () {

			if (storage.get("loginSuccess") == "yes") {
				return true;
			} else {
				return false;
			}
		};

		/**
		 *获取倒计时时间
		 * @param  {type} self       []
		 * @param  {type} position   [位置]  "秒杀"
		 * @param  {type} status     [状态]
		 * @param  {type} flag       []
		 */
		var timeCountDown = function (self, position, status, flag) {
			//debugger
			// status 
			var start = $(self).attr("data-starttime");//开始时间
			var end = $(self).attr("data-endtime");//结束时间
			var now = $(self).attr("data-currenttime");//当前系统时间
			if (!now) {
				return
			}
			if (start) {
				start = start.replace(/\-/g, "/");
			}

			if (end) {
				end = end.replace(/\-/g, "/");
			}

			if (now) {
				now = now.replace(/\-/g, "/");
			}

			var currentTime = new Date(now).getTime();
			var startTime = new Date(start).getTime();
			var endTime = new Date(end).getTime();
			var intDiff;
			if (flag) {
				intDiff = flag - 1;
			} else {

				switch (position) {
					case "flashSale"://秒杀页面
						if (status == 1) {//即将开始
							intDiff = (startTime - currentTime) / 1000;
						} else if (status == 2) {//抢购中
							intDiff = (endTime - currentTime) / 1000;
						} else {//已结束

						}
						break;
					case "main"://首页
						intDiff = (endTime - currentTime) / 1000;
						break;
					case "annouced"://揭晓
						intDiff = (endTime - currentTime) / 1000;
				}
			}

			// time = new Date(time).getTime();
			// var now = new Date().getTime();
			if (intDiff > 0) {
				var second = Math.floor(intDiff % 60);
				var minute = Math.floor((intDiff / 60) % 60);
				var hour = Math.floor((intDiff / 3600));
				hour = hour < 10 ? "0" + hour : hour;
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;

				var count_down = hour + ":" + minute + ":" + second;
				$(self).html(count_down);
			}
			else {
				//$(self).html("时间截止");
				$(self).html("");
				return
			}

			setTimeout(function () {
				timeCountDown(self, position, status, intDiff);
			}, 1000)

		};

		//分，秒，毫秒倒计时
		var MSCountDown = function (self, toEnd) {

			var current_time = $(self).data("currenttime");//当前时间
			var expire_time = $(self).data("expiretime");//结束时间

			var currentTime = new Date(current_time).getTime();
			var expireTime = new Date(expire_time).getTime();

			var intDiff = expireTime - currentTime;

			var handler = window.setInterval(function () {
				intDiff = intDiff - 20;
				if (intDiff > 0) {
					var ms = Math.floor(intDiff % 1000 / 10);
					// console.log(ms);
					var sec = Math.floor(intDiff / 1000 % 60);
					var min = Math.floor(intDiff / 1000 / 60 % 60);
					var hour = Math.floor(intDiff / 1000 / 60 / 60 % 24);

					hour = hour < 10 ? "0" + hour : hour;
					min = min < 10 ? "0" + min : min;
					sec = sec < 10 ? "0" + sec : sec;
					ms = ms < 10 ? "0" + ms : ms;

					//var count_down = hour + ":" + min + ":" + sec + ":" + ms;
					var count_down = min + ":" + sec + ":" + ms;
					$(self).html(count_down);
				} else {
					$(self).html("时间结束");
					// $(".btn_pay").removeClass("bg-ff6e2b").removeClass("btn_pay").addClass("ba-bfbfbf-css");
					window.clearInterval(handler);
					typeof toEnd == 'function' && toEnd(1);
					return;
				}
			}, 20)

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

		//获取地址栏 参数
		var getUrl = function (message) {//http://mxep:91/#sign?access_token=444
			//debugger
			var url;
			if (message) {
				url = message;
			} else {

				url = location.href;
			}

			if (url.indexOf("?") > -1) {
				var params = url.substr(url.indexOf("?") + 1, url.length).split("&");

				for (var i = 0; i < params.length; i++) {
					var param = params[i].split("=");

					storage.set(param[0], param[1]);
				}
			}
		};

		//解决 fz.Scroll冲突
		var clearTab = function (id) {

			var ids = new Array("my-mxb-page", "my-package-page", "my-integral-page", "my-announced-record-page",
				"my-order-page");

			for (var i = 0; i < ids.length; i++) {
				if (ids[i] != id) {
					$("#" + ids[i]).empty();
				}
			}

		};


		return {
			showPage: showPage,
			showHeader: showHeader,
			storage: storage,
			activeMenu: activeMenu,
			getParam: getParam,
			showMenu: showMenu,
			goBack: goBack,
			hideMenu: hideMenu,
			Navigator: Navigator,
			isEmpty: isEmpty,
			maxLength: maxLength,
			flyToCart: flyToCart,
			showShareMask: showShareMask,
			getLoginUrl: getLoginUrl,
			loginSuccess: loginSuccess,
			isLogined: isLogined,
			timeCountDown: timeCountDown,
			MSCountDown: MSCountDown,
			jsonParseParam: jsonParseParam,
			getUrl: getUrl,
			clearTab: clearTab,

		};

	}
);

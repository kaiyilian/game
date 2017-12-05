define(
	[
		'zepto', 'underscore', 'backbone', 'urlGroup', 'dropload',
		'swiper', 'echo', 'app/api',
		'app/utils', 'app/scroll',
		'text!templates/announced.html'
	],

	function ($, _, Backbone, UrlGroup, _dropload, Swiper, echo, Api, utils, scroll, announcedTemplate) {

		var $page = $("#announced-page");
		var imageRenderToken = null;
		var $dropload;
		var $announcedGoodItem;
		var $announcedGoodContain;
		var $annoucedPageNum; //页码
		var $annoucedPageSize; //每页记录数
		var droploadType;
		var handlers;
		var announcedView = Backbone.View.extend({
			el: $page,
			render: function () {
				//utils.showMenu();
				utils.showPage($page, function () {
					handlers = [];
					$page.hide();
					$page.empty().append(announcedTemplate);

					$announcedGoodItem = $page.find("#announced_good_item");
					$announcedGoodContain = $page.find(".announced_good_list");

					$annoucedPageNum = 1;
					$annoucedPageSize = 4;
					//initAnnounced();//

					//初始化dropload插件
					dropload.init();

				});
			},
			events: {

				"tap .announced_good_list li": "announcedInfo",
			},

			//进入揭晓详情
			announcedInfo: function (e) {

				e.stopImmediatePropagation();

				var announced_date_no = $(e.currentTarget).data("id");
				var good_no = $(e.currentTarget).data("good_no");

				window.location.hash = "announcedInfo/" + good_no + "/" + announced_date_no;
			},


		});

		//揭晓列表 获取
		var initAnnounced = function () {

			if (droploadType == "up") {
				$dropload.noData(false);
				$dropload.resetload();
				$dropload.unlock();
				dropload.init();
				return;
			}

			var obj = new Object();
			obj.page = $annoucedPageNum;
			obj.page_size = $annoucedPageSize;
			var url = urlGroup.announced_list + "?" + utils.jsonParseParam(obj);

			Api.mxepGet(
				url,
				null,
				function (data) {

					//announcedListInit();//揭晓商品列表 初始化
					if (data.result.data.length > 0) {

						var template = _.template($announcedGoodItem.html());
						$announcedGoodContain.append(template(data.result));
						$page.show();
						asynLoadImage();
						$annoucedPageNum++;
						$dropload.noData(false);
						$dropload.resetload();
						$dropload.unlock();
					}
					else {

						$dropload.noData(true);
						$dropload.resetload();
						$dropload.lock("down");
					}

					//倒计时
					$(".announced_good_list").find(".time_count_down").each(function () {

						MSCountDown($(this), function (data) {
							$annoucedPageNum = 1;
							$annoucedPageSize = 4;
							$announcedGoodContain.empty();
							$dropload = null;
							//window.location.hash = "announced";
							//初始化dropload插件
							dropload.init();
						});
					});

				},
				function (data) {

				});

		};

		var MSCountDown = function (self, toEnd) {

			var current_time = $(self).data("currenttime");//当前时间
			var expire_time = $(self).data("expiretime");//结束时间

			current_time = current_time.replace(/\-/g, "/");
			expire_time = expire_time.replace(/\-/g, "/");

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
				}
				else {
					$(self).html("时间结束");
					// $(".btn_pay").removeClass("bg-ff6e2b").removeClass("btn_pay").addClass("ba-bfbfbf-css");
					window.clearInterval(handler);
					typeof toEnd == 'function' && toEnd(1);
					return;
				}
			}, 20);
			handlers.push(handler);

		};

		//清空定时器
		var clearHandlers = function (handlers) {
			_.each(handlers, function (item) {

				window.clearInterval(item);
			});
		};

		//揭晓商品列表 初始化
		var announcedListInit = function () {

			$page.find(".announced_good_list > li").each(function () {
				var status = $(this).data("status");//状态：(1:进行中 2:揭晓中 3:已揭晓)

				if (status == 3) {
					$(this).find(".info").remove();//移除
				}
				else {
					$(this).find(".announced_result").remove();//移除

					/////倒计时。。。
				}

			});
		};

		var asynLoadImage = function () {
			echo.init({
				throttle: 250,
			});

			if (imageRenderToken == null) {
				imageRenderToken = window.setInterval(function () {
					echo.render();
				}, 350);
			}
		};

		var dropload = {
			init: function () {
				$dropload = $(".announced_good_list").dropload({
					scrollArea: window,
					loadDownFn: function (me) {
						droploadType = "down";

						if ($annoucedPageNum == 1) {
							$announcedGoodContain.empty();
						}
						if (handlers) {
							clearHandlers(handlers);
						}
						initAnnounced();
					},
					loadUpFn: function (me) {
						droploadType = "up";
						$annoucedPageNum = 1;
						if (handlers) {
							clearHandlers(handlers);
						}
						$announcedGoodContain.empty();
						initAnnounced();
					}
				});
			},

			lock: function () {
				$dropload.lock();
			},

			reload: function () {
				$dropload.resetload();
			},

			reset: function (flag) {
				$pageNum = 1;
				flag = flag || false;
				$dropload.unlock("down");
				$dropload.noData(flag);
				$dropload.resetload();
			}
		};

		return announcedView;

	});

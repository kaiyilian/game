define(['zepto', 'underscore', 'backbone',
		'swiper', 'echo', 'app/api',
		'dropload', 'app/utils',
		'text!templates/pointsRemark.html'
	],

	function ($, _, Backbone, Swiper, echo, Api, _dropload, utils, pointsRemarkTemplate) {

		var $page = $("#pointsRemark-page");
		//var $integralEplainContain;
		//var $integralEplainItem;
		//var $dropload;
		//var type;
		//var $pageSize = 3;//每页记录数
		//var $pageNum = 1;//页码

		var pointsRemarkView = Backbone.View.extend({
			el: $page,
			render: function (id, name) {
				utils.showPage($page, function () {
					$page.empty().append(pointsRemarkTemplate);

					//如果URL里面有platform ,title 就不显示
					if (location.href.indexOf("platform") > -1) {
						$page.find("header").hide();
						$page.find(".ui-content").css("border-top", "0");
					}

					initData();
					//
					//$pageNum = 1;
					//
					//$integralEplainContain = $page.find(".integral_eplain_contain");
					//
					//$integralEplainItem = $page.find("#integral_eplain_item");
					//
					////初始化dropload插件
					//dropload.init();
				});
			},
			events: {},


		});

		var getIntegralExplainData = function () {

			if (type == "up") {

				$dropload.noData(false);
				$dropload.resetload();
				$dropload.unlock();
				dropload.init();
				return;
			}

			var param = {page: $pageNum, page_size: $pageSize};

			Api.getIntegralExplainData(param, function (data) {
				if (data.result.data.length > 0) {

					var template = _.template($integralEplainItem.html());

					$integralEplainContain.append(template(data.result)).show();

					$pageNum++;
					$dropload.noData(false);
					$dropload.resetload();
					$dropload.unlock();
				} else {
					$dropload.noData(true);
					$dropload.resetload();
					$dropload.lock("down");
				}


			}, function (data) {

			});


		};

		var dropload = {
			init: function () {
				$dropload = $('.integral_eplain_contain').dropload({
					scrollArea: window,
					loadDownFn: function (me) {
						type = "down";
						console.log("down");
						if ($pageNum == 1) {
							$integralEplainContain.empty();
						}

						getIntegralExplainData();
					},
					loadUpFn: function (me) {
						type = "up";
						console.log("up");
						$pageNum = 1;

						$integralEplainContain.empty();
						getIntegralExplainData();
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

		var initData = function () {
			var param = {
				key: "pointsRemark"
			};

			Api.getPageContent(
				param,
				function (data) {
					//console.log(data);

					var content = data.result.content;
					//console.log(content);

					$page.find(".ui-content").empty().append(content);

				},
				function (data) {
					console.log("积分说明-----error:");
					console.log(data);
				}
			)
		};

		return pointsRemarkView;
	});

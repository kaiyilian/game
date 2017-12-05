define(
	['zepto', 'underscore', 'backbone', 'urlGroup',
		'swiper', 'echo', 'app/api',
		'app/utils', 'app/scroll',
		'text!templates/find.html'
	],

	function ($, _, Backbone, UrlGroup, Swiper, echo, Api, utils, scroll, findTemplate) {

		var $page = $("#find-page");
		var $findFuncItem;
		var $findFuncContain;
		var imageRenderToken;

		var findView = Backbone.View.extend({
			el: $page,
			render: function () {
				//utils.showMenu();
				utils.showPage($page, function () {

					$page.empty().append(findTemplate);

					$findFuncItem = $("#find_func_item");
					$findFuncContain = $(".func_list");

					initFindFuncList();//发现功能列表 获取

				});
			},
			events: {

				//进入各个 功能
				"tap .func_list > li": "findFunc"

			},

			//进入各个 功能
			findFunc: function (e) {
				e.stopImmediatePropagation();
				var $this = $(e.currentTarget);

				var href = $this.data("href");
				if (href) {

					if (href.indexOf("#wheelprize") > -1) {
						window.location.hash = "wheelprize";
						return
					}
					if (href.indexOf("#dice") > -1) {
						window.location.hash = "dice";
						return
					}
					if (href.indexOf("#fruit") > -1) {
						window.location.hash = "fruit";
						return
					}
					if (href.indexOf("=share") > -1) {
						window.location.hash = "share";
						return
					}
					if (href.indexOf("=wishlist") > -1) {
						window.location.hash = "wishlist";
						return
					}
					if (href.indexOf("=resalee") > -1) {
						window.location.hash = "resale";
					}


					if (href.indexOf("http://") > -1) {
						window.location.href = href;
					}
					//如果是 伪协议
					if (href.indexOf("mxep://") > -1) {
						if (href.indexOf("=") > -1)
							href = href.split("=")[1];
						if (href.indexOf("#") > -1)
							href = href.split("#")[1];

						window.location.hash = href;
					}

				}

			}

		});

		//发现功能列表 获取
		var initFindFuncList = function () {

			Api.getFindFuncList(
				null,
				function (data) {
					var template = _.template($findFuncItem.html());
					$findFuncContain.empty().append(template(data.result));

					asynLoadImage();//动态加载图片
				},
				function (data) {
					console.log("获取功能列表_error：");
					console.log(data);
				}
			);

		};

		//动态加载图片
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


		return findView;

	});

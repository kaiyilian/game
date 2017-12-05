define(
	['zepto', 'underscore', 'backbone',
		'swiper', 'echo', 'app/api',
		'app/utils', 'app/scroll',
		'text!templates/category.html'
	],

	function ($, _, Backbone, Swiper, echo, Api, utils, scroll, categoryTemplate) {

		var $page = $("#categor-page");
		var imageRenderToken = null;
		var $categoryList;
		var categoryView = Backbone.View.extend({
			el: $page,
			render: function () {
				utils.showPage($page, function () {

					//初始化分类数据
					initCaegor();

				});
			},
			events: {
				//查看具体种类的内容
				"tap .category_list li": "categoryListContain",

			},

			categoryListContain: function (e) {

				e.stopImmediatePropagation();
				var $this = $(e.currentTarget);
				//console.log($this.find(".category_name").html());
				window.location.hash = "categoryGoodList/" + $this.data("id");
				utils.storage.set("categoryGoodName", $this.find(".category_name").html());
				console.log($this.data("id"));

			},

		});

		var initCaegor = function () {
			var param = null;

			Api.getCategories(param, function (data) {
				var template = _.template(categoryTemplate);
				//alert(data.result)
				//console.log(data.result)
				$page.empty().append(template(data.result));

				asynLoadImage();
			}, function (data) {

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


		return categoryView;
	});

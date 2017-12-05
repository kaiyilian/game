define(['zepto', 'underscore', 'backbone',
		'swiper', 'echo', 'app/api',
		'app/utils', 'app/refreshtoken', 'app/scroll',
		'text!templates/wishList.html'
	],

	function ($, _, Backbone, Swiper, echo, Api, utils, Token, scroll, wishListTemplate) {

		var $page = $("#wish-list-page");
		var $wish_item;
		var $wishContainer;
		var imageRenderToken;

		var wishListView = Backbone.View.extend({
			el: $page,
			render: function () {
				//utils.showMenu();
				utils.showPage($page, function () {

					$page.empty().append(wishListTemplate);


					$wish_item = $page.find("#wish_item");
					$wishContainer = $page.find(".wish_list");

					initData();//

				});
			},
			events: {

				"tap .btn_my_wish": "toMyWish",
			},

			//编写自己的 心愿
			toMyWish: function () {

				window.location.hash = "myWish";
			},

		});

		//获取 数据
		var initData = function () {

			//alert(utils.storage.get("access_token"))

			var param = {
				page: "1",
				page_size: "10"
			};

			Api.getWishList(
				param,
				function (data) {

					var template = _.template($wish_item.html());
					$wishContainer.empty().append(template(data.result));

					$wishContainer.find(".wish_item").each(function () {

						var pics = $(this).find(".wish_img_list").data("pics");
						var wish_img_list = "";
						if (pics && pics.split(",").length > 0) {
							var pic = pics.split(",");
							for (var i = 0; i < pic.length; i++) {
								//var item = pic[i];
								wish_img_list += "<div class='ui-col ui-col'>" +
									"<img src='" + pic[i] + "'>" +
									"</div>"
							}

							$(this).find(".wish_img_list").show().html(wish_img_list);
							//$page.find(".wish_img_list").show().html(wish_img_list);

						}

					});

					asynLoadImage();//动态加载图片
					initStyle();
				},
				function (data) {
					
					console.log("获取心愿单---error：");
					console.log(data);


					//token过期 刷新token
					if (data.err_code == 20002) {

						Token.getRefeshToken(1, function () {
								//debugger
								initData();

							},
							function (data) {


							});
					}
				}
			)

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

		//控制心愿图片  宽高一致
		var initStyle = function () {

			$page.find(".wish_list .wish_item").each(function () {

				var width = $(this).find(".wish_img_list img").width();
				$(this).find(".wish_img_list img").height(width)

			});
		};

		return wishListView;

	});

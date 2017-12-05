/**
 * Created by CuiMengxin on 2016/10/15.
 * 往期揭晓
 */

define(
	[
		'zepto', 'jquery', 'underscore', 'backbone', 'urlGroup',
		'swiper', 'echo', 'app/api',
		'app/utils', 'app/scroll',
		'text!templates/pastAnnounced.html'
	],

	function ($, Jquery, _, Backbone, UrlGroup, Swiper, echo, Api, utils, scroll,
			  pastAnnouncedTemplate) {

		var $page = $("#past-announced-page");
		var $good_no;//商品编号
		var $past_announced_item;
		var imageRenderToken;

		var pastAnnouncedView = Backbone.View.extend({
			el: $page,
			render: function (good_no) {
				//utils.showMenu();
				utils.showPage($page, function () {
					$page.empty().append(pastAnnouncedTemplate);

					$good_no = good_no;
					$past_announced_item=$("#past_announced_item");

					initData();//初始化 数据

				});
			},
			events: {},

		});


		//获取数据
		var initData = function () {

			var param = {
				good_no: $good_no,
				page: "1",
				page_size: "10"
			};

			Api.getPastAnnounced(
				param,
				function (data) {

					var template = _.template($past_announced_item.html());
					$(".past_announced_list").empty()
						.append(template(data.result));

					asynLoadImage();//动态加载图片

				},
				function () {

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


		return pastAnnouncedView;
	});

/**
 * Created by CuiMengxin on 2016/10/17.
 * 隐私协议
 */
define(
	['zepto', 'underscore', 'backbone',
		'swiper', 'echo', 'app/api',
		'dropload', 'app/utils',
		'text!templates/privacy.html'
	],

	function ($, _, Backbone, Swiper, echo, Api, _dropload, utils, privacyTemplate) {

		var $page = $("#privacy-page");
		var privacyView = Backbone.View.extend({
			el: $page,
			render: function () {
				utils.showPage($page, function () {
					$page.empty().append(privacyTemplate);

					//如果URL里面有platform ,title 就不显示
					if (location.href.indexOf("platform") > -1) {
						$page.find("header").hide();
						$page.find(".ui-content").css("border-top", "0");
					}

					initData();
				});
			},
			events: {},

		});

		var initData = function () {
			var param = {
				key: "privacy"
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
					console.log("隐私协议-----error:");
					console.log(data);
				}
			)
		};

		return privacyView;
	}
);
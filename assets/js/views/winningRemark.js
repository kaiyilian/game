/**
 * Created by CuiMengxin on 2016/10/16.
 * //计算详情、夺宝规则 页面(纯文本)
 */
define(
	['zepto', 'underscore', 'backbone',
		'echo', 'app/api', 'app/refreshtoken',
		'app/utils',
		'text!templates/winningRemark.html'
	],

	function ($, _, Backbone, echo, Api, Token, utils, winningRemarkTemplate) {


		var $page = $("#winning-remark-page");

		var winningRemarkView = Backbone.View.extend({
			el: $page,
			render: function () {
				utils.showPage($page, function () {

					$page.empty().append(winningRemarkTemplate);

					//如果URL里面有platform ,title 就不显示
					if (location.href.indexOf("platform") > -1) {
						$page.find("header").hide();
						$page.find(".ui-content").css("border-top", "0");
					}
					//$page.empty().html(sessionStorage.getItem("img_txt_detail"))

					initData();//
				});
			},
			events: {},

		});

		var initData = function () {
			var param = {
				key: "winningRemark"
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
					console.log("中奖规则-----error:");
					console.log(data);
				}
			)
		};


		return winningRemarkView;
	});

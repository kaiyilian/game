/**
 * Created by CuiMengxin on 2016/10/17.
 * 常见问题
 */
define(
	['zepto', 'underscore', 'backbone',
		'swiper', 'echo', 'app/api',
		'dropload', 'app/utils',
		'text!templates/question.html'
	],

	function ($, _, Backbone, Swiper, echo, Api, _dropload, utils, questionTemplate) {

		var $page = $("#question-page");
		var questionView = Backbone.View.extend({
			el: $page,
			render: function () {
				utils.showPage($page, function () {
					$page.empty().append(questionTemplate);

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
				key: "question"
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
					console.log("常见问题-----error:");
					console.log(data);
				}
			)
		};


		return questionView;
	}
);

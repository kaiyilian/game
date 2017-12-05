define(['zepto', 'underscore', 'backbone',
		'echo', 'app/api',
		'app/utils',
		'text!templates/mySetting.html'
	],

	function ($, _, Backbone, echo, Api, utils, mySettingTemplate) {

		var $page = $("#my-setting-page");
		var mySettingView = Backbone.View.extend({
			el: $page,
			render: function () {
				utils.showPage($page, function () {
					$page.empty().append(mySettingTemplate);


				});
			},
			events: {
				//退出
				"tap .btn_sign_out": "dropOut",

				"tap ul > li": "GoPage",//进入 展示页面

			},

			dropOut: function () {
				//utils.storage.remove("loginSuccess");

				utils.storage.set("loginSuccess", "no");
				//置换凭证 refresh_token
				utils.storage.remove("refresh_token");
				//接口访问凭证 access_token
				utils.storage.remove("access_token");
				//过期时间
				utils.storage.remove("expire_time");
				utils.storage.remove("loginSuccess");
				window.location.hash = "my";
			},

			GoPage: function (e) {

				e.stopImmediatePropagation();
				var $this = $(e.currentTarget);

				var href = $this.data("href");
				if (href)
					window.location.hash = href;

			}

		});


		return mySettingView;
	});

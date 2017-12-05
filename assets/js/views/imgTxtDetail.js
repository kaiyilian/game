/**
 * Created by CuiMengxin on 2016/10/16.
 * 图文详解
 */
define(
	['zepto', 'underscore', 'backbone',
		'echo', 'app/api', 'app/refreshtoken',
		'app/utils',
		'text!templates/imgTxtDetail.html'
	],

	function ($, _, Backbone, echo, Api, Token, utils, imgTxtDetailTemplate) {


		var $page = $("#img-txt-detail-page");

		var imgTxtDetailView = Backbone.View.extend({
			el: $page,
			render: function () {
				utils.showPage($page, function () {

					$page.empty().append(imgTxtDetailTemplate);

					$page.find(".img-txt-detail-css").html(sessionStorage.getItem("img_txt_detail"))

				});
			},
			events: {},

		});


		return imgTxtDetailView;
	});


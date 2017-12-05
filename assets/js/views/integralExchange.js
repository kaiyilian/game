define(['zepto', 'underscore', 'backbone',
		'swiper', 'echo', 'frozen', 'app/api',
		'app/utils', 'app/refreshtoken',
		'text!templates/integralExchange.html'
	],

	function ($, _, Backbone, Swiper, echo, frozen, Api, utils, Token, integralExchangeTemplate) {

		var $page = $("#integral-exchange-page");
		var type = 1;// 需要先判断是否登陆
		var $categoryList;
		var integralExchangeView = Backbone.View.extend({
			el: $page,
			render: function (id, name) {
				utils.showPage($page, function () {
					//$page.empty().append(integralExchangeTemplate);

					getIntegralExchangeRate();
				});
			},
			events: {

				//兑换
				"tap .btn_exchange": "exchange",

			},

			exchange: function (e) {

				var result = $(e.currentTarget).data("result");

				var base = $(".exchange_rate_base").val();

				var points = parseInt(result) * parseInt(base);

				console.log(points);

				exchangePoints(points);
			},
		});

		//积分兑换
		var exchangePoints = function (points) {

			var formData = "points=" + points;

			var param = {formData: formData};

			Api.exchangePoints(param, function (successData) {

				$.Dialog.success("积分兑换成功！");
				getIntegralExchangeRate();
			}, function (errorData) {

				if (errorData.err_code == 20002) {

					Token.getRefeshToken(type, function (data) {

						exchangePoints();

					}, function (data) {


					});
				}

			});
		};

		//得到积分兑换比率
		var getIntegralExchangeRate = function () {

			Api.getIntegralExchangeRate(null, function (successData) {

				var template = _.template(integralExchangeTemplate);

				$page.empty().append(template(successData));

				getAccountInte(successData.result);

			}, function (errorData) {

				if (errorData.err_code == 20002) {

					Token.getRefeshToken(type, function (data) {

						getIntegralExchangeRate();

					}, function (data) {


					});
				}
			});
		};

		var getAccountInte = function (result) {

			var param = null;

			Api.getAccountIntegration(param, function (data) {

				$(".total_integral").html(data.result.member.points);

				var maxPoint = data.result.member.points / result * result;

				$(".exchanged_integral").html(maxPoint);

				$page.find(".exchange_rate_base").keyup(function () {
					this.value = this.value.replace(/\D/g, '');

					var val = parseInt(this.value);

					$page.find(".mxb_count_show").html(val);
				});

			}, function (errorData) {

				if (errorData.err_code == 20002) {

					Token.getRefeshToken(type, function (data) {

						getAccountInte();

					}, function (data) {


					});
				}
			});
		};

		return integralExchangeView;
	});

define(['zepto', 'underscore', 'backbone',
		'swiper', 'echo', 'frozen', 'app/api',
		'app/utils',
		'text!templates/recharge.html'
	],

	function ($, _, Backbone, Swiper, echo, frozen, Api, utils, rechargeTemplate) {

		var $page = $("#recharge-page");

		var rechargeTemplateData;

		var rechargeView = Backbone.View.extend({
			el: $page,
			render: function (id, name) {
				utils.showPage($page, function () {
					//$page.empty().append(rechargeTemplate);
					rechargeTemplateData = null;
					initData();

				});
			},
			events: {

				"tap .money_list li": "selectRechargeAmount",
				//"tap .weixin_pay": "choosePayMethod",
			},

			selectRechargeAmount: function (e) {

				e.stopImmediatePropagation();

				var $this = $(e.currentTarget);
				//点击选中 充值金额
				if (!$this.hasClass("btn_other")) {
					$this.addClass("active").siblings(".item").removeClass("active");

					var item = $this.data("item");

					$(".recharge_template_desc").html(rechargeTemplateData[item].desc);

				}

				//选择  其他金额
				if ($this.hasClass("btn_other")) {
					$this.addClass("active").siblings(".item").removeClass("active");
					var $npt = $("<input>").addClass("ui-input").addClass("other_money")
						.attr("maxlength", "3")
						.attr("placeholder", "其他金额")
						.css({
							"background": "transparent",
							"text-align": "center",
							"color": "#ff6e2b"
						});
					//禁止输入数字
					$npt.keyup(function () {
						this.value = this.value.replace(/\D/g, '')
					});
					//移除焦点 显示数字
					$npt.blur(function () {
						var val = $(this).val();
						if (val) {
							val = "<div>" + val + "</div>";
						}
						else {
							val = "<div>其他金额</div>";
							$this.closest(".btn_other").removeClass("active");
						}

						$this.closest(".btn_other").html(val);
					});

					if ($this.find(".other_money").length == 0) {
						$this.find("div").html($npt);
						$npt.focus();
					}
				}
			},

			//选择支付方式
			choosePayMethod: function (e) {
				e.stopImmediatePropagation();
				var $this = $(e.currentTarget);

				var $ico_choose = $this.find(".icon_choose");
				if ($ico_choose.hasClass("active")) {
					$ico_choose.removeClass("active");
					$ico_choose.find(".icon_choose img").attr("src", "assets/image/recharge/icon_Unchecked.png");
				}
				else {
					$ico_choose.addClass("active");
					$ico_choose.find("img").attr("src", "assets/image/recharge/icon_checked.png");
				}
			}


		});

		var initData = function () {

			Api.getRechargeTemplate(null, function (successData) {

				rechargeTemplateData = successData.result.templates;

				var template = _.template(rechargeTemplate);

				$(".recharge_template_desc").html(rechargeTemplateData[0].desc);

				$page.empty().append(template(successData.result));
			});
		};


		return rechargeView;
	});

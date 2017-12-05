define(['zepto', 'underscore', 'backbone',
		'echo', 'app/api', 'frozen',
		'app/utils', 'app/jquery.spinner',
		'text!templates/orderPaySuccess.html'
	],

	function ($, _, Backbone, echo, Api, frozen, utils, Spinner, orderPaySuccessTemplate) {
		var $page = $("#orderPaySuccess-page");
		var thisType;
		var shoppingPaySuccess;
		var orderPaySuccessView = Backbone.View.extend({
			el: $page,
			render: function (type) {
				thisType = type;
				utils.showPage($page, function () {
					$page.empty().append(orderPaySuccessTemplate);

					$(".announced_record").hide();

					shoppingPaySuccess = null;
					showAndHide();

				});
			},
			events: {
				//继续逛逛
				"tap .btn_continue": "btnContinue",

				//购买记录
				"tap .btn_buy_record": "btnBuyRecord",

				//夺宝记录
				"tap .btn_announced_record": "btnAnnouncedRecord",
				//查看全部
				"tap .btn_all": "btnAll",
			},

			btnContinue: function () {


				if (thisType == "duobaoFull" || thisType == "myorder" || thisType == "flash") {

					window.location.hash = "main";
				}
				if (thisType == "shopping") {
					window.location.hash = "main";
				}
			},

			//购买记录
			btnBuyRecord: function () {

				if (thisType == "duobaoFull" || thisType == "myorder" || thisType == "flash") {

					window.location.hash = "myOrder";
				}
			},

			//夺宝记录
			btnAnnouncedRecord: function () {

				if (thisType == "shopping") {
					window.location.hash = "myAnnouncedRecord";
				}
			},

			//查看全部
			btnAll: function (e) {

				e.stopImmediatePropagation();

				//var $this = $(e.currentTarget);
				//var snsData = $this.siblings(".announced_no").html();

				var content = "";
				if (sessionStorage.getItem("order_pay_success_noList")) {
					content = sessionStorage.getItem("order_pay_success_noList");
				}
				else {
					content = "";
				}

				var dia = $.dialog({
					title: '',
					content: content,
					button: ["关闭"]
				});
			}
		});

		var showAndHide = function () {
			if (thisType == "duobaoFull" || thisType == "myorder" || thisType == "flash") {

				$(".btn_announced_record").hide();//夺宝记录
				$(".btn_buy_record").show();//购买记录记录
			}

			if (thisType == "shopping") {
				$(".btn_announced_record").show();//夺宝记录
				$(".btn_buy_record").hide();//购买记录记录


				var shoppingPaySuccess = JSON.parse(utils.storage.get("shoppingPaySuccess"));

				console.log(shoppingPaySuccess)

				var template = _.template($("#announced_record_item").html());

				$(".announced_record").empty().append(template(shoppingPaySuccess)).show();


				//夺宝号码
				var sns = shoppingPaySuccess.auctions[0].sns;
				var sns_list = "";
				if (sns && sns.length > 2) {

					for (var i = 0; i < sns.length; i++) {
						var item = sns[i];

						sns_list += "<span class='personal_no'>" + item + "</span>";

					}

					sessionStorage.setItem("order_pay_success_noList", sns_list);//夺宝号码 列表

				}
			}

			if (thisType == "flash") {

			}
		}

		return orderPaySuccessView;
	});

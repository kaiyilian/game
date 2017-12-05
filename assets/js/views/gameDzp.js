/**
 * Created by CuiMengxin on 2016/10/8.
 */
define(
	[
		'zepto', 'underscore', 'backbone', 'urlGroup',
		'swiper', 'echo', 'app/api', 'map', 'kinerLottery',
		'app/utils', 'app/scroll', 'app/refreshtoken',
		'text!templates/gameDzp.html'
	],
	function ($, _, Backbone, UrlGroup, Swiper, echo, Api, map, kinerLottery, utils, scroll, Token,
			  gameDzpTemplate) {

		var $page = $("#game-dzp-page");
		var $prize_id = "";
		var $prize_name = "";
		var accessToken;
		var platform;
		var param;

		var gameDzpView = Backbone.View.extend({
			el: $page,
			render: function () {
				//utils.showMenu();
				utils.showPage($page, function () {

					$page.empty().append(gameDzpTemplate);

					//utils.getUrl();//
					utils.getUrl(location.href);

					param = {accessToken: utils.storage.get("access_token")};

					//如果URL里面有platform ,title 就不显示
					if (location.href.indexOf("platform") > -1) {
						$page.find(".icon_line").hide();
					}

					var KinerLottery = new kinerLottery({
						rotateNum: 8, //转盘转动圈数
						body: "#box", //大转盘整体的选择符或zepto对象
						direction: 0, //0为顺时针转动,1为逆时针转动
						disabledHandler: function (key) {
							switch (key) {
								case "noStart":
									alert("活动尚未开始");
									break;
								case "completed":
									alert("活动已结束");
									break;
							}

						}, //禁止抽奖时回调

						clickCallback: function () {

							random();
							//此处访问接口获取奖品
							function random() {
								param = {accessToken: utils.storage.get("access_token")};
								var url = urlGroup.dzp_prize_get + "?access_token="
										//+ "e69df7f06312b1737f12b1a6e0e06eb4"
									+ param.accessToken;

								Api.mxepPost(
									url,
									{},
									null,
									function (data) {
										var angle = data.result.angle;//转动角度
										console.log("角度" + (360 - angle));
										$prize_id = data.result.id;//奖品ID
										$prize_name = data.result.name;//奖品名称

										//console.log(JSON)
										//var random = Math.floor(Math.random() * 360);
										//var random = 0;//设置到达的 区域
										//alert(angle)
										//return angle;

										KinerLottery.goKinerLottery(360 - angle);//获取奖品 （转盘的转动角度）
									},
									function (error) {
										//token过期 刷新token
										if (error.err_code == 20002) {
											Token.getRefeshToken(1, function (data) {
												random();//重新获取accesstoken后，调用接口

											}, function (data) {
												window.location.href = window.LOGIN_REDIRECT_URL;
											});
										}
									}
								);
							}
						}, //点击抽奖按钮,再次回调中实现访问后台获取抽奖结果,拿到抽奖结果后显示抽奖画面

						KinerLotteryHandler: function (deg) {
							console.log("度数" + deg);
							//alert("恭喜您获得:" + $prize_name);
							$.Dialog.info("恭喜您获得奖品" + $prize_name);
							prize_record_list();//获取奖品列表
							//alert("恭喜您获得:" + whichAward(deg));
						} //抽奖结束回调
					});

					prize_record_list();//获取中奖记录
				});
			},
			events: {
				//"tap .go_back": "goBack",

			},

			//goBack: function () {
			//	window.location.hash = "main";
			//},
		});

		//获取中奖记录
		var prize_record_list = function () {
			//dzp_prize_record_list_get

			var obj = new Object();
			obj.page = 1;
			obj.page_size = "10";

			var url = urlGroup.dzp_prize_record_list_get + "?" + utils.jsonParseParam(obj);
			//alert(url)
			Api.mxepGet(
				url,
				null,
				function (data) {
					//alert(JSON.stringify(data));
					console.log("中奖记录：");
					console.log(data);

					var prizes = data.result.data;
					var prize_list = "";
					if (!prizes || prizes.length == 0) {
						prize_list = "<li>暂无数据</li>";
					}
					else {

						for (var i = 0; i < prizes.length; i++) {
							var $item = prizes[i];

							var member_name = $item.member_name;//会员名称
							var prize_name = $item.prize_name;//会员名称
							var winning_time = $item.winning_time;//中奖时间


							prize_list +=
								"<li class='ui-border-b'>" +
								"<span>恭喜</span>" +
								"<span class='winner_name'>" + member_name + "</span>" +
								"<span>获得</span>" +
								"<span class='prize_name'>" + prize_name + "</span>" +
								"</li>";

						}

					}

					$page.find(".prize_record_list_container .prize_record_list").html(prize_list);

				},
				function (error) {

				}
			);
		}


		return gameDzpView;

	}
);

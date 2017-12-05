define(['zepto', 'underscore', 'backbone', 'dropload',
		'swiper', 'echo', 'frozen', 'app/api',
		'app/utils', 'app/refreshtoken',
		'text!templates/dice.html'
	],

	function ($, _, Backbone, _dropload, Swiper, echo, frozen, Api, utils, Token, diceTemplate) {

		var $page = $("#dice-page");
		var $box;
		var $bet_status;//本期下注状态	0 未下注 1已下注
		var $date_sn;//本期期号
		var $dice_size;//本期骰子开奖大小 1大 2小
		var $dice_points;//本期中奖 点数
		var $user_choose_size;//用户选择的 大小 1大 2小
		var $current_status = 0;//0 未投入  1 已投入

		var diceView = Backbone.View.extend({
			el: $page,
			render: function () {

				utils.showPage($page, function () {


					utils.getUrl(location.href);


					initData();//获取数据

				});
			},

			events: {
				//"tap .box img": "diceRun1",//骰子 转动
				"tap .chooseBigAndSmall .ui-col": "chooseDiceSize",//选择大小
				"tap .choose_multiples": "multiplesContainerShow",//“选择基础倍数 ul ”显示
				//"tap body": "multiplesContainerHide",//“选择基础倍数 ul ”隐藏
				"tap .multiples_list li": "multiplesChoose",//选择 基础 倍数
				"tap .chooseBase .item": "baseChoose",//基数 选择
				"tap .multiples_container": "baseMultiplesAdd",//增加 基础倍数的 count
				"tap .btn_push": "btnPush",//投入
				"tap .btn_reset": "btnReset",//投入
			},

			//选择 大小
			chooseDiceSize: function (e) {
				e.stopImmediatePropagation();
				var $this = $(e.currentTarget);

				if (checkIsPush()) {
					$.Dialog.info("本期投骰子活动已经 下注过，请勿重复下注！");
					return
				}

				$user_choose_size = $this.data("size");
				$this.addClass("active").siblings().removeClass("active");

				initChooseDiceSizeImg();//初始化 选择大小 图片样式

			},

			//“选择基础倍数 ul ”显示
			multiplesContainerShow: function (e) {
				e.stopImmediatePropagation();

				if (checkIsPush()) {
					$.Dialog.info("本期投骰子活动已经 下注过，请勿重复下注！");
					return
				}

				$page.find(".multiples_list").show();
			},

			//基数 选择
			baseChoose: function (e) {
				e.stopImmediatePropagation();
				var $this = $(e.currentTarget);

				if (checkIsPush()) {
					$.Dialog.info("本期投骰子活动已经 下注过，请勿重复下注！");
					return
				}

				var val = $this.data("value");
				$page.find(".row_2 .bet_base input").val(val);

			},

			//选择 倍数的基数
			multiplesChoose: function (e) {
				e.stopImmediatePropagation();
				var $this = $(e.currentTarget);

				var $multiples_container = $page.find(".multiples_container");

				var base = $this.html();//基础倍数
				$multiples_container.find(".multiples").html(base);//赋值基础倍数
				$multiples_container.find(".multiples_count").html(0);//赋值基础倍数 数量为0

				$page.find(".multiples_list").hide();//“选择基础倍数 ul ”隐藏
			},

			//增加 基础倍数的 count
			baseMultiplesAdd: function () {
				if (checkIsPush()) {
					$.Dialog.info("本期投骰子活动已经 下注过，请勿重复下注！");
					return
				}

				var $count = $page.find(".multiples_container .multiples_count");

				var count = parseInt($count.html());
				if (count >= 10) {
					//alert("最多 10 倍！")
					$.Dialog.info("最多 10 倍！");
				}
				else {
					count += 1;
					$count.html(count);
				}

			},

			//投入
			btnPush: function () {

				if (checkIsPush()) {
					$.Dialog.info("本期投骰子活动已经 下注过，请勿重复下注！");
					return
				}

				var multiples = $page.find(".multiples").html();
				var multiples_count = $page.find(".multiples_count").html();

				var txt = "";
				var chip_amount = $.trim($page.find(".bet_base input").val());//筹码数
				var date_sn = $date_sn;
				var dice_size = $page.find(".chooseBigAndSmall .ui-col.active").data("size");
				var multiple = Math.pow(multiples, multiples_count);

				if (!chip_amount) {
					txt = "请输入筹码数量！";
				}
				else if (!dice_size) {
					txt = "请选择大小！";
				}

				if (txt) {
					$.Dialog.info(txt);
					return
				}

				var param = {
					chip_amount: chip_amount,
					date_sn: date_sn,
					dice_size: dice_size,
					multiple: multiple
				};

				param = utils.jsonParseParam(param);

				btnDicePush(param);//投入

			},

			//重置
			btnReset: function () {

				if (checkIsPush()) {
					$.Dialog.info("本期投骰子活动已经 下注过，暂时无法重置！");
					return
				}

				//$page.find(".btn_reset").removeClass("active");//重置按钮 灰色
				$page.find(".chooseBigAndSmall .ui-col").removeClass("active");//选择大小 初始化
				$page.find(".bet_base input").val("");//基数清空
				$page.find(".multiples_container .multiples").html(2);//默认倍数
				$page.find(".multiples_container .multiples_count").html(0);//默认倍数 数量

			}

		});

		//检查用户是否已经 投入过
		var checkIsPush = function () {
			return $current_status;
		};

		//初始化 数据
		var initParam = function () {
			$current_status = 0;//赋值初始 状态 未投注

			var $active_item = $page.find(".chooseBigAndSmall .ui-col.active");
			var img_name = $active_item.attr("data-img");
			var img_url = "assets/image/game/ysz/" + img_name + ".png";
			$active_item.find("img").attr("src", img_url);
			$active_item.removeClass("active");//选择大小 初始化
			$page.find(".bet_base input").val("");//基数清空
			$page.find(".multiples_container .multiples").html(2);//默认倍数
			$page.find(".multiples_container .multiples_count").html(0);//默认倍数 数量
			//$page.find(".bet_base input").removeAttr("readonly");
		};

		//获取数据
		var initData = function () {
			//console.log("initData");

			var param = {
				date_sn: ""
			};

			Api.getDiceInfo(
				param,
				function (data) {
					//console.log("本期记录：");
					//console.log(data);

					$page.empty().append(diceTemplate);
					//var template = _.template(diceTemplate);
					//$page.empty().append(template(data.result));
					$box = $page.find(".box");
					//设置
					var box_height = $box.width() * 0.8;
					$box.height(box_height);

					$page.tap(function () {
						$page.find(".multiples_list").hide();
					});
					//如果URL里面有platform ,title 就不显示
					if (location.href.indexOf("platform") > -1) {
						$page.find(".icon_line").remove();
					}
					console.log($page.find(".icon_line"))
					console.log($page.find(".icon_line").length)

					//return

					var $item = data.result;
					var status = $item.status;//本期骰子的开奖状态	1待开奖 2已开奖
					$date_sn = $item.date_sn;//本期期号
					var current_time = $item.current_time;//当前时间
					var end_time = $item.end_time;//结束时间
					var start_time = $item.start_time;//开始时间
					var points = $item.points;//分数
					$bet_status = $item.bet_status;// 本期下注状态		0 未下注 1已下注
					var dice_chips = $item.dice_chips;//筹码数
					if (dice_chips && dice_chips.length > 0) {
						var chips_list = "";
						$.each(dice_chips, function (index) {
							//console.log(item);

							chips_list += "<div class='ui-col ui-col item' data-value='" + dice_chips[index].value + "'>" +
								dice_chips[index].name + "</div>"

						});
						$page.find(".chooseBase").html(chips_list);
					}
					if ($bet_status) {
						$current_status = 1;//赋值状态 投入成功
					}
					$page.find(".user_integral").html(points);

					if (status == 0) {	//1待开奖

						current_time = current_time.replace(/-/g, "/");
						end_time = end_time.replace(/-/g, "/");
						start_time = start_time.replace(/-/g, "/");
						current_time = new Date(current_time).getTime();
						end_time = new Date(end_time).getTime();
						start_time = new Date(start_time).getTime();

						if (current_time < start_time) {	//上一期正在 开奖
							timeDownToSS(
								current_time,
								start_time,
								function (sec) {
									var content = "上一期正在开奖：" + sec + "s";
									$page.find(".time_down").show().html(content);
								},
								function () {
									initData();
								});
						}
						else {
							timeDownToSS(		//本期还未开奖
								current_time,
								end_time,
								function (sec) {
									$page.find(".time_down").show().html(sec + "s");
								},
								function () {
									$.Dialog.info("买定离手");

									//倒计时结束后 开奖中。。
									$page.find(".time_down").show().html("开奖中");

									diceRun();//动画

								});
						}

					}
					else if (status == 1) {		//2已开奖

						//倒计时结束后 开奖中。。
						$page.find(".time_down").show().html("开奖中");

						diceRun();//动画
					}

				},
				function (data) {
					console.log("本期记录-----error：");
					console.log(data);

					//token过期 刷新token
					if (data.err_code == 20002) {

						Token.getRefeshToken(1, function () {
								//debugger
								initData();

							},
							function (data) {


							});
					}
				}
			);
		};

		//活动时间 倒计时
		var timeDownToSS = function (currentTime, endTime, succFunc, endFunc) {
			//debugger
			if (!currentTime || !endTime) {
				throw "时间参数错误"
			}

			var intDiff = (endTime - currentTime) / 1000;

			console.log("倒计时：" + intDiff);

			function timeDown() {

				if (intDiff >= 0) {
					var second = Math.floor(intDiff % 60);

					succFunc(second);//

					var timeOut = setTimeout(function () {

						if (intDiff > 0) {
							intDiff -= 1;
							timeDown();
						}
						else {
							clearTimeout(timeOut);
							endFunc();
						}
					}, 1000);

				}
				else {
					endFunc();
				}
			}

			timeDown();

		};

		//初始化 选择大小 图片样式
		var initChooseDiceSizeImg = function () {
			$page.find(".chooseBigAndSmall .ui-col").each(function () {

				var img_name = $(this).attr("data-img");
				var img_pure_url = "assets/image/game/ysz/" + img_name + ".png";
				var img_choose_url = "assets/image/game/ysz/" + img_name + "_choose.png";

				if ($(this).hasClass("active")) {
					$(this).find("img").attr("src", img_choose_url);
				}
				else {
					$(this).find("img").attr("src", img_pure_url);
				}

			});
		};

		//动画 骰子 转动
		var diceRun = function () {

			var $img = $box.find("img");

			//如果 为 false
			if (!$img.hasClass("doing")) {
				$img.addClass("doing");

				$img.css({
					'-webkit-transition': 'all 5s',
					'transition': 'all 5s',
					'-webkit-transform': 'rotate(' + (1590) + 'deg)',
					'transform': 'rotate(' + (1590) + 'deg)'
				});

				//转动结束
				$box.find('img').get(0).addEventListener('webkitTransitionEnd',
					function () {
						$img.removeClass("doing");

						var random = Math.floor(Math.random() * 360);

						$img.css({
							'-webkit-transition': 'none',
							'transition': 'none',
							'-webkit-transform': 'rotate(' + random + 'deg)',
							'transform': 'rotate(' + random + 'deg)'
						});

						getPrize();//开奖后，获取中奖信息

					});

			}

		};

		//开奖后，获取中奖信息
		var getPrize = function () {

			var param = {
				date_sn: $date_sn
			};

			Api.getDiceInfo(
				param,
				function (data) {
					console.log("本期  中奖-记录：");
					console.log(data);

					var $item = data.result;
					var status = $item.status;//本期骰子的开奖状态	1待开奖 2已开奖
					$dice_size = $item.dice_size;//本期骰子开奖大小  1大 2小
					$bet_status = $item.bet_status;// 本期下注状态		0 未下注 1已下注
					$dice_points = $item.dice_point ? $item.dice_point : 1;//开奖点数

					var url = "assets/image/game/ysz/" + $dice_points + ".png";
					$box.find("img").attr("src", url);
					$box.find("img").css({
						'-webkit-transition': 'none',
						'transition': 'none',
						'-webkit-transform': 'rotate(0deg)',
						'transform': 'rotate(0deg)'
					});

					//console.log(url);

					var $msg = "";
					if (status == 0) {	//0待开奖
						$msg = "本次活动 暂无抽奖";
					}
					else if (status == 1) {		//1已开奖

						if (!$bet_status) {	//未下注
							$msg = "您没有参加此次抽奖！";
						}
						else if ($bet_status && $user_choose_size == $dice_size) {	//已中奖
							$msg = "恭喜您中奖了！";
						}
						else {	//未中奖
							$msg = "很抱歉，本轮未中奖";
						}

					}
					$.Dialog.info($msg);

					setTimeout(function () {
						initParam();//初始化参数

						initData();//
					}, 5500)

				},
				function (data) {
					console.log("本期  中奖-记录-----error：");
					console.log(data);

					//token过期 刷新token
					if (data.err_code == 20002) {

						Token.getRefeshToken(1, function () {
								//debugger
								getPrize();

							},
							function (data) {


							});
					}
				}
			);

		};

		//投入
		var btnDicePush = function (param) {
			console.log(param);

			Api.dicePush(
				param,
				function (data) {
					console.log("投入梦想币成功：");
					console.log(data);

					if (data.err_code == 0) {
						$.Dialog.info("投入成功！");
						$current_status = 1;//赋值状态 投入成功
						//$page.find(".bet_base input").attr("readonly", "readonly");

					}
					else {
						$.Dialog.info(data.err_msg);
					}

				},
				function (data) {
					console.log(data);

					//token过期 刷新token
					if (data.err_code == 20002) {

						Token.getRefeshToken(1, function () {

								btnDicePush();

							},
							function (data) {


							});
					}

				}
			)

		};

		return diceView;
	});

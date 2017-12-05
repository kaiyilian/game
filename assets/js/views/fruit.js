define(['zepto', 'underscore', 'backbone', 'dropload',
		'swiper', 'echo', 'frozen', 'app/api',
		'app/utils', 'app/refreshtoken',
		'text!templates/fruit.html'
	],

	function ($, _, Backbone, _dropload, Swiper, echo, frozen, Api, utils, Token, fruitTemplate) {

		var $page = $("#fruit-page");
		var $date_sn = "";//期号
		var $msg = "";//提示信息
		var $time_count = 0;//时间

		var fruitView = Backbone.View.extend({
			el: $page,
			render: function () {
				utils.showPage($page, function () {

					$page.empty().append(fruitTemplate);

					utils.getUrl(location.href);

					//如果URL里面有platform ,title 就不显示
					if (location.href.indexOf("platform") > -1) {
						$page.find(".icon_line").hide();
					}

					//“选择基础倍数 ul ”隐藏
					$("body").tap(function () {
						$page.find(".multiples_list").hide();
					});

					initData();//初始化 数据
				});
			},
			events: {
				"tap .row_1 .choose_fruit .ui-col": "chooseFruit",//
				"tap .choose_multiples": "multipleListShow",//
				"tap .multiples_list li": "chooseMultipleBase",//
				"tap .multiples_container": "multiplesBaseAdd",//
				"tap .btn_push": "btnPush",//
				"tap .btn_reset": "btnReset",//
			},

			// 选择 水果，准备 下注
			chooseFruit: function (e) {
				e.stopImmediatePropagation();
				var $this = $(e.currentTarget);

				$page.find(".bet_base input").val("");//清空 投入积分 输入框
				$this.addClass("active").siblings(".ui-col").removeClass("active");
				initChooseFruitImg();//初始化 选择水果 图片

			},

			//倍数的基数 弹框显示
			multipleListShow: function (e) {

				e.stopImmediatePropagation();

				$page.find(".multiples_list").show();

			},

			//选择 倍数的基数
			chooseMultipleBase: function (e) {
				e.stopImmediatePropagation();
				var $this = $(e.currentTarget);

				var $multiples_container = $page.find(".multiples_container");

				var multiples_base = $this.html();//倍数的基数
				$multiples_container.find(".multiples").html(multiples_base);//赋值基础倍数
				$multiples_container.find(".multiples_count").html(0);//赋值基础倍数 数量为0

				$page.find(".multiples_list").hide();//“选择基础倍数 ul ”隐藏
			},

			//基数的增加
			multiplesBaseAdd: function () {

				var base_multiples = $page.find(".multiples_container .multiples_count");
				var count = parseInt(base_multiples.html());

				if (count >= 10) {
					$.Dialog.info("最多 10 倍！");
				}
				else {
					count += 1;
					base_multiples.html(count);
				}
			},

			//投入
			btnPush: function () {
				//console.log("投入成功！");

				var $bet_base = $page.find(".bet_base");
				var $choose_fruit = $page.find(".choose_fruit");

				var val = $.trim($bet_base.find("input").val());//基数
				var multiples = $page.find(".multiples").html();//倍数 基数
				var multiples_count = $page.find(".multiples_count").html();//
				//$choose_fruit.find(".active").find(".bet_money").html(val);

				var txt = "";
				if (!val) {
					txt = "请输入筹码数量！";
				}
				else if ($choose_fruit.find(".active").length == 0) {
					txt = "请选择水果！";
				}

				if (txt) {
					$.Dialog.info(txt);
					return
				}

				var bet_chips = '[{' +
					'"chip_amount":"' + val + '"' + ',' +
					'"fruit_id":"' + $choose_fruit.find(".active").attr("data-id") + '"' + ',' +
					'"multiple":"' + Math.pow(multiples, multiples_count) + '"' +
					'}]';
				//bet_chips = JSON.parse(bet_chips);
				bet_chips = eval("(" + bet_chips + ")");

				var param = {
					bet_chips: bet_chips,
					date_sn: $date_sn
				};
				//console.log(param);
				Api.fruitPush(
					param,
					function (data) {
						console.log("投注 水果");
						console.log(data);

						if (data.err_code == 0) {
							$.Dialog.info("投入成功!");

							var $active_item = $page.find(".choose_fruit").find(".active");

							var total_val = Math.pow(multiples, multiples_count) * val;
							$active_item.find(".bet_money").html(total_val);


							var $bet_base = $page.find(".bet_base");
							var $multiples_container = $page.find(".multiples_container");

							$bet_base.find("input").val("");//基础金额 为空
							$multiples_container.find(".multiples").html(2);
							$multiples_container.find(".multiples_count").html(0);

							$active_item.removeClass("active");
						}


					},
					function (data) {
						console.log("投注 水果-----error");
						console.log(data);
					}
				);


			},

			//重置
			btnReset: function () {
				resetData();//重置 数据
			}

		});

		//重置 数据
		var resetData = function () {
			var $bet_base = $page.find(".bet_base");
			var $multiples_container = $page.find(".multiples_container");
			var $choose_fruit = $page.find(".choose_fruit");
			var $active_item = $page.find("#lottery").find(".active");

			var img_name = $active_item.attr("data-img");
			var img_url = "assets/image/game/csg/" + img_name + ".png";
			$active_item.find("img").attr("src", img_url);
			$active_item.removeClass("active");

			$bet_base.find("input").val("");//基础金额 为空
			$multiples_container.find(".multiples").html(2);
			$multiples_container.find(".multiples_count").html(0);

			$choose_fruit.find(".active").removeClass("active");
			$choose_fruit.find(".bet_money").html("0");//水果 买中的数量置空
			initChooseFruitImg();
		};

		//初始化 数据
		var initData = function () {

			resetData();//重置 数据

			var param = {
				date_sn: ""
			};

			Api.getFruitInfo(
				param,
				function (data) {
					console.info("获取 本期猜水果信息：");
					console.log(data);

					lottery.init('lottery');//初始化 九宫格

					var w_height = $(document).height();
					$page.find(".fruit-css .mxep_block").height(w_height + 50);


					var $item = data.result;

					var current_time = $item.current_time;//当前时间
					var start_time = $item.start_time;//开始时间
					var end_time = $item.end_time;//结束时间
					$date_sn = $item.date_sn;//期号
					var status = $item.status;//0待开奖 1已开奖
					var points = data.result.points;//用户 分数
					$page.find(".user_integral").html(points);


					if (!status) {	//待开奖状态

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
							timeDownToSS(		//本期未开奖
								current_time,
								end_time,
								function (sec) {
									$page.find(".time_down").show().html(sec + "s");
								},
								function () {
									$.Dialog.info("买定离手");

									//倒计时结束后
									$page.find(".time_down").html("开奖中");

									lottery.speed = 40;
									roll();//开始动画
								});
						}

					}
					else {	//已开奖状态
						$page.find(".time_down").html("开奖中");

						lottery.speed = 40;
						roll();//开始动画

					}

				},
				function (data) {
					console.log("获取 本期猜水果信息-----error：");
					console.log(data);

					//token过期 刷新token
					if (data.err_code == 20002) {

						Token.getRefeshToken(
							1,
							function () {
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

			if (!currentTime || !endTime) {
				throw "时间参数错误"
			}

			var intDiff = (endTime - currentTime) / 1000;
			console.info("倒计时：" + intDiff);

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

		//初始化 选择水果 图片
		var initChooseFruitImg = function () {
			$page.find(".row_1 .choose_fruit .ui-col").each(function () {

				var img_name = $(this).attr("data-img");
				var img_pure_url = "assets/image/game/csg/" + img_name + "_item.png";
				var img_choose_url = "assets/image/game/csg/" + img_name + "_choose.png";

				if ($(this).hasClass("active")) {
					$(this).find("img").attr("src", img_choose_url);
				}
				else {
					$(this).find("img").attr("src", img_pure_url);
				}

			});
		};

		var lottery = {
			index: -1,	//当前转动到哪个位置，起点位置
			count: 0,	//总共有多少个位置
			timer: 0,	//setTimeout的ID，用clearTimeout清除
			speed: 40,	//初始转动速度
			times: 0,	//转动次数
			cycle: 100,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
			prize: -1,	//中奖位置

			init: function (id) {
				if ($page.find("#" + id).find(".lottery-unit").length > 0) {
					var $lottery = $page.find("#" + id),
						$units = $lottery.find(".lottery-unit");
					this.obj = $lottery;
					this.count = $units.length;
					$lottery.find(".lottery-unit-" + this.index).addClass("active");
				}
			},

			roll: function () {
				var index = this.index;
				var count = this.count;
				var lottery = this.obj;

				$(lottery).find(".lottery-unit-" + index).removeClass("active");
				var img_name = $(lottery).find(".lottery-unit-" + index).attr("data-img");
				var img_url = "assets/image/game/csg/" + img_name + ".png";
				$(lottery).find(".lottery-unit-" + index).find("img").attr("src", img_url);

				index += 1;
				if (index > count - 1) {
					index = 0;
				}

				$(lottery).find(".lottery-unit-" + index).addClass("active");
				var img_name = $(lottery).find(".lottery-unit-" + index).attr("data-img");
				var img_url = "assets/image/game/csg/" + img_name + "_prize.png";
				$(lottery).find(".lottery-unit-" + index).find("img").attr("src", img_url);
//						$index.find("img")

				this.index = index;
				return false;
			},

			stop: function (index) {
				this.prize = index;
//						alert(this.prize)
				return false;
			}
		};

		//转动 动画
		var roll = function () {
			lottery.times += 1;
			lottery.roll();

			//抽奖完成 初始化数据
			if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
				if ($msg)
					$.Dialog.info($msg);//提示信息

				//getPrizeInfo();//
				clearTimeout(lottery.timer);
				lottery.prize = -1;
				lottery.times = 0;

				var time = 0;
				if ($time_count < 10000)
					time = 10000 - $time_count;
				setTimeout(function () {
					$time_count = 0;
					initData();//初始化 数据
				}, time)

			}
			else {
				if (lottery.times < lottery.cycle) {
					lottery.speed -= 10;
				}
				else if (lottery.times == lottery.cycle) {		//转了cycle圈后确定 礼品

					var getPrize = function () {
						var param = {
							date_sn: $date_sn
						};

						Api.getFruitInfo(
							param,
							function (data) {
								console.log("获取 猜水果中奖信息：");
								console.log(data);

								var $item = data.result;

								var bet_status = $item.bet_status;//下注状态 0未下注 1已下注
								var status = $item.status;//0待开奖 1已开奖
								var winning_fruit_id = $item.winning_fruit_id;//中奖水果 id
								var winning_status = $item.winning_status;//0未中奖 1已中奖

								//console.log(status);

								var watermelon_prize_array = [0, 8];
								var cherry_prize_array = [1, 4, 7, 11, 14];
								var apple_prize_array = [2, 5, 9, 13, 15];
								var lemon_prize_array = [3, 6, 12];
								var banana_prize_array = [10];

								var index = 0;//中奖 水果的位置

								if (winning_fruit_id == 1) {	//西瓜
									index = watermelon_prize_array[Math.floor(Math.random() *
										watermelon_prize_array.length)];
								}
								if (winning_fruit_id == 2) {
									index = cherry_prize_array[Math.floor(Math.random() *
										cherry_prize_array.length)];
								}
								if (winning_fruit_id == 3) {
									index = apple_prize_array[Math.floor(Math.random() *
										apple_prize_array.length)];
								}
								if (winning_fruit_id == 4) {
									index = lemon_prize_array[Math.floor(Math.random() *
										lemon_prize_array.length)];
								}
								if (winning_fruit_id == 5) {
									index = banana_prize_array[Math.floor(Math.random() *
										banana_prize_array.length)];
								}

								lottery.prize = index;

								if (status) {	//已开奖 (正常此时 都是 已开奖状态)

									if (!bet_status) {	//未下注
										$msg = "您没有参加此次抽奖！";
									}
									else if (winning_status) {	//已中奖
										$msg = "恭喜您中奖了！";
									}
									else {	//未中奖
										$msg = "很抱歉，本轮未中奖！";
									}

								}
								else {
									//$msg = "此时还未开奖。。。。";
								}

							},
							function (data) {
								console.log("获取 本期猜水果信息-----error：");
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

					getPrize();

				}
				else {

					if (lottery.times > lottery.cycle + 10 &&
						((lottery.prize == 0 && lottery.index == 7) ||
						lottery.prize == lottery.index + 1)) {	//最后一个 停止位置
						lottery.speed += 110;
					}
					else {
						lottery.speed += 5;
					}

				}

				if (lottery.speed < 40) {
					lottery.speed = 40;
				}
				if (lottery.speed > 100) {
					lottery.speed = 100;
				}

				$time_count += lottery.speed;

				console.log(lottery.times + '^^^^^^' + lottery.speed +
					'^^^^^^^' + lottery.prize + "----" + $time_count);
				lottery.timer = setTimeout(roll, lottery.speed);
			}
			return false;

		};


		return fruitView;
	});

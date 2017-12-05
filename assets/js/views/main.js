define(['zepto', 'underscore', 'backbone',
		'swiper', 'echo', 'app/api', 'dropload',
		'app/utils', 'app/scroll', 'app/basket',
		'text!templates/main.html'
	],

	function ($, _, Backbone, Swiper, echo, Api, _dropload, utils, scroll, basket, mainTemplate) {

		var $page = $("#main-page");
		var imageRenderToken = null;
		var $pageNum; //页码
		var $pageSize; //每页记录数
		var $announcedGoodType;
		var droploadType;
		var $dropload;
		var $directionFlag;
		var mainView = Backbone.View.extend({
			el: $page,
			render: function () {
				//utils.showMenu();
				utils.showPage($page, function () {
					$page.empty().append(mainTemplate);
					$(".main_contain").hide();
					$dropload = null;
					$pageNum = 1;//页码
					$announcedGoodType = 1;
					$directionFlag = 1;
					$pageSize = 10;//每页记录数
					//initEvent();//初始化轮播和进入二级页面事件

					initData();//初始化首页数据

				});
			},
			events: {

				"tap .text-tap": "textFunction",

				"tap .good_search": "goodSearch",

				//进入分类 、精选商品、晒单。。。
				"tap .tab_bar_list li": "tabBarList",

				//秒杀活动列表
				"tap .flash_more": "discountGoodList",

				//进入秒杀活动 某个商品具体详情
				"tap .special_offer_good_list li": "discountGoodDetail",

				//夺宝商品 详情
				"tap .announced_good_list li": "duobaoGoodInfo",

				//消息 中奖提醒 myMessage
				"tap .icon_message": "myMessage",

				//加入购物车
				"tap .add_to_shopping_cart": "addToShoppingCart",


			},

			textFunction: function () {
				console.log("text-tap");
			},

			goodSearch: function () {

				window.location.hash = "goodSearch";
			},

			tabBarList: function (e) {

				e.stopImmediatePropagation();

				$this = $(e.currentTarget);

				var href = $this.data("href");

				if (href) {
					window.location.hash = href;
				}

			},

			discountGoodList: function (e) {
				e.stopImmediatePropagation();
				
				var section = $(e.currentTarget).data("section");

				window.location.hash = "discountGoodList/" + section;
			},

			discountGoodDetail: function (e) {

				e.stopImmediatePropagation();

				$this = $(e.currentTarget);

				window.location.hash = "discountGoodInfo/" + $this.data("id");

			},

			//夺宝 商品性情
			duobaoGoodInfo: function (e) {

				e.stopImmediatePropagation();

				window.location.hash = "duobaoInfo/" + $(e.currentTarget).data("id");


			},

			myMessage: function () {

				window.location.hash = "myMessage";

			},

			//加入购物车
			addToShoppingCart: function (e) {
				e.stopImmediatePropagation();

				var id = parseInt($(e.currentTarget).parent().data("id"));

				var quantity = parseInt(1);
				var formData = "auction_id=" + id + "&" +
					"quantity=" + quantity;
				var param = {formData: formData};
				basket.addShoppingCart(param, function (data) {

					$.Dialog.success("添加成功");
				}, function () {

				});

			},

		});

		var initEvent = function () {

			//initSwiper();//初始化轮播图

			//获奖信息 上下轮播
			$(".bonus_record_list_container").myScroll({
				speed: 100,  //滚动速度,值越大速度越慢
				line: 1 //滚动的行数
			});


			//夺宝商品 按需排序
			$(".announced_type_list").find(".ui-col").each(function () {

				$(this).click(function () {
					//如果已经选中
					if ($(this).hasClass("active")) {
						$(this).siblings(".ui-col").removeClass("active");
					}
					else {
						$(this).addClass("active").siblings(".ui-col").removeClass("active");
					}


					var type = $(this).data("type");
					$announcedGoodType = type;
					var direction = $(this).data("direction");
					//console.log("type: " + type);
					//getIndianaGoods( direction);
					$directionFlag = direction
					$(".announced_good_list").empty();
					$pageNum = 1;
					$dropload = null;
					dropload.init();

				});
			});

		};

		//
		var getIndianaGoods = function ( direction) {
			if (!direction)direction = 1;
			if($announcedGoodType ==4 ){
				direction = $directionFlag;
			}
			var param = {
				page: $pageNum,
				page_size: $pageSize,
				type: $announcedGoodType,
				direction: direction,
			};
			//console.log(param);

			if ($announcedGoodType == 4 && $directionFlag == 1) {		//升序
				$page.find(".announced_type_list .icon_img_4")
					.find(".sort_up").addClass("active")
					.siblings().removeClass("active");
			}
			if ($announcedGoodType == 4 && $directionFlag == 2) {		//降序
				$page.find(".announced_type_list .icon_img_4")
					.find(".sort_down").addClass("active")
					.siblings().removeClass("active");
			}

			if (droploadType == "up") {

				$dropload.noData(false);
				$dropload.resetload();
				$dropload.unlock();
				dropload.init();
				return;
			}


			Api.getIndianaGoods(param,
				function (successData) {
					//console.log(successData);

					if (successData.result.data.length > 0) {

						var template = _.template($("#announced_good_item").html());
						$(".announced_good_list").append(template(successData.result));

						$pageNum++;

						$dropload.noData(false);
						$dropload.resetload();
						$dropload.unlock();
					} else {

						$dropload.noData(true);
						$dropload.resetload();
						$dropload.lock("down");
					}

					if ($announcedGoodType == 4) {
						//if (direction == 1) {
						//}
						direction = direction == 1 ? 2 : 1;
						$page.find(".announced_type_list .icon_img_4")
							.attr("data-direction", direction);
					}


				}, function (errorData) {


				});
		};

		//初始化首页数据
		var initData = function () {

			Api.getHomeData(null,
				function (successData) {
					console.info(successData);
					var template = _.template($("#main_item").html());
					$(".main_contain").empty().append(template(successData.result));
					$(".main_contain").show();
					utils.timeCountDown($(".time_count_down"), "main", null);
					asynLoadImage();
					bannerEvent();
					initEvent();//初始化轮播和进入二级页面事件

					//getIndianaGoods();//获取类型为“人气”的夺宝商品列表

					$(".announced_good_list").empty();
					$pageNum = 1;
					$dropload = null;
					dropload.init();

				},
				function (errorData) {

				});
		};

		var asynLoadImage = function () {
			echo.init({
				throttle: 250,
			});

			if (imageRenderToken == null) {
				imageRenderToken = window.setInterval(function () {
					echo.render();
				}, 350);
			}
		};

		var dropload = {
			init: function () {
				$dropload = $(".announced_good_list").dropload({
					scrollArea: window,
					loadDownFn: function (me) {
						droploadType = "down";
						if ($pageNum == 1) {
							$(".announced_good_list").empty();
						}
						getIndianaGoods();
					},
					loadUpFn: function (me) {
						droploadType = "up";
						$pageNum = 1
						$(".announced_good_list").empty();
						getIndianaGoods();
					}
				});
			},

			lock: function () {
				$dropload.lock();
			},

			reload: function () {
				$dropload.resetload();
			},

			reset: function (flag) {
				$pageNum = 1;
				flag = flag || false;
				$dropload.unlock("down");
				$dropload.noData(flag);
				$dropload.resetload();
			}
		};

		//初始化轮播图
		var bannerEvent = function () {

			var mySwiper = new Swiper('.banner_img_list', {
				initialSlide: 1,//设定初始化时slide的索引。
				direction: 'horizontal',//Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)
				speed: 300,//滑动速度，即slider自动滑动开始到结束的时间（单位ms）
				autoplay: 3000,//自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换。
				autoplayDisableOnInteraction: false,//用户操作swiper之后，是否禁止autoplay。默认为true：停止。
				grabCursor: true,//设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。
				setWrapperSize: true,//开启这个设定会在Wrapper上添加等于slides相加的宽高，在对flexbox布局的支持不是很好的浏览器中可能需要用到。
				//上一个,下一个
//                      nextButton: '.swiper-button-next',
//                      prevButton: '.swiper-button-prev',
				//pagination : '.swiper-pagination',
				//prevSlideMessage: 'Previous slide',
				//nextSlideMessage: 'Next slide',
				//firstSlideMessage: 'This is the first slide',
				//lastSlideMessage: 'This is the last slide',
				//paginationBulletMessage:'Go to slide {{index}}',
				slidesOffsetBefore: 0,//设定slide与左边框的预设偏移量（单位px）。
				slidesOffsetAfter: 0,//设定slide与右边框的预设偏移量（单位px）。
				freeMode: false,//默认为false   false：一次滑一个 true：滑到哪里算哪里
				freeModeSticky: true,//使得freeMode也能自动贴合。 滑动模式下也可以贴合
				//slidesPerView: 3,//一页 显示的个数
				effect: 'slide',//slide的切换效果，默认为"slide"（位移切换），"fade"（淡入）"cube"（方块）"coverflow"（3d流）。
				loop: true,
				//// 如果需要分页器
				pagination: '.swiper-pagination',
				//// 如果需要前进后退按钮
				//nextButton: '.swiper-button-next',
				//prevButton: '.swiper-button-prev',
				//// 如果需要滚动条
				//scrollbar: '.swiper-scrollbar',
				onTap: function (swiper) {
					var href = $(swiper.clickedSlide).data("href");
					if (href == "") {
						return;
					}
					//window.location.href = href;
					if (href.indexOf("=resale") > -1) {
						window.location.hash = "resale";
					}

					if (href.indexOf("=share") > -1) {
						window.location.hash = "share";
					}

					if (href.indexOf("=auctions") > -1) {
						utils.getUrl(href);
						var id = utils.storage.get("id");
						window.location.hash = "duobaoInfo/" + id;
					}
				}
			})

		};


		return mainView;
	});

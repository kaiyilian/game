define(
	[
		'zepto', 'jquery', 'underscore', 'backbone', 'urlGroup', 'spinner',
		'swiper', 'echo', 'app/api', 'app/basket',
		'app/utils', 'app/scroll',
		'text!templates/duobaoInfo.html'
	],

	function ($, Jquery, _, Backbone, UrlGroup, Spinner, Swiper, echo, Api, basket, utils, scroll,
			  duobaoInfoTemplate) {

		var $page = $("#duobao-info-page");

		var $good_no;//揭晓活动 商品编号
		var $duobao_info_item;//夺宝 详情页面
		var $attend_record_item;//参加记录 item
		var imageRenderToken;

		var remain;//商品剩余人次

		var duobaoInfoView = Backbone.View.extend({
			el: $page,
			render: function (good_no) {
				//utils.showMenu();
				utils.showPage($page, function () {
					$page.empty().append(duobaoInfoTemplate);

					$good_no = good_no;
					$duobao_info_item = $("#duobao_info_item");
					$attend_record_item = $("#attend_record_item");

					initData();//初始化数据

				});
			},
			events: {
				"tap .other_list > li": "GoPage",//
				"tap .btn_full_purchase": "buyInFullPrice",//全价购买
				"tap .btn_buy": "buyNowModalShow",//立即购买 弹框显示
				"tap .modal .remove": "buyNowModalHide",//立即购买 弹框隐藏
				"tap .modal .attend_count_list .item": "chooseAttendCount",//立即购买 参与人次数量
				"tap .btn_join_list": "joinShoppingCart",//加入清单
				"tap .modal .btn_sure": "buyNowSure",//立即购买 加入购物车后 跳转到清单页面
				"tap .btn_login": "GoLogin",//跳转到登录页面
				"tap .ui-icon-shoppingCart": "shoppingCart",//进入购物车
				"tap .btn_search_all": "searchAllNo",//查看全部 夺宝号码
				"tap .duobao_info_show":"shareDuobaoInfo",//分享

			},

			shareDuobaoInfo: function(e){
				e.stopImmediatePropagation();

				utils.showShareMask($("#duobao-info-page"));
			},

			shoppingCart: function () {

				window.location.hash = "shoppingCart";
			},

			//查看全部 夺宝号码
			searchAllNo: function () {
				var list = sessionStorage.getItem("personalNoList");
				$.Dialog.alert(list);

			},

			//进入具体的页面（图文详情、往期揭晓、晒单分享）
			GoPage: function (e) {

				e.stopImmediatePropagation();
				var $this = $(e.currentTarget);

				var href = $this.data("href");
				//alert(href)
				if (href) {
					if (href != "imgTxtDetail")
						href += "/" + $good_no;

					window.location.hash = href;
				}


			},

			//全价 购买
			buyInFullPrice: function (e) {
				//$good_no 	夺宝商品编号
				//$(e.currentTarget).data("goodid") 商品编号
				window.location.hash = "orderConfirm/" + $(e.currentTarget).data("goodid") + "/" + 1 + "/" + "duobao/" + $good_no;// 1：占位的作用
			},

			//立即购买 弹框显示
			buyNowModalShow: function () {
				//document.body.style.overflow = "hidden";

				$(".modal").show();//弹框显示

				if ($page.find(".modal").find(".spinner").length == 0) {

					//参与人次 加减插件初始化
					$page.find(".spinner_buy_count").spinner({
						min: 1,
						max: remain,
						add: function () {
							//alert("add:aa");
							totalPay();//计算 总共支付金额
						},
						del: function () {
							//alert("del:aa")
							totalPay();//计算 总共支付金额
						},
						blur: function () {
							//alert("blur:aa");
							totalPay();//计算 总共支付金额
						}
					});

				}
			},

			//立即购买 弹框隐藏
			buyNowModalHide: function () {
				document.body.style.overflow = "auto";

				$(".modal").hide();//弹框显示

			},

			//立即购买 参与人次数量
			chooseAttendCount: function (e) {
				e.stopImmediatePropagation();

				var $this = $(e.currentTarget);

				$this.addClass("active").siblings(".item").removeClass("active");
				var count = $this.html();
				$page.find(".modal").find(".spinner_buy_count").val(count);

				totalPay();//计算 总共支付金额
			},

			//加入清单
			joinShoppingCart: function () {

				var obj = new Object();
				obj.auction_id = $good_no;
				obj.quantity = $.trim($page.find(".modal .spinner_buy_count").val());

				var param = utils.jsonParseParam(obj);
				//alert(param);

				Api.shoppingCartAdd(
					param,
					function (data) {

						$.Dialog.success("添加成功");
						//$.Dialog.success("加入购物车成功", 1);
						basket.getShoppingCartNumber(0, function (number) {
							$(".shopping_cart_good_count").html(number);
						});
					},
					function (data) {
						//console.log("加入购物车：");
						//console.log(data);
					}
				);

			},

			//确认 立即购买
			buyNowSure: function () {

				var obj = new Object();
				obj.auction_id = $good_no;
				obj.quantity = $.trim($page.find(".modal .spinner_buy_count").val());

				var param = utils.jsonParseParam(obj);
				//alert(param);

				Api.shoppingCartAdd(
					param,
					function (data) {

						window.location.hash = "shoppingCart";

					},
					function (data) {
					}
				);
			},

			//跳转到登录页面
			GoLogin: function () {

				//alert(window.location.hash)
				utils.storage.set("loginSuccessBack", window.location.hash);
				//window.location.hash="login"
				window.location.href = window.LOGIN_REDIRECT_URL;

			}


		});

		//计算 总共支付金额
		var totalPay = function () {

			var unit_price = $page.find(".modal").find(".unit_price").data("price");
			var count = $page.find(".modal").find(".spinner_buy_count").val();
			var total = parseInt(unit_price) * parseInt(count);
			$page.find(".modal").find(".total_price").attr("data-price", total)
				.html(total + "梦想币");
		};


		//获取数据
		var initData = function () {

			var param = {
				good_no: $good_no
			};

			Api.getDuobaoInfo(
				param,
				function (data) {
					//alert(JSON.stringify(data));

					remain = data.result.remain;
					var template = _.template($duobao_info_item.html());
					$page.find(".duobao_info_container").empty()
						.append(template(data.result));

					//用户已经登录
					if (utils.isLogined()) {
						$page.find(".user_status_container").find(".not_login").hide();
					}
					else {
						$page.find(".user_status_container").find(".not_login").show()
							.siblings().hide()
					}

					sessionStorage.setItem("img_txt_detail", data.result.description);//图文详解

					//夺宝号码
					var sns = data.result.sns;
					var sns_list = "";
					if (sns && sns.length > 2) {

						for (var i = 0; i < sns.length; i++) {
							var item = sns[i];

							sns_list += "<span class='personal_no'>" + item + "</span>";

						}

						sessionStorage.setItem("personalNoList", sns_list);//夺宝号码 列表

					}

					initSwiper();//初始化轮播图
					initAttendRecord();//获取所有参与记录
					asynLoadImage();
					initNumber();//初始化购物车数据

				},
				function (data) {
					//alert(JSON.stringify(data));
					//console.log(JSON.stringify(data));
				}
			)
		};

		//初始化购物车数据
		var initNumber = function () {
			basket.getShoppingCartNumber(0, function (number) {
				$(".shopping_cart_good_count").html(number);
			});
		};

		//动态加载图片
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

		//获取所有参与记录
		var initAttendRecord = function () {

			var param = {
				auction_date_id: $good_no,
				page: "1",
				page_size: "10"
			};

			Api.getAttendRecord(
				param,
				function (data) {
					//alert(JSON.stringify(data));
					//console.log(data);

					var template = _.template($attend_record_item.html());
					$(".attend_record_list").empty().append(template(data.result));

					asynLoadImage();//动态 加载图片

				},
				function (data) {
					//alert(JSON.stringify(data));
				}
			)

		};

		//初始化轮播和进入二级页面事件
		var initEvent = function () {


		};

		//初始化轮播图
		var initSwiper = function () {

			var mySwiper = new Swiper('.good_img_list', {
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
			})

		};


		return duobaoInfoView;
	});

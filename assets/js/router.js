// Filename: router.js
define([
	'zepto',
	'underscore',
	'backbone',
	'app/utils',
	'app/basket'
], function ($, _, Backbone, utils, basket) {
	var Views = {};
	var app_router;
	var AppRouter = Backbone.Router.extend({

		initialize: function () {
			/**
			 * 登录回调URL
			 */
			window.LOGIN_REDIRECT_URL = utils.getLoginUrl("wxbe041ddacd1637df", window.ctx + "/login.html");

			utils.goBack({});  //初始化返回事件
			redirectFooterEvent();
			//basket.showCartPoint();
		},
		routes: {
			// Define some URL routes
			'main': 'loadMainPage',

			//揭晓
			'announced': 'loadAnnouncedPage',

			//揭晓 详情
			'announcedInfo(/:auction_id)(/:auction_date_id)': 'loadAnnouncedInfoPage',

			//夺宝商品 详情
			'duobaoInfo(/:good_no)': 'loadDuobaoInfoPage',

			//往期揭晓
			'pastAnnounced(/:good_no)': 'loadPastAnnouncedPage',

			//计算详情、夺宝规则 页面(纯文本)
			'winningRemark': 'loadWinningRemarkPage',

			//图文详解
			'imgTxtDetail': 'loadImgTxtDetailPage',

			//发现
			'find': 'loadFindPage',

			//梦想转盘
			'wheelprize': 'loadGameDzpPage',//大转盘

			//摇 骰子
			'dice': 'loadDicePage',//摇 骰子

			//猜水果
			'fruit': 'loadFruitPage',//猜水果


			//发现 心愿单
			'wishlist': 'loadWishListPage',

			//发现 填写心愿
			'myWish': 'loadMyWishPage',

			//清单
			'shoppingCart(/:foot)': 'loadshoppingCartPage',

			//商品结算
			'shoppingCartCalc(/:id)': 'loadshoppingCartCalcPage',

			//个人中心
			'my': 'loadMypage',

			//个人中心 设置
			'mySetting': 'loadMySettingPage',

			//个人中心 我的消息
			'myMessage': 'loadMyMessagePage',

			//个人中心 个人信息
			'personalInfo': 'loadPersonalInfoPage',

			//梦想币
			'myMxb': 'loadMyMxbPage',

			//所有红包列表
			'myPackage': 'loadMyPackagePage',

			//个人中心 夺宝记录
			'myAnnouncedRecord': 'loadMyAnnouncedRecordPage',

			//个人中心 夺宝记录 详情
			'myAnnouncedRecordInfo(/:order_id)': 'loadMyAnnouncedRecordInfoPage',

			//中奖纪录
			'prizeRecord': 'loadPrizeRecordPage',

			//中奖纪录详情
			'prizeDetail(/:orderId)': 'loadPrizeDetailPage',

			//个人中心 购买记录
			'myOrder': 'loadMyOrderPage',

			//订单详情
			'orderInfo(/:orderId)': 'loadOrderInfoPage',

			//个人中心 充值记录
			'rechargeRecord': 'loadRechargeRecordPage',

			//发现、个人中心、夺宝详情、揭晓详情 晒单列表
			'share(/:good_no)': 'loadSharePage',

			//中奖记录 晒单分享页面
			'shareOrder(/:auction_id)': 'loadShareOrderPage',

			//个人中心 晒单详情
			'shareOrderDetail(/:shareId)': 'loadShareOrderDetailPage',

			//个人中心 充值
			'recharge': 'loadRechargePage',

			//个人中心 收货地址管理
			'addressManage(/:comfrom)(/:id)': 'loadAddressManagePage',

			//新增收货地址
			'addressInfo(/:id)': 'loadAddressInfoPage',

			//修改昵称
			'nickName': 'loadNickNamePage',

			//修改密码
			'pwdModify': 'loadPwdModifyPage',

			//商品搜索
			'goodSearch': 'loadGoodSearch',

			//分类
			'categor': 'loadcategoryPage',

			//精选商品
			'specialGood': 'loadSpecialGoodPage',


			//签到
			'sign()': 'loadSignPage',

			//商品分类中 具体的商品
			'categoryGoodList(/:id)(/:name)': 'loadCateGoodListPage',

			//秒杀活动 列表
			'discountGoodList(/:section)': 'loadDiscountGoodListPage',

			//进入秒杀活动 某个商品具体详情
			'discountGoodInfo(/:id)(/:label)': 'loadDiscountGoodInfoPage',

			//确认订单
			'orderConfirm(/:id)(/:label)(/:type)(/:goodno)': 'loadOrderConfirmPage',//type 区分进入此页面的来源

			//支付订单
			'orderPay(/:type)(/:id)': 'loadOrderPayPage',

			//专卖商城
			'resellStore': 'loadResellStorePage',

			//查看转卖商品详情
			'resellGoodDetail(/:id)': 'loadResellGoodDetailPage',

			//积分
			'myIntegral': 'loadMyIntegralPage',

			//积分说明
			'pointsRemark': 'loadPointsRemarkPage',

			//积分兑换 梦想币
			'integralExchange': 'loadIntegralExchangePage',

			//绑定手机号 第一步
			'bindPhoneStep1': 'loadBindPhoneStep1Page',

			//绑定手机号 第二步
			'bindPhoneStep2(/:mobile)': 'loadBindPhoneStep2Page',

			//绑定手机号 第三步
			'bindPhone': 'loadBindPhonePage',

			//可用红包  type:选择红包的对象   shopping：购物车结算  flash:秒杀
			'coupon(/:type)': 'loadCouponPage',

			//转卖
			'resellCash(/:id)(/:platformDiscount)': 'loadResellCashPage',

			//常见问题
			'question': 'loadQuestionPage',

			//服务协议
			'agreement': 'loadAgreementPage',

			//隐私协议
			'privacy': 'loadPrivacyPage',

			//关于我们
			'aboutus': 'loadAboutUsPage',

			//支付成功
			'orderPaySuccess(/:type)':'loadOrderPaySuccessPage',

			//转卖商城
			'resale':'loadResalePage',

			//转卖商城详情
			'resellGoodDetail(/:id)':'loadResaleGoodDetailPage',


			// Default
			'': 'defaultAction',


		},

		defaultAction: function () {
			if (stopMain != null && !stopMain) {
				utils.showMenu();
				requirejs(['views/main'], function (main) {
					if (!Views.mainView) {
						Views.mainView = new main();
					}
					Views.mainView.render();
				});
			}
		},

		loadMainPage: function () {
			utils.activeMenu(1);
			utils.showMenu();
			requirejs(['views/main'], function (main) {
				if (!Views.mainView) {
					Views.mainView = new main();
				}
				Views.mainView.render();
			});
		},

		loadAnnouncedPage: function () {
			utils.activeMenu(2);
			utils.showMenu();
			requirejs(['views/announced'], function (announced) {
				if (!Views.announcedView) {
					Views.announcedView = new announced();
				}
				Views.announcedView.render();
			});
		},

		loadFindPage: function () {
			utils.activeMenu(3);
			utils.showMenu();
			requirejs(['views/find'], function (find) {
				if (!Views.findView) {
					Views.findView = new find();
				}
				Views.findView.render();
			});
		},

		//发现、个人中心、夺宝详情、揭晓详情 晒单列表
		loadSharePage: function (good_no) {
			utils.hideMenu();
			requirejs(['views/share'], function (share) {
				if (!Views.shareView) {
					Views.shareView = new share();
				}
				Views.shareView.render(good_no);
			});
		},

		//心愿单
		loadWishListPage: function () {
			utils.hideMenu();
			requirejs(['views/wishList'], function (wishList) {
				if (!Views.wishListView) {
					Views.wishListView = new wishList();
				}
				Views.wishListView.render();
			});
		},

		//大转盘
		loadGameDzpPage: function () {
			utils.hideMenu();
			requirejs(['views/gameDzp'], function (gameDzp) {
				if (!Views.gameDzpView) {
					Views.gameDzpView = new gameDzp();
				}
				Views.gameDzpView.render();
			});
		},

		//摇骰子
		loadDicePage: function () {
			utils.hideMenu();
			requirejs(['views/dice'], function (dice) {
				if (!Views.diceView) {
					Views.diceView = new dice();
				}
				Views.diceView.render();
			});
		},

		//猜水果
		loadFruitPage: function () {
			utils.hideMenu();
			requirejs(['views/fruit'], function (fruit) {
				if (!Views.fruitView) {
					Views.fruitView = new fruit();
				}
				Views.fruitView.render();
			});
		},

		loadMyWishPage: function () {
			utils.hideMenu();
			requirejs(['views/myWish'], function (myWish) {
				if (!Views.myWishView) {
					Views.myWishView = new myWish();
				}
				Views.myWishView.render();
			});
		},

		//加载清单
		loadshoppingCartPage: function (foot) {
			$("#announced-page").empty();
			if(foot){
				utils.activeMenu(4);
				utils.showMenu();
			}			
			requirejs(['views/shoppingCart'], function (shoppingCart) {
				if (!Views.shoppingCartView) {
					Views.shoppingCartView = new shoppingCart();
				}
				Views.shoppingCartView.render(foot);
			});
		},

		//清单 计算
		loadshoppingCartCalcPage: function (id) {
			//utils.activeMenu(4);
			utils.hideMenu();
			requirejs(['views/shoppingCartCalc'], function (shoppingCartCalc) {
				if (!Views.shoppingCartCalc) {
					Views.shoppingCartCalc = new shoppingCartCalc();
				}
				Views.shoppingCartCalc.render(id);
			});
		},

		//揭晓商品详情
		loadAnnouncedInfoPage: function (auction_id, auction_date_id) {
			utils.hideMenu();
			requirejs(['views/announcedInfo'], function (announcedInfo) {
				if (!Views.announcedInfoView) {
					Views.announcedInfoView = new announcedInfo();
				}
				Views.announcedInfoView.render(auction_id, auction_date_id);
			});
		},

		//夺宝商品 详情
		loadDuobaoInfoPage: function (good_no) {
			utils.hideMenu();
			requirejs(['views/duobaoInfo'], function (duobaoInfo) {
				if (!Views.duobaoInfoView) {
					Views.duobaoInfoView = new duobaoInfo();
				}
				Views.duobaoInfoView.render(good_no);
			});
		},

		//往期揭晓
		loadPastAnnouncedPage: function (good_no) {
			utils.hideMenu();
			requirejs(['views/pastAnnounced'], function (pastAnnounced) {
				if (!Views.pastAnnouncedView) {
					Views.pastAnnouncedView = new pastAnnounced();
				}
				Views.pastAnnouncedView.render(good_no);
			});
		},

		//计算详情、夺宝规则 页面(纯文本)
		loadWinningRemarkPage: function () {
			utils.hideMenu();
			requirejs(['views/winningRemark'], function (winningRemark) {
				if (!Views.winningRemarkView) {
					Views.winningRemarkView = new winningRemark();
				}
				Views.winningRemarkView.render();
			});
		},

		//图文详情
		loadImgTxtDetailPage: function () {
			utils.hideMenu();
			requirejs(['views/imgTxtDetail'], function (imgTxtDetail) {
				if (!Views.imgTxtDetailView) {
					Views.imgTxtDetailView = new imgTxtDetail();
				}
				Views.imgTxtDetailView.render();
			});
		},

		loadMypage: function () {
			utils.activeMenu(5);
			utils.showMenu();
			requirejs(['views/my'], function (my) {
				if (!Views.myView) {
					Views.myView = new my();
				}
				Views.myView.render();
			});
		},

		loadMySettingPage: function () {
			utils.hideMenu();
			requirejs(['views/mySetting'], function (mySetting) {
				if (!Views.mySettingView) {
					Views.mySettingView = new mySetting();
				}
				Views.mySettingView.render();
			});
		},

		loadMyMessagePage: function () {
			utils.hideMenu();
			requirejs(['views/myMessage'], function (myMessage) {
				if (!Views.myMessageView) {
					Views.myMessageView = new myMessage();
				}
				Views.myMessageView.render();
			});
		},

		loadPersonalInfoPage: function () {
			utils.hideMenu();
			requirejs(['views/personalInfo'], function (personalInfo) {
				if (!Views.personalInfoView) {
					Views.personalInfoView = new personalInfo();
				}
				Views.personalInfoView.render();
			});
		},

		loadMyMxbPage: function () {
			utils.hideMenu();
			requirejs(['views/myMxb'], function (myMxb) {
				if (!Views.View) {
					Views.myMxbView = new myMxb();
				}
				Views.myMxbView.render();
			});
		},

		loadMyPackagePage: function () {
			utils.hideMenu();
			requirejs(['views/myPackage'], function (myPackage) {
				if (!Views.View) {
					Views.myPackageView = new myPackage();
				}
				Views.myPackageView.render();
			});
		},

		//我的 夺宝记录
		loadMyAnnouncedRecordPage: function () {
			utils.hideMenu();
			requirejs(['views/myAnnouncedRecord'], function (myAnnouncedRecord) {
				if (!Views.myAnnouncedRecordView) {
					Views.myAnnouncedRecordView = new myAnnouncedRecord();
				}
				Views.myAnnouncedRecordView.render();
			});
		},

		//我的 夺宝记录 详情
		loadMyAnnouncedRecordInfoPage: function (order_id) {
			utils.hideMenu();
			requirejs(['views/myAnnouncedRecordInfo'], function (myAnnouncedRecordInfo) {
				if (!Views.myAnnouncedRecordInfoView) {
					Views.myAnnouncedRecordInfoView = new myAnnouncedRecordInfo();
				}
				Views.myAnnouncedRecordInfoView.render(order_id);
			});
		},

		loadPrizeRecordPage: function () {
			utils.hideMenu();
			requirejs(['views/prizeRecord'], function (prizeRecord) {
				if (!Views.prizeRecordView) {
					Views.prizeRecordView = new prizeRecord();
				}
				Views.prizeRecordView.render();
			});
		},

		loadPrizeDetailPage: function (orderId) {
			utils.hideMenu();
			requirejs(['views/prizeDetail'], function (prizeDetail) {
				if (!Views.prizeDetailView) {
					Views.prizeDetailView = new prizeDetail();
				}
				Views.prizeDetailView.render(orderId);
			});
		},

		loadMyOrderPage: function () {
			utils.hideMenu();
			requirejs(['views/myOrder'], function (myOrder) {
				if (!Views.myOrderView) {
					Views.myOrderView = new myOrder();
				}
				Views.myOrderView.render();
			});
		},

		loadOrderInfoPage: function (orderId) {
			utils.hideMenu();
			requirejs(['views/orderInfo'], function (orderInfo) {
				if (!Views.orderInfoView) {
					Views.orderInfoView = new orderInfo();
				}
				Views.orderInfoView.render(orderId);
			});
		},

		loadRechargeRecordPage: function () {
			utils.hideMenu();
			requirejs(['views/rechargeRecord'], function (rechargeRecord) {
				if (!Views.rechargeRecordView) {
					Views.rechargeRecordView = new rechargeRecord();
				}
				Views.rechargeRecordView.render();
			});
		},

		//中奖记录 晒单分享页面
		loadShareOrderPage: function (auction_id) {
			utils.hideMenu();
			requirejs(['views/shareOrder'], function (shareOrder) {
				if (!Views.shareOrderView) {
					Views.shareOrderView = new shareOrder();
				}
				Views.shareOrderView.render(auction_id);
			});
		},

		loadShareOrderDetailPage: function (shareId) {
			utils.hideMenu();
			requirejs(['views/shareOrderDetail'], function (shareOrderDetail) {
				if (!Views.shareOrderDetailView) {
					Views.shareOrderDetailView = new shareOrderDetail();
				}
				Views.shareOrderDetailView.render(shareId);
			});
		},

		loadRechargePage: function () {
			utils.hideMenu();
			requirejs(['views/recharge'], function (recharge) {
				if (!Views.rechargeView) {
					Views.rechargeView = new recharge();
				}
				Views.rechargeView.render();
			});
		},

		loadAddressManagePage: function (comfrom, id) {
			utils.hideMenu();
			requirejs(['views/addressManage'], function (addressManage) {
				if (!Views.addressManageView) {
					Views.addressManageView = new addressManage();
				}
				Views.addressManageView.render(comfrom, id);
			});
		},

		loadAddressInfoPage: function (id) {
			utils.hideMenu();
			requirejs(['views/addressInfo'], function (addressInfo) {
				if (!Views.addressInfoView) {
					Views.addressInfoView = new addressInfo();
				}
				Views.addressInfoView.render(id);
			});
		},

		loadNickNamePage: function () {
			utils.hideMenu();
			requirejs(['views/nickName'], function (nickName) {
				if (!Views.nickNameView) {
					Views.nickNameView = new nickName();
				}
				Views.nickNameView.render();
			});
		},

		loadPwdModifyPage: function () {
			utils.hideMenu();
			requirejs(['views/pwdModify'], function (pwdModify) {
				if (!Views.pwdModifyView) {
					Views.pwdModifyView = new pwdModify();
				}
				Views.pwdModifyView.render();
			});
		},

		loadGoodSearch: function () {
			utils.hideMenu();
			requirejs(['views/goodSearch'], function (goodSearch) {
				if (!Views.goodSearchView) {
					Views.goodSearchView = new goodSearch();
				}
				Views.goodSearchView.render();
			});
		},

		loadcategoryPage: function () {
			utils.hideMenu();
			requirejs(['views/category'], function (category) {
				if (!Views.categoryView) {
					Views.categoryView = new category();
				}
				Views.categoryView.render();
			})
		},

		loadSpecialGoodPage: function () {
			utils.hideMenu();
			requirejs(['views/specialGood'], function (specialGood) {
				if (!Views.specialGoodView) {
					Views.specialGoodView = new specialGood();
				}
				Views.specialGoodView.render();
			})
		},

		loadSignPage: function () {
			utils.hideMenu();
			requirejs(['views/sign'], function (sign) {
				if (!Views.signView) {
					Views.signView = new sign();
				}
				Views.signView.render();
			})
		},

		loadCateGoodListPage: function (id, name) {
			utils.hideMenu();
			requirejs(['views/categoryGoodList'], function (categoryGoodList) {
				if (!Views.categoryGoodListView) {
					Views.categoryGoodListView = new categoryGoodList();
				}
				Views.categoryGoodListView.render(id, name);
			});
		},

		loadDiscountGoodListPage: function (section) {
			utils.hideMenu();
			requirejs(['views/discountGoodList'], function (discountGoodList) {
				if (!Views.discountGoodListView) {
					Views.discountGoodListView = new discountGoodList();
				}
				Views.discountGoodListView.render(section);
			});
		},

		loadDiscountGoodInfoPage: function (id, label) {
			utils.hideMenu();
			requirejs(['views/discountGoodInfo'], function (discountGoodInfo) {
				if (!Views.discountGoodInfoView) {
					Views.discountGoodInfoView = new discountGoodInfo();
				}
				Views.discountGoodInfoView.render(id, label);
			});
		},

		loadOrderConfirmPage: function (id, label, type, goodno) {
			utils.hideMenu();
			requirejs(['views/orderConfirm'], function (orderConfirm) {
				if (!Views.orderConfirmView) {
					Views.orderConfirmView = new orderConfirm();
				}
				Views.orderConfirmView.render(id, label, type, goodno);
			});
		},

		loadOrderPayPage: function (type, id) {
			utils.hideMenu();
			requirejs(['views/orderPay'], function (orderPay) {
				if (!Views.orderPayView) {
					Views.orderPayView = new orderPay();
				}
				Views.orderPayView.render(type, id);
			});
		},

		loadResellStorePage: function () {
			utils.hideMenu();
			requirejs(['views/resellStore'], function (resellStore) {
				if (!Views.resellStoreView) {
					Views.resellStoreView = new resellStore();
				}
				Views.resellStoreView.render();
			});
		},

		loadResellGoodDetailPage: function (id) {
			utils.hideMenu();
			requirejs(['views/resellStoreDetail'], function (resellStoreDetail) {
				if (!Views.resellStoreDetailView) {
					Views.resellStoreDetailView = new resellStoreDetail();
				}
				Views.resellStoreDetailView.render(id);
			});
		},

		loadMyIntegralPage: function () {
			utils.hideMenu();
			requirejs(['views/myIntegral'], function (myIntegral) {
				if (!Views.myIntegralView) {
					Views.myIntegralView = new myIntegral();
				}
				Views.myIntegralView.render();
			});
		},

		//积分说明
		loadPointsRemarkPage: function () {
			utils.hideMenu();
			requirejs(['views/pointsRemark'], function (pointsRemark) {
				if (!Views.pointsRemarkView) {
					Views.pointsRemarkView = new pointsRemark();
				}
				Views.pointsRemarkView.render();
			});
		},

		loadIntegralExchangePage: function () {
			utils.hideMenu();
			requirejs(['views/integralExchange'], function (integralExchange) {
				if (!Views.integralExchangeView) {
					Views.integralExchangeView = new integralExchange();
				}
				Views.integralExchangeView.render();
			});
		},

		loadBindPhoneStep1Page: function () {
			utils.hideMenu();
			requirejs(['views/bindPhoneStep1'], function (bindPhoneStep1) {
				if (!Views.bindPhoneStep1View) {
					Views.bindPhoneStep1View = new bindPhoneStep1();
				}
				Views.bindPhoneStep1View.render();
			});
		},

		loadBindPhoneStep2Page: function (mobile) {
			utils.hideMenu();
			requirejs(['views/bindPhoneStep2'], function (bindPhoneStep2) {
				if (!Views.bindPhoneStep2View) {
					Views.bindPhoneStep2View = new bindPhoneStep2();
				}
				Views.bindPhoneStep2View.render(mobile);
			});
		},

		loadBindPhonePage: function () {
			utils.hideMenu();
			requirejs(['views/bindPhone'], function (bindPhone) {
				if (!Views.bindPhoneView) {
					Views.bindPhoneView = new bindPhone();
				}
				Views.bindPhoneView.render();
			});
		},

		loadCouponPage: function (type) {
			utils.hideMenu();
			requirejs(['views/coupon'], function (coupon) {
				if (!Views.couponView) {
					Views.couponView = new coupon();
				}
				Views.couponView.render(type);
			});
		},

		loadResellCashPage: function (id,platformDiscount) {
			utils.hideMenu();
			requirejs(['views/resellCash'], function (resellCash) {
				if (!Views.resellCashView) {
					Views.resellCashView = new resellCash();
				}
				Views.resellCashView.render(id,platformDiscount);
			});
		},

		//常见问题
		loadQuestionPage: function () {
			utils.hideMenu();
			requirejs(['views/question'], function (question) {
				if (!Views.questionView) {
					Views.questionView = new question();
				}
				Views.questionView.render();
			});
		},

		//服务协议
		loadAgreementPage: function () {
			utils.hideMenu();
			requirejs(['views/agreement'], function (agreement) {
				if (!Views.agreementView) {
					Views.agreementView = new agreement();
				}
				Views.agreementView.render();
			});
		},

		//隐私协议
		loadPrivacyPage: function () {
			utils.hideMenu();
			requirejs(['views/privacy'], function (privacy) {
				if (!Views.privacyView) {
					Views.privacyView = new privacy();
				}
				Views.privacyView.render();
			});
		},

		//关于我们
		loadAboutUsPage: function () {
			utils.hideMenu();
			requirejs(['views/aboutus'], function (aboutus) {
				if (!Views.aboutusView) {
					Views.aboutusView = new aboutus();
				}
				Views.aboutusView.render();
			});
		},

		//支付成功
		loadOrderPaySuccessPage: function (type) {
			utils.hideMenu();
			requirejs(['views/orderPaySuccess'], function (orderPaySuccess) {
				if (!Views.orderPaySuccessView) {
					Views.orderPaySuccessView = new orderPaySuccess();
				}
				Views.orderPaySuccessView.render(type);
			});
		},

		//转卖商城
		loadResalePage: function () {
			utils.hideMenu();
			requirejs(['views/resale'], function (resale) {
				if (!Views.resaleView) {
					Views.resaleView = new resale();
				}
				Views.resaleView.render();
			});
		},

		loadResaleGoodDetailPage: function (id) {
			utils.hideMenu();
			requirejs(['views/resaleGoodDetail'], function (resaleGoodDetail) {
				if (!Views.resaleGoodDetailView) {
					Views.resaleGoodDetailView = new resaleGoodDetail();
				}
				Views.resaleGoodDetailView.render(id);
			});
		},


	});

	var redirectFooterEvent = function () {

		//footer item点击事件
		$(".ui-footer").find(".ui-col").each(function () {
			$(this).click(function () {
				$(this).addClass("active").siblings(".ui-col").removeClass("active");
				if($(this).data("hash") == "shoppingCart"){
					window.location.hash = $(this).data("hash") + "/" + "foot"
				}else{
					window.location.hash = $(this).data("hash");
				}
				
			});
		});

		// $("#homepage").on("tap",function(){
		//     $(".footer button").removeClass("highlight");
		//     $(this).addClass("highlight");
		//     window.location.hash="main";
		// });
		// $("#product").on("tap",function(){
		//     $(".footer button").removeClass("highlight");
		//     $(this).addClass("highlight");
		//     window.location.hash="product";
		// });
		// $("#business").on("tap",function(){
		//     $(".footer button").removeClass("highlight");
		//     $(this).addClass("highlight");
		//     window.location.hash = "merchants";
		// });
		// $("#team").on("tap",function(){
		//     $(".footer button").removeClass("highlight");
		//     $(this).addClass("highlight");
		//     window.location.hash="excellentTeam";
		// });
		// $("#centrality").on("tap",function(){
		//     $(".footer button").removeClass("highlight");
		//     window.location.hash="agentCenter";
		// });
	};

	var initialize = function () {
		app_router = new AppRouter;
		Backbone.history.start();
	};

	var getCookie = function (name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	};

	var deleteCookie = function (name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = getCookie(name);
		if (cval != null)
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	};

	return {
		initialize: initialize
	};
});

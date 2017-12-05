
define(
	[
		'zepto', 'underscore', 'backbone',
		'swiper', 'echo', 'app/api', 'spinner',
		'app/utils', 'app/scroll', 'app/refreshtoken',
		'text!templates/shoppingCartCalc.html'
	],

	function ($, _, Backbone, Swiper, echo, Api, spinner, utils, scroll,  Token, shoppingCartCalcTemplate) {

		var $page = $("#shoppingCartCalc-page");
		var $cartCalcContainer;
		var $cartCalcItem;
		var $footer;
		var actualMoney;//应付金额
		var couponFreeMoney;//优惠券优惠金额
		var freeMoney;//总优惠金额
		var totalMoney;//总计
		var couponId;//优惠券编号
		var shoppingCartCalcView = Backbone.View.extend({

			el: $page,
			render: function (id) {
				//utils.showMenu();
				couponId = utils.storage.get("shoppintCouponId");
				utils.showPage($page, function () {
					$page.empty().append(shoppingCartCalcTemplate);//页面清空 放入 当前页模板	

					$cartCalcContainer = $page.find(".cart_calc_container");	
					$cartCalcItem = $page.find("#cart_calc_item");	
					$footer = $page.find(".footer_shopping_cart");	

					getShoppingCarts();
				});
			},
			events: {
				//提交订单
				"tap .btn_submit":"submit",
				//选择红包
				"tap .choose_package":"choosePackage",

			},

			submit: function(){
				//提交订单
				toSubmit();
				//window.location.hash="orderPay/" + "shopping" + "/" + couponId;
			},

			choosePackage: function(){

				window.location.hash = "coupon/" + "shopping";
			},


		});

		//得到清单列表
		var getShoppingCarts = function(){

			 Api.getShoppingCarts(null, function(successData){
			 		$cartCalcContainer.hide();
			 		$footer.hide();
            		var template = _.template($cartCalcItem.html());

		            $cartCalcContainer.empty().append(template(successData.result)).show();
		            $footer.show();

		            //计算下单金额
		            calculateOrderAmount();

            }, function( errorData){
                //token过期 刷新token
                if( errorData.err_code == 20002 ){
                    Token.getRefeshToken(1,function(data){
                        getShoppingCarts();
                    },function(data){
                    });
                }
            });

		};

		//计算下单金额
		var calculateOrderAmount =  function(){
			var coupon_id = "";
			if(couponId != null && couponId != ""){
				coupon_id = couponId;
			}
				var param = {coupon_id:coupon_id};

				Api.calculateOrderAmount(param, function(successData){
					var data = successData.result;
					actualMoney = data.actual_money;//应付金额
					couponFreeMoney = data.coupon_free_money;//优惠券优惠金额
					freeMoney = data.free_money;//总优惠金额
					totalMoney = data.total_money;//总计
					$(".real_pay_price").html(data.actual_money + "梦想币");
					$(".discount_total_price").html("- " +  data.coupon_free_money + "梦想币");
					if(data.coupon_free_money > 0){
						$(".package_item_choose").html("已使用1张 节省" + data.coupon_free_money + "梦想币").show()
					}
					$(".good_total_price").html(successData.result.total_money + "梦想币");

				}, function(errorData){

					//token过期 刷新token
	                if( errorData.err_code == 20002 ){
	                    Token.getRefeshToken(1,function(data){
	                        calculateOrderAmount();
	                    },function(data){
	                    });
	                }  else{
	                	window.history.go(-1);
	                }
				});
			
		};

		//提交订单
		var toSubmit = function(){
			var coupon_id = "";
			if(couponId != null && couponId != ""){
				coupon_id = couponId
			}
			var formData = "coupon_id=" + coupon_id;
			var param = {formData:formData};
			//提交购物车订单
			Api.submitShoppingOrder(param,function(successData){
				var data = successData.result;
				var shoppingOrderPay = {};//提交订单之后的信息
                shoppingOrderPay.balance = data.balance ;           //梦想币余额              
                shoppingOrderPay.current_time = data.current_time;  //当前时间             
                shoppingOrderPay.expire_time = data.expire_time;  //过期时间              
                shoppingOrderPay.need_pay = data.need_pay;         //应付金额       
                shoppingOrderPay.order_sn = data.order_sn;         //订单序列号       

                utils.storage.set("shoppingOrderPay",JSON.stringify(shoppingOrderPay));
                utils.storage.remove("shoppintCouponId");
				window.location.hash="orderPay/" + "shopping";
			}, function(errorData){

			});
		};


		return shoppingCartCalcView;

	}
);

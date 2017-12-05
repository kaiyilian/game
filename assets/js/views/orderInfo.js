define(['zepto', 'underscore', 'backbone',
		'swiper', 'echo', 'frozen', 'app/api',
		'app/utils', 'app/refreshtoken',
		'text!templates/orderInfo.html'
	],

	function ($, _, Backbone, Swiper, echo, frozen, Api, utils, Token, orderInfoTemplate) {

		var $page = $("#order-info-page");
		var imageRenderToken;
		var $categoryList;
		var orderId;
		var orderInfoView = Backbone.View.extend({
			el: $page,
			render: function (id) {
				orderId = id;
				utils.showPage($page, function () {
					//$page.empty().append(orderInfoTemplate);

					initData();
					
				});
			},
			events: {

				//取消订单
                "tap .cancel_order":"cancelOrder",
                //删除订单
                "tap .delete_order":"deleteOrder",
			    //立刻购买
                "tap .pay_money_now":"payMoney",
                //确认收货
                "tap .to_confirm_receipt":"confirmReceipt",
			},

			cancelOrder: function(e){

                e.stopImmediatePropagation();

                $this = $(e.currentTarget);

                toCancelOrder($this.parent().data("orderid"));

            },

            deleteOrder: function(e){

                e.stopImmediatePropagation();

                $this = $(e.currentTarget);

                toDeleteOrder($this.parent().data("orderid"));
            },

			payMoney: function(e){
                e.stopImmediatePropagation();
                var orderId = $(e.currentTarget).parent().data("orderid");
                window.location.hash = "orderPay/" + "myorder/" +  orderId;
            },


            confirmReceipt: function(e){

                e.stopImmediatePropagation();

                $this = $(e.currentTarget);

                toConfirmOrder($this.parent().data("orderid"));
            },


		});

		//初始化订单详情数据
		var initData = function(){

			var param = {order_id:orderId};

			Api.getOrderInfo(param, function(successData){

				var templata = _.template(orderInfoTemplate);

				$page.empty().append(templata(successData.result));

				asynLoadImage();

			}, function(errorData){

				//token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        initData();

                    },function(data){

                    });
                }
			});
		};

		//删除订单
        var toDeleteOrder = function(orderId){

            var param = {order_id:orderId};

            Api.deledeOrder(param, function(successData){

                $.Dialog.success("删除成功");

                window.history.go(-1);
            }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        toDeleteOrder(orderId);

                    },function(data){

                    });
                }

            });
        };

		//取消订单
        var toCancelOrder = function(orderId){
            var param = {order_id:orderId};

            Api.cancelOrder(param, function(successData){

                $.Dialog.success("取消成功");

                window.history.go(-1);
            }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        cancelOrder(orderId);

                    },function(data){

                    });
                }

            });

        };

        //确认收货
        var toConfirmOrder = function(orderId){

            var param = {order_id:orderId};

             Api.confirmReceipt(param, function(successData){

                $.Dialog.success("确认收货成功");

                 window.history.go(-1);
             }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        toConfirmOrder(orderId);

                    },function(data){

                    });
                }
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

		return orderInfoView;
	});

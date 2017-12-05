define(['zepto', 'underscore', 'backbone',
        'echo','app/api',
        'app/utils', 'app/jquery.spinner',
        'text!templates/orderPay.html'
    ],

    function($, _, Backbone, echo, Api, utils, Spinner, orderPayTemplate) {
        var $page = $("#order-confirm-page");
        var flshOrderPay;
        var duoBaoOrderPay;
        var thisType;
        var datas;
        var orderId
        var orderSn;//订单序列号
        var orderPayView = Backbone.View.extend({
            el: $page,
            render: function(type,id) {
                thisType = type;
                //utils.showMenu();
                //discountGoodId = id;
                utils.showPage($page, function() {
                    //$page.empty().append(orderPayTemplate);

                    
                    if(type == "shopping"){

                        datas = JSON.parse(utils.storage.get("shoppingOrderPay"));
                        orderSn = datas.order_sn;
                        initShoppingOrderData();
                    }

                    if(type == "flash"){

                        flshOrderPay  = JSON.parse(utils.storage.get("flshOrderPay"));
                        //orderSn = "161015160616400736";
                        initData();
                    }

                    if(type == "duobaoFull"){//夺宝全价购买支付

                        duoBaoOrderPay = JSON.parse(utils.storage.get("duoBaoFullOrderPay"));
                        orderSn = duoBaoOrderPay.order_sn;
                        initDuoBaoFullData();

                    }

                    if(type == "myorder"){//购买记录
                        orderId  =id;

                        var param = {order_id:orderId};
                        Api.getOrderPayInfo(param , function(successData){
                            var template = _.template(orderPayTemplate);
                            orderSn = successData.result.order_sn;
                            $page.empty().append(template(successData.result));

                            timeCountDown($(".count_down"));

                        }, function(errorData){

                        });

                    }


                });
            },
            events: {

                "tap .btn_recharge":"recharge",
                //确认支付
                "tap .btn_order_pay":"orderPay",
            }, 

            recharge: function(){

                window.location.hash = "recharge";
            } ,


            orderPay: function(){
                var param = {order_sn:orderSn};

                Api.orderPay(param, function(successData){

                    $.Dialog.success("支付成功");
                    if(thisType == "shopping"){
                        var shoppingPaySuccess = {};//夺宝商品支付成功 竞拍品信息
                        shoppingPaySuccess.auctions =  successData.result.auctions;//竞拍品信息
                        shoppingPaySuccess.goods_num = successData.result.goods_num;//购买商品数量
                        shoppingPaySuccess.join_count = successData.result.join_count;//总参与次数

                          utils.storage.set("shoppingPaySuccess",JSON.stringify(shoppingPaySuccess));
                          
                    }
                    window.location.hash = "orderPaySuccess/" + thisType;
                }, function(errorData){

                });
            },


        });

        var initShoppingOrderData = function(){

            var template = _.template(orderPayTemplate);

                $page.empty().append(template(datas));

                timeCountDown($(".count_down"));
        };

        var initData = function(){
            //确认订单 flshOrderPay
            var coupon_id  ="";
            if( flshOrderPay.coupon_id != null &&  flshOrderPay.coupon_id != ""){
                    coupon_id = flshOrderPay.coupon_id;
            }
            var formData = "address_id=" + flshOrderPay.address_id + "&" + 
                            "coupon_id=" + coupon_id + "&" + 
                            "flash_goods_id=" + flshOrderPay.flash_goods_id + "&" +
                            "section=" + flshOrderPay.section ;
            var param = {formData:formData};

            //确认订单
            Api.firmOrder(param, function(successData){

                orderSn = successData.result.order_sn;
                var template = _.template(orderPayTemplate);

                $page.empty().append(template(successData.result));
                //timeCountDown($(".time_count_down"));
            }, function(errorData){

                history.back();
            });
        };

        var initDuoBaoFullData = function(){
            var template = _.template(orderPayTemplate);

                $page.empty().append(template(duoBaoOrderPay));

                timeCountDown($(".count_down"));
        }
        
        var timeCountDown = function(self,flag){
            
            var current_time = $(self).data("currenttime");//当前时间
            var expire_time = $(self).data("expiretime");//结束时间

            if(!current_time || !expire_time){
                return;
            }
            current_time = current_time.replace(/\-/g, "/");  
            expire_time = expire_time.replace(/\-/g, "/");
            
            var currentTime = new Date(current_time).getTime();
            var expireTime = new Date(expire_time).getTime();

            var intDiff ;

            if(flag){
                intDiff = flag -20;
            }else {
                intDiff = expireTime - currentTime;
            }

            if(intDiff > 0){
                var ms = Math.floor(intDiff%1000/10);
               // console.log(ms);
                var sec = Math.floor(intDiff/1000%60);
                var min = Math.floor(intDiff/1000/60%60);
                var hour =Math.floor(intDiff/1000/60/60%24);

                hour = hour < 10 ? "0" + hour : hour;
                min = min < 10 ? "0" + min : min;
                sec = sec < 10 ? "0" + sec : sec;
                ms = ms < 10 ? "0" + ms : ms;

                //var count_down = hour + ":" + min + ":" + sec + ":" + ms;
                var count_down =  min + ":" + sec + ":" + ms;

                $(self).html(count_down);
            }else{
                $(self).html("时间结束");
                $(".btn_pay").removeClass("bg-ff6e2b").removeClass("btn_pay").addClass("ba-bfbfbf-css");
                return;
            }
            setTimeout(function () {
                timeCountDown(self, intDiff);
            }, 20)


        };
    return orderPayView;
    });

define(['zepto', 'underscore', 'backbone',
        'echo','app/api', 'app/refreshtoken',
        'app/utils', 'app/jquery.spinner',
        'text!templates/orderConfirm.html'
    ],

    function($, _, Backbone, echo, Api, Token, utils, Spinner, orderConfirmTemplate) {
        var $page = $("#order-confirm-page");
        var comFrom;//进入此页面的来源
        var discountGoodId;//秒杀商品编号
        var duoBaoGoodsId;//夺宝商品编号
        var resaleId;//转卖编号
        var resaleGoodId;//商品编号
        var goodsId;    //商品编号
        var section//时间段
        var imageRenderToken;
        var couponId = null;//优惠券编号
        var addressId = null;
        var quantity = 1;
        var orderConfirmView = Backbone.View.extend({
            el: $page,
            render: function(id,label,type,goodno) {
                //utils.showMenu();
                comFrom = type;
                discountGoodId = id;
                duoBaoGoodsId = goodno;
                resaleGoodId = id;
                resaleId = goodno;
                goodsId = id;
                section = label;
                couponId = utils.storage.get("flashCouponId");

                utils.showPage($page, function() {
                    $page.empty().append(orderConfirmTemplate);

                    addressId = utils.storage.get("orderConAddId");

                    getShowAddress();

                    if(comFrom == "duobao"){//夺宝商品 全价购买 d订单确认
                        //得到夺宝商品信息
                        getDuoBaoGoods();
                        //计算全价购买金额
                        setFullTlement(); 
                    } else if(comFrom == "resale"){
                        getResaleGoods();
                        //setResaleTlement(); 
                        setFullTlement();
                    }else{// 秒杀商品全价购买

                       
                        //得到秒杀商品信息
                        getFlashGoods();

                        //计算订单金额
                        settlement();  
                    }
                     

                    // if(couponId){
                    //     //计算订单金额 显示红包金额
                    //     settlement();   //结算
                    // }
                    //商品数量
                   // $(".buy_count").spinner();

                });
            },
            events: {
                //进入地址页面
                "tap .user_address_info":"addressInfo",
                //确认支付
                "tap .btn_pay":"pay",
                //选择红包
                "tap .choose_coupon":"coupon",
            },  

            //进入地址页面
            addressInfo: function(e){

                window.location.hash = "addressManage/" + "orderConfirm";

            },
            //确认支付
            pay: function(e){

                if(comFrom == "duobao" || comFrom == "resale"){
                    //夺宝商品全价购买下单
                    duoBaoGoodsFullSubmit();

                } else{//秒杀

                    var number =  $(".buy_count ").val();
                    var flshOrderPay = {};
                    flshOrderPay.address_id = $(".user_address_id").data("id") ;//地址编号              
                    flshOrderPay.coupon_id = couponId;  //优惠券编号             
                    flshOrderPay.flash_goods_id = discountGoodId;  //秒杀商品编号              
                    flshOrderPay.section = section;         //时间段       

                    utils.storage.set("flshOrderPay",JSON.stringify(flshOrderPay))

                    //TPDO  判断

                    window.location.hash = "orderPay/" + "flash";
                }

                

            },
            //选择红包
            coupon: function(e){

                window.location.hash = "coupon/" + "flash";
            },

        });

        //结算
        var settlement = function(){

            var coupon_id = "";

            if(couponId != null && couponId != ""){
                coupon_id = couponId;
            }

            var param = {coupon_id:coupon_id,flash_goods_id:discountGoodId,section:section};

            Api.settlement(param, function(successsData){

                var template = _.template($("#order_settlement_item").html());

                $(".order_settlement_container").empty().append(template(successsData.result));

                $(".confirm_actual_money").html("￥"+successsData.result.actual_money);
                utils.storage.remove("flashCouponId");

            }, function(errorData){


            });
        };

        //计算全价购买金额
        var setFullTlement = function(){
            var coupon_id = "";
            if(couponId != null && couponId != ""){
                coupon_id = couponId;
            }

            
            var param = {coupon_id:coupon_id,goods_id:goodsId,quantity:quantity};

            Api.getFullTlement(param, function(successData){

                var template = _.template($("#order_settlement_item").html());

                $(".order_settlement_container").empty().append(template(successData.result));

                $(".confirm_actual_money").html("￥"+(successData.result.actual_money).toFixed(2));

                

            }, function(errorData){

            });

        };

        var setResaleTlement = function(){

        }



        //夺宝商品全价购买下单
        var duoBaoGoodsFullSubmit = function(){

            var coupon_id = "";
            if(couponId != null && couponId != ""){
                coupon_id = couponId;
            }

            var formData = "address_id=" + $(".user_address_id").data("id") + "&" +
                            "coupon_id=" + coupon_id + "&" +
                            "goods_id=" + goodsId + "&" +
                            "quantity=" + quantity ;
            var param = {formData:formData}

            Api.duoBaoGoodsFullSubmit(param, function(successData){
                var data = successData.result;
                var duoBaoFullOrderPay = {};//夺宝商品全价提交订单之后的信息

                duoBaoFullOrderPay.balance = data.balance ;           //梦想币余额              
                duoBaoFullOrderPay.current_time = data.current_time;  //当前时间             
                duoBaoFullOrderPay.expire_time = data.expire_time;  //过期时间              
                duoBaoFullOrderPay.need_pay = data.need_pay;         //应付金额       
                duoBaoFullOrderPay.order_sn = data.order_sn;         //订单序列号  

                utils.storage.set("duoBaoFullOrderPay",JSON.stringify(duoBaoFullOrderPay));

                utils.storage.remove("flashCouponId");
                window.location.hash="orderPay/" + "duobaoFull";

            }, function(errorData){

            });
        };

        //得到显示地址
        var getShowAddress = function(){

            if(addressId != null && addressId != ""){
                //debugger
                var param = {id:addressId};
                Api.getAddress(param, function(successData){
                    var address = successData.result;
                    //展示地址
                    toShowAddress(1,address); //地址列表选择的地址 
                }, function(errorData){
                    //token过期 刷新token
                    if( errorData.err_code == 20002 ){

                        Token.getRefeshToken(1,function(data){//1 需要先判断是否登录  
                            
                            getShowAddress();

                        },function(data){
                        });
                    }
                });
            }else{

                Api.getAddressList(null, function(successData){
                    var address = successData.result.data;
                    if(address.length>0){
                        //展示地址
                        toShowAddress(0,address);                   
                    }

                }, function(errorData){

                    //token过期 刷新token
                    if( errorData.err_code == 20002 ){

                        Token.getRefeshToken(1,function(data){//1 需要先判断是否登录  
                            
                            getShowAddress();

                        },function(data){

                        });
                    }
                });
            }

            
        };

        //展示地址
        var toShowAddress = function(flag,address){
            var showAddressData;
            if(flag == 1){
                showAddressData =address;
            } else {
               showAddressData = address[0];//初始化是第一个地址
            
                _.each(address, function(item){//有默认地址
                    if(item.is_default == 1){
                       showAddressData = item;
                    }
                }); 
            }
            

            var template = _.template($("#user_address_item").html());

            $(".user_address_info").empty().append(template(showAddressData));

        };

        //得到夺宝商品信息
        var getDuoBaoGoods = function(){
            
            var param = {good_no:duoBaoGoodsId};

            Api.getDuobaoInfo(param, function(successData){

                var template = _.template($("#good-info-item").html());
                $(".good-info").empty().append(template(successData.result)) ;
                //商品数量
                $(".buy_count").spinner({
                    value:1,
                    min: 1,
                    max: 1,
                });              
                asynLoadImage();
            }, function(errorData){

            });
        };

        //得到转卖商品信息
        var getResaleGoods = function(){
            
            var param = {resale_id:resaleId};

            Api.getResalesInfo(param, function(successData){

                var template = _.template($("#good-info-item").html());
                $(".good-info").empty().append(template(successData.result)) ;
                //商品数量
                $(".buy_count").spinner({
                    value:1,
                    min: 1,
                    max: 1,
                });              
                asynLoadImage();
            }, function(errorData){

            });
        };

        //得到秒杀商品信息
        var getFlashGoods = function(){

            var param = {flash_goods_id:discountGoodId, section:section};
            Api.getFlashSaleInfo(param, function(successData){
                //set();
                successData.result.section = section;
                var template = _.template($("#good-info-item").html());
                $(".good-info").empty().append(template(successData.result)) ;
                //商品数量
                $(".buy_count").spinner({
                    value:1,
                    min: 1,
                    max: 1,
                });              
                asynLoadImage(); 
            }, function(errorData){


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
        }


        
    return orderConfirmView;
    });

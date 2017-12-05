define(['zepto', 'underscore', 'backbone', 'dropload',
        'swiper', 'echo','app/api', 'app/refreshtoken',
        'app/utils', 
        'text!templates/resellCash.html'
    ],

    function($, _, Backbone, _dropload, Swiper, echo, Api, Token, utils, resellCashTemplate) {
       
        var $page = $("#resell-cash-page");
        var imageRenderToken;
        var $goodInfoContainer;
        var $goodInfoItem;
        var $goodOriginalPrice;
        var account;         //收款账号
        var goodsRiginalCost;//商品原价
        var discount;        //折扣系数
        var goodsSellCost;   //最终售价
        var saleType;        // 出售方式   1 转卖给用户 2 转卖给平台 默认是1
        var platForm = 1;    //转账平台   1 支付宝 （当前直只有支付宝，默认1）
        var orderId;         //订单编号
        var realName;        // 收款信息
        var platformDiscount; //转卖平台折扣
        var resellCashView = Backbone.View.extend({
            el: $page,
            render: function(id,discount) {
                orderId = id;
                platformDiscount = discount;
                utils.showPage($page, function() {
                    $page.empty().append(resellCashTemplate);

                    saleType = 1;//1 转卖给用户
                    discount = discount = $(".good_discount_container").data("discount");
                    $goodInfoContainer = $page.find(".resell_cash_good_container");
                    $goodInfoItem = $page.find("#resell_cash_good_item");

                    $goodOriginalPrice=$page.find(".good_original_price");

                    

                    //初始化数据
                    initData();
                });
            },
            events: {

                //选择出售方式
                "change #sale_type":"chooseSaleType",  
                //填写折扣系数
                "tap .good_discount_mess":"selectDiscount",
                //确认转卖
                "tap .confirm_resell":"confirmResell",

            }, 

            chooseSaleType: function(e){

                var $this = $(e.currentTarget);
                saleType = $this.val();

                if(saleType == 2){//如果是转卖给平台 转卖折扣系数设置为后台返回值
                    $(".good_discount_mess").show();
                    $(".good_discount").hide();
                    $(".good_discount_mess").html("建议折扣：" + (parseFloat(platformDiscount).toFixed(1)));
                    discount = platformDiscount
                    goodsSellCost= parseFloat(goodsRiginalCost) * parseFloat(platformDiscount)/10;
                }else{
                    $(".good_discount_mess").hide();
                    $(".good_discount").show();

                    discount = $(".good_discount_container").data("discount");
                    goodsSellCost= parseFloat(goodsRiginalCost) * parseFloat(discount)/10;
                }

                $(".good_real_price").html("￥" + goodsSellCost.toFixed(2));
                $(".money").html("￥" + goodsSellCost.toFixed(2));

            },

            selectDiscount: function(e){
                e.stopImmediatePropagation();

                var $this = $(e.currentTarget);

            },

            confirmResell: function(){

                if(!verify()){
                    return;
                }

                //确认转卖
                toConfirmResell();

            },


        });
        //初始化买卖平台
        var initTradingPlatform = function(){

            //初始化转卖给用户
            $(".good_discount_mess").hide();
            $(".good_discount").show();

            discount = $(".good_discount_container").data("discount");
            goodsSellCost= parseFloat(goodsRiginalCost) * parseFloat(discount)/10;
            $(".good_real_price").html("￥" + goodsSellCost.toFixed(2));
            $(".money").html("￥" + goodsSellCost.toFixed(2));

            $page.find(".good_discount").blur(function (e) {
                        //console.log(e);
                        var $this = $(e.target);
                        var val = $.trim($this.val());
                        console.log("val " + val);
                        if(val == null || val ==""){
                            discount = $(".good_discount_container").data("discount");
                            goodsSellCost= parseFloat(goodsRiginalCost) * parseFloat(discount)/10;
                            $(".good_real_price").html("￥" + goodsSellCost.toFixed(2));
                            $(".money").html("￥" + goodsSellCost.toFixed(2));
                        }
                        if (isNaN(val)) {
                            $this.val("");
                        }
                        else {
                            //console.log(parseFloat(val));
                            if (parseFloat(val) >= 10) {
                                $this.val("");
                            }
                        }

                        discount = parseFloat(val);

                        if(discount>=0 && discount<=10){
                            goodsSellCost= parseFloat(goodsRiginalCost) * discount/10;
                            $(".good_real_price").html("￥" + goodsSellCost.toFixed(2));
                            $(".money").html("￥" + goodsSellCost.toFixed(2));

                        }
                        

                    })
        };

        //加载商品
        var initData = function(){

            param = {order_id:orderId};
            //中奖记录详情
            Api.getPrizeDetail(param, function(successData){

                goodsRiginalCost = successData.result.goods_price;//商品原价

                $goodOriginalPrice.html("￥" + goodsRiginalCost.toFixed(2));

                var template = _.template($goodInfoItem.html());

                $goodInfoContainer.empty().append(template(successData.result));

                asynLoadImage();

                //初始化买卖平台
                initTradingPlatform();

            }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        initData();

                    },function(data){

                        window.location.href = window.LOGIN_REDIRECT_URL;
                    });
                }

            });

        };

        var toConfirmResell = function(){

            var formData = "account=" + account + "&" +
                           "discount=" + discount + "&" + 
                           "platform=" + platForm + "&" + 
                           "realname=" + realName + "&" + 
                           "sale_type=" + saleType ;

            var param = {formData:formData,order_id:orderId}; 

            Api.confirmResell(param, function(successData){

                $.Dialog.success("提交转卖成功，等待处理");
                window.history.go(-1);
            }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        toConfirmResell();

                    },function(data){

                        window.location.href = window.LOGIN_REDIRECT_URL;
                    });
                }
            });
        };

        var verify = function(){

            account = $(".user_account input").val();
            realName = $(".user_name input").val();

            console.log(account);
            console.log(realName);

            if(account == ""){
                $.Dialog.info("请输入账号");
                return false;
            }

            if(realName == ""){
                $.Dialog.info("请输入姓名");
                return false
            }

            return true;


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


        
    return resellCashView;
    });

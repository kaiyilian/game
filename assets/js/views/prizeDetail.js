define(['zepto', 'underscore', 'backbone',
        'swiper', 'echo','app/api', 'app/refreshtoken',
        'app/utils', 'app/refreshtoken', 
        'text!templates/prizeDetail.html'
    ],

    function($, _, Backbone, Swiper, echo, Api, Token, utils, Token, prizeDetailTemplate) {
       
        var $page = $("#prize-pecord-page");
        var imageRenderToken = null;
        var $prizeDetailInfo;
        var $prizeDetailContainer;
        var isResell;//是否是转卖 1：是； 0:不是  默认  后台返回数据：receive_type 0 待兑奖 1 领取奖品 2 转卖
        var orderId;
        var platformDiscount;//转卖平台折扣
        var prizeDetailView = Backbone.View.extend({
            el: $page,
            render: function(id) {
                orderId = id;

                utils.showPage($page, function() {
                    $page.empty().append(prizeDetailTemplate);

                    isResell = 0;
                    $prizeDetailInfo = $page.find("#prize_detail_info");

                    $prizeDetailContainer = $page.find(".prize_detail_container");
                    $prizeDetailContainer.hide();
                    initData();
                });
            },
            events: {
                //立即领取
                "tap .btn_get":"receiveImmediately",
                //确认收货
                "tap .confirm_receipt":"confirmReceipt",
                //晒单分享
                "tap .prize_detail_share_order":"shareOrder",
                //转卖
                "tap .btn_resell_now":"btnResell",
                //收回转卖
                "tap .tak_back":"takeBack",
                //确认收账
                "tap .btn_confirm_receive":"btnConfirmReceive",

            }, 

            receiveImmediately: function(e){

                window.location.hash = "addressManage/" + "prizeDetail/" + orderId;
            },

            confirmReceipt: function(e){
                
                $.Dialog.confirm('', '确认收货？', function() {

                     //确认收货
                    toConfirmReceipt();
                    }, '取消', '确定');
            },

            shareOrder: function(e){

                window.location.hash = "shareOrder/" + orderId;
            },

            btnResell: function(e){

                window.location.hash = "resellCash/" + orderId + "/" + platformDiscount;
            },

            takeBack: function(e){
                //收回转卖
                $.Dialog.confirm('', '确认收回转卖商品？', function() {

                     toTakeBack();
                    }, '取消', '确定');
                
            },

            btnConfirmReceive: function(e){

                $.Dialog.confirm('', '确认收账？', function() {

                     toBtnConfirReceive();
                    }, '取消', '确定');
            },
        });

        //初始化数据
        var initData = function(){

            param = {order_id:orderId};
            //中奖记录详情
            Api.getPrizeDetail(param, function(successData){

            platformDiscount = successData.result.platform_discount;//  转卖平台折扣

            var template = _.template($prizeDetailInfo.html());

            $prizeDetailContainer.empty().append(template(successData.result)).show();

            asynLoadImage();

            }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        receiveImmediately(comFrom,comId);

                    },function(data){

                        window.location.href = window.LOGIN_REDIRECT_URL;
                    });
                }

            });
        };

        //确认收货
        var toConfirmReceipt = function(){
            var param = {order_id:orderId};

            Api.confirmReceipt(param, function(successData){

                $.Dialog.success("确认收货成功");
                initData();
            }, function(errorData){
                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        toConfirmReceipt();

                    },function(data){

                        
                    });
                }

            });
        };

        //收回转卖
        var toTakeBack = function(){
            var param = {order_id:orderId};

            Api.takeBack(param, function(successData){

                $.Dialog.success("收回转卖成功");

                initData();//刷新数据
            }, function(errorData){
                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        toTakeBack();

                    },function(data){

                        
                    });
                }

            });
        };

        //确认收账
        var toBtnConfirReceive = function(){

            Api.confirReceive(param, function(successData){
                $.Dialog.success("确认收账成功！");
                
                initData();
            }, function(errorData){
                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        toBtnConfirReceive();

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
        
    return prizeDetailView;
    });

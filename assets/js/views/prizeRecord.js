define(['zepto', 'underscore', 'backbone', 'dropload',
        'swiper', 'echo','app/api', 'app/refreshtoken',
        'app/utils', 
        'text!templates/prizeRecord.html'
    ],

    function($, _, Backbone, _dropload, Swiper, echo, Api, Token, utils, prizeRecordTemplate) {
       
        var $page = $("#prize-pecord-page");
        var type = 1;// 需要先判断是否登陆登陆
        var imageRenderToken;
        var $dropload;
        var $prizeRecordContainer;
        var $prizeRecordItem;
        var $pageNum; //页码
        var $pageSize; //每页记录数
        var prizeRecordView = Backbone.View.extend({
            el: $page,
            render: function() {
                $pageNum = 1;//页码
                $pageSize =4;//每页记录数
                utils.showPage($page, function() {
                    $page.empty().append(prizeRecordTemplate);

                    $prizeRecordContainer = $page.find(".prize_list");
                    $prizeRecordItem = $page.find("#prize_record_item");
                    //初始化dropload插件
                    dropload.init(); 

                });
            },
            events: {
                //中奖纪录详情
                "tap .prize_list li":"prizeDetail",
                //再次购买
                "tap .btn_next_buy":"btnNextBuy",

                "tap .btn_to_next_buy":"btnNextBuy",
                //确认收货
                "tap .btn_confirm_receipt":"btnConfirmReceipt",
                //立即领取
                "tap .btn_get":"btnGet",
                //转卖
                "tap .btn_resell":"btnResell",
                //收回专卖
                "tap .btn_take_back":"btnTakeBack",
                //确认收账
                "tap .btn_confir_receive":"btnConfirReceive",
                //晒单分享
                "tap .btn_share_order":"shareOrder"
              
            }, 
            //中奖纪录详情
            prizeDetail: function(e){

                e.stopImmediatePropagation();

                window.location.hash = "prizeDetail/" + $(e.currentTarget).data("id");
            },

            //再次购买
            btnNextBuy: function(e){
                e.stopImmediatePropagation();
                var auctionId = $(e.currentTarget).parent().data("auction_id");
                window.location.hash = "duobaoInfo/" + auctionId;
            },

            //确认收货
            btnConfirmReceipt: function(e){
                e.stopImmediatePropagation();

                var orderId = $(e.currentTarget).parent().data("id");

                toConfirmReceipt(orderId);
            },

            //立即领取
            btnGet: function(e){
                e.stopImmediatePropagation();

                var orderId = $(e.currentTarget).parent().data("id");

                window.location.hash = "addressManage/" + "prizeRecord/" + orderId;
            },

            //转卖
            btnResell: function(e){
                e.stopImmediatePropagation();

                var platformDiscount = $(e.currentTarget).parent().data("platform_discount");//转卖平台折扣

                var orderId = $(e.currentTarget).parent().data("id");//订单编号

                window.location.hash = "resellCash/" + orderId + "/" + platformDiscount;
            },

            //收回转卖
            btnTakeBack: function(e){
                e.stopImmediatePropagation();
                
                var orderId = $(e.currentTarget).parent().data("id");//订单编号

                $.Dialog.confirm('', '确认收回转卖商品？', function() {

                     toBtnTakeBack(orderId); 
                    }, '取消', '确定');
                //收回转卖
                
            },

            //确认收账
            btnConfirReceive: function(e){
                e.stopImmediatePropagation();

                var orderId = $(e.currentTarget).parent().data("id");//订单编号

                $.Dialog.confirm('', '确认收账', function() {

                     toBtnConfirReceive(orderId); 
                    }, '取消', '确定');
            },

            //晒单分享
            shareOrder: function(e){
                e.stopImmediatePropagation();

                var orderId = $(e.currentTarget).parent().data("id");//订单编号

                window.location.hash = "shareOrder/" + orderId;
            },

        });

        //确认收货
        var toConfirmReceipt = function(orderId){
            var param = {order_id:orderId};


            Api.confirmReceipt(param, function(successData){

                $.Dialog.success("确认收货成功");

                refreshDatas();
                 
            }, function(errorData){
                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        toConfirmReceipt(orderId);

                    },function(data){

                        
                    });
                }

            });
        };

        //确认收账
        var toBtnConfirReceive = function(orderId){

            var param = {order_id:orderId};

            Api.confirReceive(param, function(successData){
                $.Dialog.success("确认收账成功！");
                
                refreshDatas();
            }, function(errorData){
                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        toBtnConfirReceive(orderId);

                    },function(data){

                        
                    });
                }
            });
        }; 

        //收回转卖
        var toBtnTakeBack = function(orderId){

            var param = {order_id:orderId};

            Api.TakeBackResellCash(param, function(successData){

                $.Dialog.success("收回转卖成功");
                $pageNum = 1;//页码
                $pageSize =4;//每页记录数
                $dropload = null;
                $prizeRecordContainer.empty();
                dropload.init(); 
            }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        toBtnTakeBack(orderId);

                    },function(data){

                        
                    });
                }
            });
        };


        //中奖记录列表
        var getPrizeRecordList = function(){

            if(type =="up"){

                $dropload.noData(false);
                $dropload.resetload();
                $dropload.unlock();
                dropload.init(); 
                return;
            }

            var param = {page:$pageNum, page_size:$pageSize};

            //中奖记录
            Api.getPrizeRecordList( param, function(successData){

                if(successData.result.data.length>0){
                    var template = _.template($prizeRecordItem.html());
                    $prizeRecordContainer.hide();
                    $prizeRecordContainer.append(template(successData.result)).show();  
                    $pageNum++;
                    asynLoadImage();
                    $dropload.noData(false);
                    $dropload.resetload();
                    $dropload.unlock();
                }else {
                    $dropload.noData(true);
                    $dropload.resetload();
                    $dropload.lock("down");
                }
            }, function(errorData){
                
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(type,function(data){

                        getPrizeRecordList();

                    },function(data){

                        
                    });
                }

            });
        };

        var dropload = {
            init : function(){
                $dropload = $('.prize_list').dropload({
                      scrollArea : window,
                      loadDownFn : function(me){//上拉加载

                        type="down";
                        // debugger
                        console.log("down");
                          if($pageNum == 1){
                              $prizeRecordContainer.empty();
                          }
                          //getShoppingCartNumber();                                                                             
                          getPrizeRecordList();
                      },
                      loadUpFn : function(me){//下拉刷新
                        type="up";
                        console.log("up");
                        $pageNum = 1;

                        //$shoppingCartGoodCount.html(basket.getShoppingCartNumber(0));
                        $prizeRecordContainer.empty()
                        getPrizeRecordList();
                        //getShoppingCartNumber();
                      }
                });
            },

            lock : function(){
                $dropload.lock();
            },

            reload : function(){
                $dropload.resetload();
            },

            reset : function(flag){
                $pageNum = 1;
                flag = flag || false;
                $dropload.unlock("down");
                $dropload.noData(flag);
                $dropload.resetload();
            }
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

        //刷新页面
        var refreshDatas = function(){

            $pageNum = 1;//页码
            $pageSize =4;//每页记录数
            $dropload = null;
            $prizeRecordContainer.empty();
            dropload.init(); 
        };


        
    return prizeRecordView;
    });

define(['zepto', 'underscore', 'backbone',
        'swiper', 'echo', 'frozen', 'app/api',
        'app/utils', 'app/refreshtoken', 'dropload',
        'text!templates/myOrder.html'
    ],

    function($, _, Backbone, Swiper, echo, frozen, Api, utils, Token, _dropload, myOrderTemplate) {
       
        var $page = $("#my-order-page");
        var listType;//1:全部 2:待支付 3:待发货 4:待收货 默认1
        var $dropload;
        var imageRenderToken;
        var $categoryList;
        var $orderListContainer;
        var $orderListItem;
        var $pageNum;
        var $pageSize;
        var myOrderView = Backbone.View.extend({
            el: $page,
            render: function(id, name) {
                utils.showPage($page, function() {
                    $page.empty().append(myOrderTemplate);

                    $orderListItem = $page.find("#order_list_item");
                    

                    $pageNum = 1;
                    $pageSize = 4;

                    recordType = 1;
                    $orderListContainer = $page.find(".order_all"); //初始化 全部
                    //初始化数据
                    initOrderList();


                });
                initTab();
            },
            events: {
              //订单详情
              "tap ul.order_list li":"orderInfo",
              //删除订单
              "tap .delete_order":"deleteOrder",
              //取消订单
              "tap .cancel_order":"cancelOrder",
              //立刻购买
              "tap .pay_money_now":"payMoney",
              //确认收货
              "tap .confirm_receipt":"confirmReceipt",

            }, 

            orderInfo: function(e){

                e.stopImmediatePropagation();

                $this = $(e.currentTarget);

                window.location.hash = "orderInfo/" + $this.data("orderid");
            },

            deleteOrder: function(e){

                e.stopImmediatePropagation();

                $this = $(e.currentTarget);

                toDeleteOrder($this.parent().data("orderid"));
            },

            cancelOrder: function(e){

                e.stopImmediatePropagation();

                $this = $(e.currentTarget);

                toCancelOrder($this.parent().data("orderid"));

            },

            payMoney: function(e){
                e.stopImmediatePropagation();
                var orderId = $(e.currentTarget).parent().data("orderid");
                window.location.hash = "orderPay/" + "myorder/" +  orderId;
            },

            confirmReceipt: function(e){
                e.stopImmediatePropagation();
                 var orderId = $(e.currentTarget).parent().data("orderid");
                 toconfirmReceipt(orderId);
            },

        });

        //确认收货
        var toconfirmReceipt = function(orderId){

             var param = {order_id:orderId};

             Api.confirmReceipt(param, function(successData){

                $.Dialog.success("确认收货成功");

                initOrderList();
             }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        toconfirmReceipt(orderId);

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

               initOrderList();
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

                initOrderList();
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

        //初始化数据
        var initOrderList = function(){
            
            $pageNum =1;
            $orderListContainer.empty();
            //初始化dropload插件
            $dropload = null;
            dropload.init();
        };

        //fz UI 
        var initTab = function(){
			utils.clearTab("my-order-page");
            //滑动效果
                var tab = new fz.Scroll('.ui-tab', {
                        role: 'tab',
                        autoplay: false
                });

                tab.on('scrollEnd', function (curPage) {
                        if (curPage == 0) {         //全部订单

                            $orderListContainer = $page.find(".order_all"); 
                            recordType = 1;
                        }
                        if (curPage == 1) {         //待付款 订单

                            $orderListContainer = $page.find(".order_be_pay"); 
                            recordType = 2;
                        }
                        if (curPage == 2) {         //待发货 订单

                            $orderListContainer = $page.find(".order_be_send"); 
                            recordType = 3;
                        }
                        if (curPage == 3) {         //待收货 订单

                            $orderListContainer = $page.find(".order_be_receive");
                            recordType = 4; 
                        }

                        $orderListContainer.empty();
                        $pageNum = 1;
                        $dropload = null;
                        dropload.init();
                });
        };
        //1:全部 2:待支付 3:待发货 4:待收货
        //购买记录
        var orderList = function(){
            if(droploadType =="up"){

                $dropload.noData(false);
                $dropload.resetload();
                $dropload.unlock();
                dropload.init(); 
                return;
            }

            var param = {type:recordType, page:$pageNum, page_size:$pageSize};

            Api.getOrderList(param, function(successData){

                if(successData.result.data.length>0){
                    var template = _.template($orderListItem.html());

                    $orderListContainer.append(template(successData.result));
                    $pageNum++;
                    $dropload.noData(false);
                    $dropload.resetload();
                    $dropload.unlock();
                    asynLoadImage();
                }else{
                    $dropload.noData(true);
                    $dropload.resetload();
                    $dropload.lock("down");
                }
                
            }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        orderList();

                    },function(data){

                    });
                }
            });
        };

        //刷新
        var dropload = {
            init : function(){
                //$dropload = $('.income_record').dropload({
                $dropload = $orderListContainer.dropload({
                      scrollArea : window,
                      loadDownFn : function(me){
                        droploadType="down";
                        if($pageNum == 1 ){
                            $orderListContainer.empty();
                        }

                        orderList();
                      },
                      loadUpFn : function(me){
                        droploadType="up";
                        $pageNum = 1;

                        $orderListContainer.empty();
                        orderList();
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
        
    return myOrderView;
    });

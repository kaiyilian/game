define(['zepto', 'underscore', 'backbone',
        'swiper', 'echo','app/api', 'app/refreshtoken',
        'app/utils', 
        'text!templates/discountGoodList.html'
    ],

    function($, _, Backbone, Swiper, echo, Api, Token, utils, discountGoodListTemplate) {
       
        var $page = $("#discount-good-list");
        var currentId;
        var otherType = 1;
        var flashGoods ;
        var imageRenderToken;
        var $flashGoodsInfoItem;
        var $flashGoodsInfoContain;
        var $flashGoodsContain;
        var $flashGoodsItem;
        var $currentTime;
        var $section;//秒杀时间段
        var position;//秒杀商品的位置
        var handler;
        var $startTime;//开始时间
        var discountGoodListView = Backbone.View.extend({
            el: $page,
            render: function(sec) {
                $section = sec;

                //utils.showMenu();
                utils.showPage($page, function() {
                    $page.empty().append(discountGoodListTemplate);
                    $(".discount_good_list").hide();

                    $flashGoodsInfoItem = $page.find("#flash_goods_info_item");
                    $flashGoodsInfoContain = $page.find(".flash_goods_info_contain");
                    flashGoods = null;
                    initData($section);
                    
                });
            },
            events: {
                //获取不同时间段的 抢购商品
                "tap .activity_time_list .swiper-slide":"timeListChoise",
                //获取具体商品的详情
                "tap .good_list li":"discountGoodInfo",
                //获得抢购权
                "tap .get_right_to_buy":"getRightToBuy",
                //抢购
                "tap .to_panic_buy":"rushToPurchase",
              
            },

            timeListChoise: function(e){

                e.stopImmediatePropagation();

                $this = $(e.currentTarget);

                $this.addClass("active").siblings(".swiper-slide").removeClass("active");

                var startTime = $this.data("starttime");

                var endTime   = $this.data("endtime");

                $(".count_down").data("time",startTime);

                //utils.timeCountDown($(".time_count_down"));

                var id = $this.data("id");

                currentId = id;

                //展示秒杀商品
                showFlashGoods(id);

            }, 

            discountGoodInfo: function(e){

                e.stopImmediatePropagation();

                $this = $(e.currentTarget);

                var id = $this.data("id");

                var label = $this.data("label");

                window.location.hash = "discountGoodInfo/" + id + "/" + label;
            },

            getRightToBuy: function(e){
                e.stopImmediatePropagation();
                $this = $(e.currentTarget);
                var flash_goods_id = $this.parents("li").data("id");
                var section = $this.parents("li").data("label");
                var balance ;//梦想币

                getMemberInfo(flash_goods_id,section);
                
                
            },

            //抢购
            rushToPurchase: function(e){
                e.stopImmediatePropagation();
                $this = $(e.currentTarget);

                var id = $this.parent().data("id");

                var label = $this.parent().data("label");
                
                window.location.hash = "orderConfirm/" + id + "/" + label;
            },

        });

        //得到个人信息 梦想币余额
        var getMemberInfo = function(flash_goods_id,section){
            Api.getMemberInfo(null,function(){
                },function(successData){

                    balance = successData.result.balance;
                    $.Dialog.confirm('支付10梦想币获取抢购权', '当前余额：'+ balance + '梦想币', function() {

                        toGetRightToBuy(flash_goods_id, section);
                      
                    }, '取消', '确定');
                }, function(errorData){

                    if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(otherType,function(data){

                        getMemberInfo();

                    },function(data){


                    });
                }
                });
        };


        var initData = function($section){
            
            Api.getFlashSale(null, function( successData ){              

                $currentTime = successData.result.current_time;

                toInitData(successData, $section);
            }, function( errorData ){

            });   

            
        };

        //得到抢购权
        var toGetRightToBuy = function(flash_goods_id, section){
            var formData = "section=" + section;
            var param = {formData:formData, flash_goods_id:flash_goods_id};

            Api.toGetRightToBuy(param, function(successData){

                $.Dialog.success("支付成功，已经获得抢购权抢购权");

                //展示秒杀商品
                showFlashGoods(currentId);
            }, function(errorData){

                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(otherType,function(data){

                        toGetRightToBuy();

                    },function(data){


                    });
                }
            });
        };

        var toInitData = function(successData, $section){

                flashGoods = successData.result.sections;

                successData.result.section = $section;

                var template = _.template($flashGoodsInfoItem.html());

                $flashGoodsInfoContain.empty().append(template(successData.result));

                $(".discount_good_list").show();

                //utils.timeCountDown($(".time_count_down"));

                

                $flashGoodsContain = $page.find(".flash_goods_contain");

                $flashGoodsItem = $page.find("#flash_goods_item");

                //根据时间段判断 当前时间段在 flashGoods中的位置
                position = getPosition(flashGoods, $section);

                showFlashGoods(position);

                initSwiper();
        };

        var getPosition = function(flashGoods, $section){
            var position = 0;
            
            for(var i=0 ;i<flashGoods.length; i++){
                var section = flashGoods[i];

                if($section == section.label){

                    position = i;
                    break ;
                }
            }

            return position;
        };

        //展示秒杀商品
        var showFlashGoods = function(id){

              var flashGoodsData = flashGoods[id]; 
              //$currentTime
              var status = flashGoodsData.status;
              $startTime = flashGoodsData.start_time;
              var endtime = flashGoodsData.end_time;

              Api.getFlashSale(null, function( successData ){              

                    $currentTime = successData.result.current_time;

                    var  showHtml = ((status)==1 ? '距开始': (status == 2 ? '距结束' : '已结束')) + 
                    "<span class='count_down time_count_down' data-currenttime='" + 
                    $currentTime + 
                    "' data-starttime='"+ $startTime +
                    "' data-endtime='"+ endtime +"' data-sss='"+$startTime+"'></span>";

                    $(".discount_good_list_time").empty().append(showHtml);

                    // setTimeout(function () {
                        
                    // }, 1000);
                    if(handler){
                        window.clearInterval(handler); 
                    }
                    timeCountDown($(".time_count_down"),status,function(){

                        showFlashGoods(currentId);        
                    });
                    //utils.timeCountDown($(".time_count_down"),"flashSale",status);

                    flashGoodsData = successData.result.sections[id];

                    var template = _.template($flashGoodsItem.html());

                    $flashGoodsContain.empty().append(template(flashGoodsData));
                    
                    asynLoadImage();
                }, function( errorData ){

                });                        
        };

        //倒计时
        var timeCountDown = function(self,status,toEnd){


            var start = $(self).attr("data-starttime");//开始时间
             start = $(self).attr("data-starttime");//开始时间
            var end = $(self).attr("data-endtime");//结束时间
            var now = $(self).attr("data-currenttime");//当前系统时间
           
            if (!now) {
                return
            }
            if($startTime){
                $startTime = $startTime.replace(/\-/g, "/"); 
            }

            if(end){
                end = end.replace(/\-/g, "/");
            }

            if(now){
                now = now.replace(/\-/g, "/");
            } 
            var currentTime = new Date(now).getTime();
            var startTime = new Date($startTime).getTime();
            var endTime = new Date(end).getTime();

            var intDiff;

            if (status == 1) {//即将开始
                intDiff = (startTime - currentTime) / 1000;
            } else if (status == 2) {//抢购中
                intDiff = (endTime - currentTime) / 1000;
            } else {//已结束

            }

            if(intDiff > 0){
                showTime(self,intDiff);
            }else{
               $(self).html(""); 
               return;
            }

            handler = window.setInterval(function () {
                intDiff = intDiff-1;

                if(intDiff > 0){
                    showTime(self,intDiff);
                }else{
                    //$(self).html("时间结束");
                    $(self).html("");
                   // $(".btn_pay").removeClass("bg-ff6e2b").removeClass("btn_pay").addClass("ba-bfbfbf-css");
                    window.clearInterval(handler);
                    typeof toEnd == 'function' && toEnd();
                    return;
                }
                        
                        
            }, 1000);
                
        };

        var showTime = function(self,intDiff){
                var second = Math.floor(intDiff % 60);
                var minute = Math.floor((intDiff / 60) % 60);
                var hour = Math.floor((intDiff / 3600));
                hour = hour < 10 ? "0" + hour : hour;
                minute = minute < 10 ? "0" + minute : minute;
                second = second < 10 ? "0" + second : second;

                var count_down = hour + ":" + minute + ":" + second;
                $(self).html(count_down);
            
            
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

        //活动时间 列表
        var initSwiper = function(){
                var mySwiper = new Swiper('.activity_time_list', {
                    //initialSlide: 0,//设定初始化时slide的索引。
                    initialSlide: position,//设定初始化时slide的索引。
                    direction: 'horizontal',//Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)
                    speed: 300,//滑动速度，即slider自动滑动开始到结束的时间（单位ms）
                    //freeMode: false,//默认为false   false：一次滑一个 true：滑到哪里算哪里
                    //freeModeSticky: true,//使得freeMode也能自动贴合。 滑动模式下也可以贴合
                    slidesPerView: 5,//一页 显示的个数
                    effect: 'slide',//slide的切换效果，默认为"slide"（位移切换），"fade"（淡入）"cube"（方块）"coverflow"（3d流）。
                    loop: false,
                    // onClick: function () {
                    //     alert(1)
                    // }
                });
        };

        
    return discountGoodListView;
    });

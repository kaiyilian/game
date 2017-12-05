define(['zepto', 'underscore', 'backbone',
        'swiper', 'echo','app/api', 'app/refreshtoken',
        'app/utils', 'app/scroll',
        'text!templates/discountGoodInfo.html'
    ],

    function($, _, Backbone, Swiper, echo, Api, Token, utils, scroll, discountGoodInfoTemplate) {
       
        var $page = $("#discount-good-info-page");
        var infoType = 0;
        var otherType = 1;
        var discountGoodId;
        var section//时间段
        var imageRenderToken;
        var discountGoodInfoView = Backbone.View.extend({
            el: $page,
            render: function(id,label) {
                //utils.showMenu();
                discountGoodId = id;
                section = label;
                utils.showPage($page, function() {
                    //$page.empty().append(discountGoodInfoTemplate);

                    initData();

                });
            },
            events: {
                //立即抢购
                "tap .btn_panic_buying_text":"orderConfirm",
                //获得抢购权
                "tap .get_right_to_buy":"getRightToBuy",
                //抢购
                "tap .to_panic_buy":"rushToPurchase",

            },  

            orderConfirm: function(){

                window.location.hash = "orderConfirm/" + discountGoodId + "/" + section;
            },

            getRightToBuy: function(e){
                var flash_goods_id = $(e.currentTarget).parent().data("id");//
                var section = $(e.currentTarget).parent().data("section");//时间段

                getMemberInfo();
                
            },

            //抢购
            rushToPurchase: function(e){

                window.location.hash = "orderConfirm/" + discountGoodId + "/" + section;
            },

        });

        var initData = function(){

            var param = {flash_goods_id:discountGoodId, section:section};
            Api.getFlashSaleInfo(param, function(successData){
                //set();
                successData.result.section = section;
                var template = _.template(discountGoodInfoTemplate);
                $page.empty().append(template(successData.result));

                
                asynLoadImage();                
                initSwiper();//初始化轮播图
            }, function(errorData){


            });
        };

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

        //得到抢购权
        var toGetRightToBuy = function(flash_goods_id, section){
            var formData = "section=" + section;
            console.log(flash_goods_id);
            console.log(section);

            
            var param = {formData:formData, flash_goods_id:flash_goods_id};

            Api.toGetRightToBuy(param, function(successData){

                $.Dialog.success("支付成功，已经获得抢购权抢购权");
                initData();
            }, function(errorData){

                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(otherType,function(data){

                        toGetRightToBuy();

                    },function(data){


                    });
                }
            });
        };

        //初始化轮播图
        var initSwiper = function () {

                var mySwiper = new Swiper('.good_img_list', {
                        initialSlide: 1,//设定初始化时slide的索引。
                        direction: 'horizontal',//Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)
                        speed: 300,//滑动速度，即slider自动滑动开始到结束的时间（单位ms）
                        autoplay: 3000,//自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换。
                        autoplayDisableOnInteraction: false,//用户操作swiper之后，是否禁止autoplay。默认为true：停止。
                        grabCursor: true,//设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。
                        setWrapperSize: true,//开启这个设定会在Wrapper上添加等于slides相加的宽高，在对flexbox布局的支持不是很好的浏览器中可能需要用到。
                        //上一个,下一个
//                      nextButton: '.swiper-button-next',
//                      prevButton: '.swiper-button-prev',
                        //pagination : '.swiper-pagination',
                        //prevSlideMessage: 'Previous slide',
                        //nextSlideMessage: 'Next slide',
                        //firstSlideMessage: 'This is the first slide',
                        //lastSlideMessage: 'This is the last slide',
                        //paginationBulletMessage:'Go to slide {{index}}',
                        slidesOffsetBefore: 0,//设定slide与左边框的预设偏移量（单位px）。
                        slidesOffsetAfter: 0,//设定slide与右边框的预设偏移量（单位px）。
                        freeMode: false,//默认为false   false：一次滑一个 true：滑到哪里算哪里
                        freeModeSticky: true,//使得freeMode也能自动贴合。 滑动模式下也可以贴合
                        //slidesPerView: 3,//一页 显示的个数
                        effect: 'slide',//slide的切换效果，默认为"slide"（位移切换），"fade"（淡入）"cube"（方块）"coverflow"（3d流）。
                        loop: true,
                        //// 如果需要分页器
                        pagination: '.swiper-pagination',
                        //// 如果需要前进后退按钮
                        //nextButton: '.swiper-button-next',
                        //prevButton: '.swiper-button-prev',
                        //// 如果需要滚动条
                        //scrollbar: '.swiper-scrollbar',
                })

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
        
    return discountGoodInfoView;
    });

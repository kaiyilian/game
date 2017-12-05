define(['zepto', 'underscore', 'backbone',
        'swiper', 'echo','app/api',
        'app/utils', 'app/scroll',
        'text!templates/resellStoreDetail.html'
    ],

    function($, _, Backbone, Swiper, echo, Api, utils, scroll, resellStoreDetailTemplate) {
       
        var $page = $("#resell-store-details-page");
        var resellStoreId;//转卖商品Id
        var resellStoreDetailView = Backbone.View.extend({
            el: $page,
            render: function(id) {
                //utils.showMenu();

                resellStoreId = id;
                utils.showPage($page, function() {

                    $page.empty().append(resellStoreDetailTemplate);

                    initSwiper();
                        
                });
            },
            events: {

                //立即抢购
                "tap .btn_panic_buying":"orderConfirm",
            },

            orderConfirm: function(){

                window.location.hash = "orderConfirm/" +resellStoreId;
            },

        });

        var initSwiper = function(){

                //商品 列表
                var mySwiper = new Swiper('.good_img_list', {
                        initialSlide: 0,//设定初始化时slide的索引。
                        direction: 'horizontal',//Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)
                        speed: 300,//滑动速度，即slider自动滑动开始到结束的时间（单位ms）
                        //autoplay: 5000,//自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换。
                        autoplayDisableOnInteraction: false,//用户操作swiper之后，是否禁止autoplay。默认为true：停止。
                        grabCursor: true,//设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。
                        setWrapperSize: true,//开启这个设定会在Wrapper上添加等于slides相加的宽高，在对flexbox布局的支持不是很好的浏览器中可能需要用到。
                        //上一个,下一个
                        //nextButton: '.swiper-button-next',
                        //prevButton: '.swiper-button-prev',
                        pagination: '.swiper-pagination',
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
                        // pagination: '.swiper-pagination',
                        //// 如果需要前进后退按钮
                        //nextButton: '.swiper-button-next',
                        //prevButton: '.swiper-button-prev',
                        //// 如果需要滚动条
                        //scrollbar: '.swiper-scrollbar',
                })


        };     
        
    return resellStoreDetailView;
    
    });

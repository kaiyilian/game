define(
	['zepto', 'underscore', 'backbone', 'urlGroup',
		'swiper', 'echo', 'app/api', 'app/basket',
		'app/utils', 'app/scroll', 'dropload',
		'text!templates/resaleGoodDetail.html'
	],

	function ($, _, Backbone, UrlGroup, Swiper, echo, Api, basket, utils, scroll, _dropload, resaleGoodDetailTemplate) {

		var $page = $("#resaleGoodDetail-page");
		var $goodContainer;
        var imageRenderToken;
		var $goodItem;
        var resaleId;
		var resaleGoodDetailView = Backbone.View.extend({
			el: $page,
			render: function (id) {
				//utils.showMenu();
                resaleId = id;
				utils.showPage($page, function () {
					//$page.empty().append(resaleGoodDetailTemplate);

                    //$goodContainer = $page.find(".good_img_list");

                    initData();
					
				});
			},
			events: {
				
			},

		});

        var initData = function(){

            var param = {resale_id:resaleId};

            Api.getResalesInfo(param, function(successData){

                var template = _.template(resaleGoodDetailTemplate);
                $page.empty().append(template(successData.result));

                asynLoadImage();
                bannerEvent();

            }, function(errorData){


            });
            
        };

		//动态加载图片
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

        //初始化轮播图
        var bannerEvent = function () {

            var mySwiper = new Swiper('.banner_img_list', {
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
                onTap: function (swiper) {
                    var href = $(swiper.clickedSlide).data("href");
                    if (href == "") {
                        return;
                    }
                   
                }
            })

        };



		return resaleGoodDetailView;

	});

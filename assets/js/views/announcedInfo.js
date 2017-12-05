define(
	[
		'zepto', 'jquery', 'underscore', 'backbone', 'urlGroup',
		'swiper', 'echo', 'app/api', 'app/basket',
		'app/utils', 'app/scroll',
		'text!templates/announcedInfo.html'
	],

	function ($, Jquery, _, Backbone, UrlGroup, Swiper, echo, Api, basket, utils, scroll,
			  announcedInfoTemplate) {

		var $page = $("#announced-info-page");
		var $good_no;//揭晓活动 商品编号
		var $announced_date_no = "";//揭晓活动 期号编号
		var $announced_info_item;//揭晓 详情页面
		var $attend_record_item;//参加记录 item
		var imageRenderToken;

		var announcedInfoView = Backbone.View.extend({
			el: $page,
			render: function (auction_id, auction_date_id) {
				//utils.showMenu();
				utils.showPage($page, function () {
					$page.empty().append(announcedInfoTemplate);
					
					$good_no = auction_id;
					if (auction_date_id)
						$announced_date_no = auction_date_id;

					//console.log("商品编号：" + $good_no);
					//console.log("商品期号编号：" + $announced_date_no);

					$announced_info_item = $("#announced_info_item");
					$attend_record_item = $("#attend_record_item");

					initData();//初始化 数据
					//initEvent();//初始化轮播和进入二级页面事件

				});
			},
			events: {
				"tap .other_list > li": "GoPage",
				"tap .btn_full_purchase": "buyInFullPrice",//全价购买
				"tap .announced_operate .btn_go": "GoNextAnnounced",//立刻前往
				"tap .btn_login": "GoLogin",//跳转到登录页面
				"tap .btn_rule": "GoWinningRemark",//夺宝规则
				"tap .btn_calc_detail": "GoWinningRemark",//计算详情
				"tap .btn_search_all": "searchAllNo",//查看全部 夺宝号码

                "tap .ui-icon-shoppingCart":"shoppingCart", //进入购物车
			},

			shoppingCart: function(){
                
                window.location.hash = "shoppingCart";
            },

			//查看全部 夺宝号码
			searchAllNo: function () {
				var list = sessionStorage.getItem("personalNoList");
				$.Dialog.alert(list);

			},
			//夺宝规则、计算详情
			GoWinningRemark: function () {
				window.location.hash = "winningRemark";
			},

			//进入具体的页面（图文详情、往期揭晓、晒单分享）
			GoPage: function (e) {

				e.stopImmediatePropagation();
				var $this = $(e.currentTarget);

				var href = $this.data("href");
				//alert(href)
				if (href) {
					if (href != "imgTxtDetail")
						href += "/" + $good_no;

					window.location.hash = href;
				}

			},

			//全价 购买
			buyInFullPrice: function () {

			},

			//进入下期 揭晓（夺宝）
			GoNextAnnounced: function () {
				window.location.hash = "duobaoInfo/" + $good_no;
			},

			//跳转到登录页面
			GoLogin: function () {

				//alert(window.location.hash)
				utils.storage.set("loginSuccessBack", window.location.hash);
				//window.location.hash="login"
				window.location.href = window.LOGIN_REDIRECT_URL;

			}


		});


		//获取数据
		var initData = function () {

			//var url = urlGroup.announced_info + "/" + $good_no +
			//	"?access_token=" + utils.storage.get("access_token") +
			//	"&auction_date_id=" + $announced_date_no;

			var param = {
				auction_id: $good_no,
				auction_date_id: $announced_date_no
			};

			Api.getAnnouncedInfo(
				param,
				function (data) {

					var template = _.template($announced_info_item.html());
					$(".announced_info_container").empty()
						.append(template(data.result));
					asynLoadImage();
					//用户已经登录
					if (utils.isLogined()) {
						$page.find(".user_status_container").find(".not_login").hide();
					}
					else {
						$page.find(".user_status_container").find(".not_login").show()
							.siblings().hide()
					}


					sessionStorage.setItem("img_txt_detail", data.result.description);//图文详解

					//夺宝号码
					var sns = data.result.sns;
					var sns_list = "";
					if (sns && sns.length > 2) {

						for (var i = 0; i < sns.length; i++) {
							var item = sns[i];

							sns_list += "<span class='personal_no'>" + item + "</span>";

						}

						sessionStorage.setItem("personalNoList", sns_list);//夺宝号码 列表

					}

					initSwiper();//初始化轮播图
					initAttendRecord();//获取所有参与记录

					if(data.result.status == 2){
						MSCountDown($(".announced_count_down"),function(data){
							initData();//初始化  数据
						});
					}

					initNumber();//初始化购物车数据
					

				},
				function () {

				}
			)
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

		//初始化购物车数据
		var initNumber = function(){
			basket.getShoppingCartNumber(0, function(number){
				$(".shopping_cart_good_count").html(number);
			});
		};

		//获取所有参与记录
		var initAttendRecord = function () {

			var param = {
				auction_date_id: $announced_date_no,
				page: "1",
				page_size: "10"
			};

			Api.getAttendRecord(
				param,
				function (data) {
					//alert(JSON.stringify(data));
					//console.log(data);

					var template = _.template($attend_record_item.html());
					$(".attend_record_list").empty().append(template(data.result));
					asynLoadImage();//动态 加载图片

				},
				function (data) {
					//alert(JSON.stringify(data));
					console.log(JSON.stringify(data))
				}
			)

		};

		//初始化轮播和进入二级页面事件
		var initEvent = function () {

			//initSwiper();//初始化轮播图


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


		//倒计时方法
		var MSCountDown = function(self,toEnd){

			var current_time = $(self).data("currenttime");//当前时间
            var expire_time = $(self).data("rewardtime");//结束时间

            current_time = current_time.replace(/\-/g, "/");  
            expire_time = expire_time.replace(/\-/g, "/");

            var currentTime = new Date(current_time).getTime();
            var expireTime = new Date(expire_time).getTime();  

            var intDiff = expireTime - currentTime;

            var handler = window.setInterval(function () {
						intDiff = intDiff-20;
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
			               // $(".btn_pay").removeClass("bg-ff6e2b").removeClass("btn_pay").addClass("ba-bfbfbf-css");
			                window.clearInterval(handler);
			                typeof toEnd == 'function' && toEnd(1);
			                return;
			            }
					}, 20);
            //handlers.push(handler);
				
		};


		return announcedInfoView;
	});

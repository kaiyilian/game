define(
	['zepto', 'underscore', 'backbone',
		'swiper', 'echo', 'frozen', 'app/api',
		'app/utils', 'dropload', 'app/refreshtoken',
		'text!templates/myAnnouncedRecord.html'
	],

	function ($, _, Backbone, Swiper, echo, frozen, Api, utils, _dropload, Token, myAnnouncedRecordTemplate) {

		var $page = $("#my-announced-record-page");
		var $announced_item;//夺宝记录  item
		var imageRenderToken;
		var $myAnnouncedRecord;
		var $pageNum;//页码
        var $pageSize;//每页记录数
        var recordType;//夺宝记录类型 1全部 2进行中 2已揭晓 默认：全部

		var myAnnouncedRecordView = Backbone.View.extend({
			el: $page,
			render: function (id, name) {
				utils.showPage($page, function () {
					$page.empty().append(myAnnouncedRecordTemplate);

					$announced_item = $("#announced_item");
					$pageNum = 1;
                    $pageSize = 4;
					initTab();//初始化 滑动块
					//initTime();//初始化  倒计时
					//initData(1);//
					//初始化  数据
                    initRecordList();
				});
			},
			events: {

				"tap  .btn_detail": "recordInfo",//查看 夺宝记录详情

				"tap  .btn_buy_again": "nextBuy",//再次购买

				"tap  .btn_add": "addBuy",//追加

				"tap  .announced_not_start": "GoDuobaoInfo",//进行中 (未开始)

				"tap  .announced_started": "GoAnnouncedInfo",//揭晓中、已揭晓

			},

			//查看详情
			recordInfo: function (e) {

				e.stopImmediatePropagation();

				var $this = $(e.currentTarget);
				var order_id = $this.data("order_id");

				window.location.hash = "myAnnouncedRecordInfo/" + order_id;
			},

			//追加 购买
			addBuy: function (e) {
				e.stopImmediatePropagation();

				var $this = $(e.currentTarget);

				var id = $this.closest("li").data("auction_id");

				location.hash = "duobaoInfo/" + id;

			},

			//再次购买
			nextBuy: function (e) {
				e.stopImmediatePropagation();

				var $this = $(e.currentTarget);

				var id = $this.closest("li").data("auction_id");

				location.hash = "duobaoInfo/" + id;
			},

			//进入夺宝信息 页面
			GoDuobaoInfo: function (e) {
				e.stopImmediatePropagation();

				var $this = $(e.currentTarget);

				var id = $this.closest("li").data("auction_id");

				location.hash = "duobaoInfo/" + id;
			},

			//进入 揭晓信息 页面
			GoAnnouncedInfo: function (e) {
				e.stopImmediatePropagation();

				var $this = $(e.currentTarget);

				var auction_id = $this.closest("li").data("auction_id");
				var auction_date_id = $this.closest("li").data("auction_date_id");

				location.hash = "announcedInfo/" + auction_id + "/" + auction_date_id;
			},


		});

		//初始化积分记录
        var initRecordList = function(){

            recordType = 1;
            $pageNum =1;
            $myAnnouncedRecord = $(".announced_all");
            //初始化dropload插件
            $dropload = null;
            dropload.init();

        }; 

		//初始化 滑动块
		var initTab = function () {
			utils.clearTab("my-announced-record-page");
			//滑动效果
			var tab = new fz.Scroll('.ui-tab', {
				role: 'tab',
				autoplay: false
			});

			tab.on('scrollEnd', function (curPage) {
				if (curPage == 0) {         //全部
					recordType = 1;
                    $myAnnouncedRecord = $(".announced_all");
				}
				if (curPage == 1) {         //进行中
				
					recordType = 2;
                    $myAnnouncedRecord = $(".announced_ongoing");
				}
				if (curPage == 2) {         //已揭晓
					
					recordType = 3;
                    $myAnnouncedRecord = $(".announced_end");
				}
				// var type = parseInt(curPage) + 1;
				// initData(type);

				$myAnnouncedRecord.empty();
                $pageNum = 1;
                $dropload = null;
                dropload.init();

			});
		};

		//初始化  倒计时
		var initTime = function () {

			//倒计时
			$("ul.crowd-funding_all li").each(function () {

				utils.timeCountDown($(this).find(".activity_count_down"));
			});
		};

		//初始化 数据
		var initData = function (type) {

			if(droploadType =="up"){

                $dropload.noData(false);
                $dropload.resetload();
                $dropload.unlock();
                dropload.init(); 
                return;
            }
			var param = {
				type: recordType,	//1全部 2进行中 2已揭晓
				page: $pageNum,
				page_size: $pageSize
			};

			Api.getAnnouncedRecord(
				param,
				function (successData) {

				if(successData.result.data.length>0){
	                successData.result.data.recordType = recordType;
	                var template = _.template($announced_item.html());
	                $myAnnouncedRecord.append(template(successData.result));

	                
	                 $pageNum++;
	                 $dropload.noData(false);
	                 $dropload.resetload();
	                 $dropload.unlock();

					//初始化倒计时
					countDown();

					asynLoadImage();//动态加载图片
                }else {

                    $dropload.noData(true);
                    $dropload.resetload();
                    $dropload.lock("down");
                }
					

				},
				function (errorData) {
					if( errorData.err_code == 20002 ){

	                    Token.getRefeshToken(type,function(data){

	                        getRecordList();

	                    },function(data){

	                       
	                    });
	                }

				}
			)

		};

		//分页
		var dropload = {
            init : function(){
                //$dropload = $('.income_record').dropload({
                $dropload = $myAnnouncedRecord.dropload({
                      scrollArea : window,
                      loadDownFn : function(me){
                        droploadType="down";
                        if($pageNum == 1 ){
                            $myAnnouncedRecord.empty();
                        }

                        initData();
                      },
                      loadUpFn : function(me){
                        droploadType="up";
                        $pageNum = 1;

                        $myAnnouncedRecord.empty();
                        initData();
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

		//初始化倒计时
		var countDown = function(){

				$(".myannounced_record_list").find(".activity_count_down").each(function () {

					MSCountDown($(this),function(data){
						initData(1);//初始化  数据
					});
				});
		};

		//倒计时方法
		var MSCountDown = function(self,toEnd){

			var current_time = $(self).data("current_time");//当前时间
            var expire_time = $(self).data("reward_time");//结束时间

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


		return myAnnouncedRecordView;
	});

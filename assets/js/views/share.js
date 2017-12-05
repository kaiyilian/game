define(
	['zepto', 'underscore', 'backbone', 'dropload',
		'swiper', 'echo', 'app/api', 'app/refreshtoken',
		'app/utils', 'app/scroll',
		'text!templates/share.html'
	],

	function ($, _, Backbone, Dropload, Swiper, echo, Api, Token, utils, scroll, shareTemplate) {

		var $page = $("#share-page");
		var flag;//是否是个人晒单 1：是 0 不是 默认：0
		var $good_no = "";
		var imageRenderToken = null;
		var $dropload;
		var $pageNum; //页码
		var $pageSize; //每页记录数
		var $shareOrderListContainer;
		var $shareOrderItem;

		var shareView = Backbone.View.extend({
			el: $page,
			render: function (good_no) {
				utils.showPage($page, function () {
					$page.empty().append(shareTemplate);
					flag =0;
					if (good_no)
					$good_no = good_no;
					$shareOrderListContainer = $page.find(".share_order_list");
					$shareOrderItem = $page.find("#share_orders_item");
					$pageNum = 1;//页码
					$pageSize = 4;//每页记录数

					//初始化dropload插件
					dropload.init();

				});
			},
			events: {
				//晒单详情
				"tap .share_order_item": "shareOrderDetail",
			},

			//晒单详情
			shareOrderDetail: function (e) {

				e.stopImmediatePropagation();

				$this = $(e.currentTarget);
				window.location.hash = "shareOrderDetail/" + $this.data("id");

			}


		});

		//得到 晒单列表
		var getShareOrderList = function () {
			if (type == "up") {

				$dropload.noData(false);
				$dropload.resetload();
				$dropload.unlock();
				dropload.init();
				return;
			}

			if($good_no == "my"){
				$good_no = null;
				flag = 1;
			}
			var param = {auction_id: $good_no, page: $pageNum, page_size: $pageSize, flag:flag};

			Api.getShares(
				param,
				function (successData) {

					if (successData.result.data.length > 0) {

						var template = _.template($shareOrderItem.html());

						$shareOrderListContainer.append(template(successData.result));

						asynLoadImage();

						$pageNum++;
						$dropload.noData(false);
						$dropload.resetload();
						$dropload.unlock();
					}
					else {

						$dropload.noData(true);
						$dropload.resetload();
						$dropload.lock("down");
					}

				},
				function (errorData) {
					//token过期 刷新token
	                if( errorData.err_code == 20002 ){

	                    Token.getRefeshToken(type,function(data){  

	                        getShareOrderList();

	                    },function(data){

	                        
	                    });
	                }

				});

		};

		var dropload = {
			init: function () {
				//console.log("init");
				$dropload = $shareOrderListContainer.dropload({
					scrollArea: window,
					loadDownFn: function (me) {
						type = "down";
						console.log("down");
						if ($pageNum == 1) {
							$shareOrderListContainer.empty();
						}
						getShareOrderList();
					},
					loadUpFn: function (me) {
						type = "up";
						console.log("up");
						$pageNum = 1;
						$shareOrderListContainer.empty();

						getShareOrderList();
					}
				});
			},

			lock: function () {
				$dropload.lock();
			},

			reload: function () {
				$dropload.resetload();
			},

			reset: function (flag) {
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


		return shareView;

	});

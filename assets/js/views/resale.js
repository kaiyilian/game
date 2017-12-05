define(
	['zepto', 'underscore', 'backbone', 'urlGroup',
		'swiper', 'echo', 'app/api', 'app/basket',
		'app/utils', 'app/scroll', 'dropload',
		'text!templates/resale.html'
	],

	function ($, _, Backbone, UrlGroup, Swiper, echo, Api, basket, utils, scroll, _dropload, resaleTemplate) {

		var $page = $("#resale-page");
		var $goodContainer;
		var $goodItem;
		var $pageNum; //页码
        var $pageSize; //每页记录数
		var resaleView = Backbone.View.extend({
			el: $page,
			render: function () {
				//utils.showMenu();
				utils.showPage($page, function () {
					$pageNum = 1;//页码
                	$pageSize =4;//每页记录数
					$page.empty().append(resaleTemplate);

					$goodContainer = $page.find(".good_list");

					$goodItem = $page.find("#resale_item");

					dropload.init(); 
					//初始化数据
					//initData();
				});
			},
			events: {
				"tap .resale_info":"resaleInfo",

                "tap .resale_to_buy":"resaleToBuy",
			},

			resaleInfo: function(e){

				e.stopImmediatePropagation();

				$this = $(e.currentTarget);

				window.location.hash = "resellGoodDetail/" + $(e.currentTarget).data("id") ;
			},

            resaleToBuy: function(e){
                e.stopImmediatePropagation();
                //$good_no  夺宝商品编号
                //$(e.currentTarget).data("goodid") 商品编号 
                window.location.hash = "orderConfirm/" + $(e.currentTarget).data("goods_id") + "/" + 1 + "/" + "resale/" + $(e.currentTarget).data("id");// 1：占位的作用
            },

		});

		var initData = function(){

			if(type =="up"){

                $dropload.noData(false);
                $dropload.resetload();
                $dropload.unlock();
                dropload.init(); 
                return;
            }

            var param = {page:$pageNum, page_size:$pageSize};

            Api.getResalesList( param, function(successData){

                if(successData.result.data.length>0){
                    var total = successData.result.total;

                    var template = _.template($goodItem.html());
                    $goodContainer.hide();
                    $goodContainer.append(template(successData.result)).show();  
                    $pageNum++;
                    $dropload.noData(false);
                    $dropload.resetload();
                    $dropload.unlock();
                }else {

                    $dropload.noData(true);
                    $dropload.resetload();
                    $dropload.lock("down");
                }
            }, function(errorData){

            });
		}

		var dropload = {
            init : function(){
                $dropload = $('.resale_css .good_list').dropload({
                      scrollArea : window,
                      loadDownFn : function(me){//上拉加载

                        type="down";
                          if($pageNum == 1){
                              $goodContainer.empty();
                          }                                                                            
                          initData();
                      },
                      loadUpFn : function(me){//下拉刷新
                        type="up";
                        $pageNum = 1;
                        $goodContainer.empty()
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


		return resaleView;

	});

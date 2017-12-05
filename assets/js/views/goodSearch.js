define(['zepto', 'underscore', 'backbone', 'dropload',
        'swiper', 'echo','app/api', 'app/refreshtoken',
        'app/utils', 'app/scroll', 'app/basket',
        'text!templates/goodSearch.html'
    ],

    function($, _, Backbone, _dropload, Swiper, echo, Api, Token, utils, scroll, basket, goodSearchTemplate) {
       
        var $page = $("#good-search-page");
        var imageRenderToken;
        var type;
        var $hotSearchItem;
        var $hotSearchContain;
        var $searchResultsContain;
        var $searchResultsItem;
        var $historySearchItem;
        var $historySearchContain;
        var $dropload;
        var keywords;
        var $pageNum; //页码
        var $pageSize; //每页记录数
        var isExist ;
        var maxLength;//缓存最大条数
        var goodSearchView = Backbone.View.extend({
            el: $page,
            render: function() {
                //utils.showMenu();
                utils.showPage($page, function() {
                    $page.empty().append(goodSearchTemplate);

                    isExist = 0;
                    maxLength = 10;
                    
                    $hotSearchItem = $page.find("#hot_search_item");
                    $hotSearchContain = $page.find(".hot_search_txt_list");
                    $historySearchItem = $page.find("#history_search_item");
                    $searchResultsItem = $page.find("#good_list_item");
                    $historySearchContain = $page.find(".lately_search_txt_list");


                    getHotSearch();//热门搜索
                    getShoppingCartNumber();//得到购物车中商品数量
                    getHistorySearch();//初始化历史搜索记录

                });
            },
            events: {
            	//清空查询条件
            	"tap .ui-icon-close":"clearSearch",

            	//取消搜索 返回首页
            	"tap .ui-searchbar-cancel":"cancel",

            	"input .search_name":"toSearch",
                //进入购物车
                "tap .to_shopping_cart":"shoppingCart",
                //加入购物车
                "tap .add_to_shopping_cart":"addToShoppingCart",
                //商品详情
                "tap .announced_good_list":"duobaoGoodInfo",
                //热门搜索
                "tap .hot_search":"hotSearch",
                //全部加入清单
                "tap .all_to_shopping_cart":"allAddToShoppingCart",
                //最近搜索
                "tap .history_search":"toHistorySearch",
                //清除历史纪录
                "tap .clear_history":"clearHistory",
              
            },  

            clearSearch: function(){
                toSetSearchData();
            	$('.ui-searchbar-input input').val("");//查询条件 清空
				$('.ui-icon-close').hide();//删除 按钮隐藏

				//查询结果隐藏
				$(".good_search_result").hide().siblings(".mxep_block").show();
				//取消按钮隐藏 购物车按钮 出现
				$("header").find(".icon_shopping_cart").hide().siblings(".ui-searchbar-cancel").show();

                getHistorySearch();
                


            },

            cancel: function(){

            	//window.location.hash = "main";
                window.history.go(-1);
            },

            toSearch: function(e){

                //查询结果显示
                $(".good_search_result").show().siblings(".mxep_block").hide();

                //取消按钮隐藏 购物车按钮 出现
                $("header").find(".icon_shopping_cart").css("display", "block")
                                .siblings(".ui-searchbar-cancel").hide();
                $('.ui-icon-close').show();//删除 按钮隐藏

                keywords = $(".search_name").val();
                if(keywords == null || keywords == ""){
                    return;
                }
                $(".good_search_result_number").html(0);

                //初始化dropload插件
                $searchResultsContain = $(".good_list");
                $searchResultsContain.empty()
                $pageNum = 1;//页码
                $pageSize =4;//每页记录数
                type = "";
                if($dropload){
                    $dropload = null;
                }
                dropload.init();
                
 
            },

            shoppingCart: function(){

                window.location.hash = "shoppingCart";
            },

            search: function(e){




            	var e = event || window.event || arguments.callee.caller.arguments[0];



				if (e && e.keyCode == 27) { // 按 Esc
						//要做的事情
				}
				if (e && e.keyCode == 113) { // 按 F2
						//要做的事情
				}
				if (e && e.keyCode == 13) { // enter 键
                    
						//要做的事情
						var val = $.trim($(".search_name").val());
						//alert(val);

						//查询结果显示
						$(".good_search_result").show().siblings(".mxep_block").hide();

						//取消按钮隐藏 购物车按钮 出现
						$("header").find(".icon_shopping_cart").css("display", "block")
										.siblings(".ui-searchbar-cancel").hide();

				}
            },

            addToShoppingCart: function(e){

                e.stopImmediatePropagation();

                var id = parseInt($(e.currentTarget).parent().data("id"));

                var quantity = parseInt(1);
                var formData = "auction_id=" + id + "&" +
                                "quantity=" + quantity;
                var param = {formData:formData};
                basket.addShoppingCart(param,function(data){
 
                   getShoppingCartNumber();
                }, function(){

                });

            },

            //夺宝 商品性情
            duobaoGoodInfo: function (e) {

                e.stopImmediatePropagation();

                window.location.hash = "duobaoInfo/" + $(e.currentTarget).data("id");


            },

            hotSearch: function(e){
                e.stopImmediatePropagation();

                //查询结果显示
                $(".good_search_result").show().siblings(".mxep_block").hide();

                //取消按钮隐藏 购物车按钮 出现
                $("header").find(".icon_shopping_cart").css("display", "block")
                                .siblings(".ui-searchbar-cancel").hide();
                $('.ui-icon-close').show();//删除 按钮隐藏
                keywords = $(e.currentTarget).html();

                $(".search_name").val(keywords);
                if(keywords == null && keywords == ""){
                    return;
                }
                //初始化dropload插件
                $searchResultsContain = $(".good_list");
                $searchResultsContain.empty()
                $pageNum = 1;//页码
                $pageSize =4;//每页记录数
                type = "";
                if($dropload){
                    $dropload = null;
                }
                dropload.init();

            },

            toHistorySearch: function(e){
                //查询结果显示
                $(".good_search_result").show().siblings(".mxep_block").hide();

                //取消按钮隐藏 购物车按钮 出现
                $("header").find(".icon_shopping_cart").css("display", "block")
                                .siblings(".ui-searchbar-cancel").hide();
                $('.ui-icon-close').show();//删除 按钮隐藏
                keywords = $(e.currentTarget).html();

                $(".search_name").val(keywords);
                if(keywords == null && keywords == ""){
                    return;
                }
                //初始化dropload插件
                $searchResultsContain = $(".good_list");
                $searchResultsContain.empty()
                $pageNum = 1;//页码
                $pageSize =4;//每页记录数
                type = "";
                if($dropload){
                    $dropload = null;
                }
                dropload.init();

            },

            allAddToShoppingCart: function(e){
                var ids = "";
                $(".good_list").find("li").each(function () {
                    ids += $(this).data("id") + ","
                });
                if(ids == ""){
                    $.Dialog.info("没有商品可以添加！");

                    return;
                }
                basket.batchAddShoppingCart(ids,1,function(successData){
                    getShoppingCartNumber();
                }, function(errorData){

                });
                

            },

            clearHistory: function(e){
                utils.storage.remove("searchData");
                getHistorySearch();
            },



        });

        var toSetSearchData = function(){
            
            var searchData = utils.storage.get("searchData") || "[]";
            var result = JSON.parse(searchData);
            keywords = $(".search_name").val();
            if(keywords == null || keywords == ""){
                return;
            }
            var newItem = {keywords:keywords};
            
            result = _.each(result, function(item){
              if(item.keywords == newItem.keywords){
                  isExist = 1;
                  return;
                  }
              });
            if(isExist == 0) {

                if(result.length>(maxLength-1)){
                    result.unshift(newItem);//数组最前面加一条记录
                    result.pop();//删除最后一项
                }else{
                    result.push(newItem);
                }
              
            }

             utils.storage.set("searchData",JSON.stringify(result));
        };

        //得到搜索结果
        var getSearchResults = function(){
            if(type =="up"){

                $dropload.noData(false);
                $dropload.resetload();
                $dropload.unlock();
                dropload.init(); 
                return;
            }

            var param = {keywords:keywords, page:$pageNum, page_size:$pageSize};

            Api.getSearchResults(param, function(successData){

                if(successData.result.data.length>0){

                    var total = successData.result.total;

                    $(".good_search_result_number").html(total);

                    var template = _.template($searchResultsItem.html());
                    $searchResultsContain.hide();
                    $searchResultsContain.append(template(successData.result)).show();
                    asynLoadImage();
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

            
        };

        //热门搜索
        var getHotSearch = function(){

            Api.getHotSearchList(null, function(successData){

                var template = _.template($hotSearchItem.html());

                $hotSearchContain.empty().append(template(successData));

            }, function(errorData){

            });
        };

        //得到购物车中商品数量
        var getShoppingCartNumber = function(){

            Api.getShoppingCarts(null, function(successData){

                $(".shopping_cart_good_count").html(successData.result.total);
            }, function( errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(0,function(data){

                        getShoppingCartNumber();

                    },function(data){


                    });
                }
            });

        };

        //初始化历史搜索记录
        var getHistorySearch = function(){
            var searchData = utils.storage.get("searchData") || "[]";
            var result = JSON.parse(searchData);
            
            var data = {};
            data.result = result;
            if( result.length>0 ){

                $(".has_no_history").hide();//暂无搜索历史隐藏

                $(".clear_history").show();//清除搜索历史显示

                $historySearchContain.show();//搜索历史显示

                var template = _.template($historySearchItem.html());

                $historySearchContain.empty().append(template(data));
            }else {
                $(".has_no_history").show();//暂无搜索历史隐藏

                $historySearchContain.hide();//搜索历史显示

                $(".clear_history").hide();//清除搜索历史隐藏
            }

        };

        var dropload = {
            init : function(){
                $dropload = $('.good_list').dropload({
                      scrollArea : window,
                      loadDownFn : function(me){
                        type="down";
                          if($pageNum == 1){
                              $searchResultsContain.empty();
                          }
                          //getShoppingCartNumber();
                          getSearchResults();
                      },
                      loadUpFn : function(me){
                        type="up";
                          $pageNum = 1;
                          $searchResultsContain.empty();
                          //getShoppingCartNumber();
                          getSearchResults();
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
        
    return goodSearchView;
    });

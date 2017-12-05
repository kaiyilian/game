define(['zepto', 'underscore', 'backbone',  'swiper', 'echo', 
         'app/api', 'app/utils', 'dropload', 'app/refreshtoken', 'app/basket',
        'text!templates/categoryGoodList.html'
    ],

    function($, _, Backbone, Swiper, echo, Api, utils,  _dropload, Token,  basket, categoryGoodListTemplate) {
       
        var $page = $("#categor-good-list-page");
        var $uiHeaderName;
        var $categoryGoodCount;
        var $shoppingCartGoodCount;
        var $categoryList;
        var $goodListContainer;
        var $goodListItem;
        var $dropload;
        var $pageNum; //页码
        var $pageSize; //每页记录数
        var $categoryId;
        var categoryGoodListView = Backbone.View.extend({
            el: $page,
            render: function(id) {
                //utils.showMenu();
                utils.showPage($page, function() {
                        $page.empty().append(categoryGoodListTemplate);

                        $pageNum = 1;//页码
                        $pageSize =2;//每页记录数
                        $uiHeaderName = $page.find(".ui_header_name");
                        $goodListContainer = $page.find(".good_list");
                        $goodListItem = $page.find("#good_list_item");
                        $categoryGoodCount = $page.find(".category_good_count");
                        $shoppingCartGoodCount = $page.find(".shopping_cart_good_count");

                        $uiHeaderName.html(utils.storage.get("categoryGoodName"));

                        $categoryId = id;

                        getShoppingCartNumber();

                        //初始化dropload插件
                        dropload.init(); 
                        
                       // $categoryList = $page.find(".category_list");

                        
                });
            },
            events: {
                //进入清单 购物车
                "tap .to_shopping_cart":"shoppingCart",
                //加入购物车（清单）
                "tap .add_shopping_cart":"addToShoppingCart",
                //商品详情
                "tap .announced_good_list":"duobaoGoodInfo", 
                //全部加入清单
                "tap .all_to_shopping_cart":"allAddToShoppingCart",
                                       
            }, 

            shoppingCart: function(){
                
                window.location.hash = "shoppingCart";
            },

            addToShoppingCart: function(e){

                e.stopImmediatePropagation();

                var id = parseInt($(e.currentTarget).parent().data("id"));

                var quantity = parseInt(1);
                var formData = "auction_id=" + id + "&" +
                                "quantity=" + quantity;

                addShoppingCart(formData);

            },

            //夺宝 商品性情
            duobaoGoodInfo: function (e) {

                e.stopImmediatePropagation();

                window.location.hash = "duobaoInfo/" + $(e.currentTarget).data("id");


            },

            allAddToShoppingCart: function(e){
                var ids = "";
                $(".good_list").find("li").each(function () {
                    ids += $(this).data("id") + ","
                });
                //console.log(ids);
                basket.batchAddShoppingCart(ids,1,function(successData){
                    getShoppingCartNumber();
                }, function(errorData){

                });
                

            },

        });

        //商品列表
        var getGoodList = function(){
            if(type =="up"){

                $dropload.noData(false);
                $dropload.resetload();
                $dropload.unlock();
                dropload.init();
                return;
            }

            var param = {categoryId:$categoryId, page:$pageNum, page_size:$pageSize};

            Api.getCategoriesList(param, function(successData){

                if(successData.result.data.length>0){
                    var total = successData.result.total;

                    $categoryGoodCount.html(total);

                    var template = _.template($goodListItem.html());
                    $goodListContainer.append(template(successData.result));
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

        var dropload = {
            init : function(){
                $dropload = $('.good_list').dropload({
                      scrollArea : window,
                      loadDownFn : function(me){
                        type="down";
                        console.log("down");
                          if($pageNum == 1){
                              $goodListContainer.empty();
                          }
                         // getShoppingCartNumber();
                          getGoodList();
                      },
                      loadUpFn : function(me){
                        type="up";
                        console.log("up");
                          $pageNum = 1;
                          $goodListContainer.empty();

                          getGoodList();
                          //getShoppingCartNumber();
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
        
        var addShoppingCart = function( formData ){
            var param = {formData:formData};

            Api.addToShoppingCart(param, function(successData){

                console.log("加入购物车！");
                getShoppingCartNumber();
            }, function(errorData){
                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(function(data){

                        addShoppingCart(formData);

                    },function(data){


                    });
                }

            });
        };

        //得到购物车中商品数量
        var getShoppingCartNumber = function(){

            Api.getShoppingCarts(null, function(successData){

                $shoppingCartGoodCount.html(successData.result.total);
            }, function( errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(function(data){

                        getShoppingCartNumber();

                    },function(data){


                    });
                }
            });

        };

        
    return categoryGoodListView;
    });

define(['zepto', 'underscore', 'backbone', 'dropload',
        'swiper', 'echo','app/api',
        'app/utils', 'app/scroll', 'app/basket',
        'text!templates/specialGood.html'
    ],

    function($, _, Backbone, _dropload, Swiper, echo, Api, utils, scroll, basket, specialGoodTemplate) {
       
        var $page = $("#special-good-page");
        var type;
        var specialGoods;
        var $dropload;
        var $specialGoodCount;
        var $specialGoodContainer;
        var $specialGoodItem;
        var $shoppingCartGoodCount;
        var $pageNum; //页码
        var $pageSize; //每页记录数
        var specialGoodView = Backbone.View.extend({
            el: $page,
            render: function() {
                //utils.showMenu();
                $pageNum = 1;//页码
                $pageSize =4;//每页记录数

                utils.showPage($page, function() {
                        $page.empty().append(specialGoodTemplate);
                        // if(utils.storage.get("backAgain") == "yes"){
                        //     console.log("yesyesyes");
                        //     utils.storage.set("backAgain") == "no";
                        //     history.back();
                        // }
                        
                        specialGoods=[];//进入焦点的精选商品列表
                        $specialGoodContainer = $page.find(".good_list");
                        $specialGoodItem = $page.find("#special_good_item");
                        $specialGoodCount = $page.find(".special_good_count");
                        $shoppingCartGoodCount = $page.find(".shopping_cart_good_count");
                        //初始化dropload插件
                        getShoppingCartNumber(); 
                        dropload.init(); 
                    
                });

            },
            events: {
                //返回
                "tap .go_back":"goBack",
                //进入清单 购物车
                "tap .to_shopping_cart":"shoppingCart",
                //加入购物车
                "tap .add_shopping_cart":"addToShoppingCart",
                //全部加入清单
                "tap .batch_add_shoppingcart":"batchAddShoppingCart",
                //商品详情
                "tap .announced_good_list":"duobaoGoodInfo", 
            },

            goBack: function(){

                window.location.hash = ("main");
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
                var param = {formData:formData};
                basket.addShoppingCart(param,function(data){
 
                   getShoppingCartNumber();
                }, function(){

                });

            },

            batchAddShoppingCart:function(){
                if(specialGoods.length>0){
                    var auctionIds = "";

                    _.each(specialGoods,function(item){

                        auctionIds += item.id + ",";
                    });
                    basket.batchAddShoppingCart(auctionIds,1,function(){
                        getShoppingCartNumber();
                    });

                }else{
                    $.Dialog.info("精选商品列表为空，不能做次操作！");
                    return;
                }               
            },

            //夺宝 商品性情
            duobaoGoodInfo: function (e) {

                e.stopImmediatePropagation();

                window.location.hash = "duobaoInfo/" + $(e.currentTarget).data("id");


            },

        });

        //精选商品列表
        var getSpecialGoodList = function(){

            if(type =="up"){

                $dropload.noData(false);
                $dropload.resetload();
                $dropload.unlock();
                dropload.init(); 
                return;
            }

            var param = {page:$pageNum, page_size:$pageSize};

            Api.getSpecialGoodList( param, function(successData){

                if(successData.result.data.length>0){
                    var total = successData.result.total;

                    setSpecialGoods(successData.result.data);

                    $specialGoodCount.html(total);

                    var template = _.template($specialGoodItem.html());
                    $specialGoodContainer.hide();
                    $specialGoodContainer.append(template(successData.result)).show();  
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

        var getShoppingCartNumber = function(){

            basket.getShoppingCartNumber(0,function(data){
                
                $shoppingCartGoodCount.html(data);
            });
        };

        var setSpecialGoods = function(data){

            _.each(data, function(item){
               specialGoods.push(item); 
          });
        };

        var dropload = {
            init : function(){
                $dropload = $('.good_list').dropload({
                      scrollArea : window,
                      loadDownFn : function(me){//上拉加载

                        type="down";
                        // debugger
                        console.log("down");
                          if($pageNum == 1){
                              $specialGoodContainer.empty();
                          }
                          //getShoppingCartNumber();                                                                             
                          getSpecialGoodList();
                      },
                      loadUpFn : function(me){//下拉刷新
                        type="up";
                        console.log("up");
                        $pageNum = 1;

                        //$shoppingCartGoodCount.html(basket.getShoppingCartNumber(0));
                        $specialGoodContainer.empty()
                        getSpecialGoodList();
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

    return specialGoodView;
    
    });

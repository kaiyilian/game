
define(
    [
        'zepto', 'underscore', 'backbone',
        'swiper', 'echo', 'app/api', 'spinner',
        'app/utils', 'app/refreshtoken', 'app/basket',
        'text!templates/shoppingCart.html'
    ],
    function ($, _, Backbone, Swiper, echo, Api, spinner, utils, Token, basket, shoppingCartTemplate) {
        var $page = $("#shoppingCart-page");
        var $shoppingCartContain;
        var $shoppingCartItem;
        var imageRenderToken;
        var footFlag;
        var shoppingCartView = Backbone.View.extend({
            el: $page,
            render: function (foot) {
                footFlag = foot;
                utils.showPage($page, function () {

                    // if(foot == "shoppingCart"){
                    //     utils.activeMenu(4);
                    //     utils.showMenu();
                    // }else{}
                    // if(!foot){
                    //     console.log("yinc");
                    //     utils.hideMenu();
                    //     $(".good_statistics").addClass("bottom_zero");
                    // }
                    $page.empty().append(shoppingCartTemplate);
                    $shoppingCartContain = $page.find(".shopping_cart_contain");
                    $shoppingCartItem    = $page.find("#shopping_cart_item");
                    
                    $(".shopping-cart-css .ui-icon-return").hide();
                    //得到登陆状态
                    getLoginStatus();
                    initShoppingCarts();
                    //initGoodNumber();
                    
                });
            },
            events: {
                "tap .btn_go": "goAnnounced", //去逛逛
                "tap ul.announced_good_list_cart > li": "announcedInfo", //揭晓商品详情
                "tap .btn_calc": "shoppingCartCalc", //商品结算
                "tap .shopping_cart_modify": "shoppingCartModify",//编辑 购物车
                "tap .shopping_cart_list > li .choose_item": "chooseGood",//选择 商品
                "tap .choose_all": "chooseAllGood",//选择 全部
                "tap .btn_del": "delModalShow",//删除 确认弹框

                //增加数量 加1
                //"tap .increase":"increaseNumber",

                //减少数量 减1
                //"tap .decrease":"decreaseNumber",

                //"input .good_count":"text",

                //加入购物车
                "tap .add_to_shopping_cart":"addToShoppingCart",


            },

            text: function(e){

            	console.log(123);
            },
            //去逛逛
            goAnnounced: function (e) {
                e.stopImmediatePropagation();
                $this = $(e.currentTarget);
                window.location.hash = "main";
            },
            //揭晓信息
            announcedInfo: function (e) {
                e.stopImmediatePropagation();
                var $this = $(e.currentTarget);
                window.location.hash = "duobaoInfo/" + $this.data("id");
            },
            //商品结算
            shoppingCartCalc: function (e) {
                e.stopImmediatePropagation();
                window.location.hash = "shoppingCartCalc";
            },
            //编辑 购物车
            shoppingCartModify: function (e) {
                e.stopImmediatePropagation();
                var $this = $(e.currentTarget);
                //编辑状态
                if ($this.hasClass("is_modify")) {
                    $this.removeClass("is_modify").html("编辑");
                    $page.find("ul.shopping_cart_list > li").addClass("ui-whitespace")
                        .find(".choose_item").remove();
                    $page.find(".good_operate").hide().siblings(".good_statistics").show();

                    initShoppingCarts();
                }
                else {		//普通状态
                    $this.addClass("is_modify").html("完成");
                    var i = $("<i>").addClass("ui-icon-unchecked");
                    var dv = $("<div>").addClass("choose_item").addClass("display-webkit-box");
                    //i.appendTo(dv);
                    dv.empty().append($("<i>").addClass("ui-icon-unchecked").addClass("shopping_cart_i"));					
                    $page.find("ul.shopping_cart_list > li").removeClass("ui-whitespace").prepend(dv);
                    $page.find(".good_statistics").hide().siblings(".good_operate").show();

                    $page.find(".good_operate").find(".choose_all").removeClass("is_choose")
                    .empty().append(i).append("全选");
                }
                
            },
            //选择 商品
            chooseGood: function (e) {
                e.stopImmediatePropagation();
                var $this = $(e.currentTarget);
                $this.hasClass("is_choose") ? $this.removeClass("is_choose")
                    : $this.addClass("is_choose");
                isChooseAll();//判断是否全选
            },

            //选择 全部
            chooseAllGood: function (e) {
                e.stopImmediatePropagation();
                var $this = $(e.currentTarget);
                if ($this.hasClass("is_choose")) {
                    $this.removeClass("is_choose");
                    $page.find(".shopping_cart_list > li").find(".choose_item").removeClass("is_choose");
                }
                else {
                    $this.addClass("is_choose");
                    $page.find(".shopping_cart_list > li").find(".choose_item").addClass("is_choose");
                }
                initChooseItem();//选择商品后初始化
            },

            //删除 确认弹框
            delModalShow: function () {
            	var auctionIds = "";

            	$("ul.shopping_cart_list li").each(function () {

            		//console.log("is_choos" + $(this).find(".is_choose"));
            		if($(this).find(".choose_item ").hasClass("is_choose")){
            			var auctionId = $(this).find(".good_count").data("auctionid");
            			auctionIds += auctionId + ",";
            		}
            	});
                
            	if(auctionIds ==""){
        			$.Dialog.info("请选择要删除的商品！");
        			return;
        		}

            	//删除购物车中 商品
            	outOfShoppingCar(auctionIds);
            	
            },

            //增加数量 加1
            increaseNumber: function(e){

            	e.stopImmediatePropagation();

            	$this= $(e.currentTarget);

            	var	auctionId = $this.siblings(".good_count").data("auctionid");

            	var quantity = 1;

            	var formData = "auction_id=" + auctionId + "&" +
                                "quantity=" + quantity;

                toIncreaseNumber(formData);

            },

            //减少数量 减1
            decreaseNumber: function(e){

            	e.stopImmediatePropagation();

            	$this= $(e.currentTarget);

            	var	auctionId = $this.siblings(".good_count").data("auctionid");

            	var quantity = 1;

            	var formData = "auction_id=" + auctionId + "&" +
                                "quantity=" + quantity;

                toDecreaseNumber(formData);

            },

            //加入购物车
            addToShoppingCart: function(e){

                e.stopImmediatePropagation();

                var id = parseInt($(e.currentTarget).parent().data("id"));

                var quantity = parseInt(1);
                var formData = "auction_id=" + id + "&" +
                                "quantity=" + quantity;
                var param = {formData:formData};
                basket.addShoppingCart(param,function(data){
 
                   $.Dialog.success("添加成功");
                }, function(){

                });

            },



        });

        //购物车初始化
        var initShoppingCarts = function(){
            Api.getShoppingCarts(null, function(successData){

            	if( successData.result.total > 0){

            		//$(".mxep_block_empty").addClass("not_shopping");
            		$(".mxep_block_empty").hide();
            		$(".shopping_cart_modify").show();
            		var template = _.template($shoppingCartItem.html());

		            $shoppingCartContain.empty().append(template(successData.result));
                    asynLoadImage(); 
                    
                    initGoodNumber();
                       
		            
            	}else {
            		//购物车为空
            		$(".shopping_cart_contain").empty();
            		$(".shopping_cart_modify").hide();	
            		$(".mxep_block_empty").show();

                    //热门商品列表
                    getIndianaGoods(1);
            	}

                //隐藏或显示底部
	            if(!footFlag){
                        utils.hideMenu();
                        $(".good_statistics").addClass("bottom_zero");
                        $(".shopping-cart-css .ui-icon-return").show();
                }

            }, function( errorData){
                //token过期 刷新token
                if( errorData.err_code == 20002 ){
                    Token.getRefeshToken(1,function(data){
                        initShoppingCarts();
                    },function(data){
                    });
                }
            });
        };

        var getIndianaGoods = function(type){

            var param = {page: 1, page_size: 16, type: type, direction: 1};

            Api.getIndianaGoods(param, function (successData) {

                var template = _.template($("#announced_good_item_cart").html());
                $(".announced_good_list_cart").empty().append(template(successData.result));
                asynLoadImage();    
            }, function (errorData) {


            });
        };

        //购物车 商品数量初始化
        var initGoodNumber = function(){
            $("ul.shopping_cart_list li").each(function () {
                //剩余数量

                var max = $(this).find(".attend_count").attr("data-surplus_count");//商品剩余数量
                var quantity = $(this).find(".attend_count").data("quantity");//商品已经添加的数量
                //var max = surplus + quantity;//可显示的最大商品数量
                $(this).find(".shopping_cart_count").spinner({
                    value:quantity,
                    min: 1,
                    max: max,
                    blur:function(e){
                        var number = $(e.target).val();
                        var auctionid = $(e.target).data("auctionid");//夺宝商品编号

                        if(number!=null && number <=max && number >0){
                            addNumberToShoppingCart(number, auctionid);
                        }
                    },

                    add:function(e){
                        var number = $(e.target).siblings(".good_count").val();
                        var auctionid = $(e.target).siblings(".good_count").data("auctionid");//夺宝商品编号

                        if(number!=null &&number>0 &&number <= max){
                            //addToShoppingCart(number);
                            addNumberToShoppingCart(number, auctionid);
                        }
                        

                    },

                    del:function(e){              
                        var number = $(e.target).siblings(".good_count").val();
                        var auctionid = $(e.target).siblings(".good_count").data("auctionid");//夺宝商品编号
                        if(number!=null &&number>0 &&number <= max){
                            //addToShoppingCart(number);
                            addNumberToShoppingCart(number, auctionid);
                        }
                    },
                })
            });
        };

        //设定购物车中制定商品的数量
        var addNumberToShoppingCart = function(number, auctionid){
            var formData = "quantity=" + number;

            var param = {formData:formData,auction_id:auctionid};

            Api.addNumberToShoppingCart(param, function(successData){

                //$.Dialog.success("操作成功");
                refreshTotalPrice();
            }, function(errorData){
                //token过期 刷新token
                if( errorData.err_code == 20002 ){
                    Token.getRefeshToken(1,function(data){
                        addNumberToShoppingCart();
                    },function(data){
                    });
                }
            });
        };

        //加入购物车
        var addToShoppingCart = function(e){

            var id = parseInt($(e.currentTarget).parent().data("id"));

            var quantity = parseInt(1);
            var formData = "auction_id=" + id + "&" +
                            "quantity=" + quantity;
            var param = {formData:formData};
            basket.addShoppingCart(param,function(data){

               $.Dialog.success("添加成功");
            }, function(){

            });

        };

        //判断是否全选
        var isChooseAll = function () {
            var choose_length = $page.find(".shopping_cart_list > li .is_choose").length;
            var length = $page.find(".shopping_cart_list > li").length;
            if (choose_length == length) {
                $page.find(".choose_all").addClass("is_choose");
            }
            else {
                $page.find(".choose_all").removeClass("is_choose");
            }
            initChooseItem();//选择商品后初始化
        };

        //选择商品后初始化
        var initChooseItem = function () {
            var $choose_all = $page.find(".choose_all");
            //全选
            if ($choose_all.hasClass("is_choose")) {
                var i = $("<i>").addClass("ui-icon-checked");
                $choose_all.empty().append(i).append("取消全选");
            }
            else {
                var i = $("<i>").addClass("ui-icon-unchecked");
                $choose_all.empty().append(i).append("全选");
            }
            //单独商品
            $page.find(".shopping_cart_list > li").each(function () {
                var $choose_item = $(this).find(".choose_item");
                if ($choose_item.hasClass("is_choose")) {
                    var i = $("<i>").addClass("ui-icon-checked");
                    $choose_item.empty().append(i);
                }
                else {
                    var i = $("<i>").addClass("ui-icon-unchecked");
                    $choose_item.empty().append(i);
                }
            });
        };

        //增加购物车中某一个商品的数量
        var toIncreaseNumber = function(formData){

        	var param = {formData:formData};

            Api.addToShoppingCart(param, function(successData){

                refreshTotalPrice();
                $.Dialog.success("添加成功！");
            }, function(errorData){
                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(function(data){

                        toIncreaseNumber(formData);

                    },function(data){


                    });
                }

            });
        };

        //减少购物车中某一个商品的数量
        var toDecreaseNumber = function(formData){

        	var param = {formData:formData};

            Api.decreaseToShoppingCart(param, function(successData){

                refreshTotalPrice();
                $.Dialog.success("减少成功！");
            }, function(errorData){
                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(function(data){

                        toDecreaseNumber(formData);

                    },function(data){


                    });
                }

            });
        };

        //删除购物车中 商品
        var outOfShoppingCar = function(auctionIds){

        	$.Dialog.confirm('', '是否确认删除', function() {

        		
        		var formData = "auction_ids=" + auctionIds ;

        		var param = {formData:formData};

        		Api.delGoodsFromShopCart(param, function(successsData){

        			$.Dialog.success("删除成功");

        			$(".shopping_cart_modify").removeClass("is_modify").html("编辑");
                    $page.find("ul.shopping_cart_list > li").addClass("ui-whitespace")
                        .find(".choose_item").remove();
                    $page.find(".good_operate").hide().siblings(".good_statistics").show();

                    initShoppingCarts();

        		}, function(errorData){
        			//token过期 刷新token
	                if( errorData.err_code == 20002 ){
	                    Token.getRefeshToken(function(data){
	                        outOfShoppingCar();
	                    },function(data){
	                    });
	                }

        		});

                      
            }, '取消', '确定');
        };

        //刷新商品数量和所需梦想币
        var refreshTotalPrice = function(){
        	Api.getShoppingCarts(null, function(successData){        		
        		$(".total_count").html(successData.result.total);
        		$(".total_price").html(successData.result.total_price+"梦想币");
        		$(".total_price").data("count",successData.result.total_price);
            }, function( errorData){
                //token过期 刷新token
                if( errorData.err_code == 20002 ){
                    Token.getRefeshToken(function(data){
                        initShoppingCarts();
                    },function(data){
                    });
                }
            });
        };

        
        var getLoginStatus = function(){

            if( utils.isLogined()){
                //登陆成功
                return;
            }else{
                utils.storage.set("loginSuccessBack",window.location.hash);
                window.location.href = window.LOGIN_REDIRECT_URL;
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

        return shoppingCartView;
    }
);
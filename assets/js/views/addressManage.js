define(['zepto', 'underscore', 'backbone', 'dropload',
        'swiper', 'echo', 'frozen', 'app/api',
        'app/utils', 'app/refreshtoken',
        'text!templates/addressManage.html'
    ],

    function($, _, Backbone, _dropload, Swiper, echo, frozen, Api, utils, Token, addressManageTemplate) {
       
        var $page = $("#address-manage-page");
        var comFrom = null;
        var comId = null;
        var addressId;
        var $addressListContainer;
        var $addressListItem;
        var $dropload;
        var $pageNum; //页码
        var $pageSize; //每页记录数
        var addressManageView = Backbone.View.extend({
            el: $page,
            render: function(type,id) {
                comFrom = type;
                comId = id;
                utils.showPage($page, function() {
                    $page.empty().append(addressManageTemplate);

                   $pageNum = 1;//页码
                   $pageSize =2;//每页记录数
                   $addressListContainer = $page.find(".user_address_list");
                   $addressListItem = $page.find("#address_list_item");
                   dropload.init(); 
                });
            },
            events: {
                //选择收货地址
                "tap .address_choose":"addressChoose",
                //新增收货地址
                "tap .address_add":"addressAdd",
                //编辑收货地址
                "tap .icon_address_modify":"addressModify",
            }, 

            //选择收货地址
            addressChoose: function(e){

                e.stopImmediatePropagation();

                $this = $(e.currentTarget);

                addressId = $(e.currentTarget).data("id");

                doAddressChoose($this);              

            },

            //新增收货地址
            addressAdd: function(){

                window.location.hash = "addressInfo";
            },

            //修改收货地址
            addressModify: function(e){

                e.stopImmediatePropagation();

                $this = $(e.currentTarget);

                window.location.hash = "addressInfo/" + $this.parent().data("id");
            },


        });

        var doAddressChoose = function($self){

            // //已经选择
            // if ($self.hasClass("ui-icon-checked")) {
            //     console.log("yes");
            //     return
            // }

            //更改样式
            $self.removeClass("ui-icon-unchecked").removeClass("address_choose").addClass("ui-icon-checked").addClass("address_choose").parent("li").addClass("active").siblings().removeClass("active");
            
            $self.parent("li").siblings().find(".address_choose").removeClass("ui-icon-unchecked").removeClass("address_choose").removeClass("ui-icon-checked").addClass("ui-icon-unchecked").addClass("address_choose");

            if(comFrom == "orderConfirm"){//确认订单选择地址
                

                utils.storage.set("orderConAddId",$self.data("id"));

                window.history.go(-1);
                return;
            }


            if(comFrom != null && comId !=null){//中奖明细  立即领取
                receiveImmediately(comFrom,comId);
            }
        };

        //得到地址列表
        var getAddressList = function(){

            if(type =="up"){

                $dropload.noData(false);
                $dropload.resetload();
                $dropload.unlock();
                dropload.init(); 
                return;
            }

            var param = {page:$pageNum, page_size:$pageSize};

            Api.getAddressList(param, function(successData){

                if(successData.result.data.length>0){

                    var template = _.template($addressListItem.html());

                    $addressListContainer.append(template(successData.result));
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

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        getAddressList();

                    },function(data){

                        window.location.href = window.LOGIN_REDIRECT_URL;
                    });
                }
            });
        };

        var dropload = {
            init : function(){
                $dropload = $('.user_address_list').dropload({
                      scrollArea : window,
                      loadDownFn : function(me){

                        type="down";
                        // debugger
                        console.log("down");
                          if($pageNum == 1){
                              $addressListContainer.empty();
                          }
                                                                                                      
                          getAddressList();
                      },
                      loadUpFn : function(me){
                        type="up";
                        console.log("up");
                        $pageNum = 1;

                        getAddressList();
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

        var receiveImmediately = function(comFrom,comId){

            var formData = "address_id=" + addressId ;

            var param = {formData:formData,order_id:comId};

            Api.receiveImmediately(param, function(successData){

                $.Dialog.success("领取成功");

                //window.location.hash = "prizeDetail/" + comId;
                window.history.go(-1);
            }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(1,function(data){  
                        //1 需要先判断是否登录
                        receiveImmediately(comFrom,comId);

                    },function(data){

                        
                    });
                }
            });

        };

        
    return addressManageView;
    });

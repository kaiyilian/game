define(['zepto', 'underscore', 'backbone',
        'echo','app/api',
        'app/utils', 'dropload', 'app/refreshtoken',
        'text!templates/myMessage.html'
    ],

    function($, _, Backbone, echo, Api, utils, _dropload, Token, myMessageTemplate) {
       
        var $page = $("#my-message-page");
        var $dropload;
        var $messageListContain;
        var $messageListItem;
        var $pageNum; //页码
        var $pageSize; //每页记录数
        var mySettingView = Backbone.View.extend({
            el: $page,
            render: function() {
                utils.showPage($page, function() {

                    $page.empty().append(myMessageTemplate);

                    $pageNum = 1;//页码

                    $pageSize =2;//每页记录数

                    $messageListContain = $page.find(".message_list");

                    $messageListItem = $page.find("#message_list_item");

                    //初始化dropload插件
                    dropload.init(); 
                        
                });
            },
            events: {
              
              "tap .to_message_info":"toMessageInfo",
            }, 

            toMessageInfo: function(e){

                // //var href = "mxep:/ydd100.cn/page=auctions&id=?";
                // var text = href.substr(21);
                // console.log( href.substr(21));
                // console.log(text.split("&"));s
                // var attr = text.split("&");
                // console.log(attr[0]);

                e.stopImmediatePropagation();

                var href = $(e.currentTarget).data("href");

                if(href == ""){
                    return;
                } 

                if(href.indexOf("mxep://") >= 0){
                    //TODO
                }else{
                     window.location.href = href;
                }
            },

        });

        //得到消息
        var getMyMessageList = function(){
            if(type =="up"){

                $dropload.noData(false);
                $dropload.resetload();
                $dropload.unlock();
                dropload.init();
                return;
            }

            var param = {page:$pageNum, page_size:$pageSize};

            Api.getMyMessageList(param, function(successData){
                if(successData.result.data.length>0){

                    var template = _.template($messageListItem.html());

                    $messageListContain.append(template(successData.result));

                    $pageNum++;
                    $dropload.noData(false);
                    $dropload.resetload();
                    $dropload.unlock();
                } else {

                    $dropload.noData(true);
                    $dropload.resetload();
                    $dropload.lock("down");
                }
               

            }, function(errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){
                    Token.getRefeshToken(1,function(data){
                        getMyMessageList();
                    },function(data){
                    });
                }
            });
        };

        var dropload = {
            init : function(){
                $dropload = $('.message_list').dropload({
                      scrollArea : window,
                      loadDownFn : function(me){
                        type="down";
                        console.log("down");
                          if($pageNum == 1){
                              $messageListContain.empty();
                          }
                          getMyMessageList();
                      },
                      loadUpFn : function(me){
                        type="up";
                        console.log("up");
                          $pageNum = 1;
                          $messageListContain.empty();

                          getMyMessageList();
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

        
    return mySettingView;
    });

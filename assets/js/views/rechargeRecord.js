define(['zepto', 'underscore', 'backbone',
        'swiper', 'echo', 'dropload', 'app/api',
        'app/utils', 
        'text!templates/rechargeRecord.html'
    ],

    function($, _, Backbone, Swiper, echo, _dropload, Api, utils, rechargeRecordTemplate) {
       
        var $page = $("#recharge-record-page");
        var $dropload;
        var $rechargeRecordContain;
        var $rechargeRecordItem;
        var $pageNum; //页码
        var $pageSize; //每页记录数
        var rechargeRecordView = Backbone.View.extend({
            el: $page,
            render: function(id, name) {
                utils.showPage($page, function() {
                    $page.empty().append(rechargeRecordTemplate);

                    $pageNum = 1;//页码
                    $pageSize =4;//每页记录数
                    $rechargeRecordContain = $page.find(".recharge_record");
                    $rechargeRecordItem = $page.find("#recharge_record_item");


                    //初始化dropload插件
                    dropload.init(); 

                });
            },
            events: {
                //充值
                "tap .btn_recharge":"recharge",
              
            }, 

            recharge: function() {

                window.location.hash = "recharge";
            },


        });

        //充值记录列表
        var getRechargeRecord = function(){

            if(type =="up"){

                $dropload.noData(false);
                $dropload.resetload();
                $dropload.unlock();
                dropload.init(); 
                return;
            }

            var param = {page:$pageNum, page_size:$pageSize};

            Api.getRechargeRecord( param, function(successData){

                if(successData.result.data.length>0){

                    var template = _.template($rechargeRecordItem.html());

                    $rechargeRecordContain.empty().append(template(successData.result));
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
                              $rechargeRecordContain.empty();
                          }
                          getRechargeRecord();
                      },
                      loadUpFn : function(me){
                        type="up";
                        console.log("up");
                        $pageNum = 1;
                        
                        getRechargeRecord();
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

        
    return rechargeRecordView;
    });

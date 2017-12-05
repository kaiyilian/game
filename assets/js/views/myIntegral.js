define(['zepto', 'underscore', 'backbone', 
        'swiper', 'echo', 'frozen', 'app/api',
         'app/refreshtoken', 'app/utils', 'dropload',
        'text!templates/myIntegral.html'
    ],

    function($, _, Backbone, Swiper, echo, frozen, Api, Token, utils, _dropload, myIntegralTemplate) {
       
        var $page = $("#my-integral-page");
        var type = 1;// 需要先判断是否登陆登陆
        var $categoryList;
        var $dropload;
        var $pageNum;
        var $pageSize;
        var $incomePageNum; //收入页码
        var $incomePageSize; //收入每页记录数
        var $usePageNum; //支出页码
        var $usePageSize; //支出每页记录数
        var recordType =1;//记录类型 1：收入记录； 2：支出记录 默认为收入记录
        var $recordContain;
        var $recordItem;
        var myIntegralView = Backbone.View.extend({
            el: $page,
            render: function(id, name) {
                utils.showPage($page, function() {
                    $page.empty().append(myIntegralTemplate);

                    $recordItem = $page.find("#income_record_item");

                    $pageNum = 1;
                    $pageSize = 4;
                    //初始化账户积分
                    initAccountInte();

                    //初始化积分记录
                    initRecordList();
                });

                initTab();
            },
            events: {

                //积分说明
                "tap .icon-rule":"pointsRemark",

                //积分兑换 梦想币
                "tap .btn_exchange_mxb":"integralExchange",
              
            },

            pointsRemark: function(){

                window.location.hash = "pointsRemark";
            },

            integralExchange: function(){

                window.location.hash = "integralExchange";
            },


        });

        //账户积分
        var initAccountInte = function(){            
            var  param = null;

            Api.getAccountIntegration(param,function(data){

                $(".integral_balance").html(data.result.member.points);
            }, function(errorData){

                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(type,function(data){

                        initAccountInte();

                    },function(data){


                    });
                }
            });

        };

        //初始化积分记录
        var initRecordList = function(){

            recordType = 1;
            $pageNum =1;
            $recordContain = $(".income_record");
            //初始化dropload插件
            $dropload = null;
            dropload.init();

        };      

        //记录列表
        var getRecordList = function(){
            if(droploadType =="up"){

                $dropload.noData(false);
                $dropload.resetload();
                $dropload.unlock();
                dropload.init(); 
                return;
            }
            
            
            var param = {recordType:recordType, page:$pageNum, page_size:$pageSize};
                     

            //查询积分记录
            Api.getRecordList(param, function(successData){

                if(successData.result.data.length>0){
                    successData.result.data.recordType = recordType;
                    var template = _.template($recordItem.html());
                    $recordContain.append(template(successData.result));

                    
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
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(type,function(data){

                        getRecordList();

                    },function(data){

                       
                    });
                }

            });

            
        };

        var initTab = function(){
			utils.clearTab("my-integral-page");
            //滑动效果
            var tab = new fz.Scroll('.ui-tab', {
                    role: 'tab',
                    autoplay: false
            });

            tab.on('scrollEnd', function (curPage) {
                    if (curPage == 0) {//收入记录
                        //incomePageNum  incomePageSize usePageNum 

                        recordType = 1;
                        $recordContain = $(".income_record");
                    }

                    if (curPage == 1) {//支出记录
                        recordType = 2;
                        $recordContain = $(".use_record");
                    }

                    $recordContain.empty();
                    $pageNum = 1;
                    $dropload = null;
                    dropload.init();
            });

        };

        var dropload = {
            init : function(){
                //$dropload = $('.income_record').dropload({
                $dropload = $recordContain.dropload({
                      scrollArea : window,
                      loadDownFn : function(me){
                        droploadType="down";
                        console.log("down");
                        if($pageNum == 1 ){
                            $recordContain.empty();
                        }

                        getRecordList();
                      },
                      loadUpFn : function(me){
                        droploadType="up";
                        console.log("up");
                        $pageNum = 1;

                        $recordContain.empty();
                        getRecordList();
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

        
        
        
    return myIntegralView;
    });

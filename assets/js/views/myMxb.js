define(['zepto', 'underscore', 'backbone', 'dropload',
        'swiper', 'echo', 'frozen', 'app/api', 'app/refreshtoken',
        'app/utils', 
        'text!templates/myMxb.html'
    ],

    function($, _, Backbone, _dropload,  Swiper, echo, frozen, Api, Token, utils, myMxbTemplate) {
       
        var $page = $("#my-mxb-page");
        var type = 1;// 需要先判断是否登陆登陆
        var $dropload;
        var $incomePageNum; //收入页码
        var $incomePageSize; //收入每页记录数
        var $usePageNum; //支出页码
        var $usePageSize; //支出每页记录数
        var recordType =1;//记录类型 1：收入记录； 2：支出记录 默认为收入记录
        var $recordContain;
        var $recordItem;
        var myMxbView = Backbone.View.extend({
            el: $page,
            render: function() {
                utils.showPage($page, function() {
                    $page.empty().append(myMxbTemplate);

                    $recordItem = $page.find("#income_record_item");
                    $incomePageNum = 1;//页码
                    $incomePageSize =4;//每页记录数
                    // $usePageNum = 1;//页码
                    // $usePageSize =4;//每页记录数

                    //初始化梦想币
                    initBalanceInte();

                    //初始化梦想币记录
                    initBalanceList();
                });

                initTab();
            },
            events: {
                //充值
              "tap .btn_recharge":"btnRecharge",
            }, 

            btnRecharge: function(){

                window.location.hash = "recharge";
            }



        });

        //账户梦想币
        var initBalanceInte = function(){            
            var  param = null;

            Api.getAccountIntegration(param,function(data){

                $(".mxb_balance").html(data.result.member.balance);
            }, function(errorData){

                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(type,function(data){

                        initBalanceInte();

                    },function(data){


                    });
                }
            });

        };

        //初始化梦想币记录
        var initBalanceList = function(){

            recordType = 1;
            $incomePageNum =1;
            $recordContain = $(".income_record");
            //初始化dropload插件
            $dropload = null;
            dropload.init();

        };

        var initTab = function(){
            utils.clearTab("my-mxb-page");
            //滑动效果
            var tab = new fz.Scroll('.ui-tab', {
            //var tab = new fz.Scroll($page.find('.ui-tab'), {
                    role: 'tab',
                    autoplay: false
            });

            tab.on('scrollEnd', function (curPage) {
                    if (curPage == 0) {//收入记录 
                        recordType = 1;
                        // $(".content_li").hide();
                        // $(".income_record_li").show();
                        $recordContain = $(".income_record");
                    }
                    if (curPage == 1) {//支出记录
                        recordType = 2;
                        // $(".content_li").hide();
                        // $(".use_record_li").show();
                        $recordContain = $(".use_record");
                    }
                    $recordContain.empty();
                    $incomePageNum = 1;
                    $dropload = null;
                    dropload.init();
            });

        };

        //记录列表
        var getBalancesList = function(){ 
            if(droploadType =="up"){

                $dropload.noData(false);
                $dropload.resetload();
                $dropload.unlock();
                dropload.init(); 
                return;
            }

            //incomePageNum  incomePageSize usePageNum usePageSize recordType
            
            var param = {recordType:recordType, page:$incomePageNum, page_size:$incomePageSize};
                    

            //查询梦想币记录
            Api.getBalancesList(param, function(successData){

                if(successData.result.data.length>0){
                    successData.result.data.recordType = recordType;
                    var template = _.template($recordItem.html());
                    $recordContain.append(template(successData.result));
                    
                    $incomePageNum++;
                    
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

                        getBalancesList();

                    },function(data){

                        
                    });
                }

            });

            
        };

        var dropload = {
            init : function(){
                //$dropload = $('.ui-tab-content').dropload({
                $dropload = $recordContain.dropload({
                      scrollArea : window,
                      loadDownFn : function(me){
                        droploadType="down";
                        console.log("down");
                        if($incomePageNum == 1  ){
                            $recordContain.empty();
                        }

                        getBalancesList();
                      },
                      loadUpFn : function(me){
                        droploadType="up";
                        console.log("up");
                        $incomePageNum = 1;
                        $recordContain.empty();

                        getBalancesList();
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
                $incomePageNum = 1;
                flag = flag || false;
                $dropload.unlock("down");
                $dropload.noData(flag);
                $dropload.resetload();
            }
        };
        
    return myMxbView;
    });

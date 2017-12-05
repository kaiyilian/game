define(['zepto', 'underscore', 'backbone', 'dropload',
        'swiper', 'echo', 'frozen', 'app/api',
        'app/refreshtoken', 'app/utils', 
        'text!templates/myPackage.html'
    ],

    function($, _, Backbone, _dropload, Swiper, echo, frozen, Api, Token, utils, myPackageTemplate) {
       
        var $page = $("#my-package-page");
        var type = 1;// 需要先判断是否登陆登陆
        var $dropload;
        var $pageNum;
        var $pageSize;
        var $notUsePageNum; //可使用红包 页码
        var $notUsePageSize; //可使用红包 每页记录数
        var $usePageNum; //已使用红包 页码
        var $usePageSize; //已使用红包 每页记录数
        var $invalidPageNum; //已失效红包 页码
        var $invalidPageSize; //已失效红包 每页记录数
        var packageType =1;//红包类型 1：可使用红包； 2：已使用红包； 3：已失效红包 默认为可使用红包；
        var $packageContain;
        var $recordItem;
        var myPackageView = Backbone.View.extend({
            el: $page,
            render: function(id, name) {
                utils.showPage($page, function() {
                    $page.empty().append(myPackageTemplate);

                    $packageItem = $page.find("#package_item");
                    

                    $pageNum = 1;
                    $pageSize = 4;
                    initTab();
                    //初始化红包记录
                    initPackageList();
                });

                
            },
            events: {
              
            }, 



        });

        //初始化积分记录
        var initPackageList = function(){

            packageType = 1;
            $pageNum =1;
            $packageContain = $(".package_not_use");
            //初始化dropload插件
            $dropload = null;
            dropload.init();

        };

        //红包列表
        var getPackageList = function(){
            if(droploadType =="up"){

                $dropload.noData(false);
                $dropload.resetload();
                $dropload.unlock();
                dropload.init(); 
                return;
            }

        //$notUsePageNum   $notUsePageSize    $usePageNum  $usePageSize $invalidPageNum $invalidPageSize packageType

            
            var param = {packageType:packageType, page:$pageNum, page_size:$pageSize};
                       

            //查询红包记录
            Api.getPackageList(param, function(successData){

                if(successData.result.data.length>0){

                    var template = _.template($packageItem.html());
                    $packageContain.append(template(successData.result));
                    
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

                        getPackageList();

                    },function(data){

                       
                    });
                }

            });

            
        };

        var initTab = function(){
            utils.clearTab("my-package-page");
            //$("#my-mxb-page").empty();
            //滑动效果
            var tab = new fz.Scroll('.ui-tab', {
                    role: 'tab',
                    autoplay: false
            });

            tab.on('scrollEnd', function (curPage) {
                    if (curPage == 0) {         //可使用
                        
                        packageType = 1;
                        $packageContain = $(".package_not_use");
                    }
                    if (curPage == 1) {         //已使用
                        
                        packageType = 2;
                        $packageContain = $(".package_used");
                    }
                    if (curPage == 2) {         //已失效
                        
                        packageType = 3;
                        $packageContain = $(".package_invalid");
                    }

                    $packageContain.empty();
                    $pageNum = 1;
                    $dropload = null;
                    dropload.init();
            });

        };

        var dropload = {
            init : function(){
                //$dropload = $('.income_record').dropload({
                    //$notUsePageNum  $usePageNum $invalidPageNum packageType
                $dropload = $packageContain.dropload({
                      scrollArea : window,
                      loadDownFn : function(me){
                        droploadType="down";
                        if($pageNum == 1){
                            $packageContain.empty();
                        }
                        
                        

                        getPackageList();
                      },
                      loadUpFn : function(me){
                        droploadType="up";
                        $pageNum=1                   
                        $packageContain.empty();
                        getPackageList();
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

        
    return myPackageView;
    });

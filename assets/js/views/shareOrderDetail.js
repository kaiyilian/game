define(['zepto', 'underscore', 'backbone',
        'swiper', 'echo','app/api',
        'app/utils', 
        'text!templates/shareOrderDetail.html'
    ],

    function($, _, Backbone, Swiper, echo, Api, utils, shareOrderDetailTemplate) {
       
        var $page = $("#share-order-detail-page");
        var $categoryList;
        var imageRenderToken = null;
        var shareOrderDetailView = Backbone.View.extend({
            el: $page,
            render: function(shareId) {
                utils.showPage($page, function() {
                    //$page.empty().append(shareOrderDetailTemplate);
                    initData(shareId);
                    
                });
            },
            events: {
            },

            

        });

        var initData = function(shareId){

                var param = {shareId:shareId};

                Api.getShareDetail(param, function(successData){

                    var template = _.template(shareOrderDetailTemplate);

                    $page.empty().append(template(successData.result));

                    asynLoadImage();

                }, function(errorData){

                });
        };

        var asynLoadImage = function() {
                echo.init({
                    throttle: 250,
                });

                if (imageRenderToken == null) {
                    imageRenderToken = window.setInterval(function() {
                        echo.render();
                    }, 350);
                }
        };

        
    return shareOrderDetailView;
    });

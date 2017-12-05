define(['zepto', 'underscore', 'backbone',
        'echo','app/api',
        'app/utils', 
        'text!templates/nickName.html'
    ],

    function($, _, Backbone, echo, Api, utils, nickNameTemplate) {
       
        var $page = $("#nick-name-page");

        var $userNickname;
        var nickNameView = Backbone.View.extend({
            el: $page,
            render: function() {
                utils.showPage($page, function() {
                    $page.empty().append(nickNameTemplate);

                    $userNickname  =$page.find(".user_nickname");                    

                        
                });
            },
            events: {
                "tap .btn_save":"saveNickName",
            }, 

            saveNickName: function(){
                console.log("saveNickName");
                var nickname = $userNickname.val();
                if( !verify( nickname ))
                    return;

                var formData = "nickname=" + nickname; 

                var param = { formData:formData };

                Api.saveNickName( param, function() {

                }, function(data) {

                    $.Dialog.success("昵称保存成功！");

                    window.location.hash = "personalInfo" ;
                }, function(data) {

                });

            },

        });

        var verify = function( nickname ){
             if( nickname == ""){

                $.Dialog.info("请输入昵称！");

                return false ;
             }

             return true;
            
        };

        
    return nickNameView;
    });

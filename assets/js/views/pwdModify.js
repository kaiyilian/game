define(['zepto', 'underscore', 'backbone',
        'echo', 'app/api', 'app/refreshtoken',
        'app/utils', 
        'text!templates/pwdModify.html'
    ],

    function($, _, Backbone, echo, Api, Token, utils, pwdModifyTemplate) {

        var $page = $("#pwd-modify-page");

        var $currentPassword;

        var $newPassword;

        var $confirmPassword;

        var pwdModifyView = Backbone.View.extend({
            el: $page,
            render: function() {
                utils.showPage($page, function() {

                    $page.empty().append(pwdModifyTemplate);

                    $currentPassword = $page.find(".current_password");

                    $newPassword     = $page.find(".new_password");

                    $confirmPassword = $page.find(".confirm_password");
                });
            },
            events: {

                "tap .btn_submit": "modifyPwd",
              
            },

            modifyPwd: function(){
                var currentPassword =  $currentPassword.val() ;

                var newPassword     = $newPassword.val();

                var confirmPassword = $confirmPassword.val();

                if( !verify( currentPassword, newPassword, confirmPassword )){

                    return;
                }

                var formData = "password=" + currentPassword + "&" +
                               "new_password=" + newPassword + "&" +
                               "repeat_password=" + confirmPassword;

                var param = { formData:formData };

                Api.modifyPwd(param,function(){

                }, function(data){

                    window.location.hash = "personalInfo";
                }, function(data){

                });

            },

        });

        var verify = function ( currentPassword, newPassword, confirmPassword ){

            if( currentPassword.length < 6 || newPassword.length < 6 || confirmPassword.length < 6){

              $.Dialog.info( "密码的长度必须为6~15！" );  

              return false;
            } 

            if( newPassword != confirmPassword){

                $.Dialog.info( "您前后两次输入的密码不一致" );  

                return false;
            }

            if( currentPassword ==""){

                $.Dialog.info( "当前密码不能为空" );

                return false;
            }

            if( newPassword ==""){
                
                $.Dialog.info( "新密码不能为空" );

                return false;
            }

            if( confirmPassword ==""){
                
                $.Dialog.info( "确认密码不能为空" );

                return false;
            }

            return true;

        };

        
    return pwdModifyView;
    });

/**刷新token的相关操作；
*author czy_1；
*time   16/9/21；
*/
define(['zepto', 'app/utils', 'app/api'],function($, utils, Api){

	var getRefeshToken = function(type ,success, error){
        console.log(type);
        //type = 1 需要先判断是否登陆
        //type = 0 不需要先判断是否登录
		if( utils.isLogined() ) {
			//已经登陆
			var formData = "refresh_token=" + utils.storage.get( "refresh_token" );
			var param = { formData:formData };
			Api.refreshToken(param,function(){
				//brfore;

			},function(successData){
				//success;
				utils.storage.set("access_token", successData.result.access_token);

				utils.storage.set("expire_time", successData.result.expire_time);

				utils.storage.set("refresh_token", successData.result.refresh_token);

				typeof success == 'function' && success(successData);
			},function(errorData){
				//error;
				typeof error == 'function' && error(errorData);
			});
			

		} else {
			//没有登陆 去登陆
			//TODO
			if(type == 1){
				console.log(window.location.hash);
				utils.storage.set("loginSuccessBack",window.location.hash);
				$.Dialog.info("你还没有登陆，即将跳到登陆页面");
				console.log("没有登陆 去登陆");
				window.location.href = window.LOGIN_REDIRECT_URL;
			}
			
		}
	};

	return{
		getRefeshToken:getRefeshToken,
	};



});
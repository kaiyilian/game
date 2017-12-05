define(['zepto', 'app/utils','underscore', 'app/api', 'app/refreshtoken'], function($, utils, _, Api, Token) {

   
	return {
  		// 加
  		increase: function(itemId, quantity, type, callback, startTime) {
              $.ajax({
                  url: window.ctx + "shoppingCart/increase",
                  data: {
                      itemId: itemId,
                      quantity: quantity,
                      type: type,
                      startTime: startTime
                  },
                  loadMask: false,
                  type: "POST",
                  dataType: "json",
                  async: false,
                  success: function(data) {
                      typeof callback == "function" && callback(data);
                  }
              });
  		},

      /**
       * 得到购物车中商品数量
       * @param  {[type]}   type               [是否需要登陆 （1：需要； 0：不需要）]
       * @return {[type]}                      [ description]
       */
  		getShoppingCartNumber: function(type,callback){
        //如果不需要登陆 且 没有登陆 返回0
        //如果不需要登陆 且 已经登陆 返回真实数据
        var number = 0;
        if(type==0 && !utils.isLogined()){

          return typeof callback == "function" && callback(number);
        }
        
        Api.getShoppingCarts(null, function(successData){

                number = successData.result.total;
                typeof callback == "function" && callback(number);

            }, function( errorData){

                //token过期 刷新token
                if( errorData.err_code == 20002 ){

                    Token.getRefeshToken(function(data){

                        getShoppingCartNumber();

                    },function(data){


                    });
                }
            });
      },

      //加入购物车
      addShoppingCart: function(param, success, error){
          Api.addToShoppingCart(param, function(successData){

                $.Dialog.success("添加成功！");
                typeof success == 'function' && success();
            }, function(errorData){
                //token过期 刷新token
                if( errorData.err_code == 20002 ){
                    Token.getRefeshToken(1,function(data){

                        addShoppingCart(formData);

                    },function(data){
                    });
                } else{

                }

            });
      },

      /**
       * 批量加入购物车
       * @param  {[type]}   auction_ids       [夺宝商品编号]
       * @param  {[type]}   type              [是否需要先判断登陆状态（1：需要； 0：不需要）]
       * @return {[type]}                      [ description]
       */
      batchAddShoppingCart: function(auction_ids, type,success,error){
          var formData = "auction_ids=" + auction_ids ;
          var param = {formData:formData};
          Api.batchAddShoppingCart(param, function(successData){

              $.Dialog.success("添加成功！");
              typeof success == 'function' && success();
          }, function(errorData){
              //token过期 刷新token
              if( errorData.err_code == 20002 ){
                  Token.getRefeshToken(type,function(data){

                      batchAddShoppingCart(formData);

                  },function(data){
                  });
              } else{
                $.Dialog.info("添加失败");
                typeof error == 'function' && error(errorData);
              }
          });
      },
	};
});

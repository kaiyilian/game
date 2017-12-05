/**
 * Created by LiuJie on 2016/10/8.
 */

//var _url = "http://121.41.101.63:8088/mxep-api";
//var _url = "http://mxep.ngrok.cc/mxep-api";
//var _url = "http://mxep/mxep-api";
//var _url = "http://mxep:91/mxep";
//var _url = "http://mxep.ydd100.cn/mxep-api";//线上
var _url = window.API_URL;
var urlGroup = {

	//查询揭晓列表
	announced_list: _url + "/auctions/history",
	//揭晓详情
	announced_info: _url + "/auctions",

	////发现功能 列表
	//find_func_list: _url + "/discovers",

	//获取大转盘 抽奖结果
	dzp_prize_get: _url + "/game/wheelprizes/lottery",

	//大转盘中奖记录
	dzp_prize_record_list_get: _url + "/game/wheelprizes/winning/records"
};

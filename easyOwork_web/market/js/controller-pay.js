/**
 * Created by Dumin on 2016/7/21.
 */
var app = angular.module('market.pay',[]);
app.controller('payCtrl',['$rootScope','$scope','LocalStorage','commonService','$http','AppConfig','MsgService',function($rootScope,$scope,LocalStorage,commonService,$http,AppConfig,MsgService){
	
	$scope.init = function(){
		var Identity = LocalStorage.getObject("Identity");
		$scope.form = {
			'entId' : Identity.entId,
			'entName' : Identity.entName,
			'name' : Identity.name
		}
		var orderNumber = $rootScope.$stateParams.order;
		$scope.getOrderRequestInfo = {
				header : {
					"requestId" : commonService.randomWord(false, 32),
					"timeStamp" : commonService.getNowFormatDate(),
					"applicationId" : "ezKompany-market",
					"ip" : "127.0.0.1",
					"entId": Identity.entId,
					"tokenId":Identity.tokenId
				},
				body : {
					"orderNumber":orderNumber
				}
			}
			var promise = $http.post(AppConfig.BASE_URL
					+ 'work/rest/inquiryOrder', $scope.getOrderRequestInfo);
			promise.success(function(data, status, headers, config) {
				var sts = data.body.status;
				if (sts.statusCode == 0) {
					$scope.order = data.body.data.orders[0];
				} else {
					MsgService.tomsg("无法获取订单");
				}
			});
			promise.error(function(data, status, headers, config) {
				MsgService.tomsg('无法获取订单');
			});
	}
	$scope.cancel = function(){
		$rootScope.$state.go('buy');
	}
	$scope.confirm = function(){
		$rootScope.$state.go('pay');
	}
	$scope.complete = function(){
		$rootScope.$state.go('complete',{order:$scope.order.orderNumber});
	}
	
}]);

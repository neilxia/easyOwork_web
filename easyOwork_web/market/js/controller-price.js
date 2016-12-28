/**
 * Created by Dumin on 2016/7/21.
 */
var app = angular.module('market.price',[]);
app.controller('priceCtrl',['$rootScope','$scope','LocalStorage','$cookieStore',function($rootScope,$scope,LocalStorage,$cookieStore){
	
	$scope.buy = function(type){
		var Identity = $cookieStore.get("Identity");
		if(Identity == undefined || Identity.entId == undefined)
			$rootScope.$state.go('login',{redirect_url:'/buy'});
		//如果过期也需要重新登录
		else{
			$rootScope.$state.go('buy');
		}
	}
	
}]);

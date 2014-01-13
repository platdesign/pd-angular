angular.module('pdAngular', [])

.directive('pdPopup', ['$rootScope','$timeout', function($rootScope, $timeout){
	return {
		restrict: 'E',
		template:function(el, attrs){
			return '<div class="popupWrapper" ng-show="obj"><div class="popup">'+el.html()+'</div></div>';
		},
		replace:true,
		scope:{
			name:"@"
		},
		link:function(scope, el, attrs) {
			el.on("click", function(e){
				if( $(e.target)[0] === el[0] ) {
					scope.$apply(scope.close);
				}
			});
			
			scope.focus = function(){
				el.find(".focus").focus();
			};
			
			scope.el = el;
		},
		controller:["$scope", function($scope){
			
			$scope.close = function(){
				$scope.obj = null;
				$(document).off("keydown.confirmPopup");
			};
			
			$rootScope.$on('popup:'+$scope.name, function(event, obj){

				$scope.obj = obj || true;
				$timeout($scope.focus,150);
				
				$(document).on("keydown.confirmPopup", function(e){
					if(e.which == 27) {
						$scope.$apply($scope.close);
					}
				})
			});
		}]
	}
}])


.service("$ls", function(){
	return {
		set:function(key, val){
		
			if( !angular.isString(val) || !angular.isNumber(val) ) {
				val = JSON.stringify(val);
			}
		
			localStorage.setItem(key, val);
		
		},
		get:function(key){
		
			var val = localStorage.getItem(key);
		
			if( val ) {
				return JSON.parse(val); 
			}
		}
	}
})

.factory("LocalSettings", ["$ls", "$rootScope", "$parse", function($ls, $rootScope, $parse){
	var settings = $ls.get("settings") || {};
	$rootScope.$watch(function(){ return settings; }, function(a, b){
		if( a===b ) { return; }
	
		$ls.set("settings", settings);
	}, true);

	return function(key) {
		return $parse(key)(settings) || $parse(key).assign(settings, {});
	}
}])


;
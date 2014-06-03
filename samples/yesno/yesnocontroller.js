var app = angular.module('sampleapp');

app.controller('YesNoController', ['$scope', 'close', function($scope, close) {
  
 $scope.close = function(result) {
 	close(result, 200); // close, but give 200ms for bootstrap to animate
 };

}]);
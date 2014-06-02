var app = angular.module('sampleapp');

app.controller('YesNoController', ['$scope', 'close', function($scope, close) {
  
 $scope.close = function(yes) {
 	close(yes);
 };

}]);
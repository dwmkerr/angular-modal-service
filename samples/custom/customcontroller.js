var app = angular.module('sampleapp');

app.controller('CustomController', ['$scope', 'close', function($scope, close) {

  $scope.display = true;

  $scope.close = function() {
    $scope.display = false;
 	  close();
 };

}]);
var app = angular.module('sampleapp');

app.controller('ComplexController', ['$scope', 'close', function($scope, close) {

  $scope.name = null;
  $scope.age = null;
  
  $scope.close = function() {
 	  close({
      name: $scope.name,
      age: $scope.age
    }, 200); // close, but give 200ms for bootstrap to animate
 
 };

}]);
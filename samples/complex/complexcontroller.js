var app = angular.module('sampleapp');

app.controller('ComplexController', ['$scope', 'title', 'close', function($scope, title, close) {

  $scope.name = null;
  $scope.age = null;
  $scope.title = title;
  
  $scope.close = function() {
 	  close({
      name: $scope.name,
      age: $scope.age
    }, 500); // close, but give 500ms for bootstrap to animate
 
 };

}]);
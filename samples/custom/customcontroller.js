var app = angular.module('sampleapp');

app.controller('CustomController', ['$scope', 'close', function($scope, close) {

  $scope.close = close;

}]);

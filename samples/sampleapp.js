//  Build our app module, with a dependency on the angular modal service.
var app = angular.module('sampleapp', ['angularModalService']);

app.controller('SampleController', ['$scope', 'ModalService', function($scope, ModalService) {
  
  $scope.message = "Open a modal, when you close it you'll see the result here.";

  $scope.showYesNo = function() {

    ModalService.showModal({
      templateUrl: "yesno/yesno.html",
      controller: "YesNoController"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        $scope.message = result ? "You said Yes" : "You said No";
      });
    });

  };

  $scope.showComplex = function() {

    ModalService.showModal({
      templateUrl: "complex/complex.html",
      controller: "ComplexController"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        $scope.message = "Name: " + result.name + ", age: " + result.age;
      });
    });

  };

  $scope.showCustom = function() {

    ModalService.showModal({
      templateUrl: "custom/custom.html",
      controller: "CustomController"
    }).then(function(modal) {
      modal.element.css("display", "block");
      modal.close.then(function(result) {
        $scope.message = "All good!";
      });
    });

  };

}]);
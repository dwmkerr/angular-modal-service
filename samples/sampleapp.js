//  Build our app module, with a dependency on the angular modal service.
var app = angular.module('sampleapp', ['angularModalService']);

app.controller('SampleController', ['$scope', 'ModalService', function($scope, ModalService) {
  
  $scope.message = "";

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

}]);
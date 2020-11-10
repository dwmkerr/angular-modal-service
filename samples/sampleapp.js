//  Build our app module, with a dependency on the angular modal service.
var app = angular.module('sampleapp', ['angularModalService', 'ngAnimate']);

app.config(["ModalServiceProvider", function(ModalServiceProvider) {
  //uncomment this line to set a default close delay
  //ModalServiceProvider.configureOptions({closeDelay:500});

}]);

app.controller('SampleController', ['$scope', 'ModalService', '$timeout', function($scope, ModalService, $timeout) {

  $scope.yesNoResult = null;
  $scope.complexResult = null;
  $scope.customResult = null;
  $scope.componentUser = { name: 'AngularJS User' };

  $scope.showYesNo = function() {

    ModalService.showModal({
      templateUrl: "yesno/yesno.html",
      controller: "YesNoController",
      preClose: (modal) => { modal.element.modal('hide'); }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        $scope.yesNoResult = result ? "You said Yes" : "You didn't say Yes";
      });
    });

  };

  $scope.showComplex = function() {

    ModalService.showModal({
      templateUrl: "complex/complex.html",
      controller: "ComplexController",
      preClose: (modal) => { modal.element.modal('hide'); },
      inputs: {
        title: "A More Complex Example"
      }
    }).then(function(modal) {
      modal.element.modal();

      modal.close.then(function(result) {
        if (!result) {
          $scope.complexResult = "Modal forcibly closed..."
        } else {
          $scope.complexResult  = "Name: " + result.name + ", age: " + result.age + ", source: " + result.source;
        }
      });
    });

  };

  $scope.showComponent = () => {
    ModalService.showModal({
      component: 'sampleComponent',
      bindings: {
        user: $scope.componentUser
      },
      preClose: (modal) => { modal.element.find('.modal').modal('hide'); }
    }).then((modal) => {
      // Wait for controller to append component
      $timeout(() => modal.element.find('.modal').modal());

      modal.close.then((result) => {
        $scope.componentUser.name = result;
      });
    });
  };

  $scope.showCustom = function() {

    ModalService.showModal({
      templateUrl: "custom/custom.html",
      controller: "CustomController",
      bodyClass: "custom-modal-open"
    }).then(function(modal) {
      modal.close.then(function(result) {
        $scope.customResult = "All good!";
      });
    });

  };

  $scope.keyPress = function(value) {
    if (value.keyCode == 42) {
      ModalService.closeModals(null, 500);
    }
  };

}]);

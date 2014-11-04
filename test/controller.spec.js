describe('controller', function() {

  var ModalService = null;
  var $httpBackend = null;
  var $timeout = null;

  angular.module('controllertests', ['angularModalService'])
    .controller('CloseController', function ($scope) {
    });
    .controller('InputsController', function ($scope, input1, input2) {
      $scope.input1 = input1;
      $scope.input2 = input2;
    });

  beforeEach(function() {
    module('controllertests');
    inject(function(_ModalService_, $injector) {
      ModalService = _ModalService_;
      $httpBackend = $injector.get('$httpBackend');
      $timeout = $injector.get('$timeout');
      $httpBackend.when('GET', 'some/controllertemplate.html').respond("<div id='controllertemplate'>controller template</div>");
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
 
  it('should inject the closeModal function into the controller scope', function() {

    $httpBackend.expectGET('some/controllertemplate.html');

    ModalService.showModal({
      controller: "CloseController",
      templateUrl: "some/controllertemplate.html"
    }).then(function(modal) {
      
      //  The controller we've created should put the close function on
      //  the scope, this is how we test it's been passed.
      expect(modal.scope.closeModal).not.toBeUndefined();

    });

    $httpBackend.flush();
  
  });

  it('should inject inputs and init variables to the controller', function() {

    $httpBackend.expectGET('some/controllertemplate.html');

    ModalService.showModal({
      controller: "InputsController",
      templateUrl: "some/controllertemplate.html",
      inputs: {
        input1: 15,
        input2: "hi"
      },
      init: {
        test: 'new Test'
      }
    }).then(function(modal) {
      
      //  The controller sets the inputs on the scope.
      expect(modal.scope.input1).toBe(15);
      expect(modal.scope.input2).toBe("hi");
      expect(modal.scope.test).toBe("new Test");

    });

    $httpBackend.flush();

  });

});

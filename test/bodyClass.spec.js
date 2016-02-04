describe('bodyclass', function() {

  var ModalService = null;
  var $httpBackend = null;
  var $timeout = null;
  var $document = null;

  angular.module('bodyclasstests', ['angularModalService'])
    .controller('BodyClassController', function ($scope, close) {
      $scope.close = close;
    });

  beforeEach(function() {
    module('bodyclasstests');
    inject(function(_ModalService_, $injector) {
      ModalService = _ModalService_;
      $httpBackend = $injector.get('$httpBackend');
      $timeout = $injector.get('$timeout');
      $document = $injector.get('$document');
      $httpBackend.when('GET', 'some/template1.html').respond("<div id='template'>template</div>");
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should add the specified class to the body', function() {

    $httpBackend.expectGET('some/template1.html');

    ModalService.showModal({
      controller: "BodyClassController",
      templateUrl: "some/template1.html",
      bodyClass: "custom-class"
    }).then(function(modal) {

      // We should be able to find the custom class on the body.
      expect($document.find('body')[0].classList.contains('custom-class')).toBe(true);
    });

    $httpBackend.flush();

  });

  it('should remove the specified class from the body on close', function () {
    $httpBackend.expectGET('some/template1.html');

    ModalService.showModal({
      controller: "BodyClassController",
      templateUrl: "some/template1.html",
      bodyClass: "custom-class"
    }).then(function (modal) {

      // We should be able to find the custom class on the body.
      expect($document.find('body')[0].classList.contains('custom-class')).toBe(true);

      modal.close.then(function(result) {
        // The custom class should have been removed after closing.
        expect($document.find('body')[0].classList.contains('custom-class')).toBe(false);
      });

      modal.scope.close();
    });

    $httpBackend.flush();
    $timeout.flush();
  });

});

describe('dom', function() {

  var ModalService = null;
  var rootScope = null;
  var $httpBackend = null;

  angular.module('domtests', ['angularModalService'])
    .controller('DomController', function ($scope, close) {
      $scope.close = close;
    });

  beforeEach(function() {
    module('domtests');
    inject(function(_ModalService_, $rootScope, $injector) {
      ModalService = _ModalService_;
      rootScope = $rootScope;
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'some/template1.html').respond("<div id='template1'>template1</div>");
      $httpBackend.when('GET', 'some/template2.html').respond("<div id='template1'>template2</div>");
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
 
  it('should add the template html to the dom', function() {

    $httpBackend.expectGET('some/template1.html');

    ModalService.showModal({
      controller: "DomController",
      templateUrl: "some/template1.html"
    }).then(function(modal) {
      
      // We should be able to find the element that has been created in the dom.
      expect(document.getElementById('template1')).not.toBe(null);

    });

    $httpBackend.flush();
  
  });
 
  xit('should remove the template html from the dom when the controller closes the modal', function() {

    $httpBackend.expectGET('some/template2.html');

    ModalService.showModal({
      controller: "DomController",
      templateUrl: "some/template2.html"
    }).then(function(modal) {
      
      // We should be able to find the element that has been created in the dom.
      var template2Before = document.getElementById('template2');

      modal.close.then(function(result) {
        expect(document.getElementById('template2')).toBeUndefined();
      });

      modal.scope.close();
      rootScope.$apply();

    });

    $httpBackend.flush();
  
  });

});
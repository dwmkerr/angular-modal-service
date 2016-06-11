describe('template', function() {

  var ModalService = null;
  var rootScope = null;
  var $httpBackend = null;

  angular.module('templatetests', ['angularModalService'])
    .controller('TemplateController', function ($scope) {
    });

  beforeEach(function() {
    angular.mock.module('templatetests');
    inject(function(_ModalService_, $rootScope, $injector) {
      ModalService = _ModalService_;
      rootScope = $rootScope;
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'some/template.html').respond("<div>template</div>");
      $httpBackend.when('GET', 'some/invalid/template.html').respond(404, 'Not Found');
    });
  });

  afterEach(inject(function($templateCache) {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $templateCache.removeAll();
  }));

  it('should http get the specified template url', function() {

    $httpBackend.expectGET('some/template.html');

    ModalService.showModal({
      controller: "TemplateController",
      templateUrl: "some/template.html"
    }).then(function(modal) {
      expect(modal).not.toBe(null);
    });

    $httpBackend.flush();
  
  });

  it('should fail to get an invalid template url', function() {

    ModalService.showModal({
      controller: "TemplateController",
      templateUrl: "some/invalid/template.html"
    }).then(function(modal) {
      
    }).catch(function(error) {
      expect(error).not.toBe(null);
    });

    $httpBackend.flush();
  
  });

  it('should use the template cache for subsequent requests for the same template', 
    inject(function($templateCache) {

    $httpBackend.expectGET('templatetobecached.html').respond('<div>template</div>');

    ModalService.showModal({
      controller: "TemplateController",
      templateUrl: "templatetobecached.html"
    }).then(function(modal) {

      //  The template should now be cached...
      spyOn($templateCache, 'get').and.callThrough();

      ModalService.showModal({
        controller: "TemplateController",
        templateUrl: "templatetobecached.html"
      }).then(function(modal) {
        //  ...so get should have been called.
        expect(modal).not.toBe(null);
        expect($templateCache.get).toHaveBeenCalledWith('templatetobecached.html');
      });

    });

    $httpBackend.flush();

  }));

  it('should use the template cache correctly if the template is precached',
    inject(function($templateCache, $http) {

    $httpBackend.expectGET('templatetobeprecached.html').respond('<div>template</div>');

    //  Fetch the template (i.e. precache).
    $http.get('templatetobeprecached.html', {cache: $templateCache});  

    //  The template should now be cached...
    spyOn($templateCache, 'get').and.callThrough();

    ModalService.showModal({
      controller: "TemplateController",
      templateUrl: "templatetobeprecached.html"
    }).then(function(modal) {
      //  ...so get should have been called.
      expect(modal).not.toBe(null);
      expect($templateCache.get).toHaveBeenCalledWith('templatetobeprecached.html');
    });

    $httpBackend.flush();

  }));

});
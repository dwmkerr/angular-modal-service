var sinon = require('sinon');

describe('template', () => {

  var ModalService = null;
  var rootScope = null;
  var $httpBackend = null;

  angular.module('templatetests', ['angularModalService'])
    .controller('TemplateController', ($scope) => {
    });

  beforeEach(() => {
    angular.mock.module('templatetests');
    inject((_ModalService_, $rootScope, $injector) => { 
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
    sinon.restore();
  }));

  it('should http get the specified template url', function() {

    $httpBackend.expectGET('some/template.html');

    ModalService.showModal({
      controller: "TemplateController",
      templateUrl: "some/template.html"
    }).then(function(modal) {
      expect(modal).not.to.equal(null);
    });

    $httpBackend.flush();
  
  });

  it('should fail to get an invalid template url', function() {

    ModalService.showModal({
      controller: "TemplateController",
      templateUrl: "some/invalid/template.html"
    }).then(function(modal) {
      
    }).catch(function(error) {
      expect(error).not.to.equal(null);
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
      sinon.spy($templateCache, 'get');

      ModalService.showModal({
        controller: "TemplateController",
        templateUrl: "templatetobecached.html"
      }).then(function(modal) {
        //  ...so get should have been called.
        expect(modal).not.to.equal(null);
        expect($templateCache.get.called).to.equal(true);
        expect($templateCache.get.getCall(0).args[0]).to.equal('templatetobecached.html');
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
      sinon.spy($templateCache, 'get');

    ModalService.showModal({
      controller: "TemplateController",
      templateUrl: "templatetobeprecached.html"
    }).then(function(modal) {
      //  ...so get should have been called.
      expect($templateCache.get.called).to.equal(true);
      expect($templateCache.get.getCall(0).args[0]).to.equal('templatetobeprecached.html');
    });

    $httpBackend.flush();

  }));

});

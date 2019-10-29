describe('dom', () => {

  let ModalService = null;
  let $httpBackend = null;
  let $timeout = null;
  let $rootScope = null;

  angular.module('domtests', ['angularModalService'])
    .controller('DomController', ($scope, close) => {
      $scope.close = close;
    });

  beforeEach(() => {
    angular.mock.module('domtests');
    inject((_ModalService_, _$rootScope_, $injector) => {
      ModalService = _ModalService_;
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = _$rootScope_;
      $timeout = $injector.get('$timeout');
      $httpBackend.when('GET', 'some/template1.html').respond("<div id='template1'>template1</div>");
      $httpBackend.when('GET', 'some/template2.html').respond("<div id='template2'>template2</div>");
    });
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should add the template html to the dom', () => {

    $httpBackend.expectGET('some/template1.html');

    ModalService.showModal({
      controller: "DomController",
      templateUrl: "some/template1.html"
    }).then((modal) => {

      // We should be able to find the element that has been created in the dom.
      expect(document.getElementById('template1')).not.to.equal(null);

    });

    $httpBackend.flush();

  });

  it('should add the template html to the custom dom element', () => {
    $httpBackend.expectGET('some/template1.html');

    // create fake element
    let fakeDomElement = document.createElement('div');
    fakeDomElement.id = 'fake-dom-element';

    // insert fakeDomElement into the document to test against
    document.body.insertBefore(fakeDomElement, null);

    ModalService.showModal({
      controller: "DomController",
      templateUrl: "some/template1.html",
      appendElement: angular.element(document.getElementById('fake-dom-element'))
    }).then((modal) => {
      // We should be able to find the element that has been created in the custom dom element
      expect(angular.element(document.querySelector('#fake-dom-element')).find('div')).not.to.equal(null);
    });

    $httpBackend.flush();
  });

    it('should add the template html to the custom selector', () => {
        $httpBackend.expectGET('some/template1.html');

        // create fake element
        let fakeDomElement = document.createElement('div');
        fakeDomElement.id = 'fake-dom-element';

        // insert fakeDomElement into the document to test against
        document.body.insertBefore(fakeDomElement, null);

        ModalService.showModal({
            controller: "DomController",
            templateUrl: "some/template1.html",
            appendElement: '#fake-dom-element'
        }).then((modal) => {
            // We should be able to find the element that has been created in the custom dom element
            expect(angular.element(document.querySelector('#fake-dom-element')).find('div')).not.to.equal(null);
        });

        $httpBackend.flush();
    });

  it('should close the template html to the custom dom element', () => {
    $httpBackend.expectGET('some/template1.html');

    // create fake element
    let fakeDomElement = document.createElement('div');
    fakeDomElement.id = 'fake-dom-element';

    // insert fakeDomElement into the document to test against
    document.body.insertBefore(fakeDomElement, null);

    ModalService.showModal({
      controller: "DomController",
      templateUrl: "some/template1.html",
      appendElement: angular.element(document.getElementById('fake-dom-element'))
    }).then((modal) => {
      // We should be able to find the element that has been created in the custom dom element
      expect(angular.element(document.querySelector('#fake-dom-element')).find('div')).not.to.equal(null);

      modal.close.then((result) => {
        expect(document.getElementById('template2')).to.equal(null);
      });

      modal.scope.close();
    });

    $httpBackend.flush();
    $timeout.flush();
  });

  it('should remove the template html from the dom when the controller closes the modal', () => {

    $httpBackend.expectGET('some/template2.html');

    ModalService.showModal({
      controller: "DomController",
      templateUrl: "some/template2.html"
    }).then((modal) => {

      // We should be able to find the element that has been created in the dom.
      expect(document.getElementById('template2')).not.to.equal(null);

      modal.closed.then((result) => {
        expect(document.getElementById('template2')).to.equal(null);
      });

      modal.scope.close();
    });

    $httpBackend.flush();
    $timeout.flush();

  });

  it('should remove the template html from the dom when the $locationChangeSuccess event is fired', () => {

    $httpBackend.expectGET('some/template2.html');

    ModalService.showModal({
      controller: "DomController",
      templateUrl: "some/template2.html"
    }).then((modal) => {

      // We should be able to find the element that has been created in the dom.
      expect(document.getElementById('template2')).not.to.equal(null);

      modal.close.then((result) => {
        expect(document.getElementById('template2')).to.equal(null);
      });

      $rootScope.$emit('$locationChangeSuccess');
    });

    $httpBackend.flush();
    $timeout.flush();

  });

  it('should leave the template html in the dom when the $locationChangeSuccess event is explicitly enabled', () => {

    $httpBackend.expectGET('some/template2.html');

    ModalService.showModal({
      controller: "DomController",
      templateUrl: "some/template2.html"
    }).then((modal) => {

      // We should be able to find the element that has been created in the dom.
      expect(document.getElementById('template2')).not.to.equal(null);

      modal.close.then((result) => {
        expect(document.getElementById('template2')).to.equal(null);
      });

      $rootScope.$emit('$locationChangeSuccess');
    });

    $httpBackend.flush();
    $timeout.flush();

  });

  it('should leave the template html in the dom when the $locationChangeSuccess event is explicitly disabled', (done) => {

    $httpBackend.expectGET('some/template2.html');

    ModalService.showModal({
      controller: "DomController",
      templateUrl: "some/template2.html",
      locationChangeSuccess : false
    }).then((modal) => {

      // We should be able to find the element that has been created in the dom.
      expect(document.getElementById('template2')).not.to.equal(null);

      $rootScope.$emit('$locationChangeSuccess');

      setTimeout(() => {
        expect(document.getElementById('template2')).not.to.equal(null);
        done();
      }, 3);
    });

    $httpBackend.flush();
    $timeout.flush();

  });

  it('should leave the template html in the dom when the $locationChangeSuccess event for the specified delay', () => {

    $httpBackend.expectGET('some/template2.html');

    ModalService.showModal({
      controller: "DomController",
      templateUrl: "some/template2.html",
      locationChangeSuccess : 10
    }).then((modal) => {

      $rootScope.$emit('$locationChangeSuccess');
      expect($timeout.verifyNoPendingTasks).to.throw();
      expect(document.getElementById('template2')).not.to.equal(null);

      modal.close.then((result) => {
         $timeout.verifyNoPendingTasks();
        expect(document.getElementById('template2')).to.equal(null);
      });

      $rootScope.$emit('$locationChangeSuccess');

    });

    $httpBackend.flush();
    $timeout.flush();

  });

});

describe('bodyclass', () => {

    let ModalService = null;
    let $httpBackend = null;
    let $timeout = null;
    let $document = null;

    angular.module('bodyclasstests', ['angularModalService'])
        .controller('BodyClassController', ($scope, close) => {
            $scope.close = close;
        });

    beforeEach(() => {
        angular.mock.module('bodyclasstests');
        inject((_ModalService_, $injector) => {
            ModalService = _ModalService_;
            $httpBackend = $injector.get('$httpBackend');
            $timeout = $injector.get('$timeout');
            $document = $injector.get('$document');
            $httpBackend.when('GET', 'some/template1.html').respond("<div id='template'>template</div>");
        });
    });

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should add the specified class to the body', () => {

        $httpBackend.expectGET('some/template1.html');

        ModalService.showModal({
            controller: "BodyClassController",
            templateUrl: "some/template1.html",
            bodyClass: "custom-class"
        }).then((modal) => {
            // We should be able to find the custom class on the body.
            expect($document.find('body')[0].classList.contains('custom-class')).to.equal(true);
        });

        $httpBackend.flush();

    });

    it('should remove the specified class from the body on close', () => {
        $httpBackend.expectGET('some/template1.html');

        ModalService.showModal({
            controller: "BodyClassController",
            templateUrl: "some/template1.html",
            bodyClass: "custom-class"
        }).then(modal => {

            // We should be able to find the custom class on the body.
            expect($document.find('body')[0].classList.contains('custom-class')).to.equal(true);

            modal.close.then(result => {
                // The custom class should have been removed after closing.
                expect($document.find('body')[0].classList.contains('custom-class')).to.equal(false);
            });

            modal.scope.close();
        });

        $httpBackend.flush();
        $timeout.flush();
    });

});

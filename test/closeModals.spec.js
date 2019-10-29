describe('closeAll', () => {

  var ModalService = null;
  var $httpBackend = null;
  var $timeout = null;
  var $q = null;
  var $rootScope = null;

  angular.module('closemodals', ['angularModalService'])
    .controller('Modal1Controller', ($scope, close) => {
      $scope.close = close;
    })
    .controller('Modal2Controller', ($scope, close) => {
      $scope.close = close;
    });

  beforeEach(() => {
    angular.mock.module('closemodals');
    inject((_ModalService_, $injector, _$rootScope_, _$q_) => {
      ModalService = _ModalService_;
      $timeout = $injector.get('$timeout');
      $rootScope = _$rootScope_;
      $q = _$q_;
    });
  });

  it('should close both modals when \'closeModals\' is called', () => {

    //  Open one modal.
    ModalService.showModal({
      controller: "Modal1Controller",
      template: "<div>Modal 1</div>"
    }).then((modal) => {
      modal.close.then((result) => { expect(result).to.equal('closeModals'); });
    }).then(() => {
      //  Open another...
      ModalService.showModal({
        controller: "Modal2Controller",
        template: "<div>Modal 2</div>"
      }).then((modal) => {
        modal.close.then((result) => { expect(result).to.equal('closeModals'); });
      });
    }).then(() => {
      //  Then close them both...
      ModalService.closeModals('closeModals');
    });

    $timeout.flush();

  });

});

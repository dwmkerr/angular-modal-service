let sinon = require('sinon');

describe('close callback', () => {
  let ModalService = null;
  let $timeout = null;
  let $rootScope = null;
  let options;
  let modal;

  angular.module('close', ['angularModalService']);
  angular.module('close').controller('CloseController',
    function($scope, close) {
      $scope.close = close;
    }
  );

  beforeEach(() => {
    angular.mock.module('close');

    inject((_ModalService_, _$timeout_, _$rootScope_) => {
      ModalService = _ModalService_;
      $timeout = _$timeout_;
      $rootScope = _$rootScope_;
    });

    options = {
      controller: 'CloseController',
      template: '<div>Hi</div>',
      preClose: sinon.spy()
    };

    ModalService.showModal(options);
    $rootScope.$apply();

    modal = ModalService.openModals[0];
  });

  describe('when the modal\'s close function is called twice', () => {
    it('should only perform the close callback once', function() {
      modal.close();
      modal.close();

      modal.modal.close.then(() => {
        sinon.assert.calledOnce(options.preClose);
      });

      $rootScope.$apply();
    });
  });

  describe('when the modal\'s close function is called after a state change', () => {
    it('should only perform the close callback once', function() {
      $rootScope.$broadcast('$locationChangeSuccess');
      modal.close();

      modal.modal.close.then(() => {
        sinon.assert.calledOnce(options.preClose);
      });

      $rootScope.$apply();
    });
  });
});

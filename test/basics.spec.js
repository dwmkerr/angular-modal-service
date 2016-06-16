describe('basics', function() {

  var ModalService = null;

  beforeEach(() => {
    angular.mock.module('angularModalService');
    inject((_ModalService_) => {
      ModalService = _ModalService_;
    });
  });
 
  it('should be able to inject the modal service', () => {
    expect(ModalService).not.toBeNull();
  });

});
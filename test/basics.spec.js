describe('basics', function() {

  var ModalService = null;

  beforeEach(function() {
    module('angularModalService');
    inject(function(_ModalService_) {
      ModalService = _ModalService_;
    });
  });
 
  it('should be able to inject the modal service', function() {
    expect(ModalService).not.toBeNull();
  });

});
describe('services', function() {

  var ModalService = null;

  beforeEach(function() {
    module('angularModalService');
    inject(function(_ModalService_) {
      ModalService = _ModalService_;
    });
  });

  describe('modal service', function() {
   
      it('should be able to inject the modal service', function() {
        expect(ModalService).not.toBeNull();
      });

    });
});
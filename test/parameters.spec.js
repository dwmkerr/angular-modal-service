describe('parameters', function() {

  var ModalService = null;
  var rootScope = null;

  beforeEach(function() {
    module('angularModalService');
    inject(function(_ModalService_, $rootScope) {
      ModalService = _ModalService_;
      rootScope = $rootScope;
    });
  });
 
  it('should fail if there is no controller specified', function(done) {

    ModalService.showModal({
      templateUrl: "some/template.html"
      //  note, no controller is specified, so we should fail.
    }).then(function(modal) {
      //  We should never get here!
      expect(true).toBe(false);
      done();
    }).catch(function(error) {
      expect(error).toEqual("No controller has been specified.");
      done();
    });

    rootScope.$apply();

  });

  it('should fail if there is no template or template url specified', function(done) {

    ModalService.showModal({
      controller: "SomeController"
      //  note, no template or template url is specified, so we should fail.
    }).then(function(modal) {
      //  We should never get here!
      expect(true).toBe(false);
      done();
    }).catch(function(error) {
      expect(error).toEqual("No template or templateUrl has been specified.");
      done();
    });

    rootScope.$apply();

  });

});
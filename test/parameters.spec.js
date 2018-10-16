describe('parameters', () => {

  let ModalService = null;
  let rootScope = null;


  angular.module('parametertests', ['angularModalService'])
    .controller('ValidController', ($scope, close) => {
      $scope.close = close;
    });

  beforeEach(() => {
    angular.mock.module('parametertests');
    inject((_ModalService_, $rootScope) => {
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
      expect(true).to.equal(false);
      done();
    }).catch(function(error) {
      expect(error).to.equal("No controller has been specified.");
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
      expect(true).to.equal(false);
      done();
    }).catch(function(error) {
      expect(error).to.equal("No template or templateUrl has been specified.");
      done();
    });

    rootScope.$apply();

  });

  it('should accept the template provided as a string', function(done) {

    ModalService.showModal({
      controller: "ValidController",
      template: "<div>A template</div>"
    }).then(function(modal) {
      expect(modal.element.html()).to.equal("A template");
      done();
    });


    rootScope.$apply();

  });

  it('should accept the controller provided as a function', function(done) {

    ModalService.showModal({
      controller: function($scope){
        $scope.test = "here";
      },
      template: "<div>A template</div>"
    }).then(function(modal) {
      expect(modal.element.html()).to.equal("A template");
      done();
    });


    rootScope.$apply();

  });
});

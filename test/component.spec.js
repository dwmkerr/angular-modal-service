describe('component', () => {
  let ModalService;
  let $rootScope;

  let modalOptions;
  let component;

  let testModule = angular.module('component-tests', ['angularModalService']);
  testModule.component('myComponent', {
    template: 'test-template',
    bindings: {
      name: '<',
      someRecord: '<myRecord',
      close: '<'
    },
    controller: function() {
      component = this;

      this.$onInit = () => {
        this.isSomeRecordDefined = angular.isDefined(this.someRecord);
      };
    }
  });

  beforeEach(() => {
    angular.mock.module('component-tests');
    inject((_ModalService_, $injector) => {
      ModalService = _ModalService_;
      $rootScope = $injector.get('$rootScope');

      modalOptions = {
        component: 'myComponent',
        bindings: {
          name: 'MyName',
          myRecord: { id: '123' }
        }
      };

      ModalService.showModal(modalOptions);
      $rootScope.$apply();
    });
  });

  it('binds the provided bindings to the requested component', () => {
    expect(component.name).to.equal('MyName');
    expect(component.someRecord).to.equal(modalOptions.bindings.myRecord);
  });

  it('binds the close function to the component', () => {
    expect(component.close).to.equal(ModalService.openModals[0].close);
  });

  it('ensures scope bindings are available before initializing the component', function() {
    expect(component.isSomeRecordDefined).to.equal(true);
  });
});

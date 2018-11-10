describe('ModalServiceProvider', function() {
    'use strict';

    // Provider instance
    var ModalService;

    // Instantiates the module
    beforeEach(function() {
        angular.mock.module('angularModalService');
    });

    // Here we don't do any configuration to our provider
    describe('Default Configuration', function() {

        beforeEach(function() {
            inject(function(_ModalService_) {
                ModalService = _ModalService_;
            });
        });

        it('Should get the default value', function() {
            expect(ModalService.configOptions.closeDelay).to.equal(0);
        });

    });

    // Here we do some configuration
    describe('Configuration A', function() {

        // Configure the provider and instantiate it
        beforeEach(function() {
            angular.mock.module(function(ModalServiceProvider) {
                ModalServiceProvider.configureOptions({closeDelay: 500});
            });

            inject(function(_ModalService_) {
                ModalService = _ModalService_;
            });
        });

        it('Should get the configured value', function() {
            expect(ModalService.configOptions.closeDelay).to.equal(500);
        });

    });

});
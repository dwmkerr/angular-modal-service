(function() {
    'use strict';

    /**
     * Modal - Directive
     */
    function Modal($log, $animate, $document, $compile, $controller, $rootScope, $q, $templateRequest, $timeout) {

        ///////////////////////////////////////////////
        //-> ============= PRIVATE ================= //
        ///////////////////////////////////////////////
        var body = $document.find('body'); // Get the body of the document, we'll add the modal to this.

        // Returns a promise which gets the template, either
        // from the template parameter or via a request to the
        // template url parameter.
        function _getTemplate(template, templateUrl) {
            var deferred = $q.defer();
            if (template) {
                deferred.resolve(template);
            } else if (templateUrl) {
                $templateRequest(templateUrl, true)
                    .then(function(template) {
                        deferred.resolve(template);
                    }, function(error) {
                        deferred.reject(error);
                    });
            } else {
                deferred.reject('No template or templateUrl has been specified.');
            }
            return deferred.promise;
        }

        // Adds an element to the DOM as the last child of its container
        // like append, but uses $animate to handle animations. Returns a
        // promise that is resolved once all animation is complete.
        function _appendChild(parent, child) {
            var children = parent.children();
            if (children.length > 0) {
                return $animate.enter(child, parent, children[children.length - 1]);
            }
            return $animate.enter(child, parent);
        }

        /**
         * _create takes arguments and finally creates the modal object
         * @param  {[Object]} deferred [ $q.defer() Object ]
         * @param  {[Object]} options  [options configuration object]
         * @param  {[Object]} template [dom element]
         * @return {[Promise]}         [resolves a promise]
         */
        function _create(deferred, options, template) {
            // Create a new scope for the modal.
            var modalScope = (options.scope || $rootScope).$new();

            // Create the inputs object to the controller - this will include
            // the scope, as well as all inputs provided.
            // We will also create a deferred that is resolved with a provided
            // close function. The controller can then call 'close(result)'.
            // The controller can also provide a delay for closing - this is
            // helpful if there are closing animations which must finish first.
            var closeDeferred  = $q.defer();
            var closedDeferred = $q.defer();
            var inputs = {
                $scope: modalScope,
                close: function(result, delay) {
                    if (delay === undefined || delay === null){ 
                        delay = 0;
                    }
                    $timeout(function() {
                        // Resolve the 'close' promise.
                        closeDeferred.resolve(result);

                        // Let angular remove the element and wait for animations to finish.
                        $animate.leave(modalElement)
                            .then(function() {
                                // Resolve the 'closed' promise.
                                closedDeferred.resolve(result);

                                // We can now clean up the scope
                                modalScope.$destroy();

                                // Unless we null out all of these objects we seem to suffer
                                // from memory leaks, if anyone can explain why then I'd
                                // be very interested to know.
                                inputs.close  = null;
                                deferred      = null;
                                closeDeferred = null;
                                modal         = null;
                                inputs        = null;
                                modalElement  = null;
                                modalScope    = null;
                            });
                    }, delay);
                }
            };

            // If we have provided any inputs, pass them to the controller.
            if (options.inputs) { 
                angular.extend(inputs, options.inputs);
            }

            // Compile then link the template element, building the actual element.
            // Set the $element on the inputs so that it can be injected if required.
            var linkFn       = $compile(template);
            var modalElement = linkFn(modalScope);
            inputs.$element  = modalElement;

            // Create the controller, explicitly specifying the scope to use.
            var controllerObjBefore = modalScope[options.controllerAs];
            var modalController     = $controller(options.controller, inputs, false, options.controllerAs);

            if (options.controllerAs && controllerObjBefore) {
                angular.extend(modalController, controllerObjBefore);
            }

            // Finally, append the modal to the dom.
            if (options.appendElement) {
                // append to custom append element
                _appendChild(options.appendElement, modalElement);
            } else {
                // append to body when no custom append element is specified
                _appendChild(body, modalElement);
            }

            // We now have a modal object...
            var modal = {
                controller: modalController,
                scope:      modalScope,
                element:    modalElement,
                close:      closeDeferred.promise,
                closed:     closedDeferred.promise
            };

            // ...which is passed to the caller via the promise.
            deferred.resolve(modal);
        }
        
        //-> Directive's controller function
        function Ctrlr() {
            
            var vm = this;

            // This available to us on the instance
            vm.showModal = function(options) {

                // Create a deferred we'll resolve when the modal is ready.
                var deferred = $q.defer();

                // Validate the input parameters.
                var controllerName = options.controller;
                if (!controllerName) {
                    deferred.reject('No controller has been specified.');
                    return deferred.promise;
                }

                // Get the actual html of the template.
                _getTemplate(options.template, options.templateUrl)
                    .then(function(template) {
                        _create(deferred, options, template);
                    })
                    .then(null, function(error) { // 'catch' doesn't work in IE8.
                        deferred.reject(error);
                    });

                return deferred.promise;
            };

            vm.openModal = function(){

                vm.showModal(vm.options).then(function(modal) {
                    //-> bind to bootstrap event (incase clicking on backdrop)
                    modal.element.one('hidden.bs.modal', function () {
                        if (!modal.controller.closed) {
                            modal.controller.closeModal();
                        }
                    });
                    //-> callback on close event
                    modal.close.then(function(result) {
                        $log.debug('result: ', result);
                    });
                    modal.element.modal(); // Open the modal (Bootstrap modal)

                });

            };

        }

        ///////////////////////////////////////////////
        //-> ============= PUBLIC API ============== //
        ///////////////////////////////////////////////

        var directive = {
            restrict: 'E',
            replace:  true,
            scope:    {
                options: '='
            },
            template:         '<a href data-ng-click="vm.openModal()">open me</a>',
            controller:       Ctrlr,
            bindToController: true,
            controllerAs:     'vm'
        };

        return directive;

    }

    //-> ANGULAR
    angular
        .module('common')
        .directive('modal', Modal);

})();

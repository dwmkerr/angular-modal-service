'use strict';

var module = angular.module('angularModalService', []);

module.provider('ModalService', function ModalServiceProvider() {
    var _options = {
        closeDelay: 0
    };

    this.configureOptions = function (config) {
        angular.extend(_options, config);
    };
    this.$get = ['$animate', '$document', '$compile', '$controller', '$http', '$rootScope', '$q', '$templateRequest', '$timeout',
        function ($animate, $document, $compile, $controller, $http, $rootScope, $q, $templateRequest, $timeout) {

            function ModalService(configOptions) {

                var self = this;

                //stash configOptions
                self.configOptions = configOptions;

                //  Track open modals.
                self.openModals = [];

                //  Returns a promise which gets the template, either
                //  from the template parameter or via a request to the
                //  template url parameter.
                var getTemplate = function (template, templateUrl) {
                    var deferred = $q.defer();
                    if (template) {
                        deferred.resolve(template);
                    } else if (templateUrl) {
                        $templateRequest(templateUrl, true)
                            .then(function (template) {
                                deferred.resolve(template);
                            }, function (error) {
                                deferred.reject(error);
                            });
                    } else {
                        deferred.reject("No template or templateUrl has been specified.");
                    }
                    return deferred.promise;
                };

                //  Adds an element to the DOM as the last child of its container
                //  like append, but uses $animate to handle animations. Returns a
                //  promise that is resolved once all animation is complete.
                var appendChild = function (parent, child) {
                    var children = parent.children();
                    if (children.length > 0) {
                        return $animate.enter(child, parent, children[children.length - 1]);
                    }
                    return $animate.enter(child, parent);
                };

                //  Close all modals, providing the given result to the close promise.
                self.closeModals = function (result, delay) {
                    delay = delay || self.configOptions.closeDelay;
                    while (self.openModals.length) {
                        self.openModals[0].close(result, delay);
                        self.openModals.splice(0, 1);
                    }
                };

                self.showModal = function (options) {

                    //  Get the body of the document, we'll add the modal to this.
                    var body = angular.element($document[0].body);

                    //  Create a deferred we'll resolve when the modal is ready.
                    var deferred = $q.defer();

                    //  Validate the input parameters.
                    var controllerName = options.controller;
                    if (!controllerName) {
                        deferred.reject("No controller has been specified.");
                        return deferred.promise;
                    }

                    //  Get the actual html of the template.
                    getTemplate(options.template, options.templateUrl)
                        .then(function (template) {

                            //  The main modal object we will build.
                            var modal = {};

                            //  Create a new scope for the modal.
                            var modalScope = (options.scope || $rootScope).$new(),
                                rootScopeOnClose = null,
                                locationChangeSuccess = options.locationChangeSuccess;

                            //  Allow locationChangeSuccess event registration to be configurable.
                            //  True (default) = event registered with defaultCloseDelay
                            //  # (greater than 0) = event registered with delay
                            //  False = disabled
                            if (locationChangeSuccess === false) {
                                rootScopeOnClose = angular.noop;
                            }
                            else if (angular.isNumber(locationChangeSuccess) && locationChangeSuccess >= 0) {
                                $timeout(function () {
                                    rootScopeOnClose = $rootScope.$on('$locationChangeSuccess', cleanUpClose);
                                }, locationChangeSuccess);
                            }
                            else {
                                $timeout(function () {
                                    rootScopeOnClose = $rootScope.$on('$locationChangeSuccess', cleanUpClose);
                                }, self.configOptions.closeDelay);
                            }


                            //  Create the inputs object to the controller - this will include
                            //  the scope, as well as all inputs provided.
                            //  We will also create a deferred that is resolved with a provided
                            //  close function. The controller can then call 'close(result)'.
                            //  The controller can also provide a delay for closing - this is
                            //  helpful if there are closing animations which must finish first.
                            var closeDeferred = $q.defer();
                            var closedDeferred = $q.defer();
                            var hasAlreadyBeenClosed = false;

                            var inputs = {
                                $scope: modalScope,
                                close: function (result, delay) {
                                    delay = delay || self.configOptions.closeDelay;
                                    //  If we have a pre-close function, call it.
                                    if (typeof options.preClose === 'function') options.preClose(modal, result, delay);

                                    if (delay === undefined || delay === null) delay = 0;
                                    if (hasAlreadyBeenClosed) {
                                        return;
                                    }
                                    hasAlreadyBeenClosed = true;

                                    $timeout(function () {

                                        cleanUpClose(result);

                                    }, delay);
                                }
                            };

                            //  If we have provided any inputs, pass them to the controller.
                            if (options.inputs) angular.extend(inputs, options.inputs);

                            //  Compile then link the template element, building the actual element.
                            //  Set the $element on the inputs so that it can be injected if required.
                            var linkFn = $compile(template);
                            var modalElement = linkFn(modalScope);
                            inputs.$element = modalElement;

                            //  Create the controller, explicitly specifying the scope to use.
                            var controllerObjBefore = modalScope[options.controllerAs];
                            var modalController = $controller(options.controller, inputs, false, options.controllerAs);

                            if (options.controllerAs && controllerObjBefore) {
                                angular.extend(modalController, controllerObjBefore);
                            }

                            //  Then, append the modal to the dom.
                            var appendTarget = body; // append to body when no custom append element is specified
                            if (angular.isString(options.appendElement)) {
                                // query the document for the first element that matches the selector
                               // and create an angular element out of it.
                                appendTarget = angular.element($document[0].querySelector(options.appendElement));

                            } else if (options.appendElement) {
                                // append to custom append element
                                appendTarget = options.appendElement;
                            }

                            appendChild(appendTarget, modalElement);

                            // Finally, append any custom classes to the body
                            if (options.bodyClass) {
                                body[0].classList.add(options.bodyClass);
                            }

                            //  Populate the modal object...
                            modal.controller = modalController;
                            modal.scope = modalScope;
                            modal.element = modalElement;
                            modal.close = closeDeferred.promise;
                            modal.closed = closedDeferred.promise;

                            // $onInit is part of the component lifecycle introduced in AngularJS 1.6.x
                            // Because it may not be defined on all controllers,
                            // we must check for it before attempting to invoke it.
                            // https://docs.angularjs.org/guide/component#component-based-application-architecture
                            if (angular.isFunction(modal.controller.$onInit)) {
                                modal.controller.$onInit();
                            }

                            //  ...which is passed to the caller via the promise.
                            deferred.resolve(modal);

                            // Clear previous input focus to avoid open multiple modals on enter
                            document.activeElement.blur();

                            //  We can track this modal in our open modals.
                            self.openModals.push({modal: modal, close: inputs.close});

                            function cleanUpClose(result) {

                                //  Resolve the 'close' promise.
                                closeDeferred.resolve(result);

                                //  Remove the custom class from the body
                                if (options.bodyClass) {
                                    body[0].classList.remove(options.bodyClass);
                                }

                                //  Let angular remove the element and wait for animations to finish.
                                $animate.leave(modalElement)
                                    .then(function () {
                                        // prevent error if modal is already destroyed
                                        if (!modalElement) {
                                            return;
                                        }

                                        //  Resolve the 'closed' promise.
                                        closedDeferred.resolve(result);

                                        //  We can now clean up the scope
                                        modalScope.$destroy();

                                        //  Remove the modal from the set of open modals.
                                        for (var i = 0; i < self.openModals.length; i++) {
                                            if (self.openModals[i].modal === modal) {
                                                self.openModals.splice(i, 1);
                                                break;
                                            }
                                        }

                                        //  Unless we null out all of these objects we seem to suffer
                                        //  from memory leaks, if anyone can explain why then I'd
                                        //  be very interested to know.
                                        inputs.close = null;
                                        deferred = null;
                                        closeDeferred = null;
                                        modal = null;
                                        inputs = null;
                                        modalElement = null;
                                        modalScope = null;

                                    });
                                // remove event watcher
                                rootScopeOnClose && rootScopeOnClose();
                            }

                        })
                        .then(null, function (error) { // 'catch' doesn't work in IE8.
                            deferred.reject(error);
                        });

                    return deferred.promise;
                };

            }

            return new ModalService(_options);
        }];
    });

'use strict';

let module = angular.module('angularModalService', []);

module.factory('ModalService', ['$animate', '$document', '$compile', '$controller', '$http', '$rootScope', '$q', '$templateRequest', '$timeout',
  function($animate, $document, $compile, $controller, $http, $rootScope, $q, $templateRequest, $timeout) {

    function ModalService() {

      var self = this;
      var modalElement, modal;

      //  Returns a promise which gets the template, either
      //  from the template parameter or via a request to the
      //  template url parameter.
      var getTemplate = function(template, templateUrl) {
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
          deferred.reject("No template or templateUrl has been specified.");
        }
        return deferred.promise;
      };

      //  Adds an element to the DOM as the last child of its container
      //  like append, but uses $animate to handle animations. Returns a
      //  promise that is resolved once all animation is complete.
      var appendChild = function(parent, child) {
        var children = parent.children();
        if (children.length > 0) {
          return $animate.enter(child, parent, children[children.length - 1]);
        }
        return $animate.enter(child, parent);
      };

      self.showModal = function(options) {

        //  Get the body of the document, we'll add the modal to this.
        var body = angular.element($document[0].body);

        //  Create a deferred we'll resolve when the modal is ready.
        var deferred = $q.defer();

        //  Validate the input parameters.
        var controllerName = options.controller;
        if (!options.renderedElement && !controllerName) {
          deferred.reject("No controller has been specified.");
          return deferred.promise;
        }

        // Handlers for closing the modal
        var closeDeferred = $q.defer();
        var closedDeferred = $q.defer();
        var rootScopeOnClose = $rootScope.$on('$locationChangeSuccess', cleanUpClose);

        //  Create a new scope for the modal or use the one from the given rendered element.
        var modalScope = (options.renderedElement && options.renderedElement.scope()) || ((options.scope || $rootScope).$new());

        //  Store a reference to the parent element of a rendered element to put it back there later on
        var parentElement = (options.renderedElement) ? options.renderedElement.parent() : null;

        //  Create the inputs object to the controller - this will include
        //  the scope, as well as all inputs provided.
        //  We will also create a deferred that is resolved with a provided
        //  close function. The controller can then call 'close(result)'.
        //  The controller can also provide a delay for closing - this is
        //  helpful if there are closing animations which must finish first.
        var inputs = {
          close: function (result, delay) {
            if (delay === undefined || delay === null) delay = 0;
            $timeout(function () {
              cleanUpClose(result);
            }, delay);
          }
        };

        //  Get the actual html of the template, if there is no rendered element given
        if(!options.renderedElement) {
          getTemplate(options.template, options.templateUrl)
            .then(function (template) {

              // Extend the inputs object by the modalScope
              inputs.$scope = modalScope;

              //  If we have provided any inputs, pass them to the controller.
              if (options.inputs) angular.extend(inputs, options.inputs);

              //  Compile then link the template element, building the actual element.
              //  Set the $element on the inputs so that it can be injected if required.
              var linkFn = $compile(template);
              modalElement = linkFn(modalScope);

              buildModal(modalElement, inputs);
            })
            .then(null, function (error) { // 'catch' doesn't work in IE8.
              deferred.reject(error);
            });
        } else {
          // Build the modal with a given, already rendered Element
          var modalElement = options.renderedElement.clone();
          options.renderedElement.remove();
          buildModal(modalElement);
        }

        //  Define the callback for attaching the modal function onto the rendered template
        function buildModal(modalElement, inputs) {

          // Set the scope to the elements scope if not already defined
          if(inputs) {
            inputs.$element = modalElement;

            //  Create the controller, explicitly specifying the scope to use.
            var controllerObjBefore = modalScope[options.controllerAs];
            var modalController = $controller(options.controller, inputs, false, options.controllerAs);

            if (options.controllerAs && controllerObjBefore) {
              angular.extend(modalController, controllerObjBefore);
            }

          }

          //  Finally, append the modal to the dom.
          if (options.appendElement) {
            // append to custom append element
            appendChild(options.appendElement, modalElement);
          } else {
            // append to body when no custom append element is specified
            appendChild(body, modalElement);
          }

          //  We now have a modal object...
          var modal = {
            controller: modalController, // This is not defined when we use a renderedElement
            scope: modalScope,
            element: modalElement,
            close: closeDeferred.promise,
            closed: closedDeferred.promise
          };

          //  ...which is passed to the caller via the promise.
          deferred.resolve(modal);

        }

        function cleanUpClose(result) {

          //  Resolve the 'close' promise.
          closeDeferred.resolve(result);

          //  Let angular remove the element and wait for animations to finish if it wasn't a rendered element
          if(!options.renderedElement) {

            $animate.leave(modalElement)
              .then(function () {
                //  Resolve the 'closed' promise.
                closedDeferred.resolve(result);

                //  We can now clean up the scope
                modalScope.$destroy();
              });

            // remove event watcher
            rootScopeOnClose && rootScopeOnClose();
          } else {
            // move the rendered modal back to where it came from
            modalElement.clone().appendTo(parentElement);
            modalElement.remove();
            closedDeferred.resolve(result);
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
        }

        return deferred.promise;
      };

    }

    return new ModalService();
  }]);

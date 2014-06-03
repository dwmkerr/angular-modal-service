//  angularModalService.js
//
//  Service for showing modal dialogs.

/***** JSLint Config *****/
/*global angular  */
/*jslint multistr: true */
(function() {

  'use strict';

  var module = angular.module('angularModalService', []);

  module.factory('ModalService', ['$document', '$compile', '$controller', '$http', '$rootScope', '$q', '$timeout',
    function($document, $compile, $controller, $http, $rootScope, $q, $timeout) {

    //  Get the body of the document, we'll add the modal to this.
    var body = $document.find('body');
    
    function ModalService() {

      var self = this;

      self.showModal = function(options) {
        var templateUrl = options.templateUrl;
        var controller = options.controller;
        var resolve = options.resolve;

        //  Create a deferred we'll resolve when the modal is ready.
        var deferred = $q.defer();

        //  Get the actual html of the template.
        $http.get(templateUrl)
          .then(function(result) {

            //  Create the complete modal html. Wrapped in a div which is what we remove.
            var modalHtml = result.data;

            //  Create a new scope for the modal.
            var modalScope = $rootScope.$new();

            //  Create the inputs object to the controller - this will include
            //  the scope, but also the resolution of any promises in our resolve.
            //  We will also create a deferred that is resolved with a provided
            //  close function. The controller can then call 'close(result)'.
            //  The controller can also provide a delay for closing - this is 
            //  helpful if there are closing animations which must finish first.
            var closeDeferred = $q.defer();
            var inputs = {
              $scope: modalScope,
              close: function(result, delay) {
                if(delay === undefined || delay === null) delay = 0;
                $timeout(function () {
                  closeDeferred.resolve(result);
                }, delay);
              }
            };

            //  Collect all promises to resolve for the controller.
            var promises = {};
            if(resolve) {
              for (var promiseName in resolve) {
                promises[promiseName] = resolve[promiseName];
              }
            }

            //  Now resolve each promise.
            $q.all(promises)
              .then(function(results) {

                //  Add the result of each promise to the controller inputs.
                for(var resultName in results) {
                  inputs[resultName] = results[resultName];
                }

                //  Create the controller, explicitly specifying the scope to use.
                var modalController = $controller(controller, inputs);

                //  Parse the modal HTML into a DOM element (in template form).
                var modalElementTemplate = angular.element(modalHtml);

                //  Compile then link the template element, building the actual element.
                var linkFn = $compile(modalElementTemplate);
                var modalElement = linkFn(modalScope);

                //  Finally, append the modal to the dom.
                body.append(modalElement);

                //  We now have a modal object.
                var modal = {
                  controller: modalController,
                  scope: modalScope,
                  element: modalElement,
                  close: closeDeferred.promise
                };

                //  When close is resolved, we'll clean up the scope and element.
                modal.close.then(function(result) {
                  //  Clean up the scope
                  modalScope.$destroy();
                  //  Remove the element from the dom.
                  modalElement.remove();
                });

                deferred.resolve(modal);

              });

          });

        return deferred.promise;
      };

      //  todo identify and handle all error cases.

    }

    return new ModalService();
  }]);

}());
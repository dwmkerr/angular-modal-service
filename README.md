angular-modal-service
=====================

[![Build Status](https://secure.travis-ci.org/dwmkerr/angular-modal-service.png?branch=master)](https://travis-ci.org/dwmkerr/angular-modal-service)
[![Coverage Status](https://coveralls.io/repos/dwmkerr/angular-modal-service/badge.png?branch=master)](https://coveralls.io/r/dwmkerr/angular-modal-service?branch=master)
[![Dependencies](https://david-dm.org/dwmkerr/angular-modal-service.svg?theme=shields.io)](https://david-dm.org/dwmkerr/angular-modal-service)
[![Dev Dependencies](https://david-dm.org/dwmkerr/angular-modal-service/dev-status.svg?theme=shields.io)](https://david-dm.org/dwmkerr/angular-modal-service#info=devDependencies)

Modal service for AngularJS - supports creating popups and modals via a service. See [a quick fiddle](http://jsfiddle.net/dwmkerr/8MVLJ/) or a full set of samples at [dwmkerr.github.io/angular-modal-service](http://dwmkerr.github.io/angular-modal-service).

### Usage

First, install with Bower:

```
bower install angular-modal-service
```

Then reference the minified script:

```html
<script src="bower_components\angular-modal-service\dst\angular-modal-service.min.js"></script>
```

Specify the modal service as a dependency of your application:

```js
var app = angular.module('sampleapp', ['angularModalService']);
```

Now just inject the modal service into any controller, service or directive where you need it.

```js
app.controller('SampleController', function($scope, ModalService) {
  
  $scope.showAModal = function() {

  	// Just provide a template url, a controller and call 'showModal'.
    ModalService.showModal({
      templateUrl: "yesno/yesno.html",
      controller: "YesNoController"
    }).then(function(modal) {
      // The modal object has the element built, if this is a bootstrap modal
      // you can call 'modal' to show it, if it's a custom modal just show or hide
      // it as you need to.
      modal.element.modal();
      modal.close.then(function(result) {
        $scope.message = result ? "You said Yes" : "You said No";
      });
    });

  };

});
```

Calling `showModal` returns a promise which is resolved when the modal DOM element is created
and the controller for it is created. The promise returns a `modal` object which contains the 
element created, the controller, the scope and a `close` promise which is resolved when the 
modal is closed - this `close` promise provides the result of the modal close function.

The modal controller can be any controller that you like, just remember that it is always
provided with one extra parameter - the `close` function. Here's an example controller
for a bootstrap modal:

```js
app.controller('SampleModalController', function($scope, close) {
  
 $scope.close = function(result) {
 	close(result, 200); // close, but give 200ms for bootstrap to animate
 };

});
```

The `close` function is automatically injected to the modal controller and takes the result
object (which is passed to the `close` promise used by the caller). It can take an optional 
second parameter, the number of milliseconds to wait before destroying the DOM element. This
is so that you can have a delay before destroying the DOM element if you are animating the 
closure.

Now just make sure the `close` function is called by your modal controller when the modal
should be closed and that's it.

#### ShowModal Options

The `showModal` function takes an object with these fields:

* `controller`: The name of the controller to created.
* `templateUrl`: The URL of the HTML template to use for the modal.
* `template`: If `templateUrl` is not specified, you can specify `template` as raw
  HTML for the modal. 
* `inputs`: A set of values to pass as inputs to the controller. Each value provided
  is injected into the controller constructor.

#### The Modal Object

The `modal` object returned by `showModal` has this structure:

* `modal.element` - The DOM element created. This is a jquery lite object (or jquery if full
  jquery is used). If you are using a bootstrap modal, you can call `modal` on this object
  to show the modal.
* `modal.scope` - The new scope created for the modal DOM and controller.
* `modal.controller` - The new controller created for the modal.
* `modal.close` - A promise which is resolved when the modal is closed.

#### The Modal Controller

The controller that is used for the modal always has one extra parameter injected, a function
called `close`. Call this function with any parameter (the result). This result parameter is
then passed as the parameter of the `close` promise used by the caller.

### Error Handing

As the `ModalService` exposes only one function, `showModal`, error handling is always performed in the same way.
The `showModal` function returns a promise - if any part of the process fails, the promise will be rejected, meaning
that a promise error handling function or `catch` function can be used to get the error details:

```js
ModalService.showModal({
  templateUrl: "some/template.html",
  controller: "SomeController"
}).then(function(modal) {
  // only called on success...
}).catch(function(error) {
  // error contains a detailed error message.
  console.log(error);
});
```

Developing
----------

To work with the code, just run:

```
npm install
bower install
```

and all code will be built and ready to go. To ensure the code is linted, test, minified and
updated to the `dst` folder as you change it, run:

```
grunt dev
```

The easiest way to adapt the code is to play with some of the examples in the ``samples`` folder.

Tests
-----

Run tests with:

```
npm test
```

A coverage report is written to `build\coverage`.

If you are updating or debugging tests, you can run:

```
grunt karma:debug
```

This will open Karma in Chrome allowing you to set breakpoints and debug your suite.

Thanks
------

Thanks go the the following contributors:

[joshvillbrandt](https://github.com/joshvillbrandt) - Adding support for `$templateCache`.
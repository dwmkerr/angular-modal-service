# angular-modal-service

[![CircleCI](https://circleci.com/gh/dwmkerr/angular-modal-service.svg?style=shield)](https://circleci.com/gh/dwmkerr/angular-modal-service)
[![codecov](https://codecov.io/gh/dwmkerr/angular-modal-service/branch/master/graph/badge.svg)](https://codecov.io/gh/dwmkerr/angular-modal-service)
[![Dependencies](https://david-dm.org/dwmkerr/angular-modal-service.svg?theme=shields.io)](https://david-dm.org/dwmkerr/angular-modal-service)
[![Dev Dependencies](https://david-dm.org/dwmkerr/angular-modal-service/dev-status.svg?theme=shields.io)](https://david-dm.org/dwmkerr/angular-modal-service#info=devDependencies)
[![Greenkeeper badge](https://badges.greenkeeper.io/dwmkerr/angular-modal-service.svg)](https://greenkeeper.io/)

Modal service for AngularJS - supports creating popups and modals via a service. See [a quick fiddle](http://jsfiddle.net/dwmkerr/8MVLJ/) or a full set of samples at [dwmkerr.github.io/angular-modal-service](http://dwmkerr.github.io/angular-modal-service).


<!-- vim-markdown-toc GFM -->

* [Usage](#usage)
    * [ShowModal Options](#showmodal-options)
    * [The Modal Object](#the-modal-object)
    * [The Modal Controller](#the-modal-controller)
    * [Closing All Modals](#closing-all-modals)
    * [Animation](#animation)
    * [Error Handing](#error-handing)
    * [Global Options Configuration](#global-options-configuration)
* [Developing](#developing)
* [Tests](#tests)
* [Releasing](#releasing)
* [FAQ](#faq)
* [Thanks](#thanks)

<!-- vim-markdown-toc -->

## Usage

Install with Bower (or NPM):

```bash
bower install angular-modal-service
# or...
npm install angular-modal-service
```

Then reference the minified script:

```html
<script src="bower_components/angular-modal-service/dst/angular-modal-service.min.js"></script>
```

Specify the modal service as a dependency of your application:

```js
var app = angular.module('sampleapp', ['angularModalService']);
```

Now just inject the modal service into any controller, service or directive where you need it.

```js
app.controller('SampleController', ["$scope", "ModalService", function($scope, ModalService) {

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

}]);
```

Calling `showModal` returns a promise which is resolved when the modal DOM element is created
and the controller for it is created. The promise returns a `modal` object which contains the
element created, the controller, the scope and two promises: `close` and `closed`. Both are
resolved to the result of the modal close function, but `close` is resolved as soon as the
modal close function is called, while `closed` is only resolved once the modal has finished
animating and has been completely removed from the DOM.

The modal controller can be any controller that you like, just remember that it is always
provided with one extra parameter - the `close` function. Here's an example controller
for a bootstrap modal:

```js
app.controller('SampleModalController', function($scope, close) {

 $scope.dismissModal = function(result) {
 	close(result, 200); // close, but give 200ms for bootstrap to animate
 };

});
```

The `close` function is automatically injected to the modal controller and takes the result
object (which is passed to the `close` and `closed` promises used by the caller). It can
take an optional second parameter, the number of milliseconds to wait before destroying the
DOM element. This is so that you can have a delay before destroying the DOM element if you
are animating the closure. See [Global Config](#global-options-configuration) for setting a default delay.

Now just make sure the `close` function is called by your modal controller when the modal
should be closed and that's it. Quick hint - if you are using Bootstrap for your modals,
then make sure the modal template only contains one root level element, see the [FAQ](#faq)
for the gritty details of why.

To pass data into the modal controller, use the `inputs` field of the modal options. For example:

```js
ModalService.showModal({
  templateUrl: "exampletemplate.html",
  controller: "ExampleController",
  inputs: {
    name: "Fry",
    year: 3001
  }
})
```

injects the `name` and `year` values into the controller:

```js
app.controller('ExampleController', function($scope, name, year, close) {
});
```

You can also provide a controller function directly to the modal, with or without the `controllerAs` attribute.
But if you provide `controller` attribute with `as` syntax and `controllerAs` attribute together, `controllerAs`
will have high priority.

```js
ModalService.showModal({
  template: "<div>Fry lives in {{futurama.city}}</div>",
  controller: function() {
    this.city = "New New York";
  },
  controllerAs : "futurama"
})

```

### ShowModal Options

The `showModal` function takes an object with these fields:

* `controller`: The name of the controller to create. It could be a function.
* `controllerAs` : The name of the variable on the scope instance of the controller is assigned to - (optional).
* `templateUrl`: The URL of the HTML template to use for the modal.
* `template`: If `templateUrl` is not specified, you can specify `template` as raw
  HTML for the modal.
* `inputs`: A set of values to pass as inputs to the controller. Each value provided
  is injected into the controller constructor.
* `appendElement`: The custom angular element or selector (such as `#element-id`) to append the modal to instead of default `body` element.
* `scope`: Optional. If provided, the modal controller will use a new scope as a child of `scope` (created by calling `scope.$new()`) rather than a new scope created as a child of `$rootScope`.
* `bodyClass`: Optional. The custom css class to append to the body while the modal is open (optional, useful when not using Bootstrap).
* `preClose`: Optional. A function which will be called before the process of closing a modal starts. The signature is `function preClose(modal, result, delay)`. It is provided the `modal` object, the `result` which was passed to `close` and the `delay` which was passed to close.
* `locationChangeSuccess`: Optional. Allows the closing of the modal when the location changes to be configured. If no value is set, the modal is closed immediately when the `$locationChangeSuccess` event fires. If `false` is set, event is not fired. If a number `n` is set, then the event fires after `n` milliseconds.

### The Modal Object

The `modal` object returned by `showModal` has this structure:

* `modal.element` - The created DOM element. This is a jquery lite object (or jquery if full
  jquery is used). If you are using a bootstrap modal, you can call `modal` on this object
  to show the modal.
* `modal.scope` - The new scope created for the modal DOM and controller.
* `modal.controller` - The new controller created for the modal.
* `modal.close` - A promise which is resolved when the modal `close` function is called.
* `modal.closed` - A promise which is resolved once the modal has finished animating out of the DOM.

### The Modal Controller

The controller that is used for the modal always has one extra parameter injected, a function
called `close`. Call this function with any parameter (the result). This result parameter is
then passed as the parameter of the `close` and `closed` promises used by the caller.

### Closing All Modals

Sometimes you may way to forcibly close all open modals, for example if you are going to transition routes. You can use the `ModalService.closeModals` function for this:

```js
ModalService.closeModals(optionalResult, optionalDelay);
```

The `optionalResult` parameter is pased into all `close` promises, the `optionalDelay` parameter has the same effect as the controller `close` function delay parameter.

### Animation

`ModalService` cooperates with Angular's `$animate` service to allow easy implementation of
custom animation. Specifically, `showModal` will trigger the `ng-enter` hook, and calling
`close` will trigger the `ng-leave` hook. For example, if the `ngAnimate` module is
installed, the following CSS rules will add fade in/fade out animations to a modal with the
class `modal`:

```css
.modal.ng-enter {
  transition: opacity .5s ease-out;
  opacity: 0;
}
.modal.ng-enter.ng-enter-active {
  opacity: 1;
}
.modal.ng-leave {
  transition: opacity .5s ease-out;
  opacity: 1;
}
.modal.ng-leave.ng-leave-active {
  opacity: 0;
}
```

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

### Global Options Configuration

To configure the default options that will apply to all modals call `configureOptions` on the `ModalServiceProvider`.

```js
app.config(["ModalServiceProvider", function(ModalServiceProvider) {
  
  ModalServiceProvider.configureOptions({closeDelay:500});

}]);
```

Here are the available global options:
* `closeDelay` - This sets the default number of milliseconds to use in the close handler. This delay will also be used in the `closeModals` method and as the default for `locationChangeSuccess`. 

## Developing

To work with the code, just run:

```
npm install
npm test
npm start
```

The dependencies will install, the tests will be run (always a useful sanity check after a clean checkout) and the code will run. You can open the browser at localhost:8080 to see the samples. As you change the code in the `src/` folder, it will be re-built and the browser will be updated.

The easiest way to adapt the code is to play with some of the examples in the ``samples`` folder.

## Tests

Run tests with:

```
npm test
```

A coverage report is written to `build\coverage`.

Debug tests with:

```
npm run test-debug
```

This will run the tests in Chrome, allowing you to debug.

## Releasing

To create a release:

- Create the `dst` pack with `npm run build`
- Merge your work to master
- Use `npm version` to bump, e.g. `npm version patch`
- Push and deploy `git push --follow-tags && npm publish`

## FAQ

Having problems? Check this FAQ first.

**I'm using a Bootstrap Modal and the backdrop doesn't fade away**

This can happen if your modal template contains more than one top level element.
Imagine this case:

```html
<!-- Some comment -->
<div>...some modal</div>
```

When you create the modal, the Angular Modal Service will add both of these elements
to the page, then pass the elements to you as a jQuery selector. When you call bootstrap's
`modal` function on it, like this:

```js
modal.element.modal();
```

It will try and make both elements into a modal. This means both elements will get a backdrop.
In this case, either remove the extra elements, or find the specific element you need
from the provided `modal.element` property.

**The backdrop STILL does not fade away after I call `close` OR I don't want to use the 'data-dismiss' attribute on a button, how can I close a modal manually?**

You can check the 'Complex' sample ([complexcontroller.js](samples/complex/complexcontroller.js)). The 'Cancel' button closes without using the `data-dismiss` attribute. In this case, just use the `preClose` option to ensure the bootstrap modal is removed:

```js
ModalService.showModal({
  templateUrl: "some/bootstrap-template.html",
  controller: "SomeController",
  preClose: (modal) => { modal.element.modal('hide'); }
}).then(function(modal) {
  // etc
});
```

Another option is to grab the modal element in your controller, then call the bootstrap `modal` function
to manually close the modal. Then call the `close` function as normal:

```js
app.controller('ExampleModalController', [
  '$scope', '$element', 'close',
  function($scope, $element, close) {

  $scope.closeModal = function() {

    //  Manually hide the modal using bootstrap.
    $element.modal('hide');

    //  Now close as normal, but give 500ms for bootstrap to animate
    close(null, 500);
  };

}]);
```

**I'm using a Bootstrap Modal and the dialog doesn't show up**

Code is entered exactly as shown the example but when the showAModal() function fires the modal template html is appended to the body while the console outputs:

```
TypeError: undefined is not a function
```

Pointing to the code: `modal.element.modal();`. This occurs if you are using a Bootstap modal but have not included the Bootstrap JavaScript. The recommendation is to include the modal JavaScript before AngularJS.

**How can I prevent a Bootstrap modal from being closed?**

If you are using a bootstrap modal and want to make sure that only the `close` function will close the modal (not a click outside or escape), use the following attributes:

```html
<div class="modal" data-backdrop="static" data-keyboard="false">
```

To do this programatically, use:

```js
ModalService.showModal({
  templateUrl: "whatever.html",
  controller: "WhateverController"
}).then(function(modal) {
  modal.element.modal({
    backdrop: 'static',
    keyboard: false
  });
  modal.close.then(function(result) {
    //  ...etc
  });
});
```

Thanks [lindamarieb](https://github.com/lindamarieb) and [ledgeJumper](https://github.com/ledgeJumper)!

**Problems with Nested Modals**

If you are trying to nest Bootstrap modals, you will run into issues. From Bootstrap:

> Bootstrap only supports one modal window at a time. Nested modals aren’t supported as we believe them to be poor user experiences.

See: https://v4-alpha.getbootstrap.com/components/modal/#how-it-works

Some people have been able to get them working (see https://github.com/dwmkerr/angular-modal-service/issues/176). Unfortunately, due to the lack of support in Bootstrap is has proven troublesome to support this in angular-modal-service.

## Thanks

Thanks go the the following contributors:

* [joshvillbrandt](https://github.com/joshvillbrandt) - Adding support for `$templateCache`.
* [cointilt](https://github.com/cointilt) - Allowing the modal to be added to a custom element, not just the body.
* [kernowjoe](https://github.com/kernowjoe) - controllerAs
* [poporul](https://github.com/poporul) - Improving the core logic around compilation and inputs.
* [jonasnas](https://github.com/jonasnas) - Fixing template cache logic.
* [maxdow](https://github.com/maxdow) - Added support for controller inlining.
* [kernowjoe](https://github.com/kernowjoe) - Robustness around locationChange
* [arthur-xavier](https://github.com/arthur-xavier) - Robustness when `body` element changes.
* [stormpooper](https://github.com/StormPooper) - The new `bodyClass` feature.
* [decherneyge](https://github.com/decherneyge) - Provider features, global configuration, `appendElement` improvements.

angular-modal-service
=====================

[![Build Status](https://secure.travis-ci.org/dwmkerr/angular-modal-service.png?branch=master)](https://travis-ci.org/dwmkerr/angular-modal-service)
[![Coverage Status](https://coveralls.io/repos/dwmkerr/angular-modal-service/badge.png?branch=master)](https://coveralls.io/r/dwmkerr/angular-modal-service?branch=master)
[![Dependencies](https://david-dm.org/dwmkerr/angular-modal-service.svg?theme=shields.io)](https://david-dm.org/dwmkerr/angular-modal-service)
[![Dev Dependencies](https://david-dm.org/dwmkerr/angular-modal-service/dev-status.svg?theme=shields.io)](https://david-dm.org/dwmkerr/angular-modal-service#info=devDependencies)

Modal service for AngularJS - supports creating popups and modals via a service. See [a quick fiddle](http://jsfiddle.net/dwmkerr/8MVLJ/) or a full set of samples at [dwmkerr.github.io/angular-modal-service](http://dwmkerr.github.io/angular-modal-service).

1. [Usage](#usage)
2. [Developing](#developing)
3. [Tests](#tests)
4. [FAQ & Troubleshooting](#faq)
5. [Thanks](#thanks)

## Usage

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

 $scope.dismissModal = function(result) {
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

You can also provide a controller function directly to the modal, with or without the controllerAs attribute :

```js
ModalService.showModal({
  template: "<div>Fry lives in {{futurama.city}}</div>",
  controller: function() {
    this.city = "New New York";
  },
  controllerAs : "futurama"
})
```
#### ShowModal Options

The `showModal` function takes an object with these fields:

* `controller`: The name of the controller to created. It could be a function.
* `controllerAs` : The name of the variable on the scope the controller is assigned to - (optional).
* `templateUrl`: The URL of the HTML template to use for the modal.
* `template`: If `templateUrl` is not specified, you can specify `template` as raw
  HTML for the modal.
* `inputs`: A set of values to pass as inputs to the controller. Each value provided
  is injected into the controller constructor.
* `appendElement`: The custom angular element to append the modal to instead of default `body` element.

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

## Developing

To work with the code, just run:

```
npm install
bower install
gulp
```

The samples will be opened in the browser. All JavaScript changes will re-run the tests, all samples changes are automatically reloaded into the browser.

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

**I don't want to use the 'data-dismiss' attribute on a button, how can I close a modal manually?**

You can check the 'Complex' sample ([complexcontroller.js](samples/complex/complexcontroller.js)). The 'Cancel' button closes without using the `data-dismiss` attribute.
All you need to do is grab the modal element in your controller, then call the bootstrap `modal` function
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


## Thanks

Thanks go the the following contributors:

* [joshvillbrandt](https://github.com/joshvillbrandt) - Adding support for `$templateCache`.
* [cointilt](https://github.com/cointilt) - Allowing the modal to be added to a custom element, not just the body.
* [kernowjoe](https://github.com/kernowjoe) - controllerAs
* [poporul](https://github.com/poporul) - Improving the core logic around compilation and inputs.
* [jonasnas](https://github.com/jonasnas) - Fixing template cache logic.
* [maxdow](https://github.com/maxdow) - Added support for controller inlining.
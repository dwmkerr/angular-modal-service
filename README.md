angular-modal-service
=====================

[![Build Status](https://secure.travis-ci.org/dwmkerr/angular-modal-service.png?branch=master)](https://travis-ci.org/dwmkerr/angular-modal-service)

Modal service for AngularJS - supports creating popups and modals via a service.

### Usage

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

and all code will be built and ready to go. To ensure the code is minified and updated to the `dst` folder
as you change it, just run:

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
## v0.15.0

* Support for a globally configurable close timeout. Thanks [decherneyge](https://github.com/decherneyge).
* Support for selector for `appendElement`. Thanks [decherneyge](https://github.com/decherneyge).
* Tooling version updates.

## v0.7.12

* Support for configuration of the `$locationChangeSuccess` event. Thanks [smalbs](https://github.com/smalbs).

## v0.6.12

* When a model is opened, we blur any active element. Thanks [samx](https://github.com/samwx)!

## v0.6.11

* Robustness for 'locationChangeEvent'.
* Robustness if the body element changs.
* Addded `bower` as a dev dependency. Run `bower install` as an `npm` `postinstall` step, which makes initial setup on a clean machine slightly easier.

## v0.6.10

* Added support for using a custom parent scope for the controller scope, via the `scope` option.
* Fixed a bug with controllerAs vs `controller as`.

## v0.6.6

* Removed calls to $q `catch` and replaced with `then(null, f)` so that the code works in 
  IE8 (ECMAScript 3).

## v0.6.5

* Reverted changes below as they led to a bug with injected `$element` in modal controller.
  Added a test to protect against this case in the future.

## v0.6.4

* Merged `scope` option field. Updated readme.

## v0.6.3

* Fixed memory leak.

## v0.6.2

* Tidied up logic for cleanup.
* Fixed issue with vendor files.

## v0.6.1

* Moved from grunt to gulp.

## v0.6

## v0.5

* Updated the dependencies to use AngularJS 1.3 and upwards.

## v0.4

### Features

* The modal can now be added to any specific element in the DOM. If 
  unspecified, the modal is added to the `body`, as before.
  Thanks [cointilt](https://github.com/cointilt)!

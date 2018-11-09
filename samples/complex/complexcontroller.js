var app = angular.module('sampleapp');

app.controller('ComplexController', [
    '$scope', '$element', 'title', 'close',
    function ($scope, $element, title, close) {

        $scope.name = null;
        $scope.age = null;
        $scope.title = title;

        $scope.wasClosed = false;

        //  This close function doesn't need to use jQuery or bootstrap, because
        //  the button has the 'data-dismiss' attribute.
        $scope.close = function () {

            //mark the modal as handled
            $scope.wasClosed = true;

            close({
                name: $scope.name,
                age: $scope.age,
                source: 'Ok\'ed'
            }, 500); // close, but give 500ms for bootstrap to animate
        };

        //  This cancel function must use the bootstrap, 'modal' function because
        //  the doesn't have the 'data-dismiss' attribute.
        $scope.cancel = function () {

            //mark the modal as handled
            $scope.wasClosed = true;

            //  Manually hide the modal.
            $element.modal('hide');

            //  Now call close, returning control to the caller.
            close({
                name: $scope.name,
                age: $scope.age,
                source: 'Cancelled'
            }, 500); // close, but give 500ms for bootstrap to animate
        };

        //  The abort function  doesn't need to use jQuery or bootstrap, because
        //  the backdrop click already dismisses the modal and the X has the 'data-dismiss' attribute.
        $scope.abort = function () {
            //mark the modal as handled
            $scope.wasClosed = true;

            close({
                name: $scope.name,
                age: $scope.age,
                source: 'Aborted'
            }, 500); // close, but give 500ms for bootstrap to animate
        };

        var backgroundClickHandler = function (e) {

            //if the modal was already closed short circuit
            if ($scope.wasClosed) return;

            //call the close functionality
            $scope.abort();

            //remove the listener
            $element.off('hidden.bs.modal', backgroundClickHandler);
        };

        //listen for when the modal is dismissed and close it
        $element.on('hidden.bs.modal', backgroundClickHandler);

    }]);
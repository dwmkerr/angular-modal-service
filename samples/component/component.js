var app = angular.module('sampleapp');

app.component('sampleComponent', {
  template: `
    <div class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" ng-click="$ctrl.cancel" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title">What's your name?</h4>
          </div>
          <div class="modal-body">
            <span>Original Name: {{ $ctrl.originalName }}</span>
            <div>
              New Name:
              <input type="text" ng-model="$ctrl.newName" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" ng-click="$ctrl.cancel()" data-dismiss="modal" class="btn btn-default">Cancel</button>
            <button type="button" ng-click="$ctrl.submit()" data-dismiss="modal" class="btn btn-primary">Submit</button>
          </div>
        </div>
      </div>
    </div>
  `,
  bindings: {
    close: '<',
    user: '<'
  },
  controller: function() {
    this.$onInit = () => {
      this.originalName = this.user.name;
      this.newName = this.user.name;
    };

    this.submit = () => {
      this.close(this.newName);
    };

    this.cancel = () => {
      this.close(this.originalName);
    };
  }
});

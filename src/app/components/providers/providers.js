import providersModal from './confirm-modal.html';
class providersController {
  /** @ngInject */
  constructor (DataService, ngDialog, $scope, $timeout, $log) {
    this.DataService = DataService;
    this.ngDialog = ngDialog;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.providers = [];
    this.showDeleteSuccess = false;
    this.idToDelete = 0;
    this.$log = $log;

    getProviders.bind(this)();
  }

  cancelDelete () {
    this.idToDelete = 0;
    this.ngDialog.close();
  }

  confirmDelete (id) {
    this.idToDelete = id;
    this.ngDialog.open({
      plain: true,
      template: providersModal,
      scope: this.$scope,
      className: 'ngdialog-theme-default confirm-modal'
    });
  }

  deleteProvider () {
    this.DataService.deleteProvider(this.idToDelete).then( () => {
      this.providers = angular.copy(this.DataService.dataStore.providers);
      this.showDeleteSuccess = true;
      this.$timeout( () => {
        this.ngDialog.close();
        this.showDeleteSuccess = false;
      }, 1000);
    });
  }
}

function getProviders () {
  this.DataService.getProviders().then( () => {
    this.providers = angular.copy(this.DataService.dataStore.providers);
  });
}

export const providers = {
  template: require('./providers.html'),
  controller: providersController
};

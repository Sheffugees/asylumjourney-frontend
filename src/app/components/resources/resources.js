import resourcesModal from './confirmModal.html';
class resourcesController {
  /** @ngInject */
  constructor (DataService, ngDialog, $scope, $timeout) {
    this.DataService = DataService;
    this.ngDialog = ngDialog;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.resources = [];
    this.showDeleteSuccess = false;
    this.idToDelete = 0;
    getResources.bind(this)();
  }

  cancelDelete () {
    this.idToDelete = 0;
    this.ngDialog.close();
  }

  confirmDelete (id) {
    this.idToDelete = id;
    this.ngDialog.open({
      plain: true,
      template: resourcesModal,
      scope: this.$scope,
      className: 'ngdialog-theme-default confirm-modal'
    });
  }

  deleteResource () {
    this.DataService.deleteResource(this.idToDelete).then( () => {
      this.resources = angular.copy(this.DataService.dataStore.resources);
      this.showDeleteSuccess = true;
      this.$timeout( () => {
        this.ngDialog.close();
        this.showDeleteSuccess = false;
      }, 1000);
    });
  }
}

function getResources () {
  this.DataService.getResources().then( () => {
    this.resources = angular.copy(this.DataService.dataStore.resources);
  });
}

const resources = {
  template: require('./resources.html'),
  controller: resourcesController
};
export default resources;
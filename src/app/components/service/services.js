import servicesModal from './confirmModal.html';
class servicesController {
  /** @ngInject */
  constructor (DataService, ngDialog, $filter, $scope, $timeout) {
    this.DataService = DataService;
    this.ngDialog = ngDialog;
    this.$filter = $filter;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.services = [];
    this.showDeleteSuccess = false;
    this.idToDelete = 0;
    this.showExpiredOnly = false;
    this.order = 'name';
    getServices.bind(this)();
  }

  cancelDelete () {
    this.idToDelete = 0;
    this.ngDialog.close();
  }

  confirmDelete (id) {
    this.idToDelete = id;
    this.ngDialog.open({
      plain: true,
      template: servicesModal,
      scope: this.$scope,
      className: 'ngdialog-theme-default confirm-modal'
    });
  }

  deleteService () {
    this.DataService.deleteService(this.idToDelete).then( () => {
      this.services = formatExpiry.bind(this)(angular.copy(this.DataService.dataStore.services));
      this.showDeleteSuccess = true;
      this.$timeout( () => {
        this.ngDialog.close();
        this.showDeleteSuccess = false;
      }, 1000);
    });
  }

  toggleShowExpiredOnly () {
    this.showExpiredOnly = !this.showExpiredOnly;
    this.order = this.order === 'name' ? 'expiryDate' : 'name';
  }
}

function formatExpiry (services) {
  angular.forEach(services, service => {
    if (!service.expiryDate) {
      return;
    }
    const now = new Date();
    const expiry = new Date(service.expiryDate);
    if (expiry < now) {
      service.expired = true;
    }
    service.displayExpiryDate = this.$filter('date')(service.expiryDate, 'dd MMM yyyy')
  });
  return services;
}

function getServices () {
  this.DataService.getServices().then( () => {
    this.services = formatExpiry.bind(this)(angular.copy(this.DataService.dataStore.services));
  });
}

const services = {
  template: require('./services.html'),
  controller: servicesController
};
export default services;
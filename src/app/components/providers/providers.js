import providersModal from './confirmModal.html';
class providersController {
  /** @ngInject */
  constructor (DataService, ngDialog, $scope, $timeout, $filter) {
    this.DataService = DataService;
    this.ngDialog = ngDialog;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$filter = $filter;
    this.providers = [];
    this.showDeleteSuccess = false;
    this.idToDelete = 0;
    this.order = 'name';
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

  toggleShowReviewOverdueOnly () {
    this.showReviewOverdueOnly = !this.showReviewOverdueOnly;
    this.order = this.order === 'name' ? 'nextReviewDate' : 'name';
  }
}

function formatNextReviewDate (providers) {
  angular.forEach(providers, provider => {
    if (!provider.nextReviewDate) {
      return;
    }
    const now = new Date();
    const nextReview = new Date(provider.nextReviewDate);
    if (nextReview < now) {
      provider.reviewDue = true;
    }
    provider.displayNextReviewDate = this.$filter('date')(provider.nextReviewDate, 'dd MMM yyyy')
  });
  return providers;
}

function getProviders () {
  this.DataService.getProviders().then( () => {
    this.providers = formatNextReviewDate.bind(this)(angular.copy(this.DataService.dataStore.providers));
  });
}

const providers = {
  template: require('./providers.html'),
  controller: providersController
};
export default providers;
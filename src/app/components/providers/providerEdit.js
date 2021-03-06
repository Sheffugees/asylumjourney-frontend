class providerEditController {
  /** @ngInject */
  constructor (DataService, $filter, $location, $rootScope, $scope, $state, $timeout) {
    this.DataService = DataService;
    this.$filter = $filter;
    this.$location = $location;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.provider = {};
    this.saving = false;
    this.saved = false;
    this.errorMessage = '';

    const id = parseInt($state.params.id, 10);
    this.isNew = id ? false : true;

    if (!this.isNew) {
      DataService.getProvider(id).then( (provider)  => {
        this.provider = angular.copy(provider);
        formatDates.bind(this)(this.provider);
      });
    }

    this.returnToService = $state.params.service;
  }

  save () {
    this.saving = true;

    this.provider.lastReviewDate = new Date(this.provider.lastReviewDate);

    if (this.isNew) {
      this.DataService.createProvider(this.provider).then( () => {
        this.saving = false;
        this.saved = true;
        this.$timeout( () => {
          this.$location.path('providers');
        }, 500);
      }, () => {
      this.errorMessage = 'Sorry there was a problem saving the provider.'
      this.saving = false;
    });
      return;
    }

    this.DataService.updateProvider(this.provider).then( () => {
      this.saving = false;
      this.saved = true;
      this.$timeout( () => {

        if (this.returnToService) {
          this.$location.path('/service/' + this.returnToService);
          return;
        }
        this.$location.path('providers');
      }, 500);
    }, () => {
      this.errorMessage = 'Sorry there was a problem saving the provider.'
      this.saving = false;
    });
  }
}

function formatDates (provider) {
  const dateFields = ['lastReviewDate', 'nextReviewDate'];
  angular.forEach(dateFields, (field) => {
    provider[field] = this.$filter('date')(provider[field], 'dd MMM yyyy')
  });
  return provider;
}

const providerEdit = {
  template: require('./providerEdit.html'),
  controller: providerEditController
}
export default providerEdit;
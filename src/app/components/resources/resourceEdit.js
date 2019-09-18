class resourceEditController {
  /** @ngInject */
  constructor (DataService, $filter, $location, $rootScope, $scope, $state, $timeout) {
    this.DataService = DataService;
    this.$filter = $filter;
    this.$location = $location;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.resource = {};
    this.saving = false;
    this.saved = false;
    this.errorMessage = '';

    const id = parseInt($state.params.id, 10);
    this.isNew = id ? false : true;

    if (!this.isNew) {
      DataService.getResource(id).then( (resource)  => {
        this.resource = angular.copy(resource);
        formatDates.bind(this)(this.resource);
      });
    }

    this.returnToService = $state.params.service;
  }

  save () {
    this.saving = true;

    // this.resource.lastReviewDate = new Date(this.resource.lastReviewDate);

    if (this.isNew) {
      this.DataService.createResource(this.resource).then( () => {
        this.saving = false;
        this.saved = true;
        this.$timeout( () => {
          this.$location.path('resources');
        }, 500);
      }, () => {
      this.errorMessage = 'Sorry there was a problem saving the provider.'
      this.saving = false;
    });
      return;
    }

    this.DataService.updateResource(this.resource).then( () => {
      this.saving = false;
      this.saved = true;
      this.$timeout( () => {

        if (this.returnToService) {
          this.$location.path('/service/' + this.returnToService);
          return;
        }
        this.$location.path('resources');
      }, 500);
    }, () => {
      this.errorMessage = 'Sorry there was a problem saving the resource.'
      this.saving = false;
    });
  }
}

function formatDates (resource) {
  const dateFields = ['expiryDate', 'lastReviewDate', 'nextReviewDate'];
  angular.forEach(dateFields, (field) => {
    resource[field] = this.$filter('date')(resource[field], 'dd MMM yyyy')
  });
  return resource;
}

const resourceEdit = {
  template: require('./resourceEdit.html'),
  controller: resourceEditController
}
export default resourceEdit;
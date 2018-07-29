import categoriesModal from '../infoOverlay/categories.html';
import stagesModal from '../infoOverlay/stages.html';

class serviceEditController {
  /** @ngInject */
  constructor (DataService, ngDialog, $filter, $location, $state, $timeout) {
    this.DataService = DataService;
    this.ngDialog = ngDialog;
    this.$filter = $filter;
    this.$location = $location;
    this.$timeout = $timeout;
    this.service = {};
    this.service._embedded = {};
    this.service.resources = [];
    this.saving = false;
    this.saved = false;
    this.errorMessage = '';
    this.categories = [];
    this.providers = [];
    this.resources = [];
    this.stages = [];
    const id = parseInt($state.params.serviceId, 10);

    this.isNew = id ? false : true;
    DataService.getCategories().then( () => {
      this.categories = angular.copy(this.DataService.dataStore.categories);
    });
    DataService.getProviders().then( () => {
      this.providers = angular.copy(this.DataService.dataStore.providers);
    });
    DataService.getResources().then( () => {
      this.resources = angular.copy(this.DataService.dataStore.resources);
    });
    DataService.getStages().then( () => {
      this.stages = angular.copy(this.DataService.dataStore.stages);
    });

    if (!this.isNew) {
      DataService.getService(id).then(service => {
        this.service = angular.copy(service);
        // if (this.service.resources.length) {
          formatDates.bind(this)(this.service);
        // }
      });
    }

  }
  
  categoriesInfo () {
    this.ngDialog.open({
      plain: true,
      template: categoriesModal
    });
  }

  stagesInfo () {
    this.ngDialog.open({
      plain: true,
      template: stagesModal
    });
  }

  save () {
    this.saving = true;

    if (!this.service._embedded.categories || !this.service._embedded.categories.length
      || !this.service._embedded.stages || !this.service._embedded.stages.length) {
      this.saving = false;
      this.errorMessage = 'Error: Name, Categories and Stages are all required.';
      return;
    }

    this.service.categories = [];
    angular.forEach(this.service._embedded.categories, cat => {
      this.service.categories.push(cat.id);
    });

    this.service.providers = [];
    angular.forEach(this.service._embedded.providers, provider => {
      this.service.providers.push(provider.id);
    });

    this.service.resources = [];
    angular.forEach(this.service._embedded.resources, resource => {
      this.service.resources.push(resource.id);
    });

    this.service.stages = [];
    angular.forEach(this.service._embedded.stages, stage => {
      this.service.stages.push(stage.id);
    });

    if (this.isNew) {
      this.DataService.createService(this.service).then(id => {
        this.saving = false;
        this.saved = true;
        this.errorMessage = '';
        this.$timeout( () => {
          this.$location.path('/service/' + id);
        }, 500);
      }, () => {
        this.errorMessage = 'Sorry there was a problem saving the service.'
        this.saving = false;
      });
      return;
    }
    this.DataService.updateService(this.service).then( () => {
      this.saving = false;
      this.saved = true;
      this.errorMessage = '';
      this.$timeout( () => {
        this.$location.path('/service/' + this.service.id);
      }, 500);
    }, function () {
      this.errorMessage = 'Sorry there was a problem saving the service.'
      this.saving = false;
    });
  }
}

function formatDate (date) {
  if (date) {
    return this.$filter('date')(date, 'dd MMM yyyy')
  }
}

function formatDates (service) {

  const dateFields = ['endDate', 'lastReviewDate', 'nextReviewDate'];
  angular.forEach(dateFields, field => {
    service[field] = formatDate.bind(this)(service[field]);
  });
  return service;
}

const serviceEdit = {
  template: require('./serviceEdit.html'),
  controller: serviceEditController
}
export default serviceEdit;
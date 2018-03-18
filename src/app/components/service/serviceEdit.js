import categoriesModal from '../infoOverlay/categories.html';
import stagesModal from '../infoOverlay/stages.html';

class serviceEditController {
  /** @ngInject */
  constructor (DataService, ngDialog, $filter, $location, $state, $timeout, $log) {
    this.DataService = DataService;
    this.ngDialog = ngDialog;
    this.$filter = $filter;
    this.$location = $location;
    // this.$state = $state;
    this.$timeout = $timeout;
    this.service = {};
    this.service._embedded = {};
    this.service.resources = [];
    this.saving = false;
    this.saved = false;
    this.errorMessage = '';
    this.categories = [];
    this.providers = [];
    this.stages = [];
    this.$log = $log;
    $log.log($state.params)
    const id = parseInt($state.params.serviceId, 10);

    this.isNew = id ? false : true;
    $log.log('id', id);
    // this.isNew = angular.isDefined(id) ? false : true;
    $log.log('isNew', this.isNew);
    DataService.getCategories().then( () => {
      this.categories = angular.copy(this.DataService.dataStore.categories);
    });
    DataService.getProviders().then( () => {
      this.providers = angular.copy(this.DataService.dataStore.providers);
    });
    DataService.getStages().then( () => {
      this.stages = angular.copy(this.DataService.dataStore.stages);
    });

    if (!this.isNew) {
      $log.log('get service');
      DataService.getService(id).then(service => {
        this.service = angular.copy(service);
        $log.log('get service', this.service);
        if (this.service.resources.length) {
          formatDates.bind(this)(this.service);
        }
      });
    }

  }

  addResource () {
    this.service.resources.push({name: '', url: '', expiryDate: '', comments: ''})
  }

  removeResource (index) {
    this.service.resources.splice(index, 1);
  }
  
  // TO DO add these modals
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

    this.$log.log('save', this.service);

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

    this.service.stages = [];
    angular.forEach(this.service._embedded.stages, stage => {
      this.service.stages.push(stage.id);
    });

    angular.forEach(this.service.resources, (resource, i) => {
      if (resource.name === '' || resource.url === '') {
        this.service.resources.splice(i, 1)
      }
    });

    if (this.isNew) {
      this.$log.log('is New');
      this.DataService.createService(this.service).then(id => {
        this.$log.log('created id', id);
        this.saving = false;
        this.saved = true;
        this.errorMessage = '';
        this.$timeout( () => {
          // this.$state.go(`service${id}`);
          this.$location.path('/service/' + id);
        }, 500);
      }, () => {
        this.errorMessage = 'Sorry there was a problem saving the service.'
        this.saving = false;
      });
      return;
    }
    this.$log.log('update');
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
  if (service.resources.length) {
    angular.forEach(service.resources, resource => {
      resource.expiryDate = formatDate.bind(this)(resource.expiryDate);
    });
  }

  const dateFields = ['endDate', 'lastReviewDate', 'nextReviewDate'];
  angular.forEach(dateFields, field => {
    service[field] = formatDate(service[field]);
  });
  return service;
}

const serviceEdit = {
  template: require('./serviceEdit.html'),
  controller: serviceEditController
}
export default serviceEdit;
 /* global ga:false */
import './tool.scss';

class toolController {
  /** @ngInject */
  constructor(AuthService, DataService, ngDialog, $filter, $location, $rootScope, $scope, $state, $window, $log) {
    this.DataService = DataService;
    this.ngDialog = ngDialog;
    this.$filter = $filter;
    this.$scope = $scope;
    this.$state = $state;
    this.$location = $location;
    this.$window = $window;
    this.categories = [];
    this.services = [];
    this.stages = [];
    this.filtered = false;
    this.showLoader = true;
    this.showFilters = false;
    this.filteredProviders = [];
    this.searchText = $state.params.q;
    this.showAllFilters = false;
    this.numStagesDisplayed = 0;
    this.AuthService = AuthService;
    this.expandFilters = {
      stages: false,
      categories: false,
      providers: false
    };

    this.currentFilters = {
      stages: [],
      categories: [],
      providers: []
    };

    this.$log = $log;

    this.getServices();
    this.getProviders();
    this.getStages();
    this.getCategories();

    // TO DO check this works
    const updateEvent = $rootScope.$on('updateServices', () => {
      this.getServices();
    });
    $rootScope.$on('$destroy', updateEvent);
  }

  filterServices(filterId, type) {
    updateActiveFilters.bind(this)(filterId, type);
    updateCurrentFilter.bind(this)(filterId, type);

    // Get number of stages displayed for use in CSS class
    if (type === 'stages') {
      const displayedStages = this.stages.filter(stage => {
        return stage.display;
      });
      this.numStagesDisplayed = displayedStages.length;
    }
  }

   // for mobile
  toggleMobileFilters() {
    this.showFilters = !this.showFilters;
  }

  resetFilters(array, list, type) {
    resetFilter(list);
    this.currentFilters[type] = [];
    array = [];
    this.numStagesDisplayed = this.stages.length;
  }

  showAll() {
    this.closeFilters();
    resetFilter(this.stages);
    resetFilter(this.categories);
    resetFilter(this.providers);
    this.resetSearch();
    this.numStagesDisplayed = this.stages.length;
    this.filteredProviders = [];
    this.currentFilters = {
      stages: [],
      categories: [],
      providers: []
    };
    this.$location.search({});
  }

  getServices() {
    this.DataService.getServices().then(() => {
      this.services = angular.copy(this.DataService.dataStore.services);
      this.services = this.$filter('orderBy')(this.services, 'name');

      angular.forEach(this.services, item => {
        item.display = setItemDisplay.bind(this)(item);
      });

      if (this.searchText) {
        this.doSearch();
      }
      checkRoute.bind(this)();
      this.showLoader = false;
    });
  }

  getProviders() {
    this.DataService.getProviders().then(() => {
      this.providers = angular.copy(this.DataService.dataStore.providers);
      updateDisplay.bind(this)('providers');
    });
  }

  getStages() {
    this.DataService.getStages().then(() => {
      this.stages = angular.copy(this.DataService.dataStore.stages);
      updateDisplay.bind(this)('stages');
    });
  }

  getCategories() {
    this.DataService.getCategories().then(() => {
      this.categories = angular.copy(this.DataService.dataStore.categories);
      updateDisplay.bind(this)('categories');
    });
  }

  resetSearch() {
    this.searchText = '';
    this.$location.search('q', null);
    angular.forEach(this.services, item => {
      item.display = setItemDisplay.bind(this)(item);
      item.filtered = false;
    });
  }

  showService(id) {
    this.$log.log('showservice', id);
    const data = {id};
    this.ngDialog.open({
      template: 'app/components/service/service.html',
      data: angular.toJson(data),
      // controller: 'ServiceController',
      // controllerAs: 'service',
      className: 'ngdialog-theme-default service-modal'
    });
  }

  toggleSecondaryFilters() {
    this.showAllFilters = !this.showAllFilters;
    this.closeFilters();
  }

  toggleFilter(type) {
    this.expandFilters[type] = !this.expandFilters[type];
    angular.forEach(this.expandFilters, (value, key) => {
      if (key !== type) {
        this.expandFilters[key] = false;
      }
    });
  }

  // toggle Provider filter
  toggleProviderFilters() {
    this.ngDialog.open({
      template: 'app/components/filterBar/providers-overlay.html',
      scope: this.$scope
    });
  }

  openDialog() {
    this.ngDialog.open({
      template: 'app/components/infoOverlay/info.html',
      scope: this.$scope
    });
  }

  // close all filters
  closeFilters() {
    angular.forEach(this.expandFilters, (value, key) => {
      this.expandFilters[key] = false;
    });
  }

  doSearch() {
    const searchText = this.searchText.toLowerCase();

    angular.forEach(this.services, item => {
      const name = item.name.toLowerCase();
      const description = item.description ? item.description.toLowerCase() : '';
      const events = item.events ? item.events.toLowerCase() : '';

      if (name.indexOf(searchText) !== -1 || description.indexOf(searchText) !== -1 || events.indexOf(searchText) !== -1) {
        updateFilteredItem(item, setItemDisplay.bind(this)(item));
        return;
      }
      updateFilteredItem(item, false);
    });

    this.$location.search('q', this.searchText);
    if (angular.isDefined(this.$window.ga)) {
      ga('send', 'pageview', this.$location.url());
    }
  }

  resetFilterType(type) {
    resetFilter(this[type]);
    if (type === 'stages') {
      this.numStagesDisplayed = this.stages.length;
    }
    if (type === 'providers') {
      this.filteredProviders = [];
    }
    this.currentFilters[type] = [];

    const params = this.$state.params;
    params[type] = 'all';
    this.$location.search(params);
  }
}

function addToQS(qs, item, type) {
  let qsArray = [];
  if (qs) {
    qsArray = qs.length > 1 ? qs.split(',') : [qs];
  }
  let qsString = item;
  if (qsArray.indexOf('all') !== -1) {
    qsArray.splice(qsArray.indexOf('all'), 1);
  }
  if (qsArray.indexOf(item.toString()) === -1) {
    qsArray.push(item);
    if (qsArray.length > 1) {
      qsString = qsArray.join(',');
    }
    const params = this.$state.params;
    params[type] = qsString;
    this.$location.search(params);
  }
}

/**
 * Check route for direct access to service, e.g. /service/100
 * Open service modal and change url to /tool if service id is present.
 */
function checkRoute() {
  const id = this.$state.params.serviceId;
  if (id) {
    this.showService(id);
    this.$location.search('');
    this.$location.path('/tool');
  }
}

function filterFromRouteParams(type, item) {
  const selected = this.$state.params[type].split(',');

  angular.forEach(selected, selectedItem => {
    if (item.id === parseInt(selectedItem, 10)) {
      item.display = setItemDisplay.bind(this)(item);

      updateActiveFilters.bind(this)(item.id, type);
      updateCurrentFilter.bind(this)(item.id, type);

      if (type === 'stages') {
        const displayedStages = this.stages.filter(stage => {
          return stage.display;
        });
        this.numStagesDisplayed = displayedStages.length;
      }
    }
  });
  return;
}

function removeFromQS(qs, item, type) {
  if (!qs) {
    return;
  }
  const qsArray = qs.length ? qs.split(',') : [];
  let qsString = item;
  qsArray.splice(qsArray.indexOf(item.toString()), 1);
  qsString = qsArray.join(',');
  const params = this.$state.params;
  params[type] = qsString;
  this.$location.search(params);
}

function resetFilter(list) {
  angular.forEach(list, item => {
    item.display = true;
    item.filtered = false;
  });
}

function setItemDisplay(item) {
  if (!this.AuthService.isAuthenticated && item.hidden) {
    return false;
  }

  return true;
}

// Updates active filters in dropdown
function updateActiveFilters(filterId, type) {
  angular.forEach(this[type], item => {
    const isFiltered = this.currentFilters[type].filter(filteredItem => {
      return filteredItem.id === item.id;
    })[0];
    const isCurrentlyFiltered = isFiltered;
    if (item.id === filterId) {
      updateFilteredItem(item, !isCurrentlyFiltered);
      return;
    }

    if (isCurrentlyFiltered) {
      return;
    }

    updateFilteredItem(item, false);
  });
}

function updateCurrentFilter(filterId, type) {
  const currentlyFiltered = this.currentFilters[type].filter(item => {
    return item.id === filterId;
  })[0];

  // adding filter
  if (!currentlyFiltered) {
    const selectedFilter = this[type].filter(item => {
      return item.id === filterId;
    })[0];
    this.currentFilters[type].push({id: filterId, name: selectedFilter.name});
    addToQS.bind(this)(this.$state.params[type], filterId, type);

    if (type === 'providers') {
      this.filteredProviders.push(filterId);
    }
    return;
  }
  // removing filter
  this.currentFilters[type] = this.currentFilters[type].filter(obj => {
    return obj.id !== filterId;
  });

  removeFromQS.bind(this)(this.$state.params[type], filterId, type);

  if (!this.currentFilters[type].length) {
    resetFilter(this[type]);
  }

  if (type === 'providers') {
    const providerIndex = this.filteredProviders.indexOf(filterId);
    this.filteredProviders.splice(providerIndex, 1);
  }
}

function updateDisplay(type) {
  angular.forEach(this[type], item => {
    if (this.$state.params[type] && this.$state.params[type] !== 'all') {
      filterFromRouteParams.bind(this)(type, item);
      return;
    }
    item.display = setItemDisplay.bind(this)(item);
  });
}

// shows which are filtered in dropdown
function updateFilteredItem(item, filter) {
  item.display = filter;
  item.filtered = filter;
}

export const tool = {
  template: require('./tool.html'),
  controller: toolController
};

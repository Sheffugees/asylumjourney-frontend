 /* global ga:false */
import './tool.scss';
import serviceModalTemplate from '../service/service.html';
import infoModal from '../infoOverlay/info.html';
import providersModal from '../filterBar/providersOverlay.html';
import resourcesModal from '../filterBar/resourcesOverlay.html';
import searchModalTemplate from '../search/search.html';

class toolController {
  /** @ngInject */
  constructor(AuthService, DataService, ngDialog, $filter, $location, $rootScope, $scope, $state, $window) {
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
    this.filteredResources = [];
    this.searchText = '';
    this.showAllFilters = false;
    this.numStagesDisplayed = 0;
    this.AuthService = AuthService;
    this.expandFilters = {
      stages: false,
      categories: false,
      providers: false,
      resources: false
    };
    this.currentFilters = this.DataService.dataStore.currentFilters;
    this.getServices();
    this.getProviders();
    this.getStages();
    this.getCategories();
    this.getResources();

    /**
     * Update services in tool after one is deleted.
     */
    const updateEvent = $rootScope.$on('updateServices', () => {
      this.getServices();
    });
    $scope.$on('$destroy', updateEvent);

    /**
     * Show Service event - called when search results clicked.
     */
    const showServiceEvent = $rootScope.$on('showService', (event, params) => {
      this.showService(params.serviceId);
    })
    $scope.$on('$destroy', showServiceEvent);
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
    this.DataService.dataStore.currentFilters[type] = [];
    array = [];
    this.numStagesDisplayed = this.stages.length;
  }

  showAll() {
    this.closeFilters();
    resetFilter(this.stages);
    resetFilter(this.categories);
    resetFilter(this.providers);
    this.numStagesDisplayed = this.stages.length;
    this.filteredProviders = [];
    this.filteredResources = [];
    this.currentFilters = this.DataService.resetCurrentFilters();
    this.$location.search({});
  }

  getServices() {
    this.DataService.getServices().then(() => {
      this.services = angular.copy(this.DataService.dataStore.services);
      this.services = this.$filter('orderBy')(this.services, 'name');

      angular.forEach(this.services, item => {
        item.display = setItemDisplay.bind(this)(item);
      });

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

  getResources() {
    this.DataService.getResources().then(() => {
      this.resources = angular.copy(this.DataService.dataStore.resources);
      angular.forEach(this.resources, resource => {
        if (!resource.expiryDate) {
          return;
        }
        const now = new Date();
        const expiry = new Date(resource.expiryDate);
        if (expiry < now) {
          resource.expired = true;
        }
      });
      updateDisplay.bind(this)('resources');
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

  showService(id) {
    const data = {id};
    this.ngDialog.open({
      plain: true,
      template: serviceModalTemplate,
      data: angular.toJson(data),
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
      plain: true,
      template: providersModal,
      scope: this.$scope
    });
  }

  // toggle Resources filter
  toggleResourcesFilters() {
    this.ngDialog.open({
      plain: true,
      template: resourcesModal,
      scope: this.$scope
    });
  }
  
  openDialog() {
    this.ngDialog.open({
      plain: true,
      template: infoModal,
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
    if (!this.searchText.length) {
      return;
    }
    const searchData = { searchTerm: this.searchText.toLowerCase() };
    const searchModal = this.ngDialog.open({
      plain: true,
      template: searchModalTemplate,
      data: angular.toJson(searchData),
      className: 'ngdialog-theme-default service-modal'
    });
    updateRoute.bind(this)(this.searchText);
    sendGAEvent.bind(this)(this.searchText);

    // Clear search form when close result modal
    searchModal.closePromise.then(() => {
      this.searchText = '';
      removeSearchFromRoute.bind(this)();
    });
  }

  resetFilterType(type) {
    resetFilter(this[type]);
    if (type === 'stages') {
      this.numStagesDisplayed = this.stages.length;
    }
    if (type === 'providers') {
      this.filteredProviders = [];
    }
    if (type === 'resources') {
      this.filteredResources = [];
    }
    this.DataService.dataStore.currentFilters[type] = [];

    const params = this.$state.params;
    params[type] = 'all';
    this.$location.search(params);
  }
}

function updateRoute (searchTerm) {
  this.$location.search('q', searchTerm);
}

function removeSearchFromRoute () {
  const params = this.$state.params;
  delete params.q;
  this.$location.search(params);
}

function sendGAEvent () {
  if (angular.isDefined(this.$window.ga)) {
    ga('send', 'pageview', this.$location.url());
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
 * Also checks for search term and shows search results if present.
 */
function checkRoute() {
  const id = this.$state.params.serviceId;
  const searchTerm = this.$state.params.q;
  if (id) {
    this.showService(id);
    this.$location.search('');
    this.$location.path('/tool');
    return;
  }
  if (searchTerm) {
    this.searchText = searchTerm;
    this.doSearch();
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
    const isFiltered = this.DataService.dataStore.currentFilters[type].filter(filteredItem => {
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
  const currentlyFiltered = this.DataService.dataStore.currentFilters[type].filter(item => {
    return item.id === filterId;
  })[0];
  

  // adding filter
  if (!currentlyFiltered) {
    const selectedFilter = this[type].filter(item => {
      return item.id === filterId;
    })[0];
    this.DataService.dataStore.currentFilters[type].push({id: filterId, name: selectedFilter.name});
    addToQS.bind(this)(this.$state.params[type], filterId, type);

    if (type === 'providers') {
      this.filteredProviders.push(filterId);
    }

    if (type === 'resources') {
      this.filteredResources.push(filterId);
    }

    return;
  }
  // removing filter
  this.DataService.dataStore.currentFilters[type] = this.DataService.dataStore.currentFilters[type].filter(obj => {
    return obj.id !== filterId;
  });

  removeFromQS.bind(this)(this.$state.params[type], filterId, type);

  if (!this.DataService.dataStore.currentFilters[type].length) {
    resetFilter(this[type]);
  }

  if (type === 'providers') {
    const providerIndex = this.filteredProviders.indexOf(filterId);
    this.filteredProviders.splice(providerIndex, 1);
  }

  if (type === 'resources') {
    const resourceIndex = this.filteredResources.indexOf(filterId);
    this.filteredResources.splice(resourceIndex, 1);
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

const tool = {
  template: require('./tool.html'),
  controller: toolController
};
export default tool;

import './search.scss';

class SearchController {
  /** @ngInject */
  constructor(AuthService, DataService, ngDialog, $filter, $rootScope, $scope) {
    this.AuthService = AuthService;
    this.DataService = DataService;
    this.$filter = $filter;
    this.ngDialog = ngDialog;
    this.$rootScope = $rootScope;
    this.searchTerm = $scope.ngDialogData.searchTerm;
    this.searchResultsProviders = [];
    this.searchResultsServices = [];
    this.searchResultsResources = [];
    this.showLoader = false;
    this.getSearchResults(this.searchTerm);
  }

  showService (serviceId) {
    this.ngDialog.close();
    this.$rootScope.$broadcast('showService', {serviceId});
  }

  showProvider (providerId) {
    this.ngDialog.close();
    this.$rootScope.$broadcast('showProvider', {providerId});
  }

  getSearchResults (searchTerm) {
    this.showLoader = true;
    this.DataService.getServices().then(() => {
      this.services = angular.copy(this.DataService.dataStore.services);
      this.resources = angular.copy(this.DataService.dataStore.resources);
      this.providers = angular.copy(this.DataService.dataStore.providers);

      angular.forEach(this.services, item => {

        if (!shouldShowService.bind(this)(item)) {
          return;
        }
        
        if (searchTermInName(item, searchTerm)) {
          item.priority = 1;
          this.searchResultsServices.push(item);
          return;
        }

        if (searchTermInDescription(item, searchTerm)) {
          item.priority = 2;
          this.searchResultsServices.push(item);
          return;
        }

        if (searchTermInEvents(item, searchTerm)) {
          item.priority = 3;
          this.searchResultsServices.push(item);
        }
      });

      angular.forEach(this.resources, item => {
        if (!shouldShowResource.bind(this)(item)) {
          return;
        }
        
        if (searchTermInName(item, searchTerm)) {
          item.priority = 1;
          this.searchResultsResources.push(item);
          return;
        }
      });

      angular.forEach(this.providers, item => {
        if (searchTermInName(item, searchTerm)) {
          item.priority = 1;
          this.searchResultsProviders.push(item);
          return;
        }

        if (searchTermInDescription(item, searchTerm)) {
          item.priority = 2;
          this.searchResultsProviders.push(item);
          return;
        }
      });

      this.searchResultsServices = this.$filter('orderBy')(this.searchResultsServices, ['priority', 'name']);
      this.searchResultsProviders = this.$filter('orderBy')(this.searchResultsProviders, ['priority', 'name']);
      this.searchResultsResources = this.$filter('orderBy')(this.searchResultsResources, ['priority', 'name']);
      this.showLoader = false;    
    });
  }
}

function searchTermInName (item, searchTerm) {
  return item.name.toLowerCase().indexOf(searchTerm) !== -1;
}

function searchTermInDescription (item, searchTerm) {
  return item.description && item.description.toLowerCase().indexOf(searchTerm) !== -1;
}

function searchTermInEvents (item, searchTerm) {
  return item.events && item.events.toLowerCase().indexOf(searchTerm) !== -1;
}

function shouldShowService (item) {
  return this.AuthService.isAuthenticated || !item.hidden;
}

function shouldShowResource (item) {
  if (item.expiryDate) {
    const now = new Date();
    const expiry = new Date(item.expiryDate);
    if (expiry < now) {
      item.expired = true;
    }
  }
  return this.AuthService.isAuthenticated || !item.expired;
}

export default SearchController;

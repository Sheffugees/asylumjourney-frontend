import { apiUrl } from '../../constants';

export default class DataService {
  /** @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
    this.dataStore = {
      categories: [],
      providers: [],
      resources: [],
      services: [],
      stages: [],
      currentFilters: {
        stages: [],
        categories: [],
        providers: []
      }
    };
  }

  getCategories() {
    return getItems.bind(this)('categories');
  }

  createProvider (provider) {
    return createItem.bind(this)(provider, 'providers');
  }

  deleteProvider (id) {
    return deleteItem.bind(this)(id, 'providers');
  }

  getProvider(id) {
    return getItem.bind(this)(id, 'providers');
  }

  getProviders() {
    return getItems.bind(this)('providers');
  }

  updateProvider (provider) {
    return updateItem.bind(this)(provider, 'providers');
  }

  createResource (resource) {
    return createItem.bind(this)(resource, 'resources');
  }

  deleteResource (id) {
    return deleteItem.bind(this)(id, 'resources');
  }

  getResource(id) {
    return getItem.bind(this)(id, 'resources');
  }

  getResources() {
    return getItems.bind(this)('resources');
  }

  updateResource (resource) {
    return updateItem.bind(this)(resource, 'resources');
  }

  createService (service) {
    return createItem.bind(this)(service, 'services');
  }

  deleteService(id) {
    return deleteItem.bind(this)(id, 'services');
  }

  getService(id) {
    return getItem.bind(this)(id, 'services');
  }

  getServices() {
    return getItems.bind(this)('services');
  }

  updateService (service) {
    return updateItem.bind(this)(service, 'services');
  }

  getStages() {
    return getItems.bind(this)('stages');
  }

  resetCurrentFilters() {
    return this.dataStore.currentFilters = {
      stages: [],
      categories: [],
      providers: []
    }
  }

  getNonEmptyFilters() {
    const nonEmptyFilters = {};
    if (this.dataStore.currentFilters.stages.length) {
      nonEmptyFilters.stages = angular.copy(this.dataStore.currentFilters.stages);
    }
    if (this.dataStore.currentFilters.categories.length) {
      nonEmptyFilters.categories = angular.copy(this.dataStore.currentFilters.categories);
    }
    if (this.dataStore.currentFilters.providers.length) {
      nonEmptyFilters.providers = angular.copy(this.dataStore.currentFilters.providers);
    }
    return nonEmptyFilters;
  }
}

function createItem (item, type) {
  const deferred = this.$q.defer();
  return this.$http.post(`${apiUrl}${type}`, item).then((response) => {
    const location = response.headers().location;
    const id = location.split(`/${type}/`).pop();
    if (this.dataStore[type].length) {
      item.id = id;
      this.dataStore[type].push(item);
    }
    deferred.resolve(item.id);
    return deferred.promise;
  }, error => {
    deferred.reject(error);
    return deferred.promise;
  });
}

function deleteItem (id, type) {
  const deferred = this.$q.defer();
  return this.$http.delete(`${apiUrl}${type}/${id}`).then(() => {
    const index = this.dataStore[type].map((x) => {return x.id; }).indexOf(id);
    this.dataStore[type].splice(index, 1);
    deferred.resolve();
    return deferred.promise;
  }, error => {
    deferred.reject(error);
    return deferred.promise;
  });
}

function getItem (id, type) {
  const deferred = this.$q.defer();
  const item = this.dataStore[type].filter(s => {
    return s.id === id;
  })[0];

  if (item) {
    deferred.resolve(item);
    return deferred.promise;
  }

  return this.$http.get(`${apiUrl}${type}/${id}`).then(response => {
    deferred.resolve(response.data);
    return deferred.promise;
  }, error => {
    deferred.reject(error);
    return deferred.promise;
  });
}

function getItems (type) {
  const deferred = this.$q.defer();

  if (this.dataStore[type].length) {
    deferred.resolve();
    return deferred.promise;
  }

  return this.$http.get(`${apiUrl}${type}`).then(response => {
    this.dataStore[type] = angular.copy(response.data._embedded[type]);
    deferred.resolve();
    return deferred.promise;
  }, error => {
    deferred.reject(error);
    return deferred.promise;
  });
} 

function updateItem (item, type) {
  const deferred = this.$q.defer();
  return this.$http.put(`${apiUrl}${type}/${item.id}`, item).then(() => {
  if (this.dataStore[type].length) {
      const index = this.dataStore[type].map((x) => {return x.id; }).indexOf(item.id);
      this.dataStore[type][index] = item;
    }
    deferred.resolve();
    return deferred.promise;
  }, error => {
    deferred.reject(error);
    return deferred.promise;
  });
}
export class DataService {
  /** @ngInject */
  constructor($http, $q, $log) {
    this.$http = $http;
    this.$q = $q;
    this.$log = $log;
    this.dataStore = {
      categories: [],
      providers: [],
      services: [],
      stages: []
    };
  }

  deleteService(id) {
    const deferred = this.$q.defer();
    return this.$http.delete('https://asylum-journey-staging.herokuapp.com/services/', {id}).then(() => {
    // return servicesResource.delete({id: id}).$promise.then(function () {
      const index = this.dataStore.services.map(x => {
        return x.id;
      }).indexOf(id);
      this.dataStore.services.splice(index, 1);
      deferred.resolve();
      return deferred.promise;
    }, error => {
      deferred.reject(error);
      return deferred.promise;
    });
  }

  getCategories() {
    const deferred = this.$q.defer();

    if (this.dataStore.categories.length) {
      deferred.resolve();
      return deferred.promise;
    }

    return this.$http.get('https://asylum-journey-staging.herokuapp.com/categories').then(response => {
      this.dataStore.categories = angular.copy(response.data._embedded.categories);
      deferred.resolve();
      return deferred.promise;
    }, error => {
      deferred.reject(error);
      return deferred.promise;
    });
  }

  getProviders() {
    const deferred = this.$q.defer();

    if (this.dataStore.providers.length) {
      deferred.resolve();
      return deferred.promise;
    }

    return this.$http.get('https://asylum-journey-staging.herokuapp.com/providers').then(response => {
      this.dataStore.providers = angular.copy(response.data._embedded.providers);
      deferred.resolve();
      return deferred.promise;
    }, error => {
      deferred.reject(error);
      return deferred.promise;
    });
  }

  getService(id) {
    const deferred = this.$q.defer();
    const service = this.dataStore.services.filter(s => {
      return s.id === id;
    })[0];

    if (service) {
      deferred.resolve(service);
      return deferred.promise;
    }

    return this.$http.get('https://asylum-journey-staging.herokuapp.com/services/' + id).then(response => {
      deferred.resolve(response.data);
      return deferred.promise;
    }, error => {
      deferred.reject(error);
      return deferred.promise;
    });
  }

  getServices() {
    const deferred = this.$q.defer();

    if (this.dataStore.services.length) {
      deferred.resolve();
      return deferred.promise;
    }

    return this.$http.get('https://asylum-journey-staging.herokuapp.com/services').then(response => {
      this.dataStore.services = angular.copy(response.data._embedded.services);
      deferred.resolve();
      return deferred.promise;
    }, error => {
      deferred.reject(error);
      return deferred.promise;
    });
  }

  getStages() {
    const deferred = this.$q.defer();

    if (this.dataStore.stages.length) {
      deferred.resolve();
      return deferred.promise;
    }

    return this.$http.get('https://asylum-journey-staging.herokuapp.com/stages').then(response => {
      this.$log.log(response.data._embedded.stages);
      this.dataStore.stages = angular.copy(response.data._embedded.stages);
      deferred.resolve();
      return deferred.promise;
    }, error => {
      deferred.reject(error);
      return deferred.promise;
    });
  }
}

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

  createProvider (provider) {
    const deferred = this.$q.defer();
    return this.$http.post('https://asylum-journey-staging.herokuapp.com/providers', provider).then((response) => {
    this.$log.log('response', response);
    
      if (this.dataStore.providers.length) {
        const location = response.headers().location;
        this.$log.log('response location', location);
        const id = location.split('/providers/').pop();
        provider.id = id;
        this.dataStore.providers.push(provider);
      }
      deferred.resolve();
      return deferred.promise;
    }, error => {
      deferred.reject(error);
      return deferred.promise;
    });
  }

  deleteProvider (id) {
    const deferred = this.$q.defer();
    return this.$http.delete(`https://asylum-journey-staging.herokuapp.com/providers/${id}`).then(() => {
      const index = this.dataStore.providers.map((x) => {return x.id; }).indexOf(id);
      this.dataStore.providers.splice(index, 1);
      deferred.resolve();
      return deferred.promise;
    }, error => {
      deferred.reject(error);
      return deferred.promise;
    });
  }

  getProvider(id) {
    const deferred = this.$q.defer();
    const provider = this.dataStore.providers.filter(s => {
      return s.id === id;
    })[0];

    if (provider) {
      deferred.resolve(provider);
      return deferred.promise;
    }

    return this.$http.get(`https://asylum-journey-staging.herokuapp.com/providers/${id}`).then(response => {
      deferred.resolve(response.data);
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

  updateProvider (provider) {
    const deferred = this.$q.defer();
    return this.$http.put(`https://asylum-journey-staging.herokuapp.com/providers/${provider.id}`, provider).then(() => {
    if (this.dataStore.providers.length) {
        const index = this.dataStore.providers.map((x) => {return x.id; }).indexOf(provider.id);
        this.dataStore.providers[index] = provider;
      }
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

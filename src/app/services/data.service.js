(function () {
	'use strict';

	angular
	.module('asylumjourneyFrontend')
	.service('data', data);

	function data($http, $q, $resource, config) {
		var categoriesResource = $resource(config.apiUrl + 'categories');
		var providersResource = $resource(config.apiUrl + 'providers/:id',
			{id: '@id'},
			{
				'save': {
					method: 'POST',
					interceptor: {
						response: function (response) {
							return response;
						}
					}
				},
				'delete': {
					method: 'DELETE'
				},
				'update': {
					method: 'PUT'
				}
			}
			);
		var servicesResource = $resource(config.apiUrl + 'services');
		var serviceUsersResource = $resource(config.apiUrl + 'service-users');
		var stagesResource = $resource(config.apiUrl + 'stages');

		var dataStore = {
			getCategories: getCategories,
			createProvider: createProvider,
			deleteProvider: deleteProvider,
			getProvider: getProvider,
			getProviders: getProviders,
			updateProvider: updateProvider,
			getServices: getServices,
			getServiceUsers: getServiceUsers,
			getStages: getStages,
			categories: [],
			providers: [],
			services: [],
			serviceUsers: [],
			stages: []
		};
		return dataStore;

		function getCategories () {
			var deferred = $q.defer();

			if (this.categories.length) {
				deferred.resolve();
				return deferred.promise;
			}

			return categoriesResource.get().$promise.then(function (response) {
				dataStore.categories = angular.copy(response._embedded.categories);
				deferred.resolve();
				return deferred.promise;
			});
		}

		function getProviders () {
			var deferred = $q.defer();

			if (this.providers.length) {
				deferred.resolve();
				return deferred.promise;
			}

			return providersResource.get().$promise.then(function (response) {
				dataStore.providers = angular.copy(response._embedded.providers);
				deferred.resolve();
				return deferred.promise;
			});
		}

		function getProvider (id) {
			var deferred = $q.defer();

			var provider = dataStore.providers.filter(function(p) {
				return p.id === id;
			})[0];

			if (provider) {
				deferred.resolve(provider);
				return deferred.promise;
			}

			return providersResource.get({id: id}).$promise.then(function (response) {
				deferred.resolve(response);
				return deferred.promise;
			});
		}

		function updateProvider (provider) {
			var deferred = $q.defer();
			return providersResource.update(provider).$promise.then(function () {
				if (dataStore.providers.length) {
					var index = dataStore.providers.map(function(x) {return x.id; }).indexOf(provider.id);
					dataStore.providers[index] = provider;
				}
				deferred.resolve();
				return deferred.promise;
			});
		}

		function createProvider (provider) {
			var deferred = $q.defer();

			return providersResource.save(provider).$promise.then(function (response) {
				if (dataStore.providers.length) {
					var location = response.headers().location;
					var id = location.split('/providers/').pop();
					provider.id = id;
					dataStore.providers.push(provider);
				}
				deferred.resolve();
				return deferred.promise;
			});
		}

		function deleteProvider (id) {
			var deferred = $q.defer();
			return providersResource.delete({id: id}).$promise.then(function () {
				var index = dataStore.providers.map(function(x) {return x.id; }).indexOf(id);
				dataStore.providers.splice(index, 1);
				deferred.resolve();
				return deferred.promise;
			});
		}

		function getServices () {
			var deferred = $q.defer();

			if (this.services.length) {
				deferred.resolve();
				return deferred.promise;
			}

			return servicesResource.get().$promise.then(function (response) {
				dataStore.services = angular.copy(response._embedded.services);
				deferred.resolve();
				return deferred.promise;
			});
		}

		function getServiceUsers () {
			var deferred = $q.defer();

			if (this.serviceUsers.length) {
				deferred.resolve();
				return deferred.promise;
			}

			return serviceUsersResource.get().$promise.then(function (response) {
				dataStore.serviceUsers = angular.copy(response._embedded.serviceUsers);
				deferred.resolve();
				return deferred.promise;
			});
		}

		function getStages () {
			var deferred = $q.defer();

			if (this.stages.length) {
				deferred.resolve();
				return deferred.promise;
			}

			return stagesResource.get().$promise.then(function (response) {
				dataStore.stages = angular.copy(response._embedded.stages);
				deferred.resolve();
				return deferred.promise;
			});
		}
	}
})();
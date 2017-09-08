(function () {
	'use strict';

	angular
		.module('asylumjourneyFrontend')
		.service('data', data);

	function data($q, $resource, config) {
		var categoriesResource = $resource(config.apiUrl + 'categories');
		var providersResource = $resource(config.apiUrl + 'providers');
		var servicesResource = $resource(config.apiUrl + 'services');
		var serviceUsersResource = $resource(config.apiUrl + 'service-users');
		var stagesResource = $resource(config.apiUrl + 'stages');

		var dataStore = {
			getCategories: getCategories,
			getProviders: getProviders,
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

(function () {
	'use strict';

	angular
		.module('asylumjourneyFrontend')
		.service('data', data);

	function data($resource) {

		var url = 'http://asylum-journey-dev.herokuapp.com/';

		this.services = services;
		this.providers = providers;
		this.stages = stages;
		this.categories = categories;
		this.serviceUsers = serviceUsers;
		this.issues = issues;

		///////////

		function services() {
			return $resource(url + 'services');
		}

		function providers() {
			return $resource(url + 'providers');
		}

		function stages() {
			return $resource(url + 'stages');
		}

		function categories() {
			return $resource(url + 'categories');
		}

		function serviceUsers() {
			return $resource(url + 'service-users');
		}

		function issues() {
			return $resource(url + 'issues');
		}
	}
})();

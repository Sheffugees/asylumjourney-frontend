(function() {
	'use strict';

	angular
		.module('asylumjourneyFrontend')
		.service('data', data);

	function data($resource) {

		this.services = services;

		///////////

		function services() {
			return $resource('http://private-7172d-asylumjourney.apiary-mock.com/services');
		}
	}
})();

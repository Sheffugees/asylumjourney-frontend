(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .config(routeConfig);

  function routeConfig($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/components/home/home.html',
        controller: 'HomeController',
        controllerAs: 'home'
      })
      .when('/tool', {
        templateUrl: 'app/components/tool/tool.html',
        controller: 'ToolController',
        controllerAs: 'tool',
        reloadOnSearch: false
      })
      .when('/providers', {
        templateUrl: 'app/components/providers/providers.html',
        controller: 'ProvidersController',
        controllerAs: 'providers',
        authenticate: true
      })
      .when('/providers/:id/edit', {
        templateUrl: 'app/components/providers/edit-provider.html',
        controller: 'ProviderEditController',
        controllerAs: 'prov',
        authenticate: true
      })
      .when('/providers/new', {
        templateUrl: 'app/components/providers/edit-provider.html',
        controller: 'ProviderEditController',
        controllerAs: 'prov',
        authenticate: true
      })
      .when('/service/:serviceId', {
        redirectTo: '/tool'
      })
      .when('/services/:id/edit', {
        templateUrl: 'app/components/service/service-edit.html',
        controller: 'ServiceEditController',
        controllerAs: 'service',
        authenticate: true
      })
      .when('/services/new', {
        templateUrl: 'app/components/service/service-edit.html',
        controller: 'ServiceEditController',
        controllerAs: 'service',
        authenticate: true
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }

})();

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
      .when('/service/:serviceId', {
        templateUrl: 'app/components/tool/tool.html',
        controller: 'ToolController',
        controllerAs: 'tool'
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
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }

})();

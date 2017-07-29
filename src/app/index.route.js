(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .config(routeConfig);

  function routeConfig($routeProvider) {
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
      .otherwise({
        redirectTo: '/'
      });
  }

})();

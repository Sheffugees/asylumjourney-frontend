export default routesConfig;

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('start', {
      url: '/',
      component: 'start'
    })
    .state('providers', {
      url: '/providers',
      component: 'providers',
      authenticate: true
    })
    .state('providerEdit', {
      url: '/providers/:id/edit',
      component: 'providerEdit',
      authenticate: true
    })
    .state('providerNew', {
      url: '/providers/new',
      component: 'providerEdit',
      authenticate: true
    })
    .state('tool', {
      url: '/tool?stages&categories&providers&q',
      component: 'tool'
    })
    .state('service', {
      url: '/service/:serviceId',
      component: 'tool'
    });
}

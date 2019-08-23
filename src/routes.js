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
    .state('provider', {
      url: '/provider/:providerId',
      component: 'tool'
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
    .state('resources', {
      url: '/resources',
      component: 'resources',
      authenticate: true
    })
    .state('resourceEdit', {
      url: '/resources/:id/edit',
      component: 'resourceEdit',
      authenticate: true
    })
    .state('resourceNew', {
      url: '/resources/new',
      component: 'resourceEdit',
      authenticate: true
    })
    .state('service', {
      url: '/service/:serviceId',
      component: 'tool'
    })
    .state('services', {
      url: '/services',
      component: 'services',
      authenticate: true
    })
    .state('serviceEdit', {
      url: '/services/:serviceId/edit',
      component: 'serviceEdit',
      authenticate: true
    })
    .state('serviceNew', {
      url: '/services/new',
      component: 'serviceEdit',
      authenticate: true
    })
    .state('tool', {
      url: '/tool?stages&categories&providers&resources&q',
      component: 'tool',
      reloadOnSearch: false
    });
}

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
    .state('tool', {
      url: '/tool?stages&categories&providers&q',
      component: 'tool'
    });
}

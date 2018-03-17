/** @ngInject */
function runBlock(AuthService, ngDialog, $location, $rootScope, $transitions, $log) {
  $rootScope.env = ($location.host() === 'localhost' || $location.host() === 'aj-staging.firebaseapp.com') ? 'dev' : 'prod';
  $rootScope.robots = $rootScope.env === 'dev' ? 'noindex, nofollow' : 'index, follow';
  
  $log.log('env', $rootScope.env);

  $transitions.onStart({}, (transition) => {
    $log.log('onStartt', transition.to().authenticate);

    //make sure modals close 
    ngDialog.closeAll();
    $rootScope.dialogOpen = false;

    // Check authentication
    AuthService.checkAuthentication().then( () => {
      // Going to an admin route redirect to home if not authenticated
      if(transition.to().authenticate && !AuthService.isAuthenticated) {
        $location.path('/');
        return;
      }
    });
  });
 
  // Initialise Google Analytics on production
  if ($rootScope.env === 'prod') {
    if (angular.isUndefined(typeof ga)) {
      return;
    }

    ga('create', 'UA-80488368-1', 'auto');
    $transitions.onSuccess({}, () => {
      ga('send', 'pageview', $location.url());
    });
  }

}

export default runBlock;
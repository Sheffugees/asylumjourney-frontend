/** @ngInject */
function interceptors($httpProvider) {
  $httpProvider.interceptors.push('APIInterceptor')
}
export default interceptors;
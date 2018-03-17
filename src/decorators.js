/** @ngInject */
function decorators($provide) {
  /**
   * Use angular-sanitize instead of textAngular's own version
   * https://github.com/textAngular/textAngular/issues/842
   */
  $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) {
    taOptions.forceTextAngularSanitize = false;
    return taOptions;
  }])
}
export default decorators;
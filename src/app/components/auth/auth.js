import './auth.scss';
import loginModal from './login-modal.html';
class AuthController {
  /** @ngInject */
  constructor(AuthService, ngDialog, $scope, $log) {
    $log.log('authcontroller');
    this.AuthService = AuthService;
    this.ngDialog = ngDialog;
    this.loginFailed = false;
    this.saving = false;
    this.options = {
      show: false
    }
    $scope.$on('$routeChangeStart', function() {
      this.options.show = false;
    });
  }

  logIn () {
    this.saving = true;
    this.AuthService.logIn(this.username, this.password).then(() => {
      this.loginFailed = false;
      this.saving = false;
      this.ngDialog.close();
    }, () => {
      this.loginFailed = true;
      this.saving = false;
    });
  }

  logInModal () {
    this.ngDialog.open({
      plain: true,
      template: loginModal,
      className: 'ngdialog-theme-default auth-modal'
    });
  }
}

export default AuthController;
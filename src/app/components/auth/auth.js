import './auth.scss';
import loginModal from './loginModal.html';

class AuthController {
  /** @ngInject */
  constructor(AuthService, ngDialog, $transitions) {
    this.AuthService = AuthService;
    this.ngDialog = ngDialog;
    this.loginFailed = false;
    this.saving = false;
    this.showMenu = false;

    /**
     * Close admin menu on route change
     */
    $transitions.onStart({}, () => {
      this.showMenu = false;
    });
  }

  /**
   * Login using the Auth Service
   */
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

  /**
   * Show login modal
   */
  logInModal () {
    this.ngDialog.open({
      plain: true,
      template: loginModal,
      className: 'ngdialog-theme-default auth-modal'
    });
  }
}

export default AuthController;
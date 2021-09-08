import * as Phaser from 'phaser';
import UiButton from '../classes/UiButton';
import { getParam } from '../utils/utils';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    // create title text
    this.titleText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'MMORPG', { fontSize: '64px', fill: '#fff' });
    this.titleText.setOrigin(0.5);

    // create the LOGIN game button
    this.loginButton = new UiButton(this, this.scale.width / 2, this.scale.height * 0.65, 'button1', 'button2', 'Login', this.startScene.bind(this, 'Login'));

    // create the SIGNUP game button
    this.signupButton = new UiButton(this, this.scale.width / 2, this.scale.height * 0.80, 'button1', 'button2', 'Sign Up', this.startScene.bind(this, 'SignUp'));

    const ResetPasswordScene = getParam('scene');
    if(ResetPasswordScene && ResetPasswordScene === 'resetPassword'){
      this.scene.start('ResetPassword')
    }
  }

  startScene(targetScene) {
    this.scene.start(targetScene);
  }
}

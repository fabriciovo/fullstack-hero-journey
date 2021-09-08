import { postData } from "../utils/utils";
import CredentialsBaseScene from "./CredentialsBaseScene";

export default class ForgotPasswordScene extends CredentialsBaseScene {
  constructor() {
    super("ForgotPassword");
  }

  create() {
    this.createUi(
      "Reset Password",
      this.resetPassword.bind(this),
      "back",
      this.startScene.bind(this, "Title")
    );
    this.passwordInput.parentNode.removeChild(this.passwordInput);
    this.passwordLabel.parentNode.removeChild(this.passwordLabel);
  }

  resetPassword() {
    const loginValue = this.loginInput.value;

    if (loginValue) {
      postData(`${SERVER_URL}/forgot-password`, {
        email: loginValue,
      })
        .then((response) => {
          window.alert(response.message);
          this.startScene("Title");
        })
        .catch((error) => {
          console.log(error);
          window.alert(error);
        });
    } else {
      alert("All fields must be filled out");
    }
  }
}

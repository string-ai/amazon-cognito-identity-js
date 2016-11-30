import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails
} from "amazon-cognito-identity-js";
import React from "react";
import ReactDOM from "react-dom";
import appConfig from "./config";

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId,
});

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      verificationCode: '',
    };
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleVerificationCodeChange(e) {
    this.setState({verificationCode: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      })
    ];
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('user name is ' + result.user.getUsername());
      console.log('call result: ' + result);
    });
  }

  handleSubmitVerificationCode(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();
    const verificationCode = this.state.verificationCode.trim();
    const userData = {
        Username : email,
        Pool : userPool
    };
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      })
    ];
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('call result: ' + result);
    });
  }

  handleAuthorize(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();
    var authenticationData = {
        ValidationData: {},
        Username : email,
        Password : password,
    };
    const userData = {
        Username : email,
        Pool : userPool
    };
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      })
    ];
    var cognitoUser = new CognitoUser(userData);
    var authenticationDetails = new AuthenticationDetails(authenticationData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            /*Use the idToken for Logins Map when Federating User Pools with Cognito Identity or when passing through an Authorization Header to an API Gateway Authorizer*/
            console.log('idToken + ' + result.idToken.jwtToken);
        },  

        onFailure: function(err) {
            console.log("authenticateUser error: " + err);
        },

    });            
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input type="text"
                value={this.state.email}
                placeholder="Email"
                onChange={this.handleEmailChange.bind(this)}/>
          <input type="password"
                value={this.state.password}
                placeholder="Password"
                onChange={this.handlePasswordChange.bind(this)}/>
          <input type="submit"/>
        </form>
        <form onSubmit={this.handleSubmitVerificationCode.bind(this)}>
          <input type="text"
                value={this.state.verificationCode}
                placeholder="VerificationCode"
                onChange={this.handleVerificationCodeChange.bind(this)}/>
          <input type="submit"/>
        </form>
        <form onSubmit={this.handleAuthorize.bind(this)}>
          <input type="submit"/>
        </form>
        
      </div>
    );
  }
}

ReactDOM.render(<SignUpForm />, document.getElementById('app'));


import React from 'react';
import {connect} from "react-redux";
import classNames from 'classnames';

import Link from '../../../../components/Link/Link';

import OauthSocialNetworkComponent from '../oauth-social-networks-form/OAuth.social.networks.component';

import AuthService from './../../../../services/REST/authentication/Auth.service';

export default class LoginForm extends React.Component {


    constructor(props) {
        super(props);

         this.state = {

             userEmail : '',
             password : '',

             userEmailValidationStatus : [null, ''],
             passwordValidationStatus : [null, ''],
         }
    }

    componentDidMount() {
      requestAnimationFrame(() => { //Make sure it is on client only

        //console.log("#################### LOGIN ",AuthService);

      });
    }


    back(e) {
          e.preventDefault(); e.stopPropagation();

          //this.props.router.goBack();
    }



    handleCheckLogin(e){

        e.preventDefault(); e.stopPropagation();

        console.log(this.state.userEmail, this.state.password);

        AuthService.loginAsync(this.state.userEmail, this.state.password).then( (res) =>{

            let userEmailValidationStatus = [null, ''], passwordValidationStatus = [null,''];

            console.log("LOGIN ANSWER",res);

            if (res.result === true) {
                this.loginSuccessfully(res);
            }
            else
            if (res.result === false){

                if (res.message === "No User Found") {
                    userEmailValidationStatus = ["error","No User Found"];
                }
                if (res.message === "Password Incorrect") {
                    userEmailValidationStatus = ["success",''];
                    passwordValidationStatus = ["error","Incorrect Password"];
                }

                this.loginFailure(res);
            }

            this.setState({
                userEmailValidationStatus : userEmailValidationStatus,
                passwordValidationStatus : passwordValidationStatus,
            });

        });
    }

    handleUserEmailChange(e){

        this.setState({
            userEmail : e.target.value,
            userEmailValidationStatus  : [null, ''],
        });
    }

    handlePasswordChange(e){

        this.setState({
            password : e.target.value,
            passwordValidationStatus  : [null, '']
        });
    }

    loginSuccessfully(res){
        var onSuccess = this.props.onSuccess || function (){};

        onSuccess(res);
    }

    loginFailure(res){
        var onError = this.props.onError || function (){};

        onError(res);
    }

    //https://www.w3schools.com/bootstrap/bootstrap_forms_inputs2.asp DOC
    showInputStatus(status){
      return status[0] === 'error' ? "has-error has-feedback" : (status[0] === 'success' ? "has-success has-feedback" : '');
    }
    showInputFeedback(status){
      return status[0] === 'error' ? "fa fa-remove form-control-feedback" : (status[0] === 'success' ?  "fa fa-check form-control-feedback" : '');
    }

    render() {

        var onSwitch = this.props.onSwitch || function (){};

        return (

              <div>

                    <div style={{padding: 25, paddingTop: 0, paddingBottom: 0, margin: 'auto', marginBottom: 25, marginTop: 5}}>

                      <form onSubmit={::this.handleCheckLogin} autoComplete="on">

                        <label >Username or Email</label>
                        <div className={"input-group " + this.showInputStatus(this.state.userEmailValidationStatus)}  >

                          <span className="input-group-addon"><i className="fa fa-user"></i></span>

                          <input autoFocus type='text' className='form-control input-lg' placeholder='username   or    email'  name="username" value={this.state.userEmail} onChange={::this.handleUserEmailChange} />

                          <span className={::this.showInputFeedback(this.state.userEmailValidationStatus)}></span>
                        </div>
                        <label className="error" >{this.state.userEmailValidationStatus[1]}</label> <br />


                        <label >Password</label>
                        <div className={"input-group " + this.showInputStatus(this.state.passwordValidationStatus)}  >

                          <span className="input-group-addon"><i className="fa fa-key"></i></span>

                          <input autoFocus type='password' className='form-control input-lg' placeholder='password'  name="password" value={this.state.password} onChange={::this.handlePasswordChange} />

                          <span className={::this.showInputFeedback(this.state.passwordValidationStatus)}></span>
                        </div>
                        <label className="error" >{this.state.passwordValidationStatus[1]}</label>



                        <div className="form-group" >
                            <div className="row">
                              <div className="col-xs-6" style={{paddingTop: 10}}>

                                <div >
                                  <Link to={'register'} onClick = {onSwitch.bind(this)}> <strong> Register </strong></Link>to SkyHub
                                </div>

                              </div>
                              <div className="col-xs-6 text-right" >
                                <button  type='button' className='btn btn-success ' onClick={::this.handleCheckLogin}><i className="fa fa-sign-in"></i> Login</button>
                              </div>
                            </div>
                        </div>


                      </form>

                    </div>

                    <OauthSocialNetworkComponent onSuccess={::this.loginSuccessfully} onError={::this.loginFailure} />

              </div>

        );
    }
}

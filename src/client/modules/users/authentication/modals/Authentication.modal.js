import React from 'react';

import LoginForm from '../login/Login.form';
import RegistrationForm from '../registration/Registration.form';

import ModalComponent from '../../../../../client/components/util-components/modals/Modal.component';

class AuthenticationModal extends React.Component {

    refModal = null;

    loginRef = null;
    registrationRef = null;

    constructor(props) {
        super(props);

        this.state = {  modalType : 'login', modalTitle : 'Login', onSuccess: function(){} };
    }

    setOnSuccessEvent(onSuccess){
      this.setState({
        onSuccess: onSuccess||function(){},
      });
    }


    close() {
      this.refModal.closeModal();
    }

    open() {
      this.refModal.showAlert();
    }

    setLogin(){
        this.setState( {
            modalType: "login",
            modalTitle: "Login to SkyHub",
        });
    }

    openLogin(){

        this.setLogin();
        this.open("login");
    }

    setRegistration(){
        this.setState( {
            modalType: "registration",
            modalTitle: "Register to SkyHub",
        });
    }

    openRegistration(){
        this.setRegistration();
        this.open("registration");
    }

    renderLogin(){
        return (
            <LoginForm ref={(c) => this.loginRef = c} onSuccess={::this.loginSuccess} onSwitch={::this.switchLoginToRegistration} />
        )
    }

    renderRegistration(){
        return (
            <RegistrationForm ref={(c) => this.registrationRef = c} onSuccess={::this.registrationSuccess} onSwitch={::this.switchRegistrationToLogin} />
        )
    }

    render() {

        return (

            <ModalComponent modalId="AuthenticationModal"  ref={(c) => this.refModal = c} title={this.state.modalTitle} subTitle="" buttons={[]} >

              {this.state.modalType === "login" ? ::this.renderLogin() : ::this.renderRegistration()}

            </ModalComponent>

        );
    }


    loginSuccess(resource){
        let onSuccess = this.props.onSuccess||function(){};
        onSuccess(resource);

        onSuccess = this.state.onSuccess||function(){};
        onSuccess(resource);

        this.close();
    }


    registrationSuccess(resource){
        let onSuccess = this.props.onSuccess||function(){};
        onSuccess(resource);

        onSuccess = this.state.onSuccess||function(){};
        onSuccess(resource);

        this.close();
    }

    switchLoginToRegistration(e){
        e.preventDefault(); e.stopPropagation();
        this.setRegistration();
    }

    switchRegistrationToLogin(e){
        e.preventDefault(); e.stopPropagation();
        this.setLogin();
    }

}

export default AuthenticationModal;

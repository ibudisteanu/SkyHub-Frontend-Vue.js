<template>
    <div>

        <div style="padding: 25px; padding-top: 10px; padding-bottom: 0; margin: auto; margin-bottom: 25px; margin-top: 5px">

            <form @submit="handleCheckLogin" autoComplete="on">

                <label>Username or Email</label>
                <div :class="'input-group ' + showInputStatus(userEmailValidationStatus)" >

                    <span class="input-group-addon"><i class="fa fa-user"></i></span>

                    <input autoFocus type='text' class='form-control input-lg' placeholder='username   or    email'  name="username" :value="userEmail"    @change="handleUserEmailChange" />

                    <span :class="showInputFeedback(userEmailValidationStatus)"></span>

                </div>
                <label class="error">{{userEmailValidationStatus[1]}}</label> <br/>


                <label>Password</label>
                <div :class="'input-group ' + showInputStatus(passwordValidationStatus)"  >

                    <span class="input-group-addon"><i class="fa fa-key"></i></span>

                    <input autoFocus type='password' class='form-control input-lg' placeholder='password' name="password"  :value="password"    @change="handlePasswordChange" />

                    <span :class="showInputFeedback(passwordValidationStatus)"></span>
                </div>
                <label class="error">{{passwordValidationStatus[1]}}</label>



                <div class="form-group">
                    <div class="row">
                        <div class="col-xs-6" style="padding-top: 10px">

                            <div>
                                <router-link to="/register" class="item-footer-menu" click.native.prevent="handleSwitchForm">
                                <strong> Register </strong></router-link>to SkyHub
                            </div>

                        </div>
                        <div class="col-xs-6 text-right">
                            <button type='button' class='btn btn-success ' @click="handleCheckLogin">
                                <i class="fa fa-sign-in"></i> Login
                            </button>
                        </div>
                    </div>
                </div>


            </form>

        </div>

        <OauthSocialNetworkComponent :onSuccess="loginSuccessfully"    :onError="loginFailure" />

    </div>
</template>

<script>

    import {showInputStatus, showInputFeedback, convertValidationErrorToString} from 'client/components/util-components/form-validation/formValidation';

    export default {


        name: 'LoginForm',

        data: function () {
            return {
                userEmail : '',
                password : '',

                userEmailValidationStatus : [null, ''],
                passwordValidationStatus : [null, ''],
            }
        },

        props : {
            onSuccess: { type: Function },
            onError: { type: Function },
            onSwitch: { type: Function },
        },

        methods:{

            showInputStatus(status) {return showInputStatus(status)},
            showInputFeedback(status) {return showInputFeedback(status)},
            convertValidationErrorToString(error) {return convertValidationErrorToString(error)},

            async handleCheckLogin(e){

                e.preventDefault(); e.stopPropagation();

                console.log(this.userEmail, this.password);

                this.$store.dispatch('AUTHENTICATE_USER_BY_LOGIN',{sEmailUserName: this.userEmail, sPassword: this.password }).then( (res) =>{

                    this.userEmailValidationStatus = [null, '']; this.passwordValidationStatus = [null,''];

                    console.log("LOGIN ANSWER",res);

                    if (res.result === true) {
                        this.loginSuccessfully(res);
                    }
                    else
                    if (res.result === false){

                        if (res.message === "No User Found") {
                            this.userEmailValidationStatus = ["error","No User Found"];
                        }
                        if (res.message === "Password Incorrect") {
                            this.userEmailValidationStatus = ["success",''];
                            this.passwordValidationStatus = ["error","Incorrect Password"];
                        }

                        this.loginFailure(res);
                    }

                });

            },

            handleUserEmailChange(e){
                this.userEmail = e.target.value;
                this.userEmailValidationStatus  = [null, ''];
            },

            handlePasswordChange(e){
                this.password = e.target.value;
                this.passwordValidationStatus  = [null, ''];
            },

            loginSuccessfully(res){
                let onSuccess = this.onSuccess || function (){};

                onSuccess(res);
            },

            loginFailure(res){
                let onError = this.onError || function (){};
                onError(res);
            },

            handleSwitchForm(e){

                if (typeof onSwitch !== "undefined")
                {
                    e.preventDefault(); e.stopPropagation();
                    onSwitch(e);
                }

                return false;
            }


        }
    } 
</script>

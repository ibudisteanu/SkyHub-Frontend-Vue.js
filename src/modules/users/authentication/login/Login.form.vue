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
                                <router-link to="/register" class="item-footer-menu"  :event="''"  @click.native.prevent="handleSwitchForm">
                                <strong> Register </strong></router-link>to SkyHub
                            </div>

                        </div>
                        <div class="col-xs-6 text-right">

                            <LoadingButton className="btn-success" icon="fa fa-sign-in" text="Login" @onClick="handleCheckLogin" ref="refLoadingButtonLogin"/>


                        </div>
                    </div>
                </div>


            </form>

        </div>

        <OauthSocialNetworkComponent @onSuccess="loginSuccessfully"    @onError="loginFailure" />

    </div>
</template>

<script>

    import {showInputStatus, showInputFeedback, convertValidationErrorToString} from 'client/components/util-components/form-validation/formValidation';
    import LoadingButton from 'client/components/util-components/UI/buttons/LoadingButton.vue';
    import OauthSocialNetworkComponent from './../oauth-social-networks-form/OAuth.social.networks.vue';

    export default {


        name: 'LoginForm',

        components: {
            'LoadingButton':LoadingButton,
            'OauthSocialNetworkComponent':OauthSocialNetworkComponent,
        },

        data: function () {
            return {
                userEmail : '',
                password : '',

                userEmailValidationStatus : [null, ''],
                passwordValidationStatus : [null, ''],
                refLoadingButton: null,
            }
        },

        props : {
            onSwitch: { type: Function },
        },

        //@onSuccess,
        //@onError,


        methods:{

            showInputStatus(status) {return showInputStatus(status)},
            showInputFeedback(status) {return showInputFeedback(status)},
            convertValidationErrorToString(error) {return convertValidationErrorToString(error)},

            async handleCheckLogin(e, button){

                e.preventDefault(); e.stopPropagation();


                this.error = '';

                try{
                    let res = await this.$store.dispatch('AUTHENTICATE_USER_BY_LOGIN',{sEmailUserName: this.userEmail, sPassword: this.password })
                    this.$refs['refLoadingButtonLogin'].enableButton();

                    this.userEmailValidationStatus = [null, '']; this.passwordValidationStatus = [null,''];

                    console.log("LOGIN ANSWER",res);

                    if (res.result === true) {
                        this.loginSuccessfully(res.user.id||'', res);
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
                }
                catch(Exception) {
                    this.$refs['refLoadingButtonLogin'].enableButton();
                    this.error = "There was a internal problem REGISTERING... Try again"+Exception.toString();
                }





            },

            handleUserEmailChange(e){
                this.error = '';
                this.userEmail = e.target.value;
                this.userEmailValidationStatus  = [null, ''];
            },

            handlePasswordChange(e){
                this.error = '';
                this.password = e.target.value;
                this.passwordValidationStatus  = [null, ''];
            },

            loginSuccessfully(userId, user){

                this.$emit('onSuccess',userId, user);
            },

            loginFailure(res){
                this.$emit('onError',res);
            },

            handleSwitchForm(e){

                if (typeof this.onSwitch !== "undefined")
                {
                    e.preventDefault(); e.stopPropagation();
                    this.onSwitch(e);
                } else
                    this.$router.push('/registration')

                return false;
            }


        }
    } 
</script>

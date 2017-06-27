/**
 * Created by Alexandru Ionut Budisteanu - SkyHub
 * (C) BIT TECHNOLOGIES
 */


<template>
    <div>

        <div style="padding: 25px; padding-top: 10px; padding-bottom: 0; margin: auto; margin-bottom: 25px; margin-top: 5px">

            <form @submit="handleCheckRegister" autoComplete="on">

                <div class="row" >

                    <div class="col-sm-6">
                        <div :class="'input-group ' + showInputStatus(userNameValidationStatus)"  >

                            <span class="input-group-addon"><i class="fa fa-user"></i></span>

                            <input autoFocus type='text' class='form-control input-lg' placeholder='username'  name="username" :value="userName" @change="handleUserNameChange" />

                            <span :class="showInputFeedback(userNameValidationStatus)"></span>
                        </div>
                        <label class="error" >{{userNameValidationStatus[1]}}</label> <br />
                    </div>

                    <div class="col-sm-6">
                        <div :class="'input-group ' + showInputStatus(emailAddressValidationStatus)"  >

                            <span class="input-group-addon"><i class="fa fa-envelope"></i></span>

                            <input type='text' class='form-control input-lg' placeholder='E-mail'  name="email" :value="emailAddress" @change="handleEmailAddressChange" />

                            <span :class="showInputFeedback(emailAddressValidationStatus)"></span>
                        </div>
                        <label class="error" >{{emailAddressValidationStatus[1]}}</label> <br />
                    </div>

                </div>

                <div class="row" >

                    <div class="col-sm-6">
                        <div :class="'input-group ' + showInputStatus(firstNameValidationStatus)"  >

                            <span class="input-group-addon"><i class="fa fa-font"></i></span>

                            <input type='text' class='form-control input-lg' placeholder='First Name' name="firstname" :value="firstName" @change="handleFirstNameChange" />

                            <span :class="showInputFeedback(firstNameValidationStatus)"></span>
                        </div>
                        <label class="error" >{{firstNameValidationStatus[1]}}</label> <br />
                    </div>

                    <div class="col-sm-6">
                        <div :class="'input-group ' + showInputStatus(lastNameValidationStatus)"  >

                            <span class="input-group-addon"><i class="fa fa-bold"></i></span>

                            <input type='text' class='form-control input-lg' placeholder='Last Name' name="lastname" :value="lastName" @change="handleLastNameChange" />

                            <span :class="showInputFeedback(this.lastNameValidationStatus)"></span>
                        </div>
                        <label class="error" >{{lastNameValidationStatus[1]}}</label> <br />
                    </div>

                </div>

                <div class="row" >

                    <div class="col-sm-6">
                        <div :class="'input-group ' + showInputStatus(passwordValidationStatus)"  >

                            <span class="input-group-addon"><i class="fa fa-key"></i></span>

                            <input type='password' class='form-control input-lg' placeholder='password' name="password" :value="password" @change="handlePasswordChange" />

                            <span :class="showInputFeedback(passwordValidationStatus)"></span>
                        </div>
                        <label class="error" >{{passwordValidationStatus[1]}}</label> <br />
                    </div>

                    <div class="col-sm-6">
                        <div :class="'input-group ' + this.showInputStatus(retypePasswordValidationStatus)" >

                            <span class="input-group-addon"><i class="fa fa-key"></i></span>

                            <input type='password' class='form-control input-lg' placeholder='password'  :value="retypePassword" @change="handleRetypePasswordChange" />

                            <span :class="showInputFeedback(retypePasswordValidationStatus)"></span>
                        </div>
                        <label class="error" >{{retypePasswordValidationStatus[1]}}</label> <br />
                    </div>

                </div>

                <div class="row" >

                    <div class="col-sm-6">
                        <div :class="'input-group ' + this.showInputStatus(countryValidationStatus)"  >


                            <CountrySelect :defaultCountry="localization.country||''"  :defaultCountryCode="localization.countryCode||''"  :onSelect="handleCountrySelect"/>

                            <span :class="this.showInputFeedback(countryValidationStatus)"></span>
                        </div>
                        <label class="error" >{{countryValidationStatus[1]}}</label> <br />
                    </div>

                    <div class="col-sm-6" style='padding-bottom: 5px'>
                        <div :class="'input-group ' + this.showInputStatus(cityValidationStatus)"  >

                            <span class="input-group-addon"><i class="fa fa-institution"></i></span>

                            <input  type='text' class='form-control input-lg' placeholder='city'  :value="localization.city||this.city" @change="handleCityChange" />

                            <span :class="showInputFeedback(cityValidationStatus)"></span>
                        </div>
                        <label class="error" >{{cityValidationStatus[1]}}</label> <br />
                    </div>

                </div>


                <div class="form-group" >
                    <div class="row">
                        <div class="col-xs-6" style='padding-top: 5px'>

                            <div>
                                <router-link to="/login" class="item-footer-menu" :event="''" @click.native.prevent="handleSwitchForm">
                                    <strong> Login </strong></router-link>to SkyHub
                            </div>


                        </div>
                        <div class="col-xs-6 text-right" >
                            <LoadingButton className="btn-success" icon="fa fa-sign-in" text="Register" :click="handleCheckRegister" ref="refLoadingButtonRegistration"/>
                        </div>
                    </div>
                </div>


                <div v-if="error !== ''">
                    <div>
                        <div class="alert alert-danger alert-dismissable">
                            {{error}}
                        </div>
                    </div>
                </div>

            </form>
        </div>

        <OauthSocialNetworkComponent :onSuccess={registrationSuccessfully} :onError={registrationFailure} />

    </div>

</template>

<script>

    import {showInputStatus, showInputFeedback, convertValidationErrorToString} from 'client/components/util-components/form-validation/formValidation';
    import LoadingButton from 'client/components/util-components/UI/buttons/LoadingButton.vue';
    import CountrySelect from 'client/components/util-components/select/Country.select.vue';

    export default{
        name: 'RegistrationForm',

        components: {
            'LoadingButton':LoadingButton,
            'CountrySelect':CountrySelect,
        },

        data: function () {
            return {
                error:'',

                userName : '',
                emailAddress : '',
                password : '',
                retypePassword : '',

                city : '',
                country : '',
                countryCode : '',

                timeZone : '',
                ip: '',

                firstName: '',
                lastName: '',

                latitude : null, longitude : null,

                userNameValidationStatus : [null, ''],
                emailAddressValidationStatus : [null, ''],
                firstNameValidationStatus : [null, ''],
                lastNameValidationStatus : [null, ''],
                passwordValidationStatus : [null,  ''],
                retypePasswordValidationStatus : [null,  ''],

                countryValidationStatus : [null,   ''],
                cityValidationStatus : [null,  ''],
            }
        },

        props : {
            onSuccess: { type: Function },
            onError: { type: Function },
            onSwitch: { type: Function },
        },


        computed:{
            localization(){
                return this.$store.state.localization;
            }
        },

        methods:{

            showInputStatus(status) {return showInputStatus(status)},
            showInputFeedback(status) {return showInputFeedback(status)},
            convertValidationErrorToString(error) {return convertValidationErrorToString(error)},

            handleCheckRegister(e){

                e.preventDefault(); e.stopPropagation();

                console.log(this.userName, this.emailAddress, this.firstName, this.lastName, this.password, this.retypePassword, this.latitude, this.longitude, this.city, this.country, this.ip);

                this.userNameValidationStatus = [null, ''];  this.emailAddressValidationStatus = [null, ''];  this.firstNameValidationStatus = [null, '']; this.lastNameValidationStatus = [null, ''], this.passwordValidationStatus = [null,  ''];
                this.retypePasswordValidationStatus = [null,  '']; this.countryValidationStatus = [null,  ''];  this.cityValidationStatus = [null,  ''];
                this.error = '';

                let bValidationError = false;

                if (this.userName.length < 3){
                    this.userNameValidationStatus = ["error","You need a username"];
                    bValidationError = true;
                }

                if (this.firstName.length < 3){
                    this.firstNameValidationStatus = ["error","Provide your First Name"];
                    bValidationError = true;
                }

                if (this.emailAddress.length < 3){
                    this.emailAddressValidationStatus = ["error","You need to provide your Email Address"];
                    bValidationError = true;
                }

                if (this.lastName.length < 3){
                    this.lastNameValidationStatus = ["error","Provide your Last Name"];
                    bValidationError = true;
                }

                if (this.password.length < 4){
                    this.passwordValidationStatus = ["error","To weak. At least 4 characters"];
                    bValidationError = true;
                }

                if ((this.password !== this.retypePassword)&&(this.password !== '')){
                    this.retypePasswordValidationStatus = ["error","The passwords don't match"];
                    bValidationError = true;
                }

                console.log(bValidationError);

                if (bValidationError)
                    this.$refs['refLoadingButtonRegistration'].enableButton();
                else
                    this.$store.dispatch('AUTHENTICATE_REGISTER',{sUsername: this.userName, sEmailAddress:this.emailAddress, sPassword:this.password, sFirstName:this.firstName, sLastName:this.lastName,
                                                                  sCountry:(this.countryCode||this.localization.countryCode), sLanguage:'', sCity:(this.city||this.localization.city), sLatitude:(this.latitude||this.localization.latitude),
                                                                  sLongitude:(this.longitude||this.localization.longtitude), iTimeZone:this.localization.timeZone}).then((res)=>{

                        this.$refs['refLoadingButtonRegistration'].enableButton();
                        console.log(res);

                        if (res.result === true) {
                            this.registrationSuccessfully(res);
                        }
                        else
                        if (res.result === false){

                            if ((typeof res.errors.username !=="undefined")&&(Object.keys(res.errors.username).length !== 0 )) this.userNameValidationStatus = ["error", this.convertValidationErrorToString(res.errors.username[0])];
                            if ((typeof res.errors.email !=="undefined")&&(Object.keys(res.errors.email).length !== 0)) this.emailAddressValidationStatus = ["error", this.convertValidationErrorToString(res.errors.email[0])];
                            if ((typeof res.errors.firstName !=="undefined")&&(Object.keys(res.errors.firstName).length !== 0)) this.firstNameValidationStatus = ["error", this.convertValidationErrorToString(res.errors.firstName[0])];
                            if ((typeof res.errors.lastName !=="undefined")&&(Object.keys(res.errors.lastName).length  !== 0)) this.lastNameValidationStatus = ["error", this.convertValidationErrorToString(res.errors.lastName[0])];
                            if ((typeof res.errors.country !=="undefined")&&(Object.keys(res.errors.country).length  !== 0)) this.countryValidationStatus = ["error", this.convertValidationErrorToString(res.errors.country[0])];
                            if ((typeof res.errors.city !=="undefined")&&(Object.keys(res.errors.city).length  !== 0)) this.cityValidationStatus = ["error", this.convertValidationErrorToString(res.errors.city[0])];

                            this.registrationFailure(res);
                        }

                    })
                        .catch((Exception)=>{
                            this.$refs['refLoadingButtonRegistration'].enableButton();
                            this.error = "There was a internal problem REGISTERING... Try again"+Exception.toString();
                        });



            },

            handleUserNameChange(e){
                this.userName = e.target.value;
                this.userNameValidationStatus  = [null, ''];
                this.error = '';
            },

            handleEmailAddressChange(e){

                this.emailAddress = e.target.value;
                this.emailAddressValidationStatus  = [null, ''];
                this.error = '';
            },

            handleFirstNameChange(e){
                 this.firstName = e.target.value;
                 this.firstNameValidationStatus = [null, ''];
                 this.error = '';
            },

            handleLastNameChange(e){
                this.lastName = e.target.value;
                this.lastNameValidationStatus  = [null, '']
                this.error = '';
            },

            handlePasswordChange(e){
                this.password = e.target.value;
                this.passwordValidationStatus  = [null, ''];
                this.error = '';
            },

            handleRetypePasswordChange(e){
                this.retypePassword = e.target.value;
                this.retypePasswordValidationStatus  = [null, ''];
                this.error = '';
            },

            handleCountrySelect(selectedCountry, selectedCountryCode){
                this.country = selectedCountry
                this.countryCode  = selectedCountryCode;
                this.countryValidationStatus  = [null, ''];
                this.error = '';
            },

            handleCityChange(e){
                this.city = e.target.value;
                this.cityValidationStatus  = [null, ''];
            },

            registrationSuccessfully(res){
                var onSuccess = this.onSuccess || function (){};

                onSuccess(res);
            },

            registrationFailure(res){
                var onError = this.onError || function (){};

                onError(res);
            },

            handleSwitchForm(e){

                if (typeof this.onSwitch !== "undefined")
                {
                    e.preventDefault(); e.stopPropagation();
                    this.onSwitch(e);
                } else
                    this.$router.push('/login')

                return false;
            }
        }
    }
</script>

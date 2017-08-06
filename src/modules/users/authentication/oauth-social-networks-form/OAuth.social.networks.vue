/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/14/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
    <div class='text-center' style='padding: 10px'>

        <strong>SIGN UP with</strong>
        <div>
            <div style='margin-top: 12px; margin-bottom: 12px; display: inline-flex'>

                <div style='margin-right: 20px'>

                    <fb-signin-button
                            class="btn btn-social-icon btn-facebook btn-lg"
                            :params="fbSignInParams"
                            @success="responseFacebook"
                            @error="errorRegisteringFacebook">
                        <i class="fa fa-facebook"></i>
                    </fb-signin-button>

                    <!--
                    <FacebookLogin
                            appId="622709767918813"
                            autoLoad={false}
                            fields="id,name,email,picture,cover,first_name,last_name,age_range,link,gender,locale,timezone,updated_time,verified"
                            scope="public_profile,user_friends,user_about_me"
                            icon="fa fa-facebook"
                            textButton=""
                            callback={::this.responseFacebook}
                            cssClass="btn btn-social-icon btn-facebook btn-lg"
                    />
                    -->

                </div>

                <div style='marginRight:20px'>

                    <!--
                    <GoogleLogin
                            clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                            buttonText=""
                            autoLoad={false}
                            class="btn btn-social-icon btn-google btn-lg"
                            onSuccess={::this.responseSuccessGoogle}
                            //onFailure={::this.responseFailureGoogle }
                            fetchBasicProfile
                    >
                        <i class="fa fa-google-plus" />
                    </GoogleLogin>
                    -->

                </div>


                <!--
                <a class="btn btn-social-icon btn-twitter " style='margin-right:20px'>
                    <span class="fa fa-twitter"></span>
                </a>
                -->

            </div>


            <div v-if="error !== ''">
                <div class="alert alert-danger alert-dismissable">
                    {{this.error}}
                </div>
            </div>

        </div>

    </div>
</template>


<script>

    import FBSignInButton from 'vue-facebook-signin-button'
    import Vue from 'vue';

    Vue.use(FBSignInButton);
    
    export default{
        name: 'OAuthSocialNetworks',

        data: function (){
            return {
                error: '',
                fbSignInParams: {
                    scope: 'user_location',
                    return_scopes: true
                }
            }
        },

        computed: {

            localization(){
                return this.$store.state.localization;
            }
        },

        props:{

        },
        //@onSuccess,
        //@onError,

        methods:{


            errorRegisteringFacebook (response){
                this.error = "Error registering with Facebook";

                //this.modalRef.showAlert('Error registering with Facebook','',"Ops! It didn't work");

                this.registrationFailure(response);
            },

            responseSuccessGoogle (response){
                this.error = '';
                console.log(response);
            },

            responseFailureGoogle (response){
                this.error = "Error registering with Google";

                this.modalRef.showAlert('Error registering with Google','',"Ops! It didn't work");
            },

            registrationSuccessfully(response){
                this.error = '';

                this.$emit('onSuccess', response);
            },

            registrationFailure(response){
                this.$emit('onError',response);
            },

            async responseFacebook(response) {

                this.error = '';

                console.log(response);

                let userData = await new Promise((resolve)=> {
                    FB.api('/me', {fields: 'id,name,email,picture,cover,first_name,last_name,age_range,link,gender,locale,timezone,updated_time,verified,location'}, userData => {
                        resolve(userData);
                    });
                });

                console.log('facebook decoded data', userData);

                // accessToken:"EAAI2WeqD1N0BAH11ZBrtE66a2ZAF1BMoVPNBf9WVS6thiRjLqsWloXNswva5uZAp48iFmNARJFYkd6y4OzqhyU36vyjhp5idDjSfGoEoC6TfaK7VZCE63u34WFwoeaqPLQBmzVJWAWxdqVkJUVBZBW2JZAZB72IrhRw7jSvTJ86mBK1GeJstFR1lSXZBgqZCSAqQZD"
                // age_range: {min: 21}
                // cover: {id: "" , offset_y: 2, source: "location.jpg"}
                // expiresIn:6803
                // first_name:"Alexandru"
                // gender:"male"
                // id:"1899824400275208"
                // last_name : "Ionut"
                // link:"https://www.facebook.com/app_scoped_user_id/1899824400275208/"
                // locale:"en_US"
                // name:"Alexandru Ionut"
                // picture:{ data: { is_silhoette: false, url : "picture"}}
                // signedRequest: "ASS-ky4D-1KsC1Rbksly-QiCPN5sYQDYAK7xqLN_v9I.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUJ6VXFicHlvNU1CVnNSTHRJbWwzcnBFOGwyN2xURTk4Ny1XRWNzZHQyWlJkc1JxR2k4QVE3SDEzMjFwTFFrTzJaWm80LUEwcWRyZDM1dHU4UUtMb0JKa3k2eWpGMUFkLVVLb0Q0Q3piU3hVdm1xeGhHWjRuQ2pqSDY5NXpFLWJfT0dMdDM0Sll4ZHdCTlN0aHNSaGZVWHJESno5Z2NaTDhaQlZqb3NFdmRIRV90dVpFQ3VKODVEZk9MVTZvZ1BhVkVFSnpqdkxhQ0tuWjg2ckw3c0cwY2w1UVdFb04ydEtVdks2UXJZcGtTZE9BUXlhUlpGc3N0Z2FkVWl2ZzA0SmstWGY4X1hXSmhuWnlQaTk0bmJOUUVQdlZyc3h0SW5PWnY3NGw0QUIzTHBlLXVQakxQQ2p5OVhnRHVvbUgtTkZkTkNlZEtUYjZtVGp1U2ZvSmtONEZFWSIsImlzc3VlZF9hdCI6MTQ5NDc4NTE5NywidXNlcl9pZCI6IjE4OTk4MjQ0MDAyNzUyMDgifQ"
                // timezone:3
                // updated_time:"2017-04-09T16:31:48+0000"
                // userID: "1899824400275208"
                // verified : true



                try{

                    let sFacebookId = userData.id || '';

                    let sCoverImage = '';
                    let sProfilePic = '';
                    try {
                        let objCover = userData.cover || {};
                        sCoverImage = objCover.source || '';

                        sProfilePic = "http://graph.facebook.com/"+sFacebookId+"/picture?type=large";

                        // var objProfile = userData.picture || {};
                        //     objProfile = objProfile.data || {};
                        // var sProfilePic = objProfile.url || '';
                    } catch (Exception)
                    {
                        console.log('Error extracting CoverImage and Profile Pic');
                    }

                    let sAccessToken = response.authResponse.accessToken || '';
                    let sEmail = userData.email || '';
                    let sFirstName = userData.first_name || '';
                    let sLastName = userData.last_name || '';
                    let sGender = userData.gender || '';
                    let iAge = userData.age_range.min || 0;
                    let iTimeZone = userData.time_zone || 0;
                    let sLanguage = userData.locale;
                    let sShortBio = userData.user_about_me || '';
                    let bVerified = userData.verified;


                    let sCity = '';
                    let sCountry = '';
                    let longitude = '';
                    let latitude = '';

                    if ((typeof userData.location !== 'undefined')&&(userData.location !== null)){
                        let locationId = userData.location.id||'';
                        //location: {
                        //  id: "number"
                        //  name: "Bucharest, Romania
                        //}

                        await new Promise((resolve)=>{
                            FB.api('/'+locationId, {fields: 'location'}, locationData=>{
                                console.log("locationData",locationData);

                                sCity = locationData.location.city;
                                sCountry = locationData.location.country;
                                longitude = locationData.location.longtitude;
                                latitude = locationData.location.latitude;

                                resolve(true);
                            });
                        })


                        //{
                        //    "location": {
                        //        "city": "Ramat Gan",
                        //        "country": "Israel",
                        //        "latitude": 32.0833,
                        //        "longitude": 34.8167,
                        //        "zip": "<<not-applicable>>"
                        //},
                        //   "id": "112604772085346"
                        //}
                    }



                    this.$store.dispatch('AUTHENTICATE_REGISTER_OAUTH',{sSocialNetworkName:'facebook', sSocialNetworkId: sFacebookId,  sAccessToken: sAccessToken, sEmail:sEmail, sFirstName:sFirstName, sLastName:sLastName, sProfilePic:sProfilePic, sCoverImage:sCoverImage,
                                                                        sCountryCode: sCountry||this.localization.countryCode||'us', sLanguage: sLanguage, sCity:sCity||this.localization.city||'none', latitude: latitude||this.localization.latitude, longitude:longitude||this.localization.longitude, sShortBio:sShortBio, iAge:iAge, sGender:sGender,
                                                                        iTimeZone:iTimeZone||this.localization.timeZone, bVerified:bVerified})

                        .then( (res) => {

                            console.log("Auth Service answer ",res);

                            if (res.result === true) this.registrationSuccessfully(res);
                            else if (res.result === false) {
                                this.errorRegisteringFacebook(userData);
                            }

                        });


                } catch (Exception)
                {
                    console.log('error facebook registering', Exception);
                    this.errorRegisteringFacebook (userData);
                }

                console.log(userData);

            },
        }

    }

</script>
